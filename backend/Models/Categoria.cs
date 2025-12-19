using System.ComponentModel.DataAnnotations;
using ControleGastosApi.Models.Enums;

namespace ControleGastosApi.Models
{
    public class Categoria
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "A descrição não pode passar 100 caracteres.")]
        public string Descricao { get; set; } = string.Empty;

        [Required]
        public FinalidadeCategoria Finalidade { get; set; }

        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}
