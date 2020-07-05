import Axios from 'axios';
import { API_URL } from '../config';

const getAll = () => {
	return Axios.get(`${API_URL}invoices`).then((response) => response.data);
};

const get = (id) => {
	return Axios.get(`${API_URL}invoices/${id}`).then((response) => response.data);
};

const deleteInvoice = (id) => {
	return Axios.delete(`${API_URL}invoices/${id}`);
};

const update = (id, invoice) => {
	return Axios.put(`${API_URL}invoices/${id}`, {
		...invoice,
		customer: `/api/customers/${invoice.customer}`
	});
};

const create = (invoice) => {
	return Axios.post(`${API_URL}invoices`, {
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
