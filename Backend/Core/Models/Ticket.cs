using System.ComponentModel.DataAnnotations.Schema;
namespace HelpDesk.Models;

public class Ticket
{
    public Guid Id { get; set; }
    public string ReferenceNo { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    public Guid SubmittedBy { get; set; }
    [ForeignKey("SubmittedBy")]
    [InverseProperty("TicketsSubmitted")]
    public User? SubmittedByUser { get; set; } = null!;

    public Guid? AssignedTo { get; set; }
    [ForeignKey("AssignedTo")]
    [InverseProperty("TicketsAssigned")]
    public User? AssignedToUser { get; set; }

    public int CategoryId { get; set; }
    [ForeignKey("CategoryId")]
    public Category? Category { get; set; } = null!;

    public int PriorityId { get; set; }
    [ForeignKey("PriorityId")]
    public Priority? Priority { get; set; } = null!;

    public int StatusId { get; set; }
    [ForeignKey("StatusId")]
    public Status? Status { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<TicketComment> Comments { get; set; } = new List<TicketComment>();
    public ICollection<TicketAttachment> Attachments { get; set; } = new List<TicketAttachment>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ICollection<ActivityLog> ActivityLogs { get; set; } = new List<ActivityLog>();
}