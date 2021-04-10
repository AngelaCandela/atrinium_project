import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../App";
import Navbar from "../components/Navbar";

function Sectors() {  
    
    let history = useHistory();

    function setIdAndRedirect(e) {
        e.preventDefault();
        setSectorToEditId(e.target.id);
        history.push("/sector/edit");
    };

    const [sectors, setSectors] = useState([]);
    const { setSectorToEditId } = useContext(GlobalContext);

    useEffect(() => {
        fetch('http://localhost:8000/sectors', {cors: 'CORS'})
        .then(response => {
            if(!response.ok)
                throw new Error(`Something went wrong: ${response.statusText}`);
            
            return response.json();
        })
        .then(response => setSectors(response))
        .catch(error => console.log('Error: ', error)
        );
    }, [])
    
  return (
    <>
        <Navbar />   
        <div className="container">
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
                                <td><button type="button" id={sector.id}>Delete</button></td>
                            </tr>
                    })
                }
                </tbody>
            </table>     
        </div>
    </>
  );
}

export default Sectors;