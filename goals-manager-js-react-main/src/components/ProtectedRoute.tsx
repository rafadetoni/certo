import { useAuth } from './auth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: any) => {
  const { authenticated } = useAuth();

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
