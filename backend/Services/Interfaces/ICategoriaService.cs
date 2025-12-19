using ControleGastosApi.Controllers;
using ControleGastosApi.Models;

namespace ControleGastosApi.Services
{
    public interface ICategoriaService
    {
        // contrato pra adicionar categoria de forma assíncrona (liberando a thread enquanto o banco processa)
        Task<Categoria> AddCategoriaAsync(Categoria categoria); 
        // contrato para obter/lista todas as categorias existentes de forma assíncrona
        Task<IEnumerable<Categoria>> GetAllCategoriasAsync(); 
        // contrato para atualizar determinada categoria de forma assíncrona
        Task<bool> UpdateCategoriaAsync(Categoria categoria); 
        // contrato para deletar categoria determinada pelo id de forma assíncrona
        Task<bool> DeleteCategoriaAsync(int id); 
    }
}
