using HelpDesk.Data;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace HelpDesk.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly HelpDeskDbContext _context;

        public ReportsController(HelpDeskDbContext context)
        {
            _context = context;
        }
        [HttpGet("summary")]
        public IActionResult GetSummary()
        {
            var totalTickets = _context.Tickets.Count();

            var openTickets = _context.Tickets.Count(t => t.StatusId == 1);

            var resolvedTickets = _context.Tickets.Count(t => t.StatusId == 3);

            var highPriorityTickets = _context.Tickets.Count(t => t.PriorityId == 3);

            return Ok(new
            {
                totalTickets,
                openTickets,
                resolvedTickets,
                highPriorityTickets
            });
        }
    }
}