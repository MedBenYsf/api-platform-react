import Axios from 'axios';
import { API_URL } from '../config';

const register = (user) => {
	return Axios.post(`${API_URL}users`, user).then((response) => response.data);
};

export default {
	register
};
