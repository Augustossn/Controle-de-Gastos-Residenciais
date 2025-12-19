import React, { useState, useEffect } from 'react';
import { Transacao, Categoria, Pessoa, TipoTransacao, FinalidadeCategoria } from '../types';
import { getCategorias, getPessoas } from '../apiService';

interface TransacaoFormProps {
  onSubmit: (transacao: Omit<Transacao, 'id' | 'categoria' | 'pessoa'>) => void;
}

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

const TransacaoForm: React.FC<TransacaoFormProps> = ({ onSubmit }) => {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState<number | ''>('');
  const [tipo, setTipo] = useState<TipoTransacao>(TipoTransacao.Despesa);
  const [categoriaId, setCategoriaId] = useState<number | ''>('');
  const [pessoaId, setPessoaId] = useState<number | ''>('');

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catResponse, pesResponse] = await Promise.all([getCategorias(), getPessoas()]);
        setCategorias(catResponse.data);
        setPessoas(pesResponse.data);

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

  const pessoaSelecionada = pessoas.find(p => p.id === Number(pessoaId));
  const isMenorDeIdade = pessoaSelecionada 
    ? calcularIdade(pessoaSelecionada.dataNascimento) < 18 
    : false;

  useEffect(() => {
    if (isMenorDeIdade && tipo === TipoTransacao.Receita) {
      setTipo(TipoTransacao.Despesa);
    }
  }, [isMenorDeIdade, tipo]);

  const categoriasFiltradas = categorias.filter(cat => {
    const finalidade = cat.finalidade;
    if (finalidade === FinalidadeCategoria.Ambas) return true;
    if (tipo === TipoTransacao.Despesa && finalidade === FinalidadeCategoria.Despesa) return true;
    if (tipo === TipoTransacao.Receita && finalidade === FinalidadeCategoria.Receita) return true;
    return false;
  });

  useEffect(() => {
    const categoriaAtualValida = categoriasFiltradas.some(cat => cat.id === Number(categoriaId));

    if (!categoriaAtualValida) {
      if (categoriasFiltradas.length > 0) {
        setCategoriaId(categoriasFiltradas[0].id);
      } else {
        setCategoriaId('');
      }
    }
  }, [tipo, categoriasFiltradas, categoriaId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (descricao && valor && valor > 0 && categoriaId && pessoaId) {
      onSubmit({
        descricao,
        valor: Number(valor),
        tipo,
        categoriaId: Number(categoriaId),
        pessoaId: Number(pessoaId),
      });
      
      setDescricao('');
      setValor('');
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  };

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
          step="0.01"
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