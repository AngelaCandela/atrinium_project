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

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(
        {   totalSectors: 0,
            totalPages: 0,
            currentPage: 1,
            previousPage: false,
            nextPage: false,
            prevPageNumber: 0,
            nextPageNumber: 0
        }
    )

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
        fetch(`http://localhost:8000/sectors/${page}`, {method: 'GET'})
        .then(response => {
            if(!response.ok)
                throw new Error(`Something went wrong: ${response.statusText}`);
            
            return response.json();
        })
        .then(response => {
            setSectors(response.data);
            setPagination(response.pagination);
        })
        .catch(error => console.log('Error: ', error)
        );
    }, [disabled, page])
    
    function prevPageList(pagination){
        if(pagination.prevPageNumber){
            let listItem = document.getElementById('previous').classList.remove('disabled');
            return(
                <li class="page-item" onClick={() => setPage(pagination.prevPageNumber)}><a class="page-link" href="#">{pagination.prevPageNumber}</a></li>
            )
        }
    }

    function nextPageList(pagination){
        if(pagination.nextPageNumber){
            return(
                <li class="page-item" onClick={() => setPage(pagination.nextPageNumber)}><a class="page-link" href="#">{pagination.nextPageNumber}</a></li>
            )
        }
    }

    function disablePrevious(pagination){
        if(pagination.prevPageNumber === null){
            let string = "disabled";
            return string;
        } else {
            return null;
        }
    }

    function disableNext(pagination){
        if(pagination.nextPageNumber === null){
            let string = "disabled";
            return string;
        } else {
            return null;
        }
    }

    function nextPage(pagination){
        if(pagination.nextPageNumber){
            setPage(pagination.nextPageNumber);
        }
    }

    function previousPage(pagination){
        if(pagination.prevPageNumber){
            setPage(pagination.prevPageNumber);
        }
    }

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
            <div className="table-footer">
                <div>
                    <span>Total number of pages: {pagination.totalPages}</span><br></br>
                    <span>Total number of sectors: {pagination.totalSectors}</span>
                </div>
                <button type="button" onClick={() => history.push("/sector/new")}>New Sector</button>
            </div>
            <nav className="pagination" aria-label="...">
                <ul className="pagination">
                    <li id="previous" className={"page-item "+disablePrevious(pagination)}>
                        <a className="page-link" tabindex="-1" onClick={() => previousPage(pagination)}>Previous</a>
                    </li>
                    {prevPageList(pagination)}
                    <li className="page-item active">
                        <a className="page-link" href="#">{pagination.currentPage}<span className="sr-only">(current)</span></a>
                    </li>
                    {nextPageList(pagination)}
                    <li id="next" className={"page-item "+disableNext(pagination)} >
                        <a className="page-link" onClick={() => nextPage(pagination)}>Next</a>
                    </li>                      
                </ul>
            </nav>
            <div className="backdrop" disabled={disabled}>
                <div className="pop-up">
                    <p>Are you sure you want to delete this sector?</p>
                    <div className="confirmation-buttons">
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