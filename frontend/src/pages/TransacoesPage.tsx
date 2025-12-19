import React, { useState, useEffect, useCallback } from 'react';
import { Transacao, TipoTransacao } from '../types';
import { getTransacoes, createTransacao } from '../apiService';
import TransacaoForm from '../components/TransacaoForm';

const TransacoesPage: React.FC = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransacoes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTransacoes();
      setTransacoes(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
      setError('Não foi possível carregar a lista de transações.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransacoes();
  }, [fetchTransacoes]);

  const handleCreateTransacao = async (transacao: Omit<Transacao, 'id' | 'categoria' | 'pessoa'>) => {
    try {
      await createTransacao(transacao);
      fetchTransacoes(); 
    } catch (err: any) {
      console.error('Erro ao criar transação:', err);
      const errorMessage = err.response?.data?.title || 'Erro ao criar transação. Verifique as regras de negócio (ex: menor de idade, categoria incompatível).';
      alert(errorMessage);
    }
  };

  if (loading) return <p>Carregando transações...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

  return (
    <div className="container">
      <h2>Gerenciamento de transações</h2>
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
            {transacoes.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.descricao}</td>
                <td>R$ {t.valor.toFixed(2)}</td>
                <td style={{ color: t.tipo === TipoTransacao.Receita ? 'green' : 'red' }}>
                  {t.tipo === TipoTransacao.Receita ? 'Receita' : 'Despesa'}
                </td>
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
