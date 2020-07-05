import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import CustomersService from '../services/CustomersService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/TableLoader';

const CustomersPage = () => {
	const [ customers, setCustomers ] = useState([]);
	const [ currentPage, setCurrentPage ] = useState(1);
	const [ search, setSearch ] = useState('');
	const [loading, setLoading] = useState(true);

	const getAllCustomers = async () => {
		try {
			const data = await CustomersService.getAll();
			setCustomers(data['hydra:member']);
			setLoading(false);
		} catch (error) {
			toast.error('Une erreur est survenue lors de chargement des clients !');
		}
	};
	useEffect(() => {
		getAllCustomers();
	}, []);

	const handleDelete = async (id) => {
		try {
			await CustomersService.deleteCustomer(id);
			setCustomers(customers.filter((customer) => customer.id !== id));
			toast.success('Le client a bien été supprimé avec succès !');
		} catch (error) {
			setCustomers(customers);
			toast.error('Une erreur est survenue lors de la suppression de client !');
		}
	};

	const itemsPerPage = 10;

	const handleChangePage = (page) => {
		setCurrentPage(page);
	};

	const handleSearchChange = (e) => {
		const value = e.currentTarget.value;
		setSearch(value);
		setCurrentPage(1);
	};

	const filteredCustomers = customers.filter(
		(c) =>
			c.firstName.toLowerCase().includes(search.toLowerCase()) ||
			c.lastName.toLowerCase().includes(search.toLowerCase()) ||
			c.email.toLowerCase().includes(search.toLowerCase()) ||
			(c.company && c.company.toLowerCase().includes(search.toLowerCase()))
	);

	const paginatedCustomers = Pagination.getData(currentPage, itemsPerPage, filteredCustomers);

	return (
		<div>
			<div className="mb-3 d-flex justify-content-between align-items-center">
			<h1>Liste des clients</h1>
			<Link to="/customers/new" className="btn btn-primary">Ajouter un client</Link>
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
						<th>Id</th>
						<th>Client</th>
						<th>Email</th>
						<th>Entreprise</th>
						<th className="text-center">Factures</th>
						<th className="text-center">Montant total</th>
						<th />
					</tr>
				</thead>
				{!loading && <tbody>
					{paginatedCustomers.map((customer) => (
						<tr key={customer.id}>
							<td>{customer.id}</td>
							<td>
								<Link to={'/customers/' + customer.id}>{customer.firstName} {customer.lastName}</Link> 
							</td>
							<td>{customer.email}</td>
							<td>{customer.company}</td>
							<td className="text-center">{customer.invoices.length}</td>
							<td className="text-center">{customer.totalAmount.toLocaleString()} $</td>
							<td>
								<button
									className="btn btn-sm btn-danger"
									disabled={customer.invoices.length > 0}
									onClick={() => handleDelete(customer.id)}
								>
									Supprimer
								</button>
							</td>
						</tr>
					))}
				</tbody> }
			</table>
			{loading && <TableLoader /> }
			{filteredCustomers.length > 0 && (
				<Pagination
					currentPage={currentPage}
					itemsPerPage={itemsPerPage}
					size={filteredCustomers.length}
					onChangePagination={handleChangePage}
				/>
			)}
		</div>
	);
};

export default CustomersPage;
