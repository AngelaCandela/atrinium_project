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
use Pagerfanta\Adapter\ArrayAdapter;
use Pagerfanta\Pagerfanta;

class EmpresaController extends AbstractController
{
    /**
     * @Route("/companies/{page}", name="companies")
     */
    public function index($page, Request $req, EmpresaRepository $empresaRepo, EntityManagerInterface $em, SerializerService $serializer): Response
    {
        $var = "";
        $name = $req->query->get('name');
        $sector = $req->query->get('sector');

        $companiesArray = [];        
        $companies = $empresaRepo->findCompanies($em, $name, $sector);

        foreach($companies as $company){

            $companiesArray[] = $serializer->serializeCompany($company);
        }

        $adapter = new ArrayAdapter($companiesArray);
        $pagerfanta = new Pagerfanta($adapter);
        
        $pagerfanta->setMaxPerPage(10);
        $totalPages = $pagerfanta->getNbPages();
        $totalCompanies = count($companiesArray);

        $currentPage = $pagerfanta->setCurrentPage($page);
        $prevPageNumber = null;
        $nextPageNumber = null;

        if ($pagerfanta->hasPreviousPage()) {
            $prevPageNumber = $pagerfanta->getPreviousPage();
        }
        if ($pagerfanta->hasNextPage()) {
            $nextPageNumber = $pagerfanta->getNextPage();
        }
        
        $pagerfanta->getCurrentPage();
        $pagination = [];
        $pagination['totalCompanies'] = $totalCompanies;
        $pagination['totalPages'] = $totalPages;
        $pagination['currentPage'] = $page;
        $pagination['prevPageNumber'] = $prevPageNumber;
        $pagination['nextPageNumber'] = $nextPageNumber;

        $response = [];
        $response['pagination'] = $pagination;
        
        $currentPageResults = $pagerfanta->getCurrentPageResults();
        $response['data'] = $currentPageResults;

        return $this->json($response);
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
