using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ControleGastosApi.Migrations
{
    /// <inheritdoc />
    public partial class AjusteDataNascimento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Idade",
                table: "Pessoas");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataNascimento",
                table: "Pessoas",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataNascimento",
                table: "Pessoas");

            migrationBuilder.AddColumn<int>(
                name: "Idade",
                table: "Pessoas",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
