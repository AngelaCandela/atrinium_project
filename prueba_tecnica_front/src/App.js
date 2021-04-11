import './App.css';
import { useState, createContext } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./pages/Home";
import Companies from "./pages/Companies";
import Sectors from "./pages/Sectors";
import EditCompany from "./pages/EditCompany";
import EditSector from "./pages/EditSector";
import CreateCompany from "./pages/CreateCompany";
import CreateSector from "./pages/CreateSector";

export const GlobalContext = createContext({});

function App() {

  const [companyToEditId, setCompanyToEditId] = useState();
  const [sectorToEditId, setSectorToEditId] = useState();

  return (
    <>
      <BrowserRouter>        
        <Route exact path="/" component={Home}/>
        <GlobalContext.Provider value={{companyToEditId, setCompanyToEditId, sectorToEditId, setSectorToEditId}}>
          <Route path="/companies" component={Companies}/>
          <Route path="/sectors" component={Sectors}/>
          <Route path="/company/edit" component={EditCompany}/>
          <Route path="/sector/edit" component={EditSector}/>
          <Route path="/company/new" component={CreateCompany}/>
          <Route path="/sector/new" component={CreateSector}/>
        </GlobalContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
