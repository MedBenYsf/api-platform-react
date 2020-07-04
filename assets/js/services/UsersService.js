import Axios from 'axios';

const register = (user) => {
	return Axios.post(`http://localhost:8000/api/users`, user).then((response) => response.data);
};

export default {
	register
};
