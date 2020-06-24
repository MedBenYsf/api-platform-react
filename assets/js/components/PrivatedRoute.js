import React, { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = (props) => {
	const { path, component } = props;
	const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

	return isAuthenticated ? <Route path={path} exact component={component} /> : <Redirect to="/login" />;
};

export default PrivateRoute;
