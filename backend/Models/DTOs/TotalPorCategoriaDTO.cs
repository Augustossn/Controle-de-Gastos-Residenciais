using ControleGastosApi.Models.Enums;

namespace ControleGastosApi.Models.DTOs
{
    public class TotalPorCategoriaDTO // usando DTO para o usuario ver apenas o que eu quero que ele veja
    {
        public int CategoriaId { get; set; } // id da categoria
        public string DescricaoCategoria { get; set; } = string.Empty; // descrição da categoria
        public FinalidadeCategoria Finalidade { get; set; } // finalidade da categoria (despesa, receita, ambas)
        public decimal TotalReceitas { get; set; } // calcula o total das receitas da categoria
        public decimal TotalDespesas { get; set; } // calcula o total das despesas da categoria
        public decimal Saldo { get; set; } // mostra o resultado do TotalReceitas - TotalDespesas da categoria
    }
}
