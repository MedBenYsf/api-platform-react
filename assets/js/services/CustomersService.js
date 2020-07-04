import Axios from 'axios';

const getAll = () => {
	return Axios.get('http://127.0.0.1:8000/api/clients').then((response) => response.data);
};

const deleteCustomer = (id) => {
	return Axios.delete(`http://127.0.0.1:8000/api/customers/${id}`);
};

const get = (id) => {
	return Axios.get(`http://127.0.0.1:8000/api/customers/${id}`).then((response) => response.data);
};

const update = (id, customer) => {
	return Axios.put(`http://localhost:8000/api/customers/${id}`, customer);
};

const create = (customer) => {
	return Axios.post('http://localhost:8000/api/customers', customer);
};

export default {
	getAll,
	deleteCustomer,
	get,
	update,
	create
};
