using HelpDesk.Core.DTOs;
using HelpDesk.Data;
using HelpDesk.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Presentation.Controllers
{
    [Authorize(Roles = "Admin")] //authorization checks ! , it can have more than one role : Admin,Manager..
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        HelpDeskDbContext _db ;
    
        public UsersController(HelpDeskDbContext db  )
        {
            _db = db; 
          
        }

        [HttpPost]
        public async Task<IActionResult> addUser (UserDTO userDTO)
        {
            var newUser = new User
            {
                FullName = userDTO.FullName,
                Email = userDTO.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(userDTO.Password),
                RoleId = userDTO.RoleId,
            };
            _db.Users.Add(newUser);
            await _db.SaveChangesAsync();
            return Ok(newUser);

        }

        [HttpGet]     
        public async Task<IActionResult> getUsers()
        {
            //join act
            var users = _db.Users.Include(u => u.Role).Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                Role = u.Role.Name
            }).ToList();
            if (users.Count > 0)
            {
                return Ok(users);
            }
            return Ok(new { Message = "no users found" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = _db.Users.FirstOrDefault(u => u.Id == id);
            if (user != null)
            {
                _db.Users.Remove(user);
                await _db.SaveChangesAsync();
                return Ok(new { message = "user successfully deleted" });
            }
            return NotFound();
        }


    }
}
