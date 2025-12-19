import React, { useState, useEffect, useCallback } from 'react';
import { Pessoa, Transacao, TipoTransacao } from '../types';
import { getPessoas, createPessoa, deletePessoa } from '../apiService';
import PessoaForm from '../components/PessoaForm';

const PessoasPage: React.FC = () => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPessoas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPessoas();
      setPessoas(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar pessoas:', err);
      setError('Não foi possível carregar a lista de pessoas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPessoas();
  }, [fetchPessoas]);
  
  const handleCreatePessoa = async (pessoa: Omit<Pessoa, 'id'>) => {
    try {
      await createPessoa(pessoa);
      fetchPessoas(); 
    } catch (err) {
      console.error('Erro ao criar:', err);
      alert('Erro ao criar pessoa.');
    }
  };

  const handleDeletePessoa = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar esta pessoa? Todas as transações associadas serão apagadas.')) {
        try {
            await deletePessoa(id);
            fetchPessoas();
        } catch (err) {
            console.error('Erro ao deletar:', err);
            alert('Erro ao deletar pessoa.');
        }
    }
  };

  const calcularTotaisPessoa = (transacoes: Transacao[]) => {
    let receitas = 0;
    let despesas = 0;

    if (transacoes) {
        transacoes.forEach(t => {
            if (t.tipo === TipoTransacao.Receita) {
                receitas += t.valor;
            } else {
                despesas += t.valor;
            }
        });
    }

    return {
        receitas,
        despesas,
        saldo: receitas - despesas
    };
  };

  const totalGeral = pessoas.reduce((acc, pessoa) => {
      const totais = calcularTotaisPessoa(pessoa.transacoes || []);
      return {
          receitas: acc.receitas + totais.receitas,
          despesas: acc.despesas + totais.despesas,
          saldo: acc.saldo + totais.saldo
      };
  }, { receitas: 0, despesas: 0, saldo: 0 });

  const calcularIdade = (dataString: string) => {
    if (!dataString) return 0;
    const hoje = new Date();
    const nascimento = new Date(dataString);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (loading) return <p>Carregando pessoas...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

  return (
    <div className="container">
      <h2>Gerenciamento de pessoas</h2>
      <PessoaForm onSubmit={handleCreatePessoa} />

      <h3>Pessoas cadastradas e Totais</h3>
      {pessoas.length === 0 ? (
        <p>Nenhuma pessoa cadastrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Idade</th>      
              <th>Receitas</th> 
              <th>Despesas</th>   
              <th>Saldo Líq.</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pessoas.map((pessoa) => {
              const { receitas, despesas, saldo } = calcularTotaisPessoa(pessoa.transacoes || []);
              const corSaldo = saldo < 0 ? '#dc3545' : '#28a745';

              return (
                <tr key={pessoa.id}>
                  <td>{pessoa.id}</td>
                  <td>{pessoa.nome}</td>
                  <td>{calcularIdade(pessoa.dataNascimento)} anos</td>
                  <td style={{ color: '#28a745' }}>{formatarMoeda(receitas)}</td>
                  <td style={{ color: '#dc3545' }}>{formatarMoeda(despesas)}</td>
                  
                  <td style={{ fontWeight: 'bold', color: corSaldo }}>
                    {formatarMoeda(saldo)}
                  </td>
                  
                  <td>
                    <button className="delete-btn" onClick={() => handleDeletePessoa(pessoa.id)}>
                      Deletar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr className="total-row" style={{ backgroundColor: '#e9ecef', fontWeight: 'bold', borderTop: '2px solid #333' }}>
                <td colSpan={3} style={{ textAlign: 'right', paddingRight: '15px' }}>TOTAL GERAL:</td>
                <td style={{ color: '#28a745' }}>{formatarMoeda(totalGeral.receitas)}</td>
                <td style={{ color: '#dc3545' }}>{formatarMoeda(totalGeral.despesas)}</td>
                <td style={{ color: totalGeral.saldo < 0 ? '#dc3545' : '#28a745' }}>
                    {formatarMoeda(totalGeral.saldo)}
                </td>
                <td></td> 
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};

export default PessoasPage;