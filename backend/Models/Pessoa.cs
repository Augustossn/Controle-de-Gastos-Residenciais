using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ControleGastosApi.Models
{
    public class Pessoa
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "O nome não pode passar 100 caracteres.")]
        public string Nome { get; set; } = string.Empty;

        [Required]
        public DateTime DataNascimento { get; set; }

        public int Idade
        {
            get
            {
                var hoje = DateTime.Today;
                var idade = hoje.Year - DataNascimento.Year;
                
                if (DataNascimento.Date > hoje.AddYears(-idade)) idade--;
                
                return idade;
            }
        }

        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}
