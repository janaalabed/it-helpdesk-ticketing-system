using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable


namespace HelpDesk.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ForceAdminInsert : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Execute a raw SQL emergency block directly inside Postgres/Neon
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM ""Users"" WHERE ""Email"" = 'admin@helpdesk.com') THEN
                        INSERT INTO ""Users"" (""Id"", ""CreatedAt"", ""Email"", ""FullName"", ""Password"", ""RoleId"")
                        VALUES (
                            '99999999-9999-9999-9999-999999999999', 
                            '2026-01-01 00:00:00+00', 
                            'admin@helpdesk.com', 
                            'Jawad Admin', 
                            '$2a$11$clYgGZ2Z2XbXUvFv7eKfeO76n4A5K.4R5U3Pz9wWk6bY3vFv7eKfe', 
                            1
                        );
                    END IF;
                END $$;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM ""Users"" WHERE ""Id"" = '99999999-9999-9999-9999-999999999999';");
        }
    }
}