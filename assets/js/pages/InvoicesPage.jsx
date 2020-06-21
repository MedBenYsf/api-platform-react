import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import InvoicesService from '../services/InvoicesService';

const InvoicesPage = () => {
	const [ invoices, setInvoices ] = useState([]);
	const [ currentPage, setCurrentPage ] = useState(1);
	const [ search, setSearch ] = useState('');

	const itemsPerPage = 10;

	const STATUS_CLASSES = {
		PAID: 'success',
		SENTED: 'primary',
		CANCELLED: 'danger'
	}
	const STATUS_LABELS = {
		PAID: 'Payée',
		SENTED: 'Envoyée',
		CANCELLED: 'Annulée'
	}

	const getInvoices = async () => {
		try {
			const data = await InvoicesService.getAll();
			setInvoices(data['hydra:member']);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getInvoices();
	}, []);

	const handleChangePage = (page) => {
		setCurrentPage(page);
	}

	const handleDelete = async (id) => {
		const originalInvoices = [...invoices];

		setInvoices(invoices.filter(invoice => invoice.id !== id));
		try {
			await InvoicesService.deleteInvoice(id);

		} catch(error) {
			console.log(error);
			setInvoices(originalInvoices);
		}
	}

	const filteredInvoices = invoices.filter(
		(i) =>
			i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
			i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
			i.amount.toString().toLowerCase().includes(search.toLowerCase()) 
			// a voir pourquoi ça marche pas
			//STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
	);

	const paginatedInvoices = Pagination.getData(currentPage, itemsPerPage, filteredInvoices);

	const formatDate = (str) => moment(str).format('DD/MM/YYYY');

	const handleSearchChange = (e) => {
		const value = e.currentTarget.value;
		setSearch(value);
		setCurrentPage(1);
	};

	return (
		<div>
			<h1>Liste des factures</h1>
			<div className="form-group">
				<input
					type="text"
					onChange={handleSearchChange}
					value={search}
					className="form-control"
					placeholder="Rechercher"
				/>
			</div>
			<table className="table table-hover">
				<thead>
					<tr>
						<th>Numero</th>
						<th>Client</th>
						<th className="text-center">Date d'envoi</th>
						<th className="text-center">Montant</th>
						<th className="text-center">Statut</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{paginatedInvoices.map((invoice) => (
						<tr key={invoice.id}>
							<td>{invoice.chrono}</td>
							<td>
								<a href="#">
									{invoice.customer.firstName} {invoice.customer.lastName}
								</a>
							</td>
							<td className="text-center">{formatDate(invoice.sentAt)}</td>
							<td className="text-center">{invoice.amount.toLocaleString()} $</td>
							<td className="text-center">
								<span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
							</td>
							<td>
								<button className="btn btn-sm btn-primary mr-1">Editer</button>
								<button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimer</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<Pagination
					currentPage={currentPage}
					itemsPerPage={itemsPerPage}
					size={filteredInvoices.length}
					onChangePagination={handleChangePage}
				/>
		</div>
	);
};

export default InvoicesPage;
