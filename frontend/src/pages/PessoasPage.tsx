import React, { useState, useEffect, useCallback } from 'react';
import { Pessoa, Transacao, TipoTransacao } from '../types';
import { getPessoas, createPessoa, deletePessoa } from '../apiService';
import PessoaForm from '../components/PessoaForm';

const PessoasPage: React.FC = () => {
  // estados para gerenciamento dos dados da tabela e feedback de interface
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // função memorizada com useCallback para buscar a lista de pessoas e suas transações
  // useCallback garante que a referência da função não mude entre renderizações
  const fetchPessoas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPessoas(); // API já retorna as pessoas com o .Include(Transacoes)
      setPessoas(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar pessoas:', err);
      setError('Não foi possível carregar a lista de pessoas.');
    } finally {
      setLoading(false);
    }
  }, []);

  // hook que dispara a busca inicial ao montar o componente
  useEffect(() => {
    fetchPessoas();
  }, [fetchPessoas]);
  
  // manipulador para criar nova pessoa (recebe os dados do componente filho PessoaForm)
  const handleCreatePessoa = async (pessoa: Omit<Pessoa, 'id'>) => {
    try {
      await createPessoa(pessoa);
      fetchPessoas(); // recarrega a lista para mostrar a nova pessoa e limpar o formulário
    } catch (err) {
      console.error('Erro ao criar:', err);
      alert('Erro ao criar pessoa.');
    }
  };

  // manipulador para exclusão
  const handleDeletePessoa = async (id: number) => {
    // confirmação de segurança, alertando sobre a exclusão em cascata das transações
    if (window.confirm('Tem certeza que deseja deletar esta pessoa? Todas as transações associadas serão apagadas.')) {
        try {
            await deletePessoa(id);
            fetchPessoas(); // atualiza a lista removendo o item deletado
        } catch (err) {
            console.error('Erro ao deletar:', err);
            alert('Erro ao deletar pessoa.');
        }
    }
  };

  // calcula o saldo individual iterando sobre as transações da pessoa
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

  // calcula o Total Geral somando os totais de todas as pessoas
  // método .reduce acumula os valores de cada iteração em um único objeto 'acc'
  const totalGeral = pessoas.reduce((acc, pessoa) => {
      const totais = calcularTotaisPessoa(pessoa.transacoes || []);
      return {
          receitas: acc.receitas + totais.receitas,
          despesas: acc.despesas + totais.despesas,
          saldo: acc.saldo + totais.saldo
      };
  }, { receitas: 0, despesas: 0, saldo: 0 }); // valor inicial do acumulador

  // função para cálculo de idade
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

  // função para formatar números como moeda BRL (R$)
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // renderização condicional de estados
  if (loading) return <p>Carregando pessoas...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

  return (
    <div className="container">
      <h2>Gerenciamento de pessoas</h2>
      
      {/* componente de formulário reutilizável */}
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
            {/* mapeia cada pessoa para uma linha da tabela */}
            {pessoas.map((pessoa) => {
              // calcula os totais específicos desta linha (destructuring)
              const { receitas, despesas, saldo } = calcularTotaisPessoa(pessoa.transacoes || []);
              
              // define a cor do saldo dinamicamente (vermelho se negativo, verde se positivo)
              const corSaldo = saldo < 0 ? '#dc3545' : '#28a745';

              return (
                <tr key={pessoa.id}>
                  <td>{pessoa.id}</td>
                  <td>{pessoa.nome}</td>
                  <td>{calcularIdade(pessoa.dataNascimento)} anos</td>
                  
                  {/* colunas financeiras formatadas */}
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

          {/* rodapé da tabela com o Total Geral calculado via reduce */}
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