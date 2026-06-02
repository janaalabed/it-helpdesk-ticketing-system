namespace HelpDesk.Models;

public class Priority
{
    public int Id { get; set; }
    public string Level { get; set; } = string.Empty;
    public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}