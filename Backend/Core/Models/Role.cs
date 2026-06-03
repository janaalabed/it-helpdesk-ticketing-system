namespace HelpDesk.Models;

public class Role
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    //fk to user table
    public ICollection<User> Users { get; set; } = new List<User>();
}