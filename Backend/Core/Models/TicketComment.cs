using System.ComponentModel.DataAnnotations.Schema;
namespace HelpDesk.Models;

public class TicketComment
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;

    public Guid TicketId { get; set; }
    [ForeignKey("TicketId")]
    public Ticket Ticket { get; set; } = null!;

    public string Body { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}