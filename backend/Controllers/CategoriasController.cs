using ControleGastosApi.Models;
using ControleGastosApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastosApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasController : ControllerBase
    {
        private readonly ICategoriaService _categoriaService; // injeção de dependência

        public CategoriasController(ICategoriaService categoriaService)
        {
            _categoriaService = categoriaService; // construtor
        }

        // task para fazer uma requisição get nas categorias e que retorna um 200 caso seja bem sucedida
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias() 
        {
            var categorias = await _categoriaService.GetAllCategoriasAsync(); // busca em categorias todas as cadastradas
            return Ok(categorias); // retorna um Ok com todas as categorias cadastradas
        }

        // task para fazer uma requisição post nas categorias e que retorna um 201 caso bem sucedida ou um 400 caso algum erro 
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
        {
            if (!ModelState.IsValid) // verifica se o modelo é válido, caso não seja, retorna um 400
            {
                return BadRequest(ModelState);
            }

            var novaCategoria = await _categoriaService.AddCategoriaAsync(categoria); // adiciona a nova categoria 
            return novaCategoria; // retorna a nova categoria criada
        }

        // task para atualizar uma categoria existente, retorna 204 se sucesso, 400 se dados inválidos ou 404 se não encontrar
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateCategoria(int id, Categoria categoria)
        {
            if (id != categoria.Id) // verifica se o id da categoria selecionada é o mesmo da url
            {
                return BadRequest("O ID informado na URL difere do ID da categoria.");
            }

            if (!ModelState.IsValid) // verifica se o modelo é válido
            {
                return BadRequest(ModelState);
            }

            var result = await _categoriaService.UpdateCategoriaAsync(categoria); // busca a categoria e da update nela

            if (!result)  // caso o resultado seja negativo, retorna um 404 falando que não foi encontrada a categoria
            {
                return NotFound($"Categoria com ID {id} não encontrada.");
            }

            return NoContent();
        }

        // task para deletar uma categoria pelo id, retorna 204 caso bem sucedida ou 404 caso algum erro
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            var result = await _categoriaService.DeleteCategoriaAsync(id); // pesquisa a categoria por id e a deleta

            if (!result) // caso negativo, retorna um 404 falando que não foi achada a categoria
            {
                return NotFound($"Categoria com ID {id} não encontrada.");
            }

            return NoContent(); // retorna vazio caso bem sucedido
        }
    }
}