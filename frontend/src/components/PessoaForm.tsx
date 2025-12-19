import React, { useState } from 'react';
import { Pessoa } from '../types';

interface PessoaFormProps {
  onSubmit: (pessoa: Omit<Pessoa, 'id'>) => void;
}

const PessoaForm: React.FC<PessoaFormProps> = ({ onSubmit }) => {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome && dataNascimento) {
      onSubmit({
        nome, dataNascimento,
        idade: 0
      });
      setNome('');
      setDataNascimento('');
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastrar nova pessoa</h2>
      <label htmlFor="nome">Nome:</label>
      <input
        id="nome"
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />

      <label htmlFor="idade">Data de Nascimento:</label>
      <input
        id="dataNascimento"
        type="date"
        value={dataNascimento}
        onChange={(e) => setDataNascimento(e.target.value)}
        min="1"
        required
      />

      <button type="submit">Cadastrar pessoa</button>
    </form>
  );
};

export default PessoaForm;
