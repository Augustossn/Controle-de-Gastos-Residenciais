namespace ControleGastosApi.Models.DTOs
{
    public class TotalPorPessoaDTO
    {
        public int PessoaId { get; set; }
        public string NomePessoa { get; set; } = string.Empty;
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo { get; set; }
    }
}
