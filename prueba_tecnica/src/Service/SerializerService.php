<?php

namespace App\Service;

class SerializerService {

    public function serializeCompany($company): Array
    {
        $response = [];
        $response['id'] = $company->getId();
        $response['name'] = $company->getNombre();
        $response['telephone'] = $company->getTelefono();
        $response['email'] = $company->getEmail();
        $response['sector'] = $company->getSector()->getNombre();

        return $response;
    }
    
    public function serializeSector($sector): Array
    {
        $response = [];
        $response['id'] = $sector->getId();
        $response['name'] = $sector->getNombre();

        return $response;
    }
}