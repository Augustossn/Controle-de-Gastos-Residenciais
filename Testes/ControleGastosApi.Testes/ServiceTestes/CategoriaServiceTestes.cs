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
        private readonly Mock<AppDbContext> _mockContext; // declara _mockContext para simular o db
        private readonly CategoriaService _service; // usa _service como classe do CategoriaService
        private readonly Mock<DbSet<Categoria>> _mockSetCategorias; // usa o mock para simular o dbset de Categoria

        public CategoriaServiceTestes()
        {
            _mockSetCategorias = new Mock<DbSet<Categoria>>(); // declara um novo mock para Categoria
            _mockContext = new Mock<AppDbContext>(new DbContextOptions<AppDbContext>()); // declara um novo mock para o dbcontext

            _mockContext.Setup(c => c.Categorias).Returns(_mockSetCategorias.Object); // conecta o mock de Categoria ao contexto

            _service = new CategoriaService(_mockContext.Object); // instancia o service com as dependências mockadas
        }

        // task para verificar se o método de adicionar categoria salva corretamente no banco simulado quando os dados são válidos
        [Fact]
        public async Task AddCategoria_DeveSalvarNoBanco_QuandoDadosValidos()
        {
            var novaCategoria = new Categoria // declara uma nova categoria para o teste
            {
                Descricao = "Investimentos", // define a descrição da categoria
                Finalidade = FinalidadeCategoria.Ambas // define a finalidade da categoria
            };

            await _service.AddCategoriaAsync(novaCategoria); // chama o método do serviço para adicionar a categoria

            // verifica se o método Add foi chamado no dbset de categorias exatamente uma vez
            _mockSetCategorias.Verify(m => m.Add(It.IsAny<Categoria>()), Times.Once());
            // verifica se a alteração foi salva de forma assíncrona uma vez
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        }
    }
}