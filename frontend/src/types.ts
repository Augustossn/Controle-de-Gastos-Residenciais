// enum para definir a finalidade da categoria (despesa, receita ou ambas)
export enum FinalidadeCategoria {
  Despesa = 0,
  Receita = 1,
  Ambas = 2,
}

// enum para definir o tipo da transação (despesa ou receita)
export enum TipoTransacao {
  Despesa = 0,
  Receita = 1,
}

// interface que define a estrutura de dados de uma pessoa
export interface Pessoa {
  id: number;
  nome: string;
  idade: number,
  dataNascimento: string;
  transacoes?: any[]; // lista opcional de transações vinculadas à pessoa
}

// interface que define a estrutura de dados de uma categoria
export interface Categoria {
  id: number;
  descricao: string;
  finalidade: FinalidadeCategoria; // utiliza o enum finalidadecategoria
}

// interface que define a estrutura de dados de uma transação financeira
export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoTransacao; // utiliza o enum tipotransacao
  categoriaId: number; // chave estrangeira da categoria
  pessoaId: number; // chave estrangeira da pessoa
  categoria?: Categoria; // objeto completo da categoria (opcional para exibição)
  pessoa?: Pessoa; // objeto completo da pessoa (opcional para exibição)
}

// interface para o objeto de transferência de dados (dto) dos totais por pessoa
export interface TotalPorPessoaDTO {
  pessoaId: number;
  nomePessoa: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

// interface para o objeto de transferência de dados (dto) dos totais por categoria
export interface TotalPorCategoriaDTO {
  categoriaId: number;
  descricaoCategoria: string;
  finalidade: FinalidadeCategoria;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}