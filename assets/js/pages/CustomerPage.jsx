import React, { useState, useEffect } from 'react';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import CustomersService from '../services/CustomersService';
import { toast } from 'react-toastify';
import FormLoader from '../components/loaders/FormLoader';

const CustomerPage = ({ match, history }) => {
	const { id = 'new' } = match.params;
	const [ customer, setCustomer ] = useState({
		firstName: '',
		lastName: '',
		email: '',
		company: ''
	});
	const [ error, setError ] = useState({
		firstName: '',
		lastName: '',
		email: '',
		company: ''
	});
	const [ editing, setEditing ] = useState(false);
	const[loading, setLoading] = useState(false);

	const getCustomer = async (id) => {
		try {
			const { firstName, lastName, email, company } = await CustomersService.get(id);
			setCustomer({ firstName, lastName, email, company });
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(
		() => {
			if (id !== 'new') {
				setLoading(true);
				setEditing(true);
				getCustomer(id);
			}
		},
		[ id ]
	);

	const handleChange = (event) => {
		const { name, value } = event.currentTarget;
		setCustomer({ ...customer, [name]: value });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			if (editing) {
				await CustomersService.update(id, customer);
                setError(error);
                toast.success('Le client a bien été modifié avec succès !');
			} else {
				await CustomersService.create(customer);
                setError(error);
                toast.success('Le client a bien été crée avec succès !');
				history.replace('/customers');
			}
		} catch ({ response }) {
			const apiError = {};
			const { violations } = response.data;
			if (violations) {
				violations.forEach(({ propertyPath, message }) => {
					apiError[propertyPath] = message;
				});
				setError(apiError);
            }
            toast.error('Le formulaire contient des erreurs !');
		}
	};

	return (
		<div>
			{(!editing && <h1>Création d'un client</h1>) || <h1>Edition d'un client</h1>}
			{loading && <FormLoader />}
			{!loading && <form onSubmit={handleSubmit}>
				<Field
					name="lastName"
					value={customer.lastName}
					handleChange={handleChange}
					error={error.lastName}
					placeholder="Nom du client"
					label="Nom"
				/>
				<Field
					name="firstName"
					value={customer.firstName}
					handleChange={handleChange}
					error={error.firstName}
					placeholder="Prénom du client"
					label="Prénom"
				/>
				<Field
					name="email"
					value={customer.email}
					handleChange={handleChange}
					error={error.email}
					placeholder="Adresse email du client"
					label="Adresse email"
				/>
				<Field
					name="company"
					value={customer.company}
					handleChange={handleChange}
					error={error.company}
					placeholder="Entreprise du client"
					label="Entreprise"
				/>
				<div className="form-group">
					<button className="btn btn-primary">Enregister</button>
					<Link to="/customers" className="btn btn-link">
						Retour à la liste
					</Link>
				</div>
			</form>}
		</div>
	);
};

export default CustomerPage;
