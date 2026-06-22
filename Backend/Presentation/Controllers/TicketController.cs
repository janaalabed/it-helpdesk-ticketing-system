using HelpDesk.Data;
using HelpDesk.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HelpDesk.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketController : ControllerBase
    {
        HelpDeskDbContext _db;

       public TicketController( HelpDeskDbContext db)
        {
            _db = db;
        }
        [HttpGet]
        [Authorize(Roles = "Employee,Admin,Manager")]
        public async Task<IActionResult> getTickets([FromQuery] string? category = null, [FromQuery] string? status = null, [FromQuery] string? priority = null)
        {
            var query = _db.Tickets.AsQueryable();

            if (!string.IsNullOrEmpty(category))
                query = query.Where(t => t.Category.Name == category);
            if (!string.IsNullOrEmpty(status))
                    query = query.Where(s=> s.Status.Label ==  status);
            if (!string.IsNullOrEmpty(priority))
                query = query.Where(p => p.Priority.Level == priority);

            var tickets =  query.Select(t => new
            {
                t.Id,
                t.Title,
                t.Description,
                t.ReferenceNo,
                SubmittedByUser = t.SubmittedByUser.FullName,
                AssignedToUser = t.AssignedToUser.FullName,
                Status = t.Status.Label,
                Priority = t.Priority.Level,
                Category = t.Category.Name,
                t.CreatedAt,
                t.UpdatedAt
            }).ToList();

            return Ok(tickets);
        }

        [HttpGet("myTickets")]
        [Authorize(Roles = "IT Support Agent,Manager")]
        public async Task<IActionResult> getTicketById()
        {

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            var userId = Guid.Parse(userIdClaim);
            var myTicket = _db.Tickets.Where(t => t.AssignedToUser.Id == userId)
                .Select(t => new
                {
                    t.Id,
                    t.ReferenceNo,
                    t.Title,
                    t.Description,
                    category = t.Category.Name,
                    priority = t.Priority.Level,
                    status = t.Status.Label,
                    t.CreatedAt,
                    t.UpdatedAt,
                    submittedByUser = t.SubmittedByUser.FullName

                }).ToList();

            return Ok(myTicket);
        }
    }
}
