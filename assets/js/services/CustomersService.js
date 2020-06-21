import Axios from 'axios';

const getAll = () => {
	return Axios.get('http://127.0.0.1:8000/api/clients').then((response) => response.data);
};

const deleteCustomer = (id) => {
	return Axios.delete(`http://127.0.0.1:8000/api/customers/${id}`);
};

export default {
	getAll,
	deleteCustomer
};
