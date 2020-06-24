import React, { useContext } from 'react';
import AuthentificationService from '../services/AuthentificationService';
import { Link } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const Navbar = (props) => {
	const { history} = props;
	const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
	const handleClick = () => {
		AuthentificationService.logout();
		setIsAuthenticated(false);
		history.push('/login');
	};
	return (
		<div>
			<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
				<Link className="navbar-brand" to="/">
					SymReact
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-toggle="collapse"
					data-target="#navbarColor01"
					aria-controls="navbarColor01"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon" />
				</button>

				<div className="collapse navbar-collapse" id="navbarColor01">
					{isAuthenticated && <ul className="navbar-nav mr-auto">
						<li className="nav-item">
							<Link className="nav-link" to="/customers">
								Clients
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/invoices">
								Factures
							</Link>
						</li>
					</ul>}
					<ul className="navbar-nav ml-auto">
						{!isAuthenticated && <>
							<li className="nav-item">
							<Link className="nav-link" to="/register">
								Inscription
							</Link>
						</li>
						<li className="nav-item">
							<Link className="btn btn-success" to="/login">
								Connexion
							</Link>
						</li>
						</> || <li className="nav-item">
							<button className="btn btn-danger" onClick={handleClick}>
								Déconnexion
							</button>
						</li>}
						
					</ul>
				</div>
			</nav>
		</div>
	);
}
export default Navbar;