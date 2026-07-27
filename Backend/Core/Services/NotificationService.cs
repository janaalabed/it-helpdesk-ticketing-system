using HelpDesk.Data;
using HelpDesk.Models;

namespace HelpDesk.Core.Services
{
    public interface INotificationService
    {
        Task NotifyAsync(Guid userId, Guid ticketId, string message);
    }

    public class NotificationService : INotificationService
    {
        private readonly HelpDeskDbContext _db;

        public NotificationService(HelpDeskDbContext db)
        {
            _db = db;
        }

        public async Task NotifyAsync(Guid userId, Guid ticketId, string message)
        {
            var notification = new Notification
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                TicketId = ticketId,
                Message = message,
                IsRead = false,
                SentAt = DateTime.UtcNow
            };

            _db.Notifications.Add(notification);
            await _db.SaveChangesAsync();
        }
    }
}