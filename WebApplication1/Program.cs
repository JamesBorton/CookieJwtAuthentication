using AuthenticationServices;
using Domain;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Persistence;
using System.Text;
using WebApplication1.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<DataContext>(options =>
options.UseSqlServer(connectionString, b => b.MigrationsAssembly("Persistence")));

//builder.Services.AddIdentityCore<AppUser>(options => {
//    options.Password.RequiredLength = 4;
//    options.Password.RequireNonAlphanumeric = false;
//}).AddEntityFrameworkStores<DataContext>()
//.AddSignInManager<SignInManager<AppUser>>();

AuthenticationServiceConfig authConfig = builder.Configuration.GetSection("AuthenticationServiceConfig").Get<AuthenticationServiceConfig>();

builder.Services.AddIdenetyCoreDefaults<AppUser, DataContext>();
builder.Services.AddAuthenticationServices(authConfig);

//builder.Services.AddAuthentication(options =>
//{
//    // custom scheme defined in .AddPolicyScheme() below
//    options.DefaultAuthenticateScheme = "JWT_OR_COOKIE";
//    options.DefaultChallengeScheme = "JWT_OR_COOKIE";
//    options.DefaultScheme = "JWT_OR_COOKIE";
//})
//    .AddJwtBearer("Bearer", options =>
//    {
//        options.SaveToken = true;
//        options.RequireHttpsMetadata = false;
//        options.TokenValidationParameters = new TokenValidationParameters()
//        {
//            ValidateIssuer = false,
//            ValidateAudience = false,
//            ValidateIssuerSigningKey = true,
//            ValidIssuer = "https://localhost:7188",
//            ValidAudience = "https://localhost:7188",
//            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetValue<string>("JwtKey")))
//        };
//    })
//    .AddCookie("Cookies", options =>
//    {
//        options.LoginPath = "/login";
//        options.ExpireTimeSpan = TimeSpan.FromDays(1);
//        options.AccessDeniedPath = "/api/Authentication/NotAuthorized";
//        options.Cookie.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None;
//        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
//        options.Events.OnRedirectToLogin = ctx =>
//        {
//            ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
//            return Task.CompletedTask;
//        };
//        options.Events.OnRedirectToAccessDenied = ctx =>
//        {
//            ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
//            return Task.CompletedTask;
//        };
//    })
//// this is what chooses the default schema based on cookie or jwt.
//    .AddPolicyScheme("JWT_OR_COOKIE", "JWT_OR_COOKIE", options =>
//    {
//        // runs on each request
//        options.ForwardDefaultSelector = context =>
//        {
//            // filter by auth type
//            string authorization = context.Request.Headers[HeaderNames.Authorization];
//            if (!string.IsNullOrEmpty(authorization) && authorization.StartsWith("Bearer "))
//                return "Bearer";

//            // otherwise always check for cookie auth
//            return "Cookies";
//        };
//    });

builder.Services.AddScoped<TokenService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(opt => {
    opt.AddPolicy("CorsPolicy", policy => {
        policy.AllowAnyMethod().AllowAnyHeader().AllowCredentials().WithOrigins("http://localhost:3000");
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
