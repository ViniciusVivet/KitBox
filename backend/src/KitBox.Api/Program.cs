using FluentValidation.AspNetCore;
using FluentValidation;
using System.Text;
using KitBox.Domain;
using KitBox.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// ==== Logging básico
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// ==== Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(o =>
{
    o.SwaggerDoc("v1", new OpenApiInfo { Title = "KitBox API", Version = "v1" });
});

// ==== CORS (libera o frontend)
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// ==== MongoDB (client + database)
var mongoConn = builder.Configuration.GetConnectionString("Mongo") ?? "mongodb://localhost:27017";
var mongoDbName = builder.Configuration["Mongo:Database"] ?? "kitbox";

builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(mongoConn));
builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(mongoDbName);
});

// ==== DI de usuários
builder.Services.AddScoped<IUserRepository, MongoUserRepository>();

// ==== JWT (habilitado; não obrigamos ainda)
var jwtKey = builder.Configuration["Jwt:Key"] ?? "dev-secret-change-me-please";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "kitbox-api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "kitbox-ui";

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });

// ==== DI de Produtos + FluentValidation ====
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<KitBox.Api.Validators.ProductInputValidator>();

// Ajuste o segundo tipo se o nome da implementação for diferente:
builder.Services.AddScoped<IProductRepository, MongoProductRepository>();
var app = builder.Build();

// ==== Middleware de log de exceções (diagnóstico de 500)
app.Use(async (ctx, next) =>
{
    try { await next(); }
    catch (Exception ex)
    {
        Console.WriteLine("[UNHANDLED] " + ex.ToString());
        throw;
    }
});

// ==== Dev-friendly
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ==== ORDEM CORRETA
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();





