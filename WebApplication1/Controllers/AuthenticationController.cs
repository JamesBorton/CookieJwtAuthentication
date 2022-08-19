using Domain;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApplication1.DTO;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private IConfiguration _config;
        private readonly ILogger<AuthenticationController> _logger;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;

        public AuthenticationController(IConfiguration config, ILogger<AuthenticationController> logger, SignInManager<AppUser> signInManager
            , UserManager<AppUser> userManager, TokenService tokenService)
        {
            _config = config;
            _logger = logger;
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [HttpGet("/seed")]
        public async Task<string> SeedUsers()
        {
            try
            {
                var user = await _userManager.FindByNameAsync("James");
                if (user == null)
                {
                    var users = new List<AppUser>() {
                    new AppUser() { UserName="Admin", Email="Admin@test.com"},
                    new AppUser() { UserName="SecondUser", Email="Seconduser@test.com"}
                };

                    foreach (var use in users)
                    {
                        await _userManager.CreateAsync(use, "P@ssw0rd");
                    }
                }

                return "Users created";

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
            }

            return "Error occurred";
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if (user == null) return Unauthorized();

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (result.Succeeded)
            {
                return await CreateUserObject(user);
            }
            return Unauthorized();
        }

        [HttpPost("loginJwt")]
        public async Task<ActionResult<UserDto>> LoginJwt(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if (user == null) return Unauthorized();

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (result.Succeeded)
            {
                return await CreateUserObjectJwt(user);
            }
            return Unauthorized();
        }

        [Authorize]
        [HttpGet("UserDetails")]
        public async Task<ActionResult<UserDto>> UserDetails()
        {
            var result = await PopulateUserDetails();
            if (result != null)
            {
                return result;
            }
            return NotFound();
        }

        [HttpGet("logout")]
        public async Task<ActionResult<UserDto>> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }

        [HttpGet("NotAuthorized")]
        public async Task<ActionResult<UserDto>> NotAuthorized()
        {
            return Unauthorized();
        }

        [HttpGet("Forbidden")]
        public async Task<ActionResult> Forbidden()
        {
            
            return Forbid();
        }


        private async Task<UserDto> CreateUserObject(AppUser user)
        {
            var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme, ClaimTypes.Name, ClaimTypes.Role);
            identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.UserName));
            identity.AddClaim(new Claim(ClaimTypes.Name, user.UserName));
            var principal = new ClaimsPrincipal(identity);
            await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            principal,
            new AuthenticationProperties
               {
                   IsPersistent = true,
                   AllowRefresh = true,
                   ExpiresUtc = DateTime.UtcNow.AddDays(1)
               });
            return new UserDto()
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        private async Task<UserDto> CreateUserObjectJwt(AppUser user)
        {
            return new UserDto()
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        private async Task<UserDto> PopulateUserDetails()
        {
            try
            {
                AppUser user = await _signInManager.UserManager.FindByNameAsync(User.Identity.Name);
                if (user != null)
                {
                    return new UserDto()
                    {
                        Username = User.Identity.Name,
                        Token = _tokenService.CreateToken(user),
                        Image = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                        DisplayName = User.Identity.Name
                    };
                }
                else return null;
            }
            catch (Exception ex)
            {
                return null;
            }            
        }
    }
}
