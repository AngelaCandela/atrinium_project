import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../App";
import Navbar from "../components/Navbar";
import "../styles/Sectors.css";

function Sectors() {  
    
    let history = useHistory();

    const [sectors, setSectors] = useState([]);
    const { setSectorToEditId } = useContext(GlobalContext);
    const [sectorToDeleteId, setSectorToDeleteId] = useState();
    const [disabled, setDisabled] = useState(true);
    const [showErrorMsg, setShowErrorMsg] = useState(true);

    function setIdAndRedirect(e) {
        setSectorToEditId(e.target.id);
        history.push("/sector/edit");
    };

    function setIdAndEnablePopUp(e) {
        setSectorToDeleteId(e.target.id);
        setDisabled(false);
    };

    function sectorIsUsedAlert(){
        setShowErrorMsg(false);
    }

    function deleteSector() {
        fetch(`http://localhost:8000/sector/delete/${sectorToDeleteId}`, {method: 'DELETE'})
        .then(response => {
            if(!response.ok)
                throw new Error(`Something went wrong: ${response.statusText}`);
            
            return response.json();
        })
        .then(response => {
            console.log(response);
            setDisabled(true);
            if(response.error){
                sectorIsUsedAlert();
            } else {
                history.push("/sectors");                
            }
        })
        .catch(error => console.log('Error: ', error));
    };

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
    }, [disabled])
    
  return (
    <>
        <Navbar />   
        <div className="container d-flex align-items-center">
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                    {sectors.map((sector, index) => {
                        return  <tr key={index}>
                                    <th scope="row">{index+1}</th>
                                    <td>{sector.name}</td>
                                    <td><button type="button" id={sector.id} onClick={setIdAndRedirect}>Edit</button></td>
                                    <td><button type="button" id={sector.id} onClick={setIdAndEnablePopUp}>Delete</button></td>
                                </tr>
                        })
                    }
                    </tbody>
                </table>
            </div>
            <button className="m-auto" type="button" onClick={() => history.push("/sector/new")}>New Sector</button>
            <div className="backdrop" disabled={disabled}>
                <div className="pop-up">
                    <p>Are you sure you want to delete this sector?</p>
                    <div className="d-flex flex-column">
                        <button type="button" onClick={deleteSector}>Accept</button>
                        <button type="button" onClick={() => setDisabled(true)}>Cancel</button>
                    </div>
                </div>
            </div>
            <div className="backdrop" disabled={showErrorMsg}>
                <div className="pop-up">
                    <p>This sector cannot be deleted as it is used by one or more companies.</p>
                    <button className="" type="button" onClick={() => setShowErrorMsg(true)}>OK</button>
                </div>
            </div>  
        </div>
    </>
  );
}

export default Sectors;