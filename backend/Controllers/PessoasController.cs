using ControleGastosApi.Models;
using ControleGastosApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastosApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly IPessoaService _pessoaService; // injeção de dependência

        public PessoasController(IPessoaService pessoaService)
        {
            _pessoaService = pessoaService; // construtor
        }

        // task para fazer uma requisição get em todas as pessoas cadastradas
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Pessoa>>> GetPessoas()
        {
            var pessoas = await _pessoaService.GetAllPessoasAsync(); // busca todas as pessoas cadastradas
            return Ok(pessoas); // retorna um 200 com todas as pessoas cadastradas
        }

        // task para fazer uma requisição post para adicionar uma nova pessoa
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Pessoa>> PostPessoa(Pessoa pessoa)
        {
            if (!ModelState.IsValid) // verifica se o model é válido, caso não seja retorna um 400
            {
                return BadRequest(ModelState);
            }

            var novaPessoa = await _pessoaService.AddPessoaAsync(pessoa); // adiciona a nova pessoa pelo service
            return novaPessoa; // retorna novaPessoa cadastrada
        }

        // task para fazer um delete de uma pessoa pelo id
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeletePessoa(int id) 
        {
            var result = await _pessoaService.DeletePessoaAsync(id); // deleta a pessoa

            if (!result) // caso o resultado seja negativo (pessoa não encontrada), retorna um 404
            {
                return NotFound($"Pessoa com ID {id} não encontrada.");
            }

            return NoContent(); // retorna vazio caso bem sucedido
        }
    }
}
