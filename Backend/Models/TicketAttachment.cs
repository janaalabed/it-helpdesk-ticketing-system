using System.ComponentModel.DataAnnotations.Schema;
namespace HelpDesk.Models;

public class TicketAttachment
{
    public Guid Id { get; set; }

    public Guid TicketId { get; set; }
    [ForeignKey("TicketId")]
    public Ticket Ticket { get; set; } = null!;

    public Guid UploadedBy { get; set; }
    [ForeignKey("UploadedBy")]
    public User UploadedByUser { get; set; } = null!;

    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}