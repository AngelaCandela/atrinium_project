import { useEffect, useContext } from "react";
import { GlobalContext } from "../App";
import Navbar from "../components/Navbar";

function EditSector() {    

    const { sectorToEditId } = useContext(GlobalContext);

    useEffect(() => {
        console.log(sectorToEditId);
        /* fetch('http://localhost:8000/companies', {cors: 'CORS'})
        .then(response => {
            if(!response.ok)
                throw new Error(`Something went wrong: ${response.statusText}`);
            
            return response.json();
        })
        .then(response => {
            console.log('You are inside the companies page', response);
            setCompanies(response);
        })
        .catch(error => console.log('Error: ', error)
        ); */
    }, [])

    /* function editSector(e) {
        e.preventDefault();
        fetch('http://localhost:8000/sector/edit',
        {
            method: 'POST',
            cors: 'CORS',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
        .then(response => {
            if(!response.ok)
                throw new Error(`Something went wrong: ${response.statusText}`);
            
            return response.json();
        })
        .then(company => {
            console.log(`The sector has been edited successfully!`);
        })
        .catch(error => console.log('Error: ', error)
        );
    }; */
    
  return (      
    <>
        <Navbar />
        <div className="container">
            <p>Hi, you're here to edit sector { sectorToEditId }</p>
        </div>
    </>
  );
}

export default EditSector;