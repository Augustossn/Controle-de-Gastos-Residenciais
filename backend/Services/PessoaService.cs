using ControleGastosApi.Data;
using ControleGastosApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastosApi.Services
{
    public class PessoaService : IPessoaService
    {
        private readonly AppDbContext _dbContext; // injeção de dependência

        public PessoaService(AppDbContext dbContext)
        {
            _dbContext = dbContext; // construtor
        }

        // task para adicionar uma pessoa ao banco de dados de forma assíncrona
        public async Task<Pessoa> AddPessoaAsync(Pessoa pessoa)
        {
            _dbContext.Pessoas.Add(pessoa); // adicionar a nova pessoa no db
            await _dbContext.SaveChangesAsync(); // salva as alterações
            return pessoa; // retorna a pessoa criada
        }

        // task booleana para remover uma pessoa pelo id
        public async Task<bool> DeletePessoaAsync(int id)
        {
            // busca a pessoa pelo id e a salva numa variável
            var pessoa = await _dbContext.Pessoas.FindAsync(id); 
            if (pessoa == null) return false; // caso pessoa seja null, retorna false

            _dbContext.Pessoas.Remove(pessoa); // remove a pessoa do db
            await _dbContext.SaveChangesAsync(); // salva as alterações
            return true; // retorna true
        }

        // task para obter/listar todas as pessoas do banco de dados de forma assíncrona
        public async Task<IEnumerable<Pessoa>> GetAllPessoasAsync()
        {
            return await _dbContext.Pessoas // retorna todas as pessoas obtidas no banco de dados
                .Include(p => p.Transacoes) // inclue as transações ligadas a essas pessoas
                .ToListAsync(); // transforma tudo em uma lista
        }
    }
}
