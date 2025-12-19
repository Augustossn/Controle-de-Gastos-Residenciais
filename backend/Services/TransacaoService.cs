using ControleGastosApi.Data;
using ControleGastosApi.Models;
using ControleGastosApi.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace ControleGastosApi.Services
{
    public class TransacaoService : ITransacaoService
    {
        private readonly AppDbContext _dbContext;

        public TransacaoService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Transacao?> AddTransacaoAsync(Transacao transacao)
        {
            var pessoa = await _dbContext.Pessoas.FindAsync(transacao.PessoaId);
            if (pessoa == null)
            {
                return null; 
            }

            var categoria = await _dbContext.Categorias.FindAsync(transacao.CategoriaId);
            if (categoria == null)
            {
                return null;
            }

            var idade = DateTime.Today.Year - pessoa.DataNascimento.Year;
            if (pessoa.DataNascimento.Date > DateTime.Today.AddYears(-idade)) idade --;

            if (transacao.Tipo == TipoTransacao.Receita && idade < 18)
            {
                throw new ArgumentException("Regra de Negócio: Menores de 18 anos só podem registar despesas.");
            }

            if (transacao.Tipo == TipoTransacao.Despesa && categoria.Finalidade == FinalidadeCategoria.Receita)
            {
                throw new ArgumentException("Regra de Negócio: Não é possível lançar uma despesa em uma categoria de receita.");
            }

            if (transacao.Tipo == TipoTransacao.Receita && categoria.Finalidade == FinalidadeCategoria.Despesa)
            {
                throw new ArgumentException("Regra de Negócio: Não é possível lançar uma receita em uma categoria de despesa.");
            }

            _dbContext.Transacoes.Add(transacao);
            await _dbContext.SaveChangesAsync();
            return transacao;
        }

        public async Task<IEnumerable<Transacao>> GetAllTransacoesAsync()
        {
            return await _dbContext.Transacoes
                .Include(t => t.Pessoa)
                .Include(t => t.Categoria)
                .ToListAsync();
        }

        public bool IsTipoCompativelComFinalidade(TipoTransacao tipoTransacao, FinalidadeCategoria finalidadeCategoria)
        {
            return finalidadeCategoria switch
            {
                FinalidadeCategoria.Ambas => true,
                FinalidadeCategoria.Despesa => tipoTransacao == TipoTransacao.Despesa,
                FinalidadeCategoria.Receita => tipoTransacao == TipoTransacao.Receita,
                _ => false,
            };
        }
    }
}
