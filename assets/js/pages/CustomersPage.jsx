import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import CustomersService from '../services/CustomersService';
import { Link } from 'react-router-dom';

const CustomersPage = () => {
	const [ customers, setCustomers ] = useState([]);
	const [ currentPage, setCurrentPage ] = useState(1);
	const [ search, setSearch ] = useState('');

	const getAllCustomers = async () => {
		try {
			const data = await CustomersService.getAll();
			setCustomers(data['hydra:member']);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		//CustomersService.getAll().then((data) => setCustomers(data['hydra:member']));
		getAllCustomers();
	}, []);

	const handleDelete = async (id) => {
		try {
			await CustomersService.deleteCustomer(id);
			setCustomers(customers.filter((customer) => customer.id !== id));
		} catch (error) {
			setCustomers(customers);
			console.log(error);
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
				<tbody>
					{paginatedCustomers.map((customer) => (
						<tr key={customer.id}>
							<td>{customer.id}</td>
							<td>
								{customer.firstName} {customer.lastName}
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
				</tbody>
			</table>
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
