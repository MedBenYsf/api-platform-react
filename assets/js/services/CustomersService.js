import Axios from 'axios';
import { API_URL } from '../config';

const getAll = () => {
	return Axios.get(API_URL + 'clients').then((response) => response.data);
};

const deleteCustomer = (id) => {
	return Axios.delete(`${API_URL}customers/${id}`);
};

const get = (id) => {
	return Axios.get(`${API_URL}customers/${id}`).then((response) => response.data);
};

const update = (id, customer) => {
	return Axios.put(`${API_URL}customers/${id}`, customer);
};

const create = (customer) => {
	return Axios.post(`${API_URL}customers`, customer);
};

export default {
	getAll,
	deleteCustomer,
	get,
	update,
	create
};
