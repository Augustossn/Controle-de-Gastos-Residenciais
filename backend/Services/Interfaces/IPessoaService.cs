using ControleGastosApi.Models;

namespace ControleGastosApi.Services
{
    public interface IPessoaService
    {
        Task<Pessoa> AddPessoaAsync(Pessoa pessoa);
        Task<IEnumerable<Pessoa>> GetAllPessoasAsync();
        Task<bool> DeletePessoaAsync(int id);
    }
}
