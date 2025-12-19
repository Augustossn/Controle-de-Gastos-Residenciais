using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ControleGastosApi.Models
{
    public class Pessoa
    {
        [Key] // chave primária
        public int Id { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "O nome não pode passar 100 caracteres.")] // marcado como required e definido o length do nome
        public string Nome { get; set; } = string.Empty;

        [Required]
        public DateTime DataNascimento { get; set; } // usando data de nascimento para que não seja necessário ajustar a idade

        public int Idade // calculando a idade automaticamente pra mostrar para o frontend
        {
            get
            {
                var hoje = DateTime.Today;
                var idade = hoje.Year - DataNascimento.Year;
                
                if (DataNascimento.Date > hoje.AddYears(-idade)) idade--;
                
                return idade;
            }
        }

        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>(); // propriedade de navegação para acessar as transações dessa pessoa
    }
}
