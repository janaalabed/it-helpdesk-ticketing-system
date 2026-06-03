using System.ComponentModel.DataAnnotations.Schema;
namespace HelpDesk.Models;

public class ActivityLog
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;

    public Guid TicketId { get; set; }
    [ForeignKey("TicketId")]
    public Ticket Ticket { get; set; } = null!;

    public string Action { get; set; } = string.Empty;
    public string? Details { get; set; }
    public DateTime LoggedAt { get; set; } = DateTime.UtcNow;
}