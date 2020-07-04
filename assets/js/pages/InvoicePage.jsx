import React, { useState, useEffect } from 'react';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import { Link } from 'react-router-dom';
import CustomersService from '../services/CustomersService';
import Axios from 'axios';
import InvoicesService from '../services/InvoicesService';
const InvoicePage = ({ history, match }) => {
	const [ invoice, setInvoice ] = useState({
		amount: '',
		customer: '',
		status: 'SENT'
	});
	const { id = 'new' } = match.params;

	const [ errors, setErrors ] = useState({
		amount: '',
		customer: '',
		status: ''
	});

	const [ customers, setCustomers ] = useState([]);
	const [ editing, setEditing ] = useState(false);

	const handleChange = (event) => {
		const { name, value } = event.currentTarget;
		setInvoice({ ...invoice, [name]: value });
	};

	const getCustomers = async () => {
		try {
			const data = await CustomersService.getAll();
			setCustomers(data['hydra:member']);
			console.log(invoice.customer);
			if (!invoice.customer && !id) setInvoice({ ...invoice, customer: data['hydra:member'][0].id });
		} catch (error) {
			console.log(error.response);
		}
	};

	const getInvoice = async (id) => {
		try {
			const data = await InvoicesService.get(id);
			const { amount, status, customer } = data;
			setInvoice({ amount, status, customer: customer.id });
		} catch (error) {
			//TODO notification error
			history.replace('/invoices');
		}
	};

	useEffect(() => {
		getCustomers();
	}, []);

	useEffect(
		() => {
			if ('new' != id) {
				setEditing(true);
				getInvoice(id);
			}
		},
		[ id ]
	);

	const handleSubmit = async (event) => {
		event.preventDefault();
		console.log('invoice ==>', invoice);
		try {
			if (editing) {
				await InvoicesService.update(id, invoice);
				//TODO: flash notification success
			} else {
				await InvoicesService.create(invoice);
				//TODO: flash notification success
				history.replace('/invoices');
			}
		} catch ({ response }) {
			const apiError = {};
			const { violations } = response.data;
			if (violations) {
				violations.forEach(({ propertyPath, message }) => {
					apiError[propertyPath] = message;
				});
				setErrors(apiError);
			}
			//TODO: flash notification error
		}
	};

	return (
		<div>
			<h1>Création d'une facture</h1>
			<form onSubmit={handleSubmit}>
				<Field
					name="amount"
					label="Montant"
					type="number"
					value={invoice.amount}
					handleChange={handleChange}
					placeholder="Montant de la facture"
					error={errors.amount}
				/>
				<Select
					name="customer"
					label="Client"
					value={invoice.customer}
					error={errors.customer}
					onChange={handleChange}
				>
					{customers.map((customer) => (
						<option key={customer.id} value={customer.id}>
							{customer.firstName} {customer.lastName}
						</option>
					))}
				</Select>
				<Select
					name="status"
					label="Statut"
					value={invoice.status}
					error={errors.status}
					onChange={handleChange}
				>
					<option value="PAID">Payée</option>
					<option value="SENT">Envoyée</option>
					<option value="CANCELLED">Annulée</option>
				</Select>
				<div className="form-group">
					<button className="btn btn-primary">Enregistrer</button>
					<Link to="/invoices" className="btn btn-link">
						Retour aux factures
					</Link>
				</div>
			</form>
		</div>
	);
};

export default InvoicePage;
