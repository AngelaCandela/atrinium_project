import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Navbar from "../components/Navbar";

function CreateSector() { 
    
    let history = useHistory();

    const [newData, setNewData] = useState ({
        name: ""
    });

    function validateCompulsoryFields(){
        
        let text = document.getElementById("text");

        if(newData.name === ""){
            text.innerHTML = "The field sector name is required.";
            text.style.color = "#ff0000";
            return false;
        } else {
            text.innerHTML = "";
            return true;
        }
    }

    function sectorAlreadyExistsAlert(){
        
        let text = document.getElementById("text");

        text.innerHTML = "This sector already exists.";
        text.style.color = "#ff0000";
    }

    function createSector() {
        if(validateCompulsoryFields()){
            fetch('http://localhost:8000/sector/add',
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
            .then(sector => {
                console.log(`The sector ${sector.name} has been created successfully!`, sector);
                history.push("/sectors");
            })
            .catch(error => {
                console.log('Error: ', error);
                sectorAlreadyExistsAlert();
            });
        }
                
    }

    function handleName(e) {
        setNewData({...newData, name: e.target.value})
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        createSector();
    }
    
  return (      
    <>
        <Navbar />
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="inputCompanyName">Name*</label>
                    <input type="text" className="form-control" id="inputCompanyName" value={newData.name} onChange={handleName} />
                </div>
                <span id="text"></span>
                <button type="submit" className="btn btn-primary save-btn" value="Submit">Create sector</button>
                <button type="button" className="btn" onClick={() => history.push("/sectors")}>Cancel</button>
          </form>
        </div>
    </>
  );
}

export default CreateSector;