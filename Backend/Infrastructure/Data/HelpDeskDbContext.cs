using HelpDesk.Models;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Data
{
    public class HelpDeskDbContext : DbContext
    {
        public HelpDeskDbContext(DbContextOptions<HelpDeskDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Role> Roles => Set<Role>();
        public DbSet<Ticket> Tickets => Set<Ticket>();
        public DbSet<Notification> Notifications => Set<Notification>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Priority> Priorities => Set<Priority>();
        public DbSet<Status> Statuses => Set<Status>();
        public DbSet<TicketAttachment> TicketAttachments => Set<TicketAttachment>();
        public DbSet<TicketComment> TicketComments => Set<TicketComment>();
        public DbSet<ActivityLog> ActivityLogs => Set<ActivityLog>();


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            
            var adminRoleId = 1;
            var agentRoleId = 2;
            var employeeRoleId = 3;
            var managerRoleId = 4;

            modelBuilder.Entity<Role>().HasData(
                new Role { Id = adminRoleId, Name = "Admin" },
                new Role { Id = agentRoleId, Name = "IT Support Agent" },
                new Role { Id = employeeRoleId, Name = "Employee" },
                new Role { Id = managerRoleId, Name = "Manager" }
            );

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = Guid.Parse("99999999-9999-9999-9999-999999999999"), // Fixed Guid
                    FullName = "System Administrator",
                    Email = "admin@helpdesk.com",
                    Password = "Admin123!", // Temporary plain text or dummy string for testing
                    RoleId = adminRoleId, // Explicitly linking to the Admin role
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                 
                }
            );
        }
        }


}