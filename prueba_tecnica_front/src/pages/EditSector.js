import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../App";
import Navbar from "../components/Navbar";

function EditSector() {
    
    let history = useHistory();

    const { sectorToEditId } = useContext(GlobalContext);
    const [sectorToEdit, setSectorToEdit] = useState({});

    const [newData, setNewData] = useState ({
        name: sectorToEdit.name
    });

    useEffect(() => {
        console.log(sectorToEditId);
        fetch(`http://localhost:8000/sector/find/${sectorToEditId}`, {method: 'GET'})
        .then(response => {
            if(!response.ok)
                throw new Error(`Something went wrong: ${response.statusText}`);
            
            return response.json();
        })
        .then(sector => {
            setSectorToEdit(sector);
            setNewData({
                name: sector.name
            });
        })
        .catch(error => console.log('Error: ', error)
        );
    }, [])

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

        text.innerHTML = "This sector name is already being used.";
        text.style.color = "#ff0000";
    }

    function editSector() {
        if(validateCompulsoryFields()){
            fetch('http://localhost:8000/sector/edit',
            {
                method: 'PUT',
                cors: 'CORS',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {   
                        sectorId: sectorToEditId,
                        newData: newData
                    })
            })
            .then(response => {
                if(!response.ok)
                    throw new Error(`Something went wrong: ${response.statusText}`);
                
                return response.json();
            })
            .then(sector => {
                console.log(`The sector ${sector.name} has been edited successfully!`, sector);
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
        editSector();
    }
    
  return (      
    <>
        <Navbar />
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="inputCompanyName">Name*</label>
                    <input type="text" className="form-control" id="inputCompanyName" value={newData.name} onChange={handleName} />
                    <span id="text"></span>
                </div>
                <button type="submit" className="btn btn-primary save-btn" value="Submit">Save changes</button>
                <button type="button" className="btn" onClick={() => history.push("/sectors")}>Cancel</button>
          </form>
        </div>
    </>
  );
}

export default EditSector;