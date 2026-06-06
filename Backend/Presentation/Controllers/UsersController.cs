using HelpDesk.Core.DTOs;
using HelpDesk.Data;
using HelpDesk.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HelpDesk.Presentation.Controllers
{
    [Authorize(Roles = "Admin")] //authorization checks ! , it can have more than one role : Admin,Manager..
    [ApiController]
    [Route("api/[Controller]")]
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


    }
}
