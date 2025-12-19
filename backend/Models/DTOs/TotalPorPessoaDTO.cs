namespace ControleGastosApi.Models.DTOs
{
    public class TotalPorPessoaDTO // usando DTO para o usuario ver apenas o que eu quero que ele veja
    {
        public int PessoaId { get; set; } // id da pessoa
        public string NomePessoa { get; set; } = string.Empty; // nome da pessoa
        public decimal TotalReceitas { get; set; } // total das recetas da pessoa
        public decimal TotalDespesas { get; set; } // total das despesas da pessoa
        public decimal Saldo { get; set; } // TotalReceitas - TotalDespesas da pessoa
    }
}
