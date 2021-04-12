<?php

namespace App\Repository;

use App\Entity\Empresa;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Empresa|null find($id, $lockMode = null, $lockVersion = null)
 * @method Empresa|null findOneBy(array $criteria, array $orderBy = null)
 * @method Empresa[]    findAll()
 * @method Empresa[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EmpresaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Empresa::class);
    }

    public function findCompanies($em, $name, $sector) {

        $var = "";

        if($name !== ""){
            /* $query->setParameter(1, $name); */
            if($var === ""){
                $var = $var."WHERE e.nombre LIKE '%$name%'";
            }else{
                $var = $var." AND e.nombre LIKE '%$name%'";
            }
        }
        if($sector !== ""){
            /* $query->setParameter(2, $sector); */
            if($var === ""){
                $var = $var."WHERE e.sector = "."'$sector'";
            }else{
                $var = $var." AND e.sector = "."'$sector'";
            }
        }
        dump($var);

        $query = $em->createQuery('SELECT e FROM App\Entity\Empresa e '.$var);
        
        $results = $query->getResult();
        dump($results);
        
        return $results;
    }

    // /**
    //  * @return Empresa[] Returns an array of Empresa objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('e.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Empresa
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
