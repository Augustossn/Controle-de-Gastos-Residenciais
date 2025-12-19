using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ControleGastosApi.Models.Enums;

namespace ControleGastosApi.Models
{
    public class Transacao
    {
        [Key] // chave primária
        public int Id { get; set; }

        [Required]
        [StringLength(200, ErrorMessage = "A descrição não pode exceder 200 caracteres.")] // marcado como required e definido o length da descrição
        public string Descricao { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser positivo.")] // marcado como required e definido o tamanho do valor máximo e mínimo
        public decimal Valor { get; set; }

        [Required]
        public TipoTransacao Tipo { get; set; } // define se a transação aceita despesas ou receitas (via Enum)

        [Required]
        public int CategoriaId { get; set; } // id da categoria marcado como required para não ter transação sem categoria

        public Categoria? Categoria { get; set; } 

        [Required]
        public int PessoaId { get; set; } // id da pessoa marcado como required para não ter transação sem pessoa
        
        public Pessoa? Pessoa { get; set; }
    }
}
