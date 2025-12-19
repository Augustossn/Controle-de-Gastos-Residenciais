import React, { useState, useEffect, useCallback } from 'react';
import { Categoria, FinalidadeCategoria } from '../types';
import { getCategorias, createCategoria, deleteCategoria, updateCategoria } from '../apiService';
import CategoriaForm from '../components/CategoriaForm';

const FinalidadeMap: Record<FinalidadeCategoria, string> = {
  [FinalidadeCategoria.Despesa]: 'Despesa',
  [FinalidadeCategoria.Receita]: 'Receita',
  [FinalidadeCategoria.Ambas]: 'Ambas',
};

const CategoriasPage: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categoriaEmEdicao, setCategoriaEmEdicao] = useState<Categoria | null>(null);

  const fetchCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCategorias();
      setCategorias(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
      setError('Não foi possível carregar a lista de categorias.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const handleFormSubmit = async (dadosCategoria: Omit<Categoria, 'id'>) => {
    try {
      if (categoriaEmEdicao) {
        await updateCategoria(categoriaEmEdicao.id, dadosCategoria);
        setCategoriaEmEdicao(null); 
      } else {
        await createCategoria(dadosCategoria);
      }
      fetchCategorias(); 
    } catch (err) {
      console.error('Erro ao salvar categoria:', err);
      alert('Erro ao salvar categoria.');
    }
  };

  const handleDeleteCategoria = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar?')) {
      try {
        await deleteCategoria(id);
        fetchCategorias();
      } catch (err) {
        console.error('Erro ao deletar:', err);
        alert('Erro ao deletar categoria.');
      }
    }
  };

  const handleEditClick = (categoria: Categoria) => {
    setCategoriaEmEdicao(categoria);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setCategoriaEmEdicao(null);
  };

  if (loading) return <p>Carregando categorias...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

  return (
    <div className="container">
      <h2>Gerenciamento de categorias</h2>

      <CategoriaForm 
        onSubmit={handleFormSubmit} 
        categoriaParaEditar={categoriaEmEdicao}
        onCancel={handleCancelEdit}
      />

      <h3>Categorias cadastradas</h3>
      {categorias.length === 0 ? (
        <p>Nenhuma categoria cadastrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Descrição</th>
              <th>Finalidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.id}</td>
                <td>{categoria.descricao}</td>
                <td>{FinalidadeMap[categoria.finalidade]}</td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => handleEditClick(categoria)}
                        style={{
                            backgroundColor: '#ffc107', 
                            color: '#000',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                      Editar
                    </button>

                    <button className="delete-btn" onClick={() => handleDeleteCategoria(categoria.id)}>
                      Deletar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoriasPage;