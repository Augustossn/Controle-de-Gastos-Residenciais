using ControleGastosApi.Models;

namespace ControleGastosApi.Services
{
    public interface IPessoaService
    {
        // contrato para adicionar uma nova pessoa de forma assíncrona
        Task<Pessoa> AddPessoaAsync(Pessoa pessoa); 
        // contrato para obter/listar todas as pessoas de forma assíncrona
        Task<IEnumerable<Pessoa>> GetAllPessoasAsync();
        // contrato para deletar uma pessoa (determinada pelo id) de forma assíncrona
        Task<bool> DeletePessoaAsync(int id);
    }
}
