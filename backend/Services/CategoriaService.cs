using ControleGastosApi.Data;
using ControleGastosApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastosApi.Services
{
    public class CategoriaService : ICategoriaService
    {
        private readonly AppDbContext _dbContext; // injeção de dependência

        public CategoriaService(AppDbContext dbContext)
        {
            _dbContext = dbContext; // construtor
        }

        // task para adicionar uma categoria ao banco de dados de forma assíncrona
        public async Task<Categoria> AddCategoriaAsync(Categoria categoria)
        {
            _dbContext.Categorias.Add(categoria); // utiliza o add do dbcontext para adicionar a categoria ao db
            await _dbContext.SaveChangesAsync(); // salva as mudanças
            return categoria; // retorna a categoria cadastrada
        }

        // task para obter/lista todas as categorias do banco de dados de forma assíncrona
        public async Task<IEnumerable<Categoria>> GetAllCategoriasAsync()
        {
            return await _dbContext.Categorias.ToListAsync(); // retorna todas as categorias em formato de lista
        }

        // task booleana para atualizar uma categoria no banco de dados de forma assíncrona
        public async Task<bool> UpdateCategoriaAsync(Categoria categoria)
        {
            // primeiramente salva a categoria achada pelo id numa variável
            var categoriaExistente = await _dbContext.Categorias.FindAsync(categoria.Id); 
            
            if (categoriaExistente == null) return false; // verifica se a categoria existe, caso não, retorna false

            categoriaExistente.Descricao = categoria.Descricao; // faz uma atualização da descrição na categoria existente
            categoriaExistente.Finalidade = categoria.Finalidade; // faz uma atualização da finalidade na categoria existente

            await _dbContext.SaveChangesAsync(); // salva as alterações feitas
            return true; // retorna true
        }

        // task booleana para remover uma categoria pelo id
        public async Task<bool> DeleteCategoriaAsync(int id)
        {
            var categoria = await _dbContext.Categorias.FindAsync(id); // salva numa variável a categoria encontrada pelo id

            if (categoria == null) return false; // caso não ache a categoria, retorna false

            _dbContext.Categorias.Remove(categoria); // remove a categoria do db
            await _dbContext.SaveChangesAsync(); // salva as alterações
            return true; // retorna true
        }
    }
}
