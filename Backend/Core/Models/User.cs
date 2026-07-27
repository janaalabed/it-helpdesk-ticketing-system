using System.ComponentModel.DataAnnotations.Schema;
namespace HelpDesk.Models;

public class User
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public int RoleId { get; set; }
    [ForeignKey("RoleId")]
    public Role Role { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [InverseProperty("SubmittedByUser")]
    public ICollection<Ticket> TicketsSubmitted { get; set; } = new List<Ticket>();

    [InverseProperty("AssignedToUser")]
    public ICollection<Ticket> TicketsAssigned { get; set; } = new List<Ticket>();
}