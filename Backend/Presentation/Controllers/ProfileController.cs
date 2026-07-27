using HelpDesk.Core.DTOs;
using HelpDesk.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HelpDesk.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        HelpDeskDbContext _db;

        public ProfileController(HelpDeskDbContext db)
        {
            _db = db;
        }
        [Authorize]
        [HttpPut]
        public async Task<IActionResult> changePassword([FromBody] ChangePasswordDto dto)
        {
            if (dto.NewPassword != dto.ConfirmedPassword)
                return BadRequest("Passwords do not match");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = Guid.Parse(userIdClaim);

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return Unauthorized();

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.Password))
                return BadRequest("Current password is incorrect");

            user.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Password updated successfully" });

        }

        [HttpGet]
        public async Task<IActionResult> getUserInfo()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = Guid.Parse(userIdClaim);

            var user = await _db.Users
       .Include(u => u.Role)
       .FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return Unauthorized();

                var userInfo = new
                {
                    user.FullName,
                    user.Email,
                    user.CreatedAt,
                    Role = user.Role.Name,       
                };
       
            return Ok(userInfo);
            
        }
    }
}
