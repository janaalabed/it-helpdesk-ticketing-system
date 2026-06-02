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
    }
}