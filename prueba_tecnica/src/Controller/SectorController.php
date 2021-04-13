<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Sector;
use App\Entity\RegistroSector;
use App\Repository\SectorRepository;
use App\Service\SerializerService;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Pagerfanta\Adapter\ArrayAdapter;
use Pagerfanta\Pagerfanta;

class SectorController extends AbstractController
{

    /**
     * @Route("/sectors", name="select-sectors")
     */
    public function selectSectors(SectorRepository $sectorRepo, SerializerService $serializer): Response
    {
        $sectorsArray = [];
        $sectors = $sectorRepo->findAll();
        foreach($sectors as $sector){

            $sectorsArray[] = $serializer->serializeSector($sector);
        }

        return $this->json($sectorsArray);
    }

    /**
     * @Route("/sectors/{page}", name="sectors")
     */
    public function index($page, SectorRepository $sectorRepo, SerializerService $serializer): Response
    {
        $sectorsArray = [];
        $sectors = $sectorRepo->findBy([], ['id' => 'ASC']); // He usado el método findBy en lugar de findAll para poder ordenar los resultados por id

        foreach($sectors as $sector){

            $sectorsArray[] = $serializer->serializeSector($sector);
        }

        $adapter = new ArrayAdapter($sectorsArray);
        $pagerfanta = new Pagerfanta($adapter);
        
        $pagerfanta->setMaxPerPage(10);
        $totalPages = $pagerfanta->getNbPages();
        $totalSectors = count($sectorsArray);

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
        $pagination['totalSectors'] = $totalSectors;
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
     * @Route("/sector/add", name="add-sector")
     */
    public function add(EntityManagerInterface $em, Request $req, SectorRepository $sectorRepo, ValidatorInterface $validator, SerializerService $serializer): Response
    {
        $body = $req->getContent();
        $jsonContent = json_decode($body);

        $sectorName = $jsonContent->newData->name;

        $registro = new RegistroSector();
        $registro->setName($sectorName);

        $nameError = $validator->validateProperty($registro, 'name');
        $formErrors = [];

        if(count($nameError) > 0) {
            $formErrors['nameError'] = $nameError[0]->getMessage();
        }
        if($formErrors) {
            dump($formErrors);
            return new JsonResponse($formErrors);
        }

        /* if($sectorRepo->findOneByNombre($sectorName) !== null){      // Aunque podría comprobarse así, esa comprobación no hace falta
            return $this->json("This sector already exists");           // ya que la entidad Sector tiene la propiedad 'name' configurada como 'unique=true'
        }; */                                                           // así que si se intentara crear un nuevo sector dándole el nombre de un sector ya existente,
                                                                        // eso devolvería un error 500 y la operación de INSERT no se llevaría a cabo
        $sector = new Sector();
        $sector->setNombre($sectorName);

        $em->persist($sector);
        $em->flush();
        
        $response = $serializer->serializeSector($sector);

        return $this->json($response);
    }

    /**
     * @Route("/sector/edit", name="edit-sector", methods={"PUT"})
     */
    public function edit(EntityManagerInterface $em, Request $req, SectorRepository $sectorRepo, ValidatorInterface $validator, SerializerService $serializer): Response
    {
        $body = $req->getContent();
        $jsonContent = json_decode($body);

        $sectorId = $jsonContent->sectorId;
        $sectorName = $jsonContent->newData->name;

        $registro = new RegistroSector();
        $registro->setName($sectorName);

        $nameError = $validator->validateProperty($registro, 'name');
        $formErrors = [];

        if(count($nameError) > 0) {
            $formErrors['nameError'] = $nameError[0]->getMessage();
        }
        if($formErrors) {
            return new JsonResponse($formErrors);
        }

       /*  if($sectorRepo->findOneByNombre($sectorName) !== null){          // Aunque podría comprobarse así, esa comprobación no hace falta
            return $this->json("This sector name is already being used");   // ya que la entidad Sector tiene la propiedad 'name' configurada como 'unique=true'
        }; */                                                               // así que si se intentara atribuir a un sector el nombre usado por otro sector,
                                                                            // eso devolvería un error 500 y la operación de UPDATE no se llevaría a cabo
        
        $sector = $sectorRepo->find($sectorId);

        $sector->setNombre($sectorName);

        $em->persist($sector);
        $em->flush();

        $response = $serializer->serializeSector($sector);

        return $this->json($response);
    }

    /**
     * @Route("/sector/delete/{id}", name="delete-sector", methods={"DELETE"})
     */
    public function delete($id, SectorRepository $sectorRepo, EntityManagerInterface $em): Response
    {
        $sector = $sectorRepo->find($id);

        $sectorCompanies = $sector->getEmpresas();
        
        $sectorCompaniesObjects = [];
        foreach($sectorCompanies as $sectorCompany){
            $sectorCompanyObject = [];
            $sectorCompanyObject['name'] = $sectorCompany->getNombre();
            $sectorCompaniesObjects[] = $sectorCompanyObject;
        }

        if($sectorCompaniesObjects !== []){
            $response = [];
            $response['error'] = "This sector cannot be deleted.";
            return $this->json($response);
        };

        $em->remove($sector);
        $em->flush();

        return $this->json("The sector has been deleted successfully.");
    }

    /**
     * @Route("/sector/find/{id}", name="find-sector", methods={"GET"})
     */
    public function find($id, SectorRepository $sectorRepo, SerializerService $serializer): Response
    {
        $sector = $sectorRepo->find($id);

        $response = $serializer->serializeSector($sector);

        return $this->json($response);
    }
}
