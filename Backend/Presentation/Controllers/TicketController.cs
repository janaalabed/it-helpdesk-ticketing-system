using HelpDesk.Core.DTOs;
using HelpDesk.Data;
using HelpDesk.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        public async Task<IActionResult> getTicketById(
           [FromQuery] string? category = null,
           [FromQuery] string? status = null,
           [FromQuery] string? priority = null)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            var userId = Guid.Parse(userIdClaim);

            var query = _db.Tickets.Where(t => t.AssignedToUser.Id == userId);

            if (!string.IsNullOrEmpty(category))
                query = query.Where(t => t.Category.Name == category);
            if (!string.IsNullOrEmpty(status))
                query = query.Where(t => t.Status.Label == status);
            if (!string.IsNullOrEmpty(priority))
                query = query.Where(t => t.Priority.Level == priority);

            var myTickets = await query
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
                    submittedByUser = t.SubmittedByUser.FullName,
                    assignedToUser = t.AssignedToUser.FullName
                })
                .ToListAsync();

            return Ok(myTickets);
        }

        [HttpPatch("{id}/changeStatus")]
        [Authorize(Roles = "IT Support Agent,Manager")]
        public async Task<IActionResult> changeTicketStatus(Guid id)
        {
            var ticket =  _db.Tickets.FirstOrDefault(t => t.Id == id);
            if (ticket == null) return NotFound("Ticket not found");
            var closedStatus = await _db.Statuses.FirstOrDefaultAsync(s => s.Label.ToLower() == "closed");
            if(closedStatus == null) return StatusCode(500, "Closed status not found in database");

            ticket.StatusId = closedStatus.Id;
            ticket.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Ticket closed successfully" });
        }


        [HttpPost]
        [Authorize(Roles = "Employee,Admin,Manager")]
        public async Task<IActionResult> CreateTicket([FromBody] CreateTicketDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            var userId = Guid.Parse(userIdClaim);

           
            if (dto.AssignedTo.HasValue)
            {
                var assignedUserExists = await _db.Users.AnyAsync(u => u.Id == dto.AssignedTo.Value);
                if (!assignedUserExists)
                    return BadRequest("Assigned user not found");
            }

            var timestamp = DateTime.UtcNow.ToString("yyyyMMdd");
            var randomSuffix = new Random().Next(1000, 9999);
            var referenceNo = $"TKT-{timestamp}-{randomSuffix}";

            var newTicket = new Ticket
            {
                Id = Guid.NewGuid(),
                ReferenceNo = referenceNo,
                Title = dto.Title,
                Description = dto.Description,
                CategoryId = dto.CategoryId,
                PriorityId = dto.PriorityId,
                StatusId = 1,
                SubmittedBy = userId,
                AssignedTo = dto.AssignedTo,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.Tickets.Add(newTicket);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(getTickets), new { id = newTicket.Id }, new { message = "Ticket successfully filed", referenceNo });
        }
        [HttpPatch("{id}/escalate")]
        [Authorize(Roles = "IT Support Agent")]
        public async Task<IActionResult> EscalateTicket(Guid id)
        {
            var ticket = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == id);
            if (ticket == null) return NotFound("Ticket not found");

            var manager = await _db.Users.FirstOrDefaultAsync(u => u.FullName == "Hadi Hijazi");
            if (manager == null) return StatusCode(500, "Escalation manager not found");

            ticket.AssignedTo = manager.Id;
            ticket.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Ticket escalated to Hadi Hijazi" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Employee,Admin,Manager")]
        public async Task<IActionResult> DeleteTicket(Guid id)
        {
            var ticket = await _db.Tickets.FindAsync(id);

            if (ticket == null)
                return NotFound();

            _db.Tickets.Remove(ticket);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
