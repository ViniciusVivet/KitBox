using KitBox.Infrastructure;
using KitBox.Domain;
using FluentValidation;
using KitBox.Api.Dtos;
using KitBox.Api.Validators;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo {
        Title = "KitBox API",
        Version = "v1",
        Description = "CRUD de Produtos (MongoDB) com paginação, filtros, sort e validação."
    });
});

// CORS (Dev: AllowAll | Prod: origem única a partir de FRONTEND_ORIGIN)
var frontendOrigin = builder.Configuration["FRONTEND_ORIGIN"];
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAll", p =>
            p.AllowAnyOrigin()
             .AllowAnyHeader()
             .AllowAnyMethod());
    });
}
else
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("FrontOnly", p =>
        {
            if (!string.IsNullOrWhiteSpace(frontendOrigin))
            {
                p.WithOrigins(frontendOrigin)
                 .AllowAnyHeader()
                 .AllowAnyMethod();
            }
        });
    });
}

// DI do projeto
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddScoped<IValidator<ProductInputDto>, ProductInputValidator>();

var app = builder.Build();

// Swagger sempre habilitado (ok para dev/demo)
app.UseSwagger();
app.UseSwaggerUI();

// Pipeline
app.UseHttpsRedirection();
app.UseRouting();

if (app.Environment.IsDevelopment())
    app.UseCors("AllowAll");
else
    app.UseCors("FrontOnly");

app.UseAuthorization();
app.MapControllers();

app.Run();
