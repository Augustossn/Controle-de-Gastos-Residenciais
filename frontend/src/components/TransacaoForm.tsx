import React, { useState, useEffect } from 'react';
import { Transacao, Categoria, Pessoa, TipoTransacao, FinalidadeCategoria } from '../types';
import { getCategorias, getPessoas } from '../apiService';

// define a interface das props (recebe apenas a função de submit)
interface TransacaoFormProps {
  onSubmit: (transacao: Omit<Transacao, 'id' | 'categoria' | 'pessoa'>) => void;
}

// função utilitária para calcular a idade baseada na string de data (formato yyyy-mm-dd)
const calcularIdade = (dataString: string) => {
  if (!dataString) return 0;
  const hoje = new Date();
  const nascimento = new Date(dataString);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  // ajusta a idade se o aniversário ainda não ocorreu neste ano
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
  }
  return idade;
};

const TransacaoForm: React.FC<TransacaoFormProps> = ({ onSubmit }) => {
  // estados locais para os campos do formulário
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState<number | ''>('');
  const [tipo, setTipo] = useState<TipoTransacao>(TipoTransacao.Despesa); // inicia como Despesa por padrão
  const [categoriaId, setCategoriaId] = useState<number | ''>('');
  const [pessoaId, setPessoaId] = useState<number | ''>('');

  // estados para armazenar as listas vindas da API (Selects)
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true); // controle de carregamento

  // useEffect para buscar dados iniciais (Categorias e Pessoas) ao montar o componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // executa as duas requisições em paralelo para ganhar performance
        const [catResponse, pesResponse] = await Promise.all([getCategorias(), getPessoas()]);
        setCategorias(catResponse.data);
        setPessoas(pesResponse.data);

        // pré-seleciona o primeiro item de cada lista para não deixar o select vazio
        if (catResponse.data.length > 0) setCategoriaId(catResponse.data[0].id);
        if (pesResponse.data.length > 0) setPessoaId(pesResponse.data[0].id);
      } catch (err) {
        console.error('Erro ao carregar dados para o formulário:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // encontra a pessoa selecionada para verificar a idade
  const pessoaSelecionada = pessoas.find(p => p.id === Number(pessoaId));
  
  // verifica se é menor de idade
  const isMenorDeIdade = pessoaSelecionada 
    ? calcularIdade(pessoaSelecionada.dataNascimento) < 18 
    : false;

  // se a pessoa mudar para um menor de idade, força o tipo para Despesa
  useEffect(() => {
    if (isMenorDeIdade && tipo === TipoTransacao.Receita) {
      setTipo(TipoTransacao.Despesa);
    }
  }, [isMenorDeIdade, tipo]);

  // mostra apenas categorias compatíveis com o Tipo selecionado (Receita/Despesa)
  const categoriasFiltradas = categorias.filter(cat => {
    const finalidade = cat.finalidade;
    if (finalidade === FinalidadeCategoria.Ambas) return true;
    if (tipo === TipoTransacao.Despesa && finalidade === FinalidadeCategoria.Despesa) return true;
    if (tipo === TipoTransacao.Receita && finalidade === FinalidadeCategoria.Receita) return true;
    return false;
  });

  // se a categoria selecionada sumir do filtro, seleciona a primeira válida
  useEffect(() => {
    const categoriaAtualValida = categoriasFiltradas.some(cat => cat.id === Number(categoriaId));

    if (!categoriaAtualValida) {
      if (categoriasFiltradas.length > 0) {
        setCategoriaId(categoriasFiltradas[0].id);
      } else {
        setCategoriaId(''); // se não sobrar nenhuma, limpa a seleção
      }
    }
  }, [tipo, categoriasFiltradas, categoriaId]);

  // manipulador de envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (descricao && valor && valor > 0 && categoriaId && pessoaId) {
      // envia o objeto formatado para o componente pai
      onSubmit({
        descricao,
        valor: Number(valor),
        tipo,
        categoriaId: Number(categoriaId),
        pessoaId: Number(pessoaId),
      });
      
      // limpa apenas os campos de texto/valor, mantendo as seleções de pessoa/categoria para facilitar novos lançamentos
      setDescricao('');
      setValor('');
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  };

  // renderização condicional de carregamento ou mensagem de erro se não houver dados
  if (loading) return <p>Carregando formulário de transação...</p>;
  if (categorias.length === 0 || pessoas.length === 0) return <p>É necessário cadastrar pelo menos uma Pessoa e uma Categoria antes de registrar transações.</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar Nova Transação</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="descricao" style={{display: 'block', marginBottom: '5px'}}>Descrição:</label>
        <input
          id="descricao"
          type="text"
          className="input-padrao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="valor" style={{display: 'block', marginBottom: '5px'}}>Valor:</label>
        <input
          id="valor"
          type="number"
          className="input-padrao"
          step="0.01" // permite centavos
          value={valor}
          onChange={(e) => setValor(Number(e.target.value))}
          min="0.01"
          required
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="pessoa" style={{display: 'block', marginBottom: '5px'}}>Pessoa:</label>
        <select
          id="pessoa"
          value={pessoaId}
          className="input-padrao"
          onChange={(e) => setPessoaId(Number(e.target.value))}
          required
        >
          {pessoas.map(pes => (
            <option key={pes.id} value={pes.id}>
                {pes.nome} ({calcularIdade(pes.dataNascimento)} anos)
            </option>
          ))}
        </select>
        {/* feedback visual para regra de menor de idade */}
        {isMenorDeIdade && (
           <small style={{ color: '#dc3545', display:'block', marginTop:'5px', fontWeight: 'bold' }}>
             * Menores de 18 anos só podem registrar despesas.
           </small>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="tipo" style={{display: 'block', marginBottom: '5px'}}>Tipo:</label>
        <select
          id="tipo"
          value={tipo}
          className="input-padrao"
          onChange={(e) => setTipo(Number(e.target.value) as TipoTransacao)}
          required
        >
          <option value={TipoTransacao.Despesa}>Despesa</option>
          {/* esconde a opção Receita se for menor de idade */}
          {!isMenorDeIdade && (
            <option value={TipoTransacao.Receita}>Receita</option>
          )}
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="categoria" style={{display: 'block', marginBottom: '5px'}}>Categoria:</label>
        <select
          id="categoria"
          value={categoriaId}
          className="input-padrao"
          onChange={(e) => setCategoriaId(Number(e.target.value))}
          required
        >
          {/* renderiza apenas as categorias filtradas pela lógica acima */}
          {categoriasFiltradas.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.descricao}</option>
          ))}
        </select>
        {categoriasFiltradas.length === 0 && <p style={{color: 'red'}}>Nenhuma categoria compatível com o tipo de transação selecionado.</p>}
      </div>

      <button type="submit" disabled={categoriasFiltradas.length === 0}>Registrar Transação</button>
    </form>
  );
};

export default TransacaoForm;