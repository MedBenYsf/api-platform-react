import Axios from 'axios';
import React, { useState, useContext } from 'react';
import AuthentificationService from '../services/AuthentificationService';
import AuthContext from '../contexts/AuthContext';
import Field from '../components/forms/Field';
import { toast } from 'react-toastify';

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
			toast.success('Vous etes désormais connecté !');
			history.push('/customers');
		} catch (error) {
			setError('Aucun compte ne possede pas cette adresse email ou bien les informations ne correspondent pas !');
			toast.error('Le formulaire contient des erreurs !');
		}
	};

	return (
		<div>
			<h1>Connexion à l'application</h1>
			<form onSubmit={handleSubmit}>
				<Field name="username" type="email" value={credentials.username} placeholder="Email de connexion" label="Adresse email" handleChange={handleChange} error={error} />
				<Field name="password" type="password" value={credentials.password} handleChange={handleChange} label="Mot de passe" error={error} />
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
