using ControleGastosApi.Models;
using ControleGastosApi.Models.Enums;

namespace ControleGastosApi.Services
{
    public interface ITransacaoService
    {
        // contrato para adicionar nova transação de forma assíncrona
        Task<Transacao?> AddTransacaoAsync(Transacao transacao);
        // contrato para obter todas as transações de forma assíncrona
        Task<IEnumerable<Transacao>> GetAllTransacoesAsync();
        // contrato para checar se a transação é compatível com os enums definidos
        bool IsTipoCompativelComFinalidade(TipoTransacao tipoTransacao, FinalidadeCategoria finalidadeCategoria);
    }
}
