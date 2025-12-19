using System.ComponentModel.DataAnnotations;
using ControleGastosApi.Models.Enums;

namespace ControleGastosApi.Models
{
    public class Categoria
    {
        [Key] // chave primária
        public int Id { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "A descrição não pode passar 100 caracteres.")] // marcado como required e definido o length da descrição
        public string Descricao { get; set; } = string.Empty;

        [Required]
        public FinalidadeCategoria Finalidade { get; set; } // define se a categoria aceita despesas, receitas ou ambas (via Enum)

        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>(); // propriedade de navegação para acessar as transações dessa pessoa
    }
}
