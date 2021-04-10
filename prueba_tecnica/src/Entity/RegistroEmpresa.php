<?php

// La clase RegistroEmpresa va a recibir los datos que lleguen del formulario de creación o edición de una empresa 
// y los validará con el componente Validator usando los constraints
namespace App\Entity;
use Symfony\Component\Validator\Constraints as Assert;

class RegistroEmpresa
{
    /**
     * @Assert\NotBlank(message="Company name is required")
     */
    protected $name;
    /**
     * @Assert\Email(
     *     message="This email is not valid"
     * )
     */
    protected $email;
    /**
     * @Assert\NotBlank(message="Company sector is required")
     * 
     */
    protected $sector;    
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
    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->email;
    }
    /**
     * @param mixed $email
     */
    public function setEmail($email): void
    {
        $this->email = $email;
    }
    /**
     * @return mixed
     */
    public function getSector()
    {
        return $this->sector;
    }
    /**
     * @param mixed $sector
     */
    public function setSector($sector): void
    {
        $this->sector = $sector;
    }    
}