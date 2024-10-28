import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button'; 
import { logout } from '../http/login';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };

  return (
    <Button 
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
