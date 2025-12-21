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
        private readonly Mock<AppDbContext> _mockContext; // declara _mockContext para simular o db
        private readonly Mock<DbSet<Pessoa>> _mockSetPessoas; // usa o mock para simular o dbset de Pessoa
        private readonly PessoaService _service; // usa _service como classe do PessoaService

        public PessoaServiceTestes()
        {
            _mockSetPessoas = new Mock<DbSet<Pessoa>>(); // declara um novo mock para Pessoa
            _mockContext = new Mock<AppDbContext>(new DbContextOptions<AppDbContext>()); // declara um novo mock para o dbcontext

            _mockContext.Setup(c => c.Pessoas).Returns(_mockSetPessoas.Object); // conecta o mock de Pessoas ao contexto

            _service = new PessoaService(_mockContext.Object); // instancia o service com as dependências mockadas
        }

        // task para verificar se o método de adicionar pessoa salva corretamente no banco simulado quando os dados são válidos
        [Fact]
        public async Task AddPessoa_DeveSalvarNoBanco_QuandoDadosValidos()
        {
            var novaPessoa = new Pessoa // declara uma nova pessoa para o teste
            {
                Nome = "Usuário de Teste", // define o nome da pessoa
                DataNascimento = DateTime.Today.AddYears(-20) // define a data de nascimento
            };

            await _service.AddPessoaAsync(novaPessoa); // chama o método do serviço para adicionar a pessoa

            // verifica se o método add foi chamado no dbset de pessoas exatamente uma vez
            _mockSetPessoas.Verify(m => m.Add(It.IsAny<Pessoa>()), Times.Once());
            // verifica se a alteração foi salva de forma assíncrona uma vez
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        }
    }
}