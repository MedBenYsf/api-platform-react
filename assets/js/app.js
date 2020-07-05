import React, { useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import AuthContext from './contexts/AuthContext';
/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import '../css/app.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import { HashRouter, Switch, Route, withRouter, Redirect } from 'react-router-dom';
import CustomersPage from './pages/CustomersPage';
import CustomersPageWithPagination from './pages/CustomersPageWithPagination';
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/LoginPage';
import AuthentificationService from './services/AuthentificationService';
import PrivateRoute from './components/PrivatedRoute';
import CustomerPage from './pages/CustomerPage';
import InvoicePage from './pages/InvoicePage';
import RegisterPage from './pages/RegisterPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

AuthentificationService.setUp();

const NavbarWithRouter = withRouter(Navbar);

const App = () => {
	const [ isAuthenticated, setIsAuthenticated ] = useState(AuthentificationService.isLogged());
	const contextValue = {
		isAuthenticated,
		setIsAuthenticated
	};
	return (
		<AuthContext.Provider value={contextValue}>
			<HashRouter>
				<NavbarWithRouter />
				<main className="container pt-5">
					<Switch>
						<Route path="/" exact component={HomePage} />
						<Route path="/login" exact component={LoginPage} />
						<Route path="/register" exact component={RegisterPage} />
						<PrivateRoute path="/customers/:id" component={CustomerPage} />
						<PrivateRoute path="/customers" component={CustomersPage} />
						<PrivateRoute path="/invoices/:id" component={InvoicePage} />
						<PrivateRoute path="/invoices" component={InvoicesPage} />
					</Switch>
				</main>
			</HashRouter>
			<ToastContainer position="bottom-left" />
		</AuthContext.Provider>
	);
};
const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);
