using ControleGastosApi.Models;
using ControleGastosApi.Models.Enums;

namespace ControleGastosApi.Services
{
    public interface ITransacaoService
    {
        Task<Transacao?> AddTransacaoAsync(Transacao transacao);
        Task<IEnumerable<Transacao>> GetAllTransacoesAsync();
        bool IsTipoCompativelComFinalidade(TipoTransacao tipoTransacao, FinalidadeCategoria finalidadeCategoria);
    }
}
