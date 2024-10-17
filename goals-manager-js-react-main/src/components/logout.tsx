import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button'; 
import { logout } from '../http/login'; // Função de logout que remove o token

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Remove o token do localStorage
    navigate('/login'); // Redireciona para a página de login
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
