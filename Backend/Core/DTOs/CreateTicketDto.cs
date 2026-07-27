namespace HelpDesk.Core.DTOs
{
    public class CreateTicketDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public int PriorityId { get; set; }
        public Guid? AssignedTo { get; set; }
    }
}