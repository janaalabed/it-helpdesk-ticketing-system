using HelpDesk.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HelpDesk.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "IT Support Agent")]
    public class ItSupportDashboardController : ControllerBase
    {
        private readonly HelpDeskDbContext _db;

        public ItSupportDashboardController(HelpDeskDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = Guid.Parse(userIdClaim);

            var myTickets = _db.Tickets.Where(t => t.AssignedTo == userId);

            var today = DateTime.UtcNow.Date;

            var assigned = await myTickets.CountAsync();
            var working = await myTickets.CountAsync(t => t.Status.Label == "In Progress");
            var resolvedToday = await myTickets.CountAsync(t =>
                t.Status.Label == "Resolved" && t.UpdatedAt.Date == today);

            var critical = await myTickets.CountAsync(t => t.Priority.Level == "Critical");
            var high = await myTickets.CountAsync(t => t.Priority.Level == "High");
            var medium = await myTickets.CountAsync(t => t.Priority.Level == "Medium");
            var low = await myTickets.CountAsync(t => t.Priority.Level == "Low");

            return Ok(new
            {
                assigned,
                working,
                resolvedToday,
                critical,
                high,
                medium,
                low
            });
        }
    }
}