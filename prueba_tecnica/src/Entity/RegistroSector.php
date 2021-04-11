<?php

// La clase RegistroSector va a recibir los datos que lleguen del formulario de creación o edición de un sector
// y los validará con el componente Validator usando los constraints
namespace App\Entity;
use Symfony\Component\Validator\Constraints as Assert;

class RegistroSector
{
    /**
     * @Assert\NotBlank(message="Sector name is required")
     */
    protected $name;    
    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }
    /**
     * @param mixed $name
     */
    public function setName($name): void
    {
        $this->name = $name;
    }   
}