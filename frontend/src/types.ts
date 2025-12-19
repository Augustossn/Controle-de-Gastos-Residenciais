export enum FinalidadeCategoria {
  Despesa = 0,
  Receita = 1,
  Ambas = 2,
}

export enum TipoTransacao {
  Despesa = 0,
  Receita = 1,
}

export interface Pessoa {
  id: number;
  nome: string;
  idade: number,
  dataNascimento: string;
  transacoes?: any[];
}

export interface Categoria {
  id: number;
  descricao: string;
  finalidade: FinalidadeCategoria;
}

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: number;
  pessoaId: number;
  categoria?: Categoria;
  pessoa?: Pessoa;
}

export interface TotalPorPessoaDTO {
  pessoaId: number;
  nomePessoa: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotalPorCategoriaDTO {
  categoriaId: number;
  descricaoCategoria: string;
  finalidade: FinalidadeCategoria;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}