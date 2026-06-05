using HelpDesk.Core.DTOs;
using HelpDesk.Data;
using HelpDesk.Infrastructure.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Controllers
{
    [ApiController]//it tells ASP.NET that this class is an API controller
    [Route("api/[controller]")]//define the URL pattern
    public class LoginController : ControllerBase //ControllerBase provide these methods: OK(),NotFound(),BadRequest(),UnAuthorized()
    {
        private readonly HelpDeskDbContext _db ;
        private readonly JwtTokenGenerator _jwtGenerator ;

       public LoginController (HelpDeskDbContext db , JwtTokenGenerator jwtGenerator)
        {
            _db = db ;
            _jwtGenerator = jwtGenerator ;
        }
 

        [HttpPost]//Specifies the HTTP verb
        public async Task<IActionResult> Login(loginDto myDto) //IActionResult allows the return of type above methods
        {

            var user = await _db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == myDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(myDto.Password, user.Password))
            {
                return Unauthorized(new { message = "Invalid Credentials" });
            }

            //bool isPasswordValid = false;
            //if (user != null)
            //{
            //    if (user.Email == "admin@helpdesk.com" && myDto.Password == "Admin123!")
            //    {
            //        isPasswordValid = true;
            //    }
            //    else
            //    {
            //        isPasswordValid = BCrypt.Net.BCrypt.Verify(myDto.Password, user.Password);
            //    }
            //}

            //if (user == null || !isPasswordValid)
            //{
            //    return Unauthorized(new { message = "Invalid Credentials" });
            //}

            // User credentials are valid, create the token 
            var rolename = user.Role.Name;
            var myEmail = user.Email;
            var tokenString = _jwtGenerator.GenerateToken(user, rolename);

            return Ok(new { token = tokenString, email = myEmail, role = rolename });

        }
    
    }
}
