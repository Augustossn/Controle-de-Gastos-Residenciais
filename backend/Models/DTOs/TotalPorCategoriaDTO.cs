using ControleGastosApi.Models.Enums;

namespace ControleGastosApi.Models.DTOs
{
    public class TotalPorCategoriaDTO
    {
        public int CategoriaId { get; set; }
        public string DescricaoCategoria { get; set; } = string.Empty;
        public FinalidadeCategoria Finalidade { get; set; }
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo { get; set; }
    }
}
