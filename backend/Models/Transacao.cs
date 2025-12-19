using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ControleGastosApi.Models.Enums;

namespace ControleGastosApi.Models
{
    public class Transacao
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200, ErrorMessage = "A descrição não pode exceder 200 caracteres.")]
        public string Descricao { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser positivo.")]
        public decimal Valor { get; set; }

        [Required]
        public TipoTransacao Tipo { get; set; }

        [Required]
        public int CategoriaId { get; set; }

        public Categoria? Categoria { get; set; }

        [Required]
        public int PessoaId { get; set; }
        
        public Pessoa? Pessoa { get; set; }
    }
}
