import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PessoasPage from './pages/PessoasPage';
import CategoriasPage from './pages/CategoriasPage';
import TransacoesPage from './pages/TransacoesPage';
import './index.css';

const App = () => {
  return (
    // inicia o roteador que gerencia o histórico e a navegação da aplicação
    <Router>
      <div className="container">
        <h1>Controle de Gastos Residenciais</h1>
        
        {/* menu de navegação que utiliza o componente link para transitar entre páginas sem recarregar */}
        <nav>
          <Link to="/">Pessoas</Link>
          <Link to="/categorias">Categorias</Link>
          <Link to="/transacoes">Transações</Link>
        </nav>

        {/* define a área onde as páginas serão renderizadas de acordo com a url acessada */}
        <Routes>
          {/* define a rota raiz para carregar a página de pessoas */}
          <Route path="/" element={<PessoasPage />} />
          {/* define a rota para carregar a página de categorias */}
          <Route path="/categorias" element={<CategoriasPage />} />
          {/* define a rota para carregar a página de transações */}
          <Route path="/transacoes" element={<TransacoesPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;