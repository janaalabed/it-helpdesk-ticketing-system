using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelpDesk.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixAdminPasswordHashSpace : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"),
                column: "Password",
                value: "$2a$11$5va6AQc5S7035j1b2OqBhuK/N0Czr/uSJs5E0uqi0rMQuSWxBNRPG");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"),
                column: "Password",
                value: "$2a$11$5va6AQc5S7035j1b2OqBhuK / N0Czr / uSJs5E0uqi0rMQuSWxBNRPG");
        }
    }
}
