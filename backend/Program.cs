using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 1) Configura a policy de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowWeb", policy =>
        policy.WithOrigins(
            "http://localhost:3000",          // Frontend local
            "https://kitbox.vercel.app"       // Domínio do Vercel (ajuste depois se mudar)
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
    );
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 2) Usa a policy de CORS
app.UseCors("AllowWeb");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Healthcheck simples
app.MapGet("/health", () => new { status = "ok", utc = DateTime.UtcNow });

app.Run();
