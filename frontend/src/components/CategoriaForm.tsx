import React, { useState, useEffect } from 'react';
import { Categoria, FinalidadeCategoria } from '../types';

interface CategoriaFormProps {
  onSubmit: (categoria: Omit<Categoria, 'id'>) => void;
  categoriaParaEditar?: Categoria | null;
  onCancel?: () => void; 
}

const CategoriaForm: React.FC<CategoriaFormProps> = ({ onSubmit, categoriaParaEditar, onCancel }) => {
  const [descricao, setDescricao] = useState('');
  const [finalidade, setFinalidade] = useState<FinalidadeCategoria>(FinalidadeCategoria.Ambas);

  useEffect(() => {
    if (categoriaParaEditar) {
      setDescricao(categoriaParaEditar.descricao);
      setFinalidade(categoriaParaEditar.finalidade);
    } else {
      setDescricao('');
      setFinalidade(FinalidadeCategoria.Ambas);
    }
  }, [categoriaParaEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (descricao) {
      onSubmit({ descricao, finalidade });

      if (!categoriaParaEditar) {
        setDescricao('');
        setFinalidade(FinalidadeCategoria.Ambas);
      }
    } else {
      alert('Por favor, preencha a descrição da categoria.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{categoriaParaEditar ? 'Editar Categoria' : 'Cadastrar nova categoria'}</h2>
      
      <label htmlFor="descricao">Descrição:</label>
      <input
        id="descricao"
        type="text"
        className="input-padrao" 
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        required
      />

      <label htmlFor="finalidade">Finalidade:</label>
      <select
        id="finalidade"
        className="input-padrao" 
        value={finalidade}
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
            {categoriaParaEditar ? 'Salvar Alterações' : 'Cadastrar categoria'}
        </button>
        
        {categoriaParaEditar && (
          <button 
            type="button" 
            onClick={onCancel}
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