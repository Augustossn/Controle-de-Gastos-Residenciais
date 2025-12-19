using ControleGastosApi.Data;
using ControleGastosApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastosApi.Services
{
    public class PessoaService : IPessoaService
    {
        private readonly AppDbContext _dbContext;

        public PessoaService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Pessoa> AddPessoaAsync(Pessoa pessoa)
        {
            _dbContext.Pessoas.Add(pessoa);
            await _dbContext.SaveChangesAsync();
            return pessoa;
        }

        public async Task<bool> DeletePessoaAsync(int id)
        {
            var pessoa = await _dbContext.Pessoas.FindAsync(id);
            if (pessoa == null)
            {
                return false;
            }

            _dbContext.Pessoas.Remove(pessoa);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Pessoa>> GetAllPessoasAsync()
        {
            return await _dbContext.Pessoas
                .Include(p => p.Transacoes)
                .ToListAsync();
        }
    }
}
