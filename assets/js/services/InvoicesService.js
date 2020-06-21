import Axios from 'axios';

const getAll = () => {
	return Axios.get('http://127.0.0.1:8000/api/invoices').then((response) => response.data);
};

const deleteInvoice = (id) => {
	return Axios.delete(`http://127.0.0.1:8000/api/invoices/${id}`);
};

export default {
	getAll,
	deleteInvoice
};
