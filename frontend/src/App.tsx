import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PessoasPage from './pages/PessoasPage';
import CategoriasPage from './pages/CategoriasPage';
import TransacoesPage from './pages/TransacoesPage';
import './index.css';
import React from 'react';

const App = () => {
  return (
    <Router>
      <div className="container">
        <h1>Controle de Gastos Residenciais</h1>
        <nav>
          <Link to="/">Pessoas</Link>
          <Link to="/categorias">Categorias</Link>
          <Link to="/transacoes">Transações</Link>
        </nav>

        <Routes>
          <Route path="/" element={<PessoasPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/transacoes" element={<TransacoesPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
