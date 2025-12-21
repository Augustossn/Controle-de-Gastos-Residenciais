import React, { useState, useEffect } from 'react';
import { Categoria, FinalidadeCategoria } from '../types';

// define a interface das props recebidas pelo componente
interface CategoriaFormProps {
  // função callback para enviar os dados para o componente pai (Omit remove o id, pois é gerado no back ou mantido na edição)
  onSubmit: (categoria: Omit<Categoria, 'id'>) => void; 
  // prop opcional que recebe a categoria a ser editada (se null, é modo de criação)
  categoriaParaEditar?: Categoria | null; 
  // função callback opcional para cancelar a edição e fechar o formulário
  onCancel?: () => void; 
}

const CategoriaForm: React.FC<CategoriaFormProps> = ({ onSubmit, categoriaParaEditar, onCancel }) => {
  // define o estado local para a descrição da categoria
  const [descricao, setDescricao] = useState(''); 
  // define o estado local para a finalidade, iniciando com o valor padrão 'Ambas'
  const [finalidade, setFinalidade] = useState<FinalidadeCategoria>(FinalidadeCategoria.Ambas); 

  // hook useEffect para observar mudanças na prop 'categoriaParaEditar'
  useEffect(() => {
    if (categoriaParaEditar) {
      // se houver um objeto para editar, popula os estados com os dados existentes (Modo Edição)
      setDescricao(categoriaParaEditar.descricao);
      setFinalidade(categoriaParaEditar.finalidade);
    } else {
      // caso contrário, reseta os campos para o padrão (Modo Criação)
      setDescricao('');
      setFinalidade(FinalidadeCategoria.Ambas);
    }
  }, [categoriaParaEditar]); // array de dependências: executa sempre que 'categoriaParaEditar' mudar

  // manipulador de evento para o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // previne o comportamento padrão do navegador de recarregar a página
    if (descricao) {
      // chama a função recebida via props passando o objeto montado com os estados atuais
      onSubmit({ descricao, finalidade });

      // se não estiver em modo de edição, limpa o formulário para permitir um novo cadastro imediato
      if (!categoriaParaEditar) {
        setDescricao('');
        setFinalidade(FinalidadeCategoria.Ambas);
      }
    } else {
      alert('Por favor, preencha a descrição da categoria.'); // validação simples de campo obrigatório
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* renderização condicional do título dependendo se é edição ou cadastro */}
      <h2>{categoriaParaEditar ? 'Editar Categoria' : 'Cadastrar nova categoria'}</h2>
      
      <label htmlFor="descricao">Descrição:</label>
      <input
        id="descricao"
        type="text"
        className="input-padrao" 
        value={descricao} // two-way binding: o valor do input é ligado ao estado
        onChange={(e) => setDescricao(e.target.value)} // atualiza o estado a cada digitação
        required
      />

      <label htmlFor="finalidade">Finalidade:</label>
      <select
        id="finalidade"
        className="input-padrao" 
        value={finalidade} // two-way binding com o select
        // converte o valor string do select para Number/Enum ao alterar
        onChange={(e) => setFinalidade(Number(e.target.value) as FinalidadeCategoria)}
        required
      >
        <option value={FinalidadeCategoria.Despesa}>Despesa</option>
        <option value={FinalidadeCategoria.Receita}>Receita</option>
        <option value={FinalidadeCategoria.Ambas}>Ambas</option>
      </select>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
            type="submit" 
            style={{ flex: 1 }} 
        >
            {/* muda o texto do botão dinamicamente */}
            {categoriaParaEditar ? 'Salvar Alterações' : 'Cadastrar categoria'}
        </button>
        
        {/* renderização condicional: o botão cancelar só aparece se estiver editando */}
        {categoriaParaEditar && (
          <button 
            type="button" 
            onClick={onCancel} // chama a função de cancelar recebida via props
            style={{ backgroundColor: '#6c757d', flex: 1 }} 
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoriaForm;