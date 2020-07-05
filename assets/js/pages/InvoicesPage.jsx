import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import InvoicesService from '../services/InvoicesService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/TableLoader';

const InvoicesPage = () => {
	const [ invoices, setInvoices ] = useState([]);
	const [ currentPage, setCurrentPage ] = useState(1);
	const [ search, setSearch ] = useState('');
	const [loading, setLoading] = useState(true);

	const itemsPerPage = 10;

	const STATUS_CLASSES = {
		PAID: 'success',
		SENT: 'primary',
		CANCELLED: 'danger'
	};
	const STATUS_LABELS = {
		PAID: 'Payée',
		SENT: 'Envoyée',
		CANCELLED: 'Annulée'
	};

	const getInvoices = async () => {
		try {
			const data = await InvoicesService.getAll();
			setInvoices(data['hydra:member']);
			setLoading(false);
		} catch (error) {
			toast.error('une erreur est survenue lors de chargement des factures !');
		}
	};

	useEffect(() => {
		getInvoices();
	}, []);

	const handleChangePage = (page) => {
		setCurrentPage(page);
	};

	const handleDelete = async (id) => {
		const originalInvoices = [ ...invoices ];
		setInvoices(invoices.filter((invoice) => invoice.id !== id));
		try {
			await InvoicesService.deleteInvoice(id);
			toast.success('La facture a bien été supprimée avec suuccès !');
		} catch (error) {
			toast.success('Une erreur est survenue lors de la suppression de la facture !');
			setInvoices(originalInvoices);
		}
	};

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
			<div className="mb-3 d-flex justify-content-between align-items-center">
				<h1>Liste des factures</h1>
				<Link to="/invoices/new" className="btn btn-primary">
					Ajouter une facture
				</Link>
			</div>
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
				{!loading && <tbody>
					{paginatedInvoices.map((invoice) => (
						<tr key={invoice.id}>
							<td>{invoice.chrono}</td>
							<td>
								<Link to={'/customers/' + invoice.customer.id}>
									{invoice.customer.firstName} {invoice.customer.lastName}
								</Link>
							</td>
							<td className="text-center">{formatDate(invoice.sentAt)}</td>
							<td className="text-center">{invoice.amount.toLocaleString()} $</td>
							<td className="text-center">
								<span className={'badge badge-' + STATUS_CLASSES[invoice.status]}>
									{STATUS_LABELS[invoice.status]}
								</span>
							</td>
							<td>
								<Link to={'/invoices/' + invoice.id} className="btn btn-sm btn-primary mr-1">
									Editer
								</Link>
								<button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>
									Supprimer
								</button>
							</td>
						</tr>
					))}
				</tbody> }
			</table>
			{loading && <TableLoader />}
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
