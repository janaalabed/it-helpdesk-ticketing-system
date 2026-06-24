using HelpDesk.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HelpDesk.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeDashboardController : ControllerBase
    {
        HelpDeskDbContext _db;
        public EmployeeDashboardController(HelpDeskDbContext db) { 
            _db = db;
        }

        [HttpGet]
        [Authorize(Roles = "Employee")]

        public async Task<IActionResult> getStats() { 


         var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
         if (userIdClaim == null) return Unauthorized();

         var userId = Guid.Parse(userIdClaim);

            var stats = new
            {
                TotalTickets = await _db.Tickets.CountAsync(t => t.SubmittedBy == userId),
                OpenTickets = await _db.Tickets.CountAsync(t => t.SubmittedBy == userId && t.Status.Label == "Open"),
                InProgressTickets = await _db.Tickets.CountAsync(t => t.SubmittedBy == userId && t.Status.Label == "In Progress"),
                ResolvedTickets = await _db.Tickets.CountAsync(t => t.SubmittedBy == userId && t.Status.Label == "Resolved"),


                RecentTickets = _db.Tickets
                .Where(t => t.SubmittedByUser.Id == userId)
                .OrderByDescending(t => t.CreatedAt)
                .Take(5)
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.ReferenceNo,
                    Status = t.Status.Label,
                    Priority = t.Priority.Level,
                    Category = t.Category.Name,
                    t.CreatedAt,
                })
                .ToList(),

            };
           
            return Ok(stats);
         



        }
    }
}
