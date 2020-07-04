import Axios from 'axios';

const getAll = () => {
	return Axios.get('http://127.0.0.1:8000/api/invoices').then((response) => response.data);
};

const get = (id) => {
	return Axios.get(`http://localhost:8000/api/invoices/${id}`).then((response) => response.data);
};

const deleteInvoice = (id) => {
	return Axios.delete(`http://127.0.0.1:8000/api/invoices/${id}`);
};

const update = (id, invoice) => {
	return Axios.put(`http://localhost:8000/api/invoices/${id}`, {
		...invoice,
		customer: `/api/customers/${invoice.customer}`
	});
};

const create = (invoice) => {
	return Axios.post(`http://localhost:8000/api/invoices`, {
		...invoice,
		customer: `/api/customers/${invoice.customer}`
	});
};
export default {
	getAll,
	get,
	update,
	create,
	deleteInvoice
};
