using HelpDesk.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Text;

namespace HelpDesk.Infrastructure.Security
{
    public class JwtTokenGenerator
    {
        private readonly IConfiguration _config;
       public JwtTokenGenerator(IConfiguration config) {
            _config = config;
        }


        public string GenerateToken(User user , string roleName) {
            // 1. Gather secret properties from configuration files
            var secretKey = _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is missing.");
            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];
            var duration = double.Parse(_config["Jwt:DurationInMinutes"] ?? "60");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            //2. specifying the Token claims fields to be sent maa envelop
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                new Claim(ClaimTypes.Email,user.Email),
                new Claim(ClaimTypes.Role,roleName),
            };

            //3. preparing the all envelop data 
            var token = new JwtSecurityToken(
               issuer: issuer,
               audience: audience,
               claims: claims,
               expires: DateTime.UtcNow.AddMinutes(duration),
               signingCredentials: creds//key l khitm (signature)
            );

            //4.generating the Token .
            return new JwtSecurityTokenHandler().WriteToken(token);

        }
    }
}
