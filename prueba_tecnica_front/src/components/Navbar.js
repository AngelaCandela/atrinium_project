import { useHistory } from "react-router-dom";

export default function Navbar() {

    let history = useHistory();

    function redirect(e) {
        e.preventDefault();
        history.push(e.target.id);
    };

    return (
        <div className="container">
            <nav className="navbar navbar-default">
                <div className="container">
                    <div className="navbar-header">
                        <a href="#" className="navbar-brand" id="/" onClick={redirect}>Atrinium</a>
                    </div>
                    <div>
                        <ul className="nav navbar-nav">
                            <li><a href="/" id="/" onClick={redirect}>Home</a></li>
                            <li><a href="/companies" id="/companies" onClick={redirect}>Companies</a></li>
                            <li><a href="/sectors" id="/sectors" onClick={redirect}>Sectors</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}
