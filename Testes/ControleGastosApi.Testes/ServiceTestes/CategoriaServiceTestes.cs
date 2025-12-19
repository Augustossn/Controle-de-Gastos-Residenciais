using Xunit;
using Moq;
using ControleGastosApi.Services;
using ControleGastosApi.Models;
using ControleGastosApi.Models.Enums;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ControleGastosApi.Data; 

namespace ControleGastosApi.Testes
{
    public class CategoriaServiceTestes
    {
        private readonly Mock<AppDbContext> _mockContext;
        private readonly CategoriaService _service;
        private readonly Mock<DbSet<Categoria>> _mockSetCategorias;

        public CategoriaServiceTestes()
        {
            _mockSetCategorias = new Mock<DbSet<Categoria>>();
            _mockContext = new Mock<AppDbContext>(new DbContextOptions<AppDbContext>());

            _mockContext.Setup(c => c.Categorias).Returns(_mockSetCategorias.Object);

            _service = new CategoriaService(_mockContext.Object);
        }

        [Fact]
        public async Task AddCategoria_DeveSalvarNoBanco_QuandoDadosValidos()
        {
            var novaCategoria = new Categoria
            {
                Descricao = "Investimentos",
                Finalidade = FinalidadeCategoria.Ambas
            };

            await _service.AddCategoriaAsync(novaCategoria);
            _mockSetCategorias.Verify(m => m.Add(It.IsAny<Categoria>()), Times.Once());
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        }
    }
}