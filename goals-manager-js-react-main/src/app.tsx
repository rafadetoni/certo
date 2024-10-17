import { Dialog } from '@radix-ui/react-dialog';
import { CriarMeta } from './components/criarMeta';
import { ResumoSemanal } from './components/resumoSemanal';
import { useQuery } from '@tanstack/react-query';
import { getResumo } from './http/getResumo';
import { Loader2 } from 'lucide-react';
import { MetasVazias } from './components/metasVazias';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Cadastro from './components/cadastro';
import { AuthProvider } from './components/auth'; // Importar o contexto de autenticação
import ProtectedRoute from './components/ProtectedRoute'; // Componente para rotas protegidas

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainContent />
              </ProtectedRoute>
            }
          />
          {/* Redirecionar para login por padrão */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const MainContent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['summary'],
    queryFn: getResumo,
  });

  if (isLoading || !data) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="text-zinc-500 animate-spin size-10" />
      </div>
    );
  }

  return (
    <Dialog>
      {data.summary.total > 0 ? (
        <ResumoSemanal summary={data.summary} />
      ) : (
        <MetasVazias />
      )}
      <CriarMeta />
    </Dialog>
  );
};

export default App;
