using HelpDesk.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LookupsController : ControllerBase
    {
        HelpDeskDbContext _db;
        public LookupsController(HelpDeskDbContext db)
        {
            _db = db;
        }

        [HttpGet("priorities")]
        public async Task<IActionResult> getPriorities()
        {
            var priorities = _db.Priorities.Select(p => new
            {
                p.Id,
                p.Level
            }).ToList();

            return Ok(priorities);
        }
        [HttpGet("categories")]
        public async Task<IActionResult> getCategories()
        {
            var categories = _db.Categories.Select(c => new
            {
                c.Id,
                c.Name
            }).ToList();

            return Ok(categories);

        }

        [HttpGet("statuses")]
        public async Task<IActionResult> getStatuses()
        {
            var statuses = _db.Statuses.Select(s => new
            {
                s.Id,
                s.Label
            }).ToList();

            return Ok(statuses);


        }
        [HttpGet("assignable-users")]
        public async Task<IActionResult> getAssignableUsers()
        {
            var users = await _db.Users
                .Where(u => u.Role.Name == "IT Support Agent" || u.Role.Name == "Manager")
                .Select(u => new
                {
                    u.Id,
                    u.FullName
                })
                .OrderBy(u => u.FullName)
                .ToListAsync();

            return Ok(users);
        }
    }
}
