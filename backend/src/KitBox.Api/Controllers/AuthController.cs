using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using KitBox.Api.Services;
using KitBox.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace KitBox.Api.Controllers
{
    [ApiController]
    [Route("/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _users;
        private readonly IPasswordHasher _hasher;
        private readonly IConfiguration _config;

        public AuthController(IUserRepository users, IPasswordHasher hasher, IConfiguration config)
        {
            _users = users;
            _hasher = hasher;
            _config = config;
        }

        public class LoginInput
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginInput input)
        {
            var user = await _users.FindByEmailAsync(input.Email);
            if (user is null)
                return Unauthorized(new { message = "Credenciais inválidas." });

            if (!_hasher.Verify(input.Password, user.PasswordHash))
                return Unauthorized(new { message = "Credenciais inválidas." });

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(ClaimTypes.Role, user.Role ?? "User"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "dev-super-secret-key-please-change"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"] ?? "kitbox-api",
                audience: _config["Jwt:Audience"] ?? "kitbox-ui",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(4),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return Ok(new { token = jwt });
        }
    }
}