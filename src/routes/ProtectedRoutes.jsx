import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import Layout from '@/layout/index.jsx';
import { checkTokenValid } from '@/utils/helper.jsx';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!checkTokenValid()) {
    return <Navigate to='/sign-in' replace />;
  }

  if (location.pathname === '/') return <Navigate to='/sign-in' replace />;

  <Layout>{children}</Layout>;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  component: PropTypes.object,
  children: PropTypes.node,
};
