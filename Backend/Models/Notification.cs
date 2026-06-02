using System.ComponentModel.DataAnnotations.Schema;
namespace HelpDesk.Models;

public class Notification
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;

    public Guid TicketId { get; set; }
    [ForeignKey("TicketId")]
    public Ticket Ticket { get; set; } = null!;

    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
}