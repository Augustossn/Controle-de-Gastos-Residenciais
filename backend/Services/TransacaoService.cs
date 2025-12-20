using ControleGastosApi.Data;
using ControleGastosApi.Models;
using ControleGastosApi.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace ControleGastosApi.Services
{
    public class TransacaoService : ITransacaoService
    {
        private readonly AppDbContext _dbContext; // injeção de depedência

        public TransacaoService(AppDbContext dbContext)
        {
            _dbContext = dbContext; // construtor
        }

        // task para adicionar uma transação ao banco de dados de forma assíncrona
        public async Task<Transacao?> AddTransacaoAsync(Transacao transacao)
        {
            // busca a pessoa pelo id e salva em uma variável
            var pessoa = await _dbContext.Pessoas.FindAsync(transacao.PessoaId);
            if (pessoa == null) return null;

            // busca a categoria pelo id e salva em uma variável
            var categoria = await _dbContext.Categorias.FindAsync(transacao.CategoriaId);
            if (categoria == null) return null;

            // calcula a idade da pessoa e salva em uma variável
            var idade = DateTime.Today.Year - pessoa.DataNascimento.Year;
            if (pessoa.DataNascimento.Date > DateTime.Today.AddYears(-idade)) idade --;

            // Regras de negócio
            // verifica se a transação é do tipo receita e se a pessoa é menor de 18 anos
            if (transacao.Tipo == TipoTransacao.Receita && idade < 18)
                throw new ArgumentException("Regra de Negócio: Menores de 18 anos só podem registar despesas.");

            // verifica se está tentando lançar uma despesa em uma categoria que só aceita receita
            if (transacao.Tipo == TipoTransacao.Despesa && categoria.Finalidade == FinalidadeCategoria.Receita)
                throw new ArgumentException("Regra de Negócio: Não é possível lançar uma despesa em uma categoria de receita.");

            // verifica se está tentando lançar uma receita em uma categoria que só aceita despesa
            if (transacao.Tipo == TipoTransacao.Receita && categoria.Finalidade == FinalidadeCategoria.Despesa)
                throw new ArgumentException("Regra de Negócio: Não é possível lançar uma receita em uma categoria de despesa.");

            _dbContext.Transacoes.Add(transacao); // adiciona a transação ao db
            await _dbContext.SaveChangesAsync(); // salva as alterações
            return transacao; // retorna a transação
        }

        // task para obter/listar todas as transações do banco de dados de forma assíncrona
        public async Task<IEnumerable<Transacao>> GetAllTransacoesAsync()
        {
            return await _dbContext.Transacoes // retorna todas as transações
                .Include(t => t.Pessoa) // inclui a pessoa com determinada transação
                .Include(t => t.Categoria) // inclui a categoria com determinada transação
                .ToListAsync(); // transforma tudo em lista
        }

        // método para verificar se o tipo de transação é compatível com a finalidade da categoria
        public bool IsTipoCompativelComFinalidade(TipoTransacao tipoTransacao, FinalidadeCategoria finalidadeCategoria)
        {
            return finalidadeCategoria switch
            {
                FinalidadeCategoria.Ambas => true, // se a categoria aceita ambas retorna true para qualquer tipo
                // se a categoria é despesa, o tipo deve ser despesa
                FinalidadeCategoria.Despesa => tipoTransacao == TipoTransacao.Despesa, 
                // se a categoria é receita, o tipo deve ser receita
                FinalidadeCategoria.Receita => tipoTransacao == TipoTransacao.Receita,
                _ => false,// qualquer outra combinação não prevista retorna false
            };
        }
    }
}
