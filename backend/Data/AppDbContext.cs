using Microsoft.EntityFrameworkCore;
using ControleGastosApi.Models;

namespace ControleGastosApi.Data
{
    public class AppDbContext : DbContext
    {
        // construtor para implementar o options
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // usando virtual para implementar os testes automatizados
        public virtual DbSet<Pessoa> Pessoas { get; set; }
        public virtual DbSet<Categoria> Categorias { get; set; }
        public virtual DbSet<Transacao> Transacoes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // fazendo o relacionameto entre pessoas e transacoes
            modelBuilder.Entity<Pessoa>()
                .HasMany(p => p.Transacoes)
                .WithOne(t => t.Pessoa)
                .HasForeignKey(t => t.PessoaId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
