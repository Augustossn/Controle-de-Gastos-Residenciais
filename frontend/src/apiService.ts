import axios from 'axios';
import { Pessoa, Categoria, Transacao } from './types';

// define a url base da api backend
const API_BASE_URL = 'http://localhost:5000/api';

// cria uma instância do axios com a configuração da url base
const api = axios.create({
  baseURL: API_BASE_URL,
});

// função para buscar a lista de todas as pessoas da api
export const getPessoas = () => api.get<Pessoa[]>('/pessoas');
// função para criar uma nova pessoa enviando os dados (sem id) para a api
export const createPessoa = (pessoa: Omit<Pessoa, 'id'>) => api.post<Pessoa>('/pessoas', pessoa);
// função para deletar uma pessoa específica pelo id
export const deletePessoa = (id: number) => api.delete(`/pessoas/${id}`);

// função para buscar a lista de todas as categorias da api
export const getCategorias = () => api.get<Categoria[]>('/categorias');
// função para criar uma nova categoria
export const createCategoria = (categoria: Omit<Categoria, 'id'>) => api.post<Categoria>('/categorias', categoria);
// função para atualizar uma categoria existente pelo id
export const updateCategoria = (id: number, categoria: Omit<Categoria, 'id'>) => {
  // envia o método put combinando os dados atualizados com o id
  return api.put(`/categorias/${id}`, { ...categoria, id });
};

// função para deletar uma categoria específica pelo id
export const deleteCategoria = (id: number) => api.delete(`/categorias/${id}`);
// função para buscar a lista de todas as transações da api
export const getTransacoes = () => api.get<Transacao[]>('/transacoes');
// função para criar uma nova transação (omitindo id e os objetos completos de relacionamento)
export const createTransacao = (transacao: Omit<Transacao, 'id' | 'categoria' | 'pessoa'>) => api.post<Transacao>('/transacoes', transacao);

export default api;