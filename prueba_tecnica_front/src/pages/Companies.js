import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../App";
import Navbar from "../components/Navbar";
import "../styles/Companies.css";

function Companies() {   
    
    let history = useHistory();

    const [companies, setCompanies] = useState([]);
    const { setCompanyToEditId } = useContext(GlobalContext);
    const [companyToDeleteId, setCompanyToDeleteId] = useState();
    const [disabled, setDisabled] = useState(true);

    function setIdAndRedirect(e) {
        setCompanyToEditId(e.target.id);
        history.push("/company/edit");
    };

    function setIdAndEnablePopUp(e) {
        setCompanyToDeleteId(e.target.id);
        setDisabled(false);
    };

    function deleteCompany(e) {
        console.log(`You are about to delete company id: ${e.target.id}`);
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
        fetch('http://localhost:8000/companies', {method: 'GET'})
        .then(response => {
            if(!response.ok)
                throw new Error(`Something went wrong: ${response.statusText}`);
            
            return response.json();
        })
        .then(response => setCompanies(response))
        .catch(error => console.log('Error: ', error)
        );
    }, [disabled])
    
  return (
    <>
        <Navbar /> 
        <div className="container">
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
            <button type="button" onClick={() => history.push("/company/new")}>New Company</button>
            <div className="backdrop" disabled={disabled}>
                <div className="pop-up">
                    <p>Are you sure you want to delete this company?</p>
                    <div className="d-flex flex-column">
                        <button className="mr-4" type="button" onClick={deleteCompany}>Accept</button>
                        <button type="button" onClick={() => setDisabled(true)}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}

export default Companies;