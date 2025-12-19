using ControleGastosApi.Models;
using ControleGastosApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastosApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly ITransacaoService _transacaoService; // injeção de dependência

        public TransacoesController(ITransacaoService transacaoService)
        {
            _transacaoService = transacaoService; // construtor
        }

        // task para fazer uma requisição get e buscar todas as transações cadastradas
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Transacao>>> GetTransacoes()
        {
            var transacoes = await _transacaoService.GetAllTransacoesAsync(); // busca as transações 
            return Ok(transacoes); // retorna 200 com todas as transações cadastradas
        }

        // task para fazer uma requisição post para adicionar uma nova transação
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Transacao>> PostTransacao(Transacao transacao)
        {
            if (!ModelState.IsValid) // verifica se o modelo é válido, caso não seja, retorna 400
            {
                return BadRequest(ModelState);
            }

            try // tenta adicionar a nova transação
            {
                var novaTransacao = await _transacaoService.AddTransacaoAsync(transacao);
                return Ok(transacao);
            }
            catch (ArgumentException ex) // captura erros de validação (regras de negócio)
            {
                return BadRequest(new { mensagem = ex.Message });
            }
            catch (KeyNotFoundException ex) // captura erros de id não encontrado
            {
                return NotFound(new { mensagem = ex.Message });
            }
            catch (Exception) // captura erros genéricos
            {
                return StatusCode(500, "Erro interno ao processar a transação.");
            }

        }
    }
}
