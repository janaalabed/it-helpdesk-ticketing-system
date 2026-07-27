using HelpDesk.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;

namespace HelpDesk.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminDashboardController : ControllerBase
    {
        HelpDeskDbContext _db;
        public AdminDashboardController(HelpDeskDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> getStats()
        {
            var stats = new
            {
                UsersCount = await _db.Users.CountAsync(),
                EmployeesCount = await _db.Users.CountAsync(u => u.Role.Name == "Employee"),
                ItSupportsCount = await _db.Users.CountAsync(u => u.Role.Name == "IT Support Agent"),
                ManagersCount = await _db.Users.CountAsync(u => u.Role.Name == "Manager"),
                AdminsCount = await _db.Users.CountAsync(u => u.Role.Name == "Admin"),


                TicketsCount = await _db.Tickets.CountAsync(),
                OpenTickets = await _db.Tickets.CountAsync(t => t.Status.Label == "Open"),
                ClosedTickets = await _db.Tickets.CountAsync(t => t.Status.Label == "Closed"),
                ResolvedTickets = await _db.Tickets.CountAsync(t => t.Status.Label == "Resolved"),
                PendingTickets = await _db.Tickets.CountAsync(t => t.Status.Label == "Pending"),
                InProgressTickets = await _db.Tickets.CountAsync(t => t.Status.Label == "In Progress"),

                
                UnassignedTickets = await _db.Tickets.CountAsync(t => t.AssignedTo == null),

             // Recent 5 tickets
             RecentTickets = await _db.Tickets
            .OrderByDescending(t => t.CreatedAt)
            .Take(5)
            .Select(t => new {
                t.Id,
                t.Title,
                t.ReferenceNo,
                Status = t.Status.Label,
                Priority = t.Priority.Level,
                Category = t.Category.Name,
                t.CreatedAt,
            })
            .ToListAsync(),

               
             TicketsByCategory = await _db.Tickets
            .GroupBy(t => t.Category.Name)
            .Select(g => new {
                Category = g.Key,
                Count = g.Count(),
            })
            .ToListAsync(),

                
             TicketsByPriority = await _db.Tickets
            .GroupBy(t => t.Priority.Level)
            .Select(g => new {
                Priority = g.Key,
                Count = g.Count(),
            })
            .ToListAsync(),

            };

            return Ok(stats);
        }
    }
}