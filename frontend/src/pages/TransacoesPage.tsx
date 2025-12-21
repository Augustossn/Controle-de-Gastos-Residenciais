import React, { useState, useEffect, useCallback } from 'react';
import { Transacao, TipoTransacao } from '../types';
import { getTransacoes, createTransacao } from '../apiService';
import TransacaoForm from '../components/TransacaoForm';

const TransacoesPage: React.FC = () => {
  // estados para gerenciamento da lista de dados e feedback de interface (loading/erro)
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // função memorizada com usecallback para buscar a lista de transações
  // garante que a função não seja recriada a cada renderização, mantendo a estabilidade do useeffect
  const fetchTransacoes = useCallback(async () => {
    try {
      setLoading(true); // inicia o estado de carregamento
      const response = await getTransacoes(); // a api retorna as transações com include(pessoa, categoria)
      setTransacoes(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
      setError('Não foi possível carregar a lista de transações.');
    } finally {
      setLoading(false); // finaliza o carregamento
    }
  }, []);

  // hook que dispara a busca de dados assim que o componente é montado na tela
  useEffect(() => {
    fetchTransacoes();
  }, [fetchTransacoes]);

  // manipulador para criar nova transação
  const handleCreateTransacao = async (transacao: Omit<Transacao, 'id' | 'categoria' | 'pessoa'>) => {
    try {
      await createTransacao(transacao);
      fetchTransacoes(); // atualiza a tabela imediatamente após o sucesso
    } catch (err: any) {
      console.error('Erro ao criar transação:', err);
      
      // tratamento de erro específico
      const errorMessage = err.response?.data?.title || 'Erro ao criar transação. Verifique as regras de negócio (ex: menor de idade, categoria incompatível).';
      alert(errorMessage);
    }
  };

  // renderização condicional para feedback visual
  if (loading) return <p>Carregando transações...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

  return (
    <div className="container">
      <h2>Gerenciamento de transações</h2>
      
      {/* componente de formulário para inserção de novos registros */}
      <TransacaoForm onSubmit={handleCreateTransacao} />

      <h3>Transações Registradas</h3>
      {transacoes.length === 0 ? (
        <p>Nenhuma transação registrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Categoria</th>
              <th>Pessoa</th>
            </tr>
          </thead>
          <tbody>
            {/* mapeia a lista de transações para criar as linhas da tabela */}
            {transacoes.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.descricao}</td>
                <td>R$ {t.valor.toFixed(2)}</td>
                
                {/* renderização condicional de estilo: verde para receitas, vermelho para despesas */}
                <td style={{ color: t.tipo === TipoTransacao.Receita ? 'green' : 'red' }}>
                  {t.tipo === TipoTransacao.Receita ? 'Receita' : 'Despesa'}
                </td>
                
                {/* evita quebra da aplicação caso a transação venha sem categoria ou pessoa vinculada */}
                <td>{t.categoria?.descricao || 'N/A'}</td>
                <td>{t.pessoa?.nome || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransacoesPage;