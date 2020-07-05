import React, { useState, useEffect } from 'react';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import { Link } from 'react-router-dom';
import CustomersService from '../services/CustomersService';
import Axios from 'axios';
import InvoicesService from '../services/InvoicesService';
import { toast } from 'react-toastify';
import FormLoader from '../components/loaders/FormLoader';
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
	const[loading, setLoading] = useState(true);

	const handleChange = (event) => {
		const { name, value } = event.currentTarget;
		setInvoice({ ...invoice, [name]: value });
	};

	const getCustomers = async () => {
		try {
			const data = await CustomersService.getAll();
			setCustomers(data['hydra:member']);
			setLoading(false)
			if (!invoice.customer && id === 'new') setInvoice({ ...invoice, customer: data['hydra:member'][0].id });
		} catch (error) {
			toast.error('Une erreur est survenue lors de chargements des clients !');
		}
	};

	const getInvoice = async (id) => {
		try {
			const data = await InvoicesService.get(id);
			const { amount, status, customer } = data;
			setInvoice({ amount, status, customer: customer.id });
			setLoading(false);
		} catch (error) {
			toast.error('Une erreur est survenue lors de chargement de la facture demandée !');
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
		try {
			if (editing) {
				await InvoicesService.update(id, invoice);
				toast.success('La facture a bien été modifiée avec suuccès !');
			} else {
				await InvoicesService.create(invoice);
				toast.success('La facture a bien été crée avec suuccès !');
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
			toast.error('Le formulaire contient des erreurs !');
		}
	};

	return (
		<div>
			<h1>Création d'une facture</h1>
			{loading && <FormLoader />}
			{!loading && <form onSubmit={handleSubmit}>
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
			</form> }
		</div>
	);
};

export default InvoicePage;
