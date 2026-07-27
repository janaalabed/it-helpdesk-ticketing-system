using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelpDesk.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RebuildAdminWithHash : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // FORCE AN INSERT STATEMENT HERE BYPASSING EF'S SNAPSHOT
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "Password", "RoleId" },
                values: new object[] {
                    new Guid("99999999-9999-9999-9999-999999999999"),
                    new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc),
                    "admin@helpdesk.com",
                    "Jawad Admin",
                    "$2a$11$clYgGZ2Z2XbXUvFv7eKfeO76n4A5K.4R5U3Pz9wWk6bY3vFv7eKfe", // Hashed password
                    1 // Admin Role Id
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Clean up the row if we ever roll back
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"));
        }
    }
}