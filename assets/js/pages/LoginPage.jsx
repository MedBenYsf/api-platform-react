import Axios from 'axios';
import React, { useState, useContext } from 'react';
import AuthentificationService from '../services/AuthentificationService';
import AuthContext from '../contexts/AuthContext';

const LoginPage = (props) => {
	const {history} = props;
	const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);

	const [ credentials, setCredentials ] = useState({
		username: '',
		password: ''
	});
	const [ error, setError ] = useState('');

	const handleChange = (event) => {
		const { value, name } = event.currentTarget;
		setCredentials({ ...credentials, [name]: value });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const token = await AuthentificationService.authenticate(credentials);
			localStorage.setItem('authToken', token);
			Axios.defaults.headers['Authorization'] = 'Bearer ' + token;
			setIsAuthenticated(true);
			history.push('/customers');
		} catch (error) {
			console.log(error);
			setError('Aucun compte ne possede pas cette adresse email ou bien les informations ne correspondent pas !');
		}
	};

	return (
		<div>
			<h1>Connexion à l'application</h1>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="username">Email de connexion </label>
					<input
						value={credentials.username}
						onChange={handleChange}
						type="email"
						className={'form-control' + (error && ' is-invalid')}
						id="username"
						name="username"
						placeholder="Email de connexion"
						autoFocus
					/>
					{error && <div className="invalid-feedback">{error}</div>}
				</div>
				<div className="form-group">
					<label htmlFor="password"> Mot de passe </label>
					<input
						value={credentials.password}
						onChange={handleChange}
						type="password"
						className="form-control"
						id="password"
						name="password"
						placeholder="Mot de passe"
					/>
				</div>
				<div className="form-group">
					<button type="submit" className="btn btn-primary">
						Se connecter
					</button>
				</div>
			</form>
		</div>
	);
};

export default LoginPage;
