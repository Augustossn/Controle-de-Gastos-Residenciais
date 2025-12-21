import React, { useState } from 'react';
import { Pessoa } from '../types';

// define a interface das props recebidas pelo componente
interface PessoaFormProps {
  // função callback para enviar os dados para o componente pai (Omit remove o id, pois é gerado no banco)
  onSubmit: (pessoa: Omit<Pessoa, 'id'>) => void;
}

const PessoaForm: React.FC<PessoaFormProps> = ({ onSubmit }) => {
  // define o estado local para o nome da pessoa
  const [nome, setNome] = useState('');
  // define o estado local para a data de nascimento (armazenado como string no formato 'yyyy-mm-dd')
  const [dataNascimento, setDataNascimento] = useState('');

  // manipulador de evento para o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // previne o comportamento padrão do navegador de recarregar a página
    
    if (nome && dataNascimento) {
      // chama a função recebida via props enviando o objeto montado
      onSubmit({
        nome, 
        dataNascimento,
        idade: 0 // envia 0 como placeholder, pois a idade real é calculada dinamicamente pelo Backend
      });
      
      // reseta os estados para limpar os campos do formulário após o envio
      setNome('');
      setDataNascimento('');
    } else {
      alert('Por favor, preencha todos os campos corretamente.'); // validação simples
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastrar nova pessoa</h2>
      
      <label htmlFor="nome">Nome:</label>
      <input
        id="nome"
        type="text"
        value={nome} // two-way binding: o valor do input reflete o estado
        onChange={(e) => setNome(e.target.value)} // atualiza o estado a cada caractere digitado
        required
      />

      <label htmlFor="idade">Data de Nascimento:</label>
      <input
        id="dataNascimento"
        type="date"
        value={dataNascimento} // two-way binding com o input de data
        onChange={(e) => setDataNascimento(e.target.value)} // atualiza o estado da data
        min="1" // (opcional) restrição básica de HTML
        required
      />

      <button type="submit">Cadastrar pessoa</button>
    </form>
  );
};

export default PessoaForm;