using KitBox.Infrastructure;
using KitBox.Domain;
using FluentValidation;
using KitBox.Api.Dtos;
using KitBox.Api.Validators;

var builder = WebApplication.CreateBuilder(args);

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// DI
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddScoped<IValidator<ProductInputDto>, ProductInputValidator>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAll");
app.UseAuthorization();

app.MapControllers();

app.Run();
