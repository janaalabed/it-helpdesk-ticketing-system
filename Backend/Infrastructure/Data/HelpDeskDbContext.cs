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
                    Id = Guid.Parse("99999999-9999-9999-9999-999999999999"), 
                    FullName = "Jawad Admin",
                    Email = "admin@helpdesk.com",                  
                    Password = "$2a$11$5va6AQc5S7035j1b2OqBhuK/N0Czr/uSJs5E0uqi0rMQuSWxBNRPG",
                    RoleId = adminRoleId, 
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                 
                }
            );

            modelBuilder.Entity<Priority>().HasData(
                new Priority { Id =1 , Level = "Low"},
                new Priority { Id =2 , Level = "Medium"},
                new Priority { Id =3, Level = "High"},
                new Priority { Id = 4, Level = "Critical"}
                );

            modelBuilder.Entity<Status>().HasData(
                new Status { Id = 1, Label = "Open"},
                new Status { Id = 2, Label = "In Progress"},
                new Status { Id = 3, Label = "Pending"},
                new Status { Id = 4, Label = "Resolved"},
                new Status { Id= 5, Label = "Closed"}
                );

            modelBuilder.Entity<Category>().HasData(
                new Category {Id = 1, Name = "Hardware"},
                new Category { Id = 2, Name = "Software"},
                new Category { Id = 3, Name = "Email"},
                new Category { Id = 4, Name = "Network"},
                new Category { Id = 5, Name = "Access Control"},
                new Category { Id = 6, Name = "other"}
                );
        }
        }


}