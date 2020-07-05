import Axios from 'axios';
import jwtDecode from 'jwt-decode';
import { API_URL } from '../config';

const authenticate = (credentials) => {
	return Axios.post(`${API_URL}login_check`, credentials).then((response) => response.data.token).then((token) => {
		localStorage.setItem('authToken', token);
		setAxios(token);
		return token;
	});
};

const logout = () => {
	localStorage.removeItem('authToken');
	delete Axios.defaults.headers['Authorization'];
};

const setAxios = (token) => {
	Axios.defaults.headers['Authorization'] = 'Bearer ' + token;
};

const setUp = () => {
	const token = localStorage.getItem('authToken');
	if (isLogged()) {
		setAxios(token);
	} else {
		logout();
	}
};

const isLogged = () => {
	const token = localStorage.getItem('authToken');
	if (token) {
		const { exp } = jwtDecode(token);
		return exp * 1000 > new Date().getTime();
	} else {
		return false;
	}
};

export default {
	authenticate,
	logout,
	setUp,
	isLogged
};
