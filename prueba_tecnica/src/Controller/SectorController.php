<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Sector;
use App\Repository\SectorRepository;

class SectorController extends AbstractController
{
    /**
     * @Route("/sector/add", name="add-sector")
     */
    public function add(EntityManagerInterface $em): Response
    {
        $sector = new Sector();
        $sector->setNombre('Desarrollo Software');

        $em->persist($sector);
        $em->flush();

        return new Response('Sector dado de alta. El id es: '.$sector->getId());
    }

    /**
     * @Route("/sector/edit", name="edit-sector", methods={"POST"})
     */
    public function edit(EntityManagerInterface $em, SectorRepository $empresaRepo): Response
    {
        $sector = new Sector();
        $sector->setNombre('Atrinium');        

        $em->persist($company);
        $em->flush();

        return new Response("The sector has been edited successfully. Sector's id: ".$sector->getId());
    }

    /**
     * @Route("/sectors", name="sectors")
     */
    public function index(SectorRepository $repo): Response
    {
        $sectorsArray = [];
        $sectors = $repo->findBy([], ['id' => 'ASC']); // He usado el método findBy en lugar de findAll para poder ordenar los resultados por id

        foreach($sectors as $sector){
            $item = [];

            $item['id'] = $sector->getId();
            $item['name'] = $sector->getNombre();
            
            $sectorsArray[] = $item;
        }

        return $this->json($sectorsArray);
    }
}
