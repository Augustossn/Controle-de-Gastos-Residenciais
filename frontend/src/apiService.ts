import axios from 'axios';
import { Pessoa, Categoria, Transacao } from './types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
} );

export const getPessoas = () => api.get<Pessoa[]>('/pessoas');
export const createPessoa = (pessoa: Omit<Pessoa, 'id'>) => api.post<Pessoa>('/pessoas', pessoa);
export const deletePessoa = (id: number) => api.delete(`/pessoas/${id}`);

export const getCategorias = () => api.get<Categoria[]>('/categorias');
export const createCategoria = (categoria: Omit<Categoria, 'id'>) => api.post<Categoria>('/categorias', categoria);
export const updateCategoria = (id: number, categoria: Omit<Categoria, 'id'>) => {
  return api.put(`/categorias/${id}`, { ...categoria, id });
};
export const deleteCategoria = (id: number) => api.delete(`/categorias/${id}`);

export const getTransacoes = () => api.get<Transacao[]>('/transacoes');
export const createTransacao = (transacao: Omit<Transacao, 'id' | 'categoria' | 'pessoa'>) => api.post<Transacao>('/transacoes', transacao);

export default api;
