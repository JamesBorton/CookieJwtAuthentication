using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AuthenticationServices
{
    public static class AuthenticationServices
    {

        public static void AddIdenetyCoreDefaults<TUser, TContext>(this IServiceCollection services) where TUser : class
            where TContext : Microsoft.EntityFrameworkCore.DbContext
        {
            services.AddIdentityCore<TUser>(options => {
                options.Password.RequiredLength = 4;
                options.Password.RequireNonAlphanumeric = false;
            }).AddEntityFrameworkStores<TContext>()
            .AddSignInManager<SignInManager<TUser>>();
        }

        public static void AddAuthenticationServices(this IServiceCollection services, AuthenticationServiceConfig settings) 
        {
            // register your services here
            services.AddAuthentication(options =>
            {
                // custom scheme defined in .AddPolicyScheme() below
                options.DefaultAuthenticateScheme = "JWT_OR_COOKIE";
                options.DefaultChallengeScheme = "JWT_OR_COOKIE";
                options.DefaultScheme = "JWT_OR_COOKIE";
            })
    .AddJwtBearer("Bearer", options =>
    {
        options.SaveToken = true;
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            ValidIssuer = string.IsNullOrWhiteSpace(settings.ValidIssuer) ? settings.ValidIssuer : "https://localhost:7188",
            ValidAudience = string.IsNullOrWhiteSpace(settings.ValidAudience) ? settings.ValidAudience : "https://localhost:7188",
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(string.IsNullOrWhiteSpace(settings.IssuerSigningKey) ? settings.IssuerSigningKey : "default"))
        };
    })
    .AddCookie("Cookies", options =>
    {
        options.LoginPath = "/login";
        //UseTokenLifetime = false;
        options.SlidingExpiration = true;
        options.ExpireTimeSpan = TimeSpan.FromMinutes(1);
        options.Cookie.MaxAge = options.ExpireTimeSpan;
        options.AccessDeniedPath = "/api/Authentication/NotAuthorized";
        options.Cookie.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Events.OnRedirectToLogin = ctx =>
        {
            ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = ctx =>
        {
            ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    })
    // this is what chooses the default schema based on cookie or jwt.
    .AddPolicyScheme("JWT_OR_COOKIE", "JWT_OR_COOKIE", options =>
    {
        // runs on each request
        options.ForwardDefaultSelector = context =>
        {
            // filter by auth type
            string authorization = context.Request.Headers[HeaderNames.Authorization];
            if (!string.IsNullOrEmpty(authorization) && authorization.StartsWith("Bearer "))
                return "Bearer";

            // otherwise always check for cookie auth
            return "Cookies";
        };
    });
        }
    }

    public class AuthenticationServiceConfig
    {
        public string ValidIssuer { get; set; }
        public string ValidAudience { get; set; }
        public string IssuerSigningKey { get; set; }
    }
}
