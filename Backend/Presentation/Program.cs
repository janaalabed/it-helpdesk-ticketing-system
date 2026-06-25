using HelpDesk.Data;
//using HelpDesk.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer; 
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;               
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


//to connect database
builder.Services.AddDbContext<HelpDeskDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

//enable CORS allowing react to request without blocking
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
//register the created jwt service 
builder.Services.AddScoped<HelpDesk.Infrastructure.Security.JwtTokenGenerator>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("Jb4o5kAbh54LMUngqkpUPo85f9b30m46cGH") 
            )
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    //// Program.cs - only in dev. shilyn bs taamle test w ymshe hal get tickets endpoint!!
    //using var scope = app.Services.CreateScope();
    //var db = scope.ServiceProvider.GetRequiredService<HelpDeskDbContext>();
    //await SeedData.SeedTicketsAsync(db);
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");

app.UseAuthentication(); 
app.UseAuthorization();  

app.MapControllers();


app.Run();
