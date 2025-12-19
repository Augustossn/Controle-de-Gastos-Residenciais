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
    public class TransacaoServiceTestes
    {
        private readonly Mock<AppDbContext> _mockContext;
        private readonly TransacaoService _service;
        private readonly Mock<DbSet<Pessoa>> _mockSetPessoas;
        private readonly Mock<DbSet<Categoria>> _mockSetCategorias;
        private readonly Mock<DbSet<Transacao>> _mockSetTransacoes;

        public TransacaoServiceTestes()
        {
            _mockSetPessoas = new Mock<DbSet<Pessoa>>();
            _mockSetCategorias = new Mock<DbSet<Categoria>>();
            _mockSetTransacoes = new Mock<DbSet<Transacao>>();

            _mockContext = new Mock<AppDbContext>(new DbContextOptions<AppDbContext>());

            _mockContext.Setup(c => c.Pessoas).Returns(_mockSetPessoas.Object);
            _mockContext.Setup(c => c.Categorias).Returns(_mockSetCategorias.Object);
            _mockContext.Setup(c => c.Transacoes).Returns(_mockSetTransacoes.Object);

            _service = new TransacaoService(_mockContext.Object);
        }

        [Fact]
        public async Task AddTransacao_DeveLancarErro_QuandoMenorDeIdadeTentaReceita()
        {
            var idMenor = 1;
            var idCategoriaReceita = 10;

            var pessoaMenor = new Pessoa 
            { 
                Id = idMenor, 
                Nome = "Jovem Teste", 
                DataNascimento = DateTime.Today.AddYears(-15) 
            };

            var categoriaReceita = new Categoria 
            { 
                Id = idCategoriaReceita, 
                Descricao = "Mesada", 
                Finalidade = FinalidadeCategoria.Receita 
            };

            _mockSetPessoas.Setup(m => m.FindAsync(idMenor)).ReturnsAsync(pessoaMenor);
            _mockSetCategorias.Setup(m => m.FindAsync(idCategoriaReceita)).ReturnsAsync(categoriaReceita);

            var transacao = new Transacao 
            { 
                PessoaId = idMenor, 
                CategoriaId = idCategoriaReceita,
                Tipo = TipoTransacao.Receita, 
                Valor = 50
            };

            var exception = await Assert.ThrowsAsync<ArgumentException>(() => _service.AddTransacaoAsync(transacao));

            Assert.Contains("Menores de 18 anos", exception.Message);
        }

        [Fact]
        public async Task AddTransacao_DeveSucesso_QuandoMenorDeIdadeFazDespesa()
        {
            var idMenor = 1;
            var idCategoriaDespesa = 20;

            var pessoaMenor = new Pessoa 
            { 
                Id = idMenor, 
                DataNascimento = DateTime.Today.AddYears(-15) 
            };

            var categoriaDespesa = new Categoria 
            { 
                Id = idCategoriaDespesa, 
                Finalidade = FinalidadeCategoria.Despesa 
            };

            _mockSetPessoas.Setup(m => m.FindAsync(idMenor)).ReturnsAsync(pessoaMenor);
            _mockSetCategorias.Setup(m => m.FindAsync(idCategoriaDespesa)).ReturnsAsync(categoriaDespesa);

            var transacao = new Transacao 
            { 
                PessoaId = idMenor, 
                CategoriaId = idCategoriaDespesa,
                Tipo = TipoTransacao.Despesa, 
                Valor = 20
            };

            var resultado = await _service.AddTransacaoAsync(transacao);

            Assert.NotNull(resultado);
            
            _mockSetTransacoes.Verify(m => m.Add(It.IsAny<Transacao>()), Times.Once());
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        }
    }
}