<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Empresa;
use App\Entity\RegistroEmpresa;
use App\Repository\SectorRepository;
use App\Repository\EmpresaRepository;
use App\Service\SerializerService;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class EmpresaController extends AbstractController
{
    /**
     * @Route("/companies", name="companies")
     */
    public function index(EmpresaRepository $empresaRepo, SerializerService $serializer): Response
    {
        $companiesArray = [];
        $companies = $empresaRepo->findBy([], ['id' => 'ASC']); // He usado el método findBy en lugar de findAll para poder ordenar los resultados por id

        foreach($companies as $company){

            $companiesArray[] = $serializer->serializeCompany($company);
        }

        return $this->json($companiesArray);
    }
    
    /**
     * @Route("/company/add", name="add-company")
     */
    public function add(EntityManagerInterface $em, Request $req, SectorRepository $sectorRepo, ValidatorInterface $validator, SerializerService $serializer): Response
    {
        $body = $req->getContent();
        $jsonContent = json_decode($body);

        $companyName = $jsonContent->newData->name;
        $companyTelephone = $jsonContent->newData->telephone;
        $companyEmail = $jsonContent->newData->email;
        $companySector = $jsonContent->newData->sector;

        $registro = new RegistroEmpresa();
        $registro->setName($companyName);
        $registro->setEmail($companyEmail);
        $registro->setSector($companySector);

        $nameError = $validator->validateProperty($registro, 'name');
        $emailError = $validator->validateProperty($registro, 'email');
        $sectorError = $validator->validateProperty($registro, 'sector');
        $formErrors = [];

        if(count($nameError) > 0) {
            $formErrors['nameError'] = $nameError[0]->getMessage();
        }
        if(count($emailError) > 0) {
            $formErrors['emailError'] = $emailError[0]->getMessage();
        }
        if(count($sectorError) > 0) {
            $formErrors['sectorError'] = $sectorError[0]->getMessage();
        }        
        if($formErrors) {
            return new JsonResponse($formErrors);
        }

        $company = new Empresa();
        $company->setNombre($companyName);
        $company->setTelefono($companyTelephone);
        $company->setEmail($companyEmail);

        $sector = $sectorRepo->findOneByNombre($companySector);
        $company->setSector($sector);

        $em->persist($company);
        $em->flush();
        
        $response = $serializer->serializeCompany($company);

        return $this->json($response);
    }

    /**
     * @Route("/company/edit", name="edit-company", methods={"PUT"})
     */
    public function edit(EntityManagerInterface $em, Request $req, EmpresaRepository $empresaRepo, SectorRepository $sectorRepo, ValidatorInterface $validator, SerializerService $serializer): Response
    {
        $body = $req->getContent();
        $jsonContent = json_decode($body);

        $companyId = $jsonContent->companyId;
        $companyName = $jsonContent->newData->name;
        $companyTelephone = $jsonContent->newData->telephone;
        $companyEmail = $jsonContent->newData->email;
        $companySector = $jsonContent->newData->sector;

        $registro = new RegistroEmpresa();
        $registro->setName($companyName);
        $registro->setEmail($companyEmail);
        $registro->setSector($companySector);

        $nameError = $validator->validateProperty($registro, 'name');
        $emailError = $validator->validateProperty($registro, 'email');
        $sectorError = $validator->validateProperty($registro, 'sector');
        $formErrors = [];

        if(count($nameError) > 0) {
            $formErrors['nameError'] = $nameError[0]->getMessage();
        }
        if(count($emailError) > 0) {
            $formErrors['emailError'] = $emailError[0]->getMessage();
        }
        if(count($sectorError) > 0) {
            $formErrors['sectorError'] = $sectorError[0]->getMessage();
        }        
        if($formErrors) {
            return new JsonResponse($formErrors);
        }

        $company = $empresaRepo->find($companyId);

        $company->setNombre($companyName);
        $company->setTelefono($companyTelephone);
        $company->setEmail($companyEmail);

        $sector = $sectorRepo->findOneByNombre($companySector);
        $company->setSector($sector);

        $em->persist($company);
        $em->flush();

        $response = $serializer->serializeCompany($company);

        return $this->json($response);
    }

    /**
     * @Route("/company/delete/{id}", name="delete-company", methods={"DELETE"})
     */
    public function delete($id, EmpresaRepository $empresaRepo, EntityManagerInterface $em): Response
    {
        $company = $empresaRepo->find($id);

        $em->remove($company);
        $em->flush();

        return $this->json("The company has been deleted successfully!");
    }

    /**
     * @Route("/company/find/{id}", name="find-company", methods={"GET"})
     */
    public function find($id, EmpresaRepository $empresaRepo, SerializerService $serializer): Response
    {
        $company = $empresaRepo->find($id);

        $response = $serializer->serializeCompany($company);

        return $this->json($response);
    }
}
