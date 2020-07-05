import React, { useState } from 'react';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import UsersService from '../services/UsersService';
import { toast } from 'react-toastify';

const RegisterPage = ({ history }) => {
	const [ user, setUser ] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: ''
	});
	const [ errors, setErrors ] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: ''
	});

	const handleChange = (event) => {
		const { name, value } = event.currentTarget;
		setUser({ ...user, [name]: value });
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		const apiError = {};
		if (user.password !== user.confirmPassword) {
			apiError['confirmPassword'] = 'les mots de passe ne sont pas identiques !';
			setErrors(apiError);
			return;
		}
		try {
			await UsersService.register(user);
			setErrors({});
            toast.success('Votre compte a bien été crée avec succès !');
			history.replace('/login');
		} catch (error) {
			const { violations } = error.response.data;
			if (violations) {
				violations.forEach(({ propertyPath, message }) => {
					apiError[propertyPath] = message;
				});
				setErrors(apiError);
            }
            toast.error('Votre formulaire contient des erreurs !');
		}
	};

	return (
		<div>
			<h1> Inscription</h1>
			<form onSubmit={handleSubmit}>
				<Field
					name="firstName"
					label="Prénom"
					placeholder="Votre prénom"
					value={user.firstName}
					handleChange={handleChange}
					error={errors.firstName}
				/>
				<Field
					name="lastName"
					label="Nom"
					placeholder="Votre nom"
					value={user.lastName}
					handleChange={handleChange}
					error={errors.lastName}
				/>
				<Field
					name="email"
					label="Adresse email"
					type="email"
					placeholder="Votre adresse email"
					value={user.email}
					handleChange={handleChange}
					error={errors.email}
				/>
				<Field
					name="password"
					label="Mot de passe"
					type="password"
					placeholder="Votre mot de passe"
					value={user.password}
					handleChange={handleChange}
					error={errors.password}
				/>
				<Field
					name="confirmPassword"
					label="Confirmation de mot de passe"
					type="password"
					placeholder="Votre mot de passe"
					value={user.confirmPassword}
					handleChange={handleChange}
					error={errors.confirmPassword}
				/>
				<div className="form-group">
					<button className="btn btn-success mr-3">Confirmation</button>
					<Link to="/login">Se connecter</Link>
				</div>
			</form>
		</div>
	);
};

export default RegisterPage;
