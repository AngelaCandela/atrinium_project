import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../App";
import _, { debounce } from 'lodash';
import Navbar from "../components/Navbar";
import "../styles/Companies.css";

function Companies() {   
    
    let history = useHistory();

    const [companies, setCompanies] = useState([]);
    const [sectors, setSectors] = useState([]);
    const { setCompanyToEditId } = useContext(GlobalContext);
    const [companyToDeleteId, setCompanyToDeleteId] = useState();
    const [disabled, setDisabled] = useState(true);

    const [filters, setFilters] = useState(
        {
            nameInput: "",
            sectorInput: ""
        }
    )

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(
        {   totalCompanies: 0,
            totalPages: 0,
            currentPage: 1,
            previousPage: false,
            nextPage: false,
            prevPageNumber: 0,
            nextPageNumber: 0
        }
    )

    function setIdAndRedirect(e) {
        setCompanyToEditId(e.target.id);
        history.push("/company/edit");
    };

    function setIdAndEnablePopUp(e) {
        setCompanyToDeleteId(e.target.id);
        setDisabled(false);
    };

    function deleteCompany() {
        fetch(`http://localhost:8000/company/delete/${companyToDeleteId}`, {method: 'DELETE'})
        .then(response => {
            if(!response.ok)
                throw new Error(`Something went wrong: ${response.statusText}`);
            
            return response.json();
        })
        .then(response => {
            console.log(response);
            history.push("/companies");
            setDisabled(true);
        })
        .catch(error => console.log('Error: ', error));
    };

    useEffect(() => {
        fetch(`http://localhost:8000/companies/${page}?name=${filters.nameInput}&sector=${filters.sectorInput}`, {method: 'GET'})
        .then(response => {
            if(!response.ok)
                throw new Error(`Something went wrong: ${response.statusText}`);
            
            return response.json();
        })
        .then(response => {
            setCompanies(response.data);
            setPagination(response.pagination);
        })
        .catch(error => console.log('Error: ', error)
        );

        fetch('http://localhost:8000/sectors', {method: 'GET'})
        .then(response => {
            if(!response.ok)
                throw new Error(`Something went wrong: ${response.statusText}`);
            
            return response.json();
        })
        .then(response => setSectors(response))
        .catch(error => console.log('Error: ', error)
        );
    }, [disabled, page, filters])

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

    function handleSector(e){
        setFilters({...filters, sectorInput: e.target.value});
    }
    
    const handleName = _.debounce(async (e) => {
        setFilters({ ...filters, nameInput: e.target.value })
    }, 500);
    
  return (
    <>
        <Navbar />
        <div className="container">
            <div className="filters">
                <div class="name-filter input-group mb-3">
                    <input onChange={handleName} type="text" class="form-control" placeholder="Company's name" aria-label="Recipient's username" aria-describedby="button-addon2"></input>
                </div>
                <select onChange={handleSector} className="form-control form-control-sm" id="inputCompanySector">
                    <option value="">Sector</option>
                    {
                        sectors.map((sector, index) => {
                            return <option key={index} value={sector.id}>{sector.name}</option>
                        })
                    }
                </select>
            </div>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Telephone</th>
                            <th scope="col">Email</th>
                            <th scope="col">Industry</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                    {companies.map((company, index) => {
                        return  <tr key={index}>
                                    <th scope="row">{index+1}</th>
                                    <td>{company.name}</td>
                                    <td>{company.telephone}</td>
                                    <td>{company.email}</td>
                                    <td>{company.sector}</td>
                                    <td><button type="button" id={company.id} onClick={setIdAndRedirect}>Edit</button></td>
                                    <td><button type="button" id={company.id} onClick={setIdAndEnablePopUp}>Delete</button></td>
                                </tr>
                        })
                    }
                    </tbody>
                </table>
            </div>
            <div className="table-footer">
                <div>
                    <span>Total number of pages: {pagination.totalPages}</span><br></br>
                    <span>Total number of companies: {pagination.totalCompanies}</span>
                </div>
                <button type="button" onClick={() => history.push("/company/new")}>New Company</button>
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
                    <p>Are you sure you want to delete this company?</p>
                    <div className="confirmation-buttons">
                        <button type="button" onClick={deleteCompany}>Accept</button>
                        <button type="button" onClick={() => setDisabled(true)}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}

export default Companies;