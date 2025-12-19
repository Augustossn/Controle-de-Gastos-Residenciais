using ControleGastosApi.Data;
using ControleGastosApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastosApi.Services
{
    public class CategoriaService : ICategoriaService
    {
        private readonly AppDbContext _dbContext;

        public CategoriaService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Categoria> AddCategoriaAsync(Categoria categoria)
        {
            _dbContext.Categorias.Add(categoria);
            await _dbContext.SaveChangesAsync();
            return categoria;
        }

        public async Task<IEnumerable<Categoria>> GetAllCategoriasAsync()
        {
            return await _dbContext.Categorias.ToListAsync();
        }

        public async Task<bool> UpdateCategoriaAsync(Categoria categoria)
        {
            var categoriaExistente = await _dbContext.Categorias.FindAsync(categoria.Id);
            
            if (categoriaExistente == null) return false;

            categoriaExistente.Descricao = categoria.Descricao;
            categoriaExistente.Finalidade = categoria.Finalidade;

            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCategoriaAsync(int id)
        {
            var categoria = await _dbContext.Categorias.FindAsync(id);
            if (categoria == null)
            {
                return false;
            }

            _dbContext.Categorias.Remove(categoria);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
