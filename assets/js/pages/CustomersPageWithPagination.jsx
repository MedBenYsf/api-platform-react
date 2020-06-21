import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Pagination from '../components/Pagination';

const CustomersPageWithPagination = () => {
	const [ customers, setCustomers ] = useState([]);
	const [ currentPage, setCurrentPage ] = useState(1);
	const [ totalItems, setTotalItems ] = useState(0);
	const [ loading, setLoading ] = useState(true);

	useEffect(
		() => {
			Axios.get(
				`http://127.0.0.1:8000/api/clients?pagination=true&page=${currentPage}&count=${itemsPerPage}`
			).then((response) => {
				setCustomers(response.data['hydra:member']);
				setTotalItems(response.data['hydra:totalItems']);
				setLoading(false);
			});
		},
		[ currentPage ]
	);

	const handleDelete = (id) => {
		Axios.delete(`http://127.0.0.1:8000/api/customers/${id}`).then((response) =>
			setCustomers(customers.filter((customer) => customer.id !== id))
		);
	};

	const itemsPerPage = 10;

	const handleChangePage = (page) => {
		setLoading(true);
		setCurrentPage(page);
	};

	const paginatedCustomers = Pagination.getData(currentPage, itemsPerPage, customers);

	return (
		<div>
			<h1>Liste des clients (Pagination)</h1>
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
					{loading && (
						<tr>
							<td>Chargement ...</td>
						</tr>
					)}
					{!loading &&
						customers.map((customer) => (
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
			<Pagination
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				size={totalItems}
				onChangePagination={handleChangePage}
			/>
		</div>
	);
};

export default CustomersPageWithPagination;
