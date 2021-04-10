import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Navbar from "../components/Navbar";

function CreateCompany() { 
    
    let history = useHistory();

    const [sectors, setSectors] = useState([]);

    const [newData, setNewData] = useState ({
        name: "",
        telephone: "",
        email: "",
        sector: ""
    });

    useEffect(() => {
        fetch('http://localhost:8000/sectors', {method: 'GET'})
        .then(response => {
            if(!response.ok)
                throw new Error(`Something went wrong: ${response.statusText}`);
            
            return response.json();
        })
        .then(response => setSectors(response))
        .catch(error => console.log('Error: ', error)
        );
        
    }, [])

    
    function validateEmail(email){
        
        let text = document.getElementById("text");
        let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

        if(email.match(pattern)){
            text.innerHTML = "";
            return true;
        }else{
            text.innerHTML = "Please enter valid email address";
            text.style.color = "#ff0000";
            return false;
        }
    }

    function validateCompulsoryFields(){
        
        let text = document.getElementById("text2");

        if(newData.name === "" || newData.sector === ""){
            text.innerHTML = "Please fill in all fields marked by (*)";
            text.style.color = "#ff0000";
            return false;
        } else {
            text.innerHTML = "";
            return true;
        }
    }

    function createCompany() {
        if(validateCompulsoryFields() && validateEmail(newData.email)){
            fetch('http://localhost:8000/company/add',
            {
                method: 'POST',
                cors: 'CORS',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {   
                        newData: newData
                    })
            })
            .then(response => {
                if(!response.ok)
                    throw new Error(`Something went wrong: ${response.statusText}`);
                
                return response.json();
            })
            .then(company => {
                console.log(`The company ${company.name} has been created successfully!`, company);
                history.push("/companies");
            })
            .catch(error => console.log('Error: ', error)
            );
        }
                
    }

    function handleName(e) {
        setNewData({...newData, name: e.target.value})
    }

    function handleTelephone(e) {
        setNewData({...newData, telephone: e.target.value})
    }

    function handleEmail(e) {
        setNewData({...newData, email: e.target.value})        
    }

    function handleSector(e) {
        setNewData({...newData, sector: e.target.value})
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        createCompany();
    }
    
  return (      
    <>
        <Navbar />
        <div className="container">
            <p>Hi, you're here to create a new company!</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="inputCompanyName">Name*</label>
                    <input type="text" className="form-control" id="inputCompanyName" value={newData.name} onChange={handleName} />
                </div>
                <div className="form-group">
                    <label htmlFor="inputCompanyTelephone">Telephone</label>
                    <input type="text" className="form-control" id="inputCompanyTelephone" value={newData.telephone} onChange={handleTelephone} />
                </div>
                <div className="form-group">
                    <label htmlFor="inputCompanyEmail">Email</label>
                    <input type="email" className="form-control" id="inputCompanyEmail" value={newData.email} onChange={handleEmail} />
                    <span id="text"></span>
                </div>
                <div className="form-group">
                    <label htmlFor="inputCompanySector">Sector*</label>
                    <select className="form-control form-control-sm" id="inputCompanySector" value={newData.sector} onChange={handleSector}>
                        <option value=""></option>
                        {
                            sectors.map((sector, index) => {
                                return <option key={index} value={sector.name}>{sector.name}</option>
                            })
                        }
                    </select>
                    <span id="text2"></span>
                </div>
                <button type="submit" className="btn btn-primary" value="Submit">Create company</button>
                <button type="button" className="btn btn-primary" onClick={() => history.push("/companies")}>Cancel</button>
          </form>
        </div>
    </>
  );
}

export default CreateCompany;