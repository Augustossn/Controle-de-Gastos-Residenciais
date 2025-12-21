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
        private readonly Mock<AppDbContext> _mockContext; // declara _mockContext para simular o db
        private readonly TransacaoService _service; // usa _service como classe do TransacaoService
        private readonly Mock<DbSet<Pessoa>> _mockSetPessoas; // usa o mock para simular o dbset de Pessoa
        private readonly Mock<DbSet<Categoria>> _mockSetCategorias; // usa o mock para simular o dbset de Categoria
        private readonly Mock<DbSet<Transacao>> _mockSetTransacoes; // usa o mock para simular o dbset de Transacao

        public TransacaoServiceTestes()
        {
            _mockSetPessoas = new Mock<DbSet<Pessoa>>(); // declara um novo mock para Pessoa
            _mockSetCategorias = new Mock<DbSet<Categoria>>(); // declara um novo mock para Categoria
            _mockSetTransacoes = new Mock<DbSet<Transacao>>(); // declara um novo mock para Transacao

            _mockContext = new Mock<AppDbContext>(new DbContextOptions<AppDbContext>()); // declara um novo mock para o dbcontext

            _mockContext.Setup(c => c.Pessoas).Returns(_mockSetPessoas.Object); // conecta o mock de Pessoas ao contexto
            _mockContext.Setup(c => c.Categorias).Returns(_mockSetCategorias.Object); // conecta o mock de Categoria ao contexto
            _mockContext.Setup(c => c.Transacoes).Returns(_mockSetTransacoes.Object); // conecta o mock de Transacao ao contexto

            _service = new TransacaoService(_mockContext.Object); // instancia o service com as dependências mockadas
        }

        // task para verificar se o addtransacao está funcionando corretamente e lançando erro para a regra de negócio que trata
        // quando a pessoa for menor de idade e deve lançar erro quando essa pessoa tenta lançar uma receita
        [Fact]
        public async Task AddTransacao_DeveLancarErro_QuandoMenorDeIdadeTentaReceita()
        {
            var idMenor = 1; // define o id para teste
            var idCategoriaReceita = 10; // define o id de categoria receita como 10

            var pessoaMenor = new Pessoa // declara uma nova pessoa
            { 
                Id = idMenor, // define o id de pessoa como o idmenor declarado anteriormente
                Nome = "Jovem Teste", // define o nome da classe pessoa
                DataNascimento = DateTime.Today.AddYears(-15) // define a idade da pessoa para 15 usando o datanascimento
            };

            var categoriaReceita = new Categoria // declara uma nova categoria
            { 
                Id = idCategoriaReceita, // define o id de categoria como o idcategoriareceita
                Descricao = "Mesada", // define o nome da descricao de categoria
                Finalidade = FinalidadeCategoria.Receita // define a finalidade da categoria como receita
            };

            // configura o retorno simulado
            _mockSetPessoas.Setup(m => m.FindAsync(idMenor)).ReturnsAsync(pessoaMenor); 
            // configura o retorno simulado
            _mockSetCategorias.Setup(m => m.FindAsync(idCategoriaReceita)).ReturnsAsync(categoriaReceita);

            var transacao = new Transacao // define uma nova transação
            { 
                PessoaId = idMenor, // define o pessoaid da transacao como o id da pessoa criada
                CategoriaId = idCategoriaReceita, // define o categoriaid da transacao como o id da categoria criada
                Tipo = TipoTransacao.Receita, // define o tipo de transacao como o receita
                Valor = 50 // define o valor em reais da transacao
            };

            // verifica se o método lança uma ArgumentException ao ser executado
            var exception = await Assert.ThrowsAsync<ArgumentException>(() => _service.AddTransacaoAsync(transacao));

            // verifica se a mensagem de erro contém o texto esperado
            Assert.Contains("Menores de 18 anos", exception.Message);
        }

        // task para adicionar transação para retornar sucesso quando um menor de idade faz uma despesa
        [Fact]
        public async Task AddTransacao_DeveSucesso_QuandoMenorDeIdadeFazDespesa()
        {
            var idMenor = 1; // define o id para teste
            var idCategoriaDespesa = 20; // define o id de categoria despesa como 20

            var pessoaMenor = new Pessoa // define uma nova pessoa
            { 
                Id = idMenor, // define o id de pessoa como o idmenor declarado anteriormente
                DataNascimento = DateTime.Today.AddYears(-15) // define a idade da pessoa para 15 usando o datanascimento
            };

            var categoriaDespesa = new Categoria // define uma nova categoria
            { 
                Id = idCategoriaDespesa, // define o id de categoria como o idcategoriadespesa
                Finalidade = FinalidadeCategoria.Despesa // define a finalidade da categoria como despesa
            };
            // configura o retorno simulado
            _mockSetPessoas.Setup(m => m.FindAsync(idMenor)).ReturnsAsync(pessoaMenor); 
            // configura o retorno simulado
            _mockSetCategorias.Setup(m => m.FindAsync(idCategoriaDespesa)).ReturnsAsync(categoriaDespesa);

            var transacao = new Transacao // define uma nova transação
            { 
                PessoaId = idMenor, // define o pessoaid da transacao como o id da pessoa criada
                CategoriaId = idCategoriaDespesa, // define o categoriaid da transacao como o id da categoria criada
                Tipo = TipoTransacao.Despesa, // define o tipo de transacao como despesa
                Valor = 20 // define o valor em reais da transacao
            };

            var resultado = await _service.AddTransacaoAsync(transacao); // adiciona a transação

            Assert.NotNull(resultado); // garante que o retorno não é nulo

            // verifica se a transacao adicionada foi chamada e foi adicionada uma vez
            _mockSetTransacoes.Verify(m => m.Add(It.IsAny<Transacao>()), Times.Once());
            // verifica se a alteração foi salva de forma assíncrona uma vez
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        }
    }
}