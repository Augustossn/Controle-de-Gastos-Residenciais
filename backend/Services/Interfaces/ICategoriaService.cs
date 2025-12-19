using ControleGastosApi.Controllers;
using ControleGastosApi.Models;

namespace ControleGastosApi.Services
{
    public interface ICategoriaService
    {
        Task<Categoria> AddCategoriaAsync(Categoria categoria);
        Task<IEnumerable<Categoria>> GetAllCategoriasAsync();
        Task<bool> UpdateCategoriaAsync(Categoria categoria);
        Task<bool> DeleteCategoriaAsync(int id);
    }
}
