using Xunit;
using Moq;
using ControleGastosApi.Services;
using ControleGastosApi.Models;
using ControleGastosApi.Models.Enums;
using Microsoft.EntityFrameworkCore;
using ControleGastosApi.Data;
using System.Threading.Tasks;

namespace ControleGastosApi.Testes
{
    public class PessoaServiceTestes
    {
        private readonly Mock<AppDbContext> _mockContext;
        private readonly Mock<DbSet<Pessoa>> _mockSetPessoas;
        private readonly PessoaService _service;

        public PessoaServiceTestes()
        {
            _mockSetPessoas = new Mock<DbSet<Pessoa>>();
            _mockContext = new Mock<AppDbContext>(new DbContextOptions<AppDbContext>());

            _mockContext.Setup(c => c.Pessoas).Returns(_mockSetPessoas.Object);

            _service = new PessoaService(_mockContext.Object);
        }

        [Fact]
        public async Task AddPessoa_DeveSalvarNoBanco_QuandoDadosValidos()
        {
            var novaPessoa = new Pessoa
            {
                Nome = "Usuário de Teste",
                DataNascimento = DateTime.Today.AddYears(-20)
            };

            await _service.AddPessoaAsync(novaPessoa);
            _mockSetPessoas.Verify(m => m.Add(It.IsAny<Pessoa>()), Times.Once());
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        }
    }
}