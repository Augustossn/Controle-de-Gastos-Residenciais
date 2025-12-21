import React, { useState, useEffect, useCallback } from 'react';
import { Categoria, FinalidadeCategoria } from '../types';
import { getCategorias, createCategoria, deleteCategoria, updateCategoria } from '../apiService';
import CategoriaForm from '../components/CategoriaForm';

// objeto utilitário para mapear os valores numéricos do Enum para strings legíveis na interface
const FinalidadeMap: Record<FinalidadeCategoria, string> = {
  [FinalidadeCategoria.Despesa]: 'Despesa',
  [FinalidadeCategoria.Receita]: 'Receita',
  [FinalidadeCategoria.Ambas]: 'Ambas',
};

const CategoriasPage: React.FC = () => {
  // estados para gerenciamento de dados e interface
  const [categorias, setCategorias] = useState<Categoria[]>([]); // armazena a lista vinda da API
  const [loading, setLoading] = useState(true); // controla o feedback de carregamento
  const [error, setError] = useState<string | null>(null); // armazena mensagens de erro

  // estado que controla qual categoria está sendo editada no momento (se null, o formulário assume modo de criação)
  const [categoriaEmEdicao, setCategoriaEmEdicao] = useState<Categoria | null>(null);

  // função memorizada com useCallback para buscar dados na API
  // useCallback evita que a função seja recriada a cada renderização, prevenindo loops no useEffect
  const fetchCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCategorias();
      setCategorias(response.data); // atualiza o estado com os dados recebidos
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
      setError('Não foi possível carregar a lista de categorias.');
    } finally {
      setLoading(false); // remove o estado de carregamento independente do sucesso ou erro
    }
  }, []);

  // hook que dispara a busca inicial de dados assim que o componente é montado
  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  // manipulador unificado para submissão do formulário (Gerencia tanto Criação quanto Edição)
  const handleFormSubmit = async (dadosCategoria: Omit<Categoria, 'id'>) => {
    try {
      if (categoriaEmEdicao) {
        // se existe uma categoria em edição, chama a rota de PUT (Update)
        await updateCategoria(categoriaEmEdicao.id, dadosCategoria);
        setCategoriaEmEdicao(null); // Limpa o estado de edição após o sucesso
      } else {
        // se não, chama a rota de POST (Create)
        await createCategoria(dadosCategoria);
      }
      fetchCategorias(); // atualiza a lista na tabela para refletir as mudanças
    } catch (err) {
      console.error('Erro ao salvar categoria:', err);
      alert('Erro ao salvar categoria.');
    }
  };

  // função assíncrona para deletar uma categoria
  const handleDeleteCategoria = async (id: number) => {
    // exige confirmação do usuário antes de realizar a operação destrutiva
    if (window.confirm('Tem certeza que deseja deletar?')) {
      try {
        await deleteCategoria(id);
        fetchCategorias(); // atualiza a lista removendo o item deletado
      } catch (err) {
        console.error('Erro ao deletar:', err);
        alert('Erro ao deletar categoria.');
      }
    }
  };

  // prepara o formulário para edição
  const handleEditClick = (categoria: Categoria) => {
    setCategoriaEmEdicao(categoria); // preenche o estado com a categoria selecionada
    window.scrollTo({ top: 0, behavior: 'smooth' }); // rola a página para o formulário no topo
  };

  // reseta o estado de edição (volta o formulário para modo de criação)
  const handleCancelEdit = () => {
    setCategoriaEmEdicao(null);
  };

  // renderização condicional para estados de carregamento e erro
  if (loading) return <p>Carregando categorias...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

  return (
    <div className="container">
      <h2>Gerenciamento de categorias</h2>

      {/* renderiza o formulário passando as funções de controle e o estado de edição atual */}
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
            {/* mapeia o array de categorias para criar as linhas da tabela */}
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.id}</td>
                <td>{categoria.descricao}</td>
                {/* usa o FinalidadeMap para converter o número do Enum em texto */}
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