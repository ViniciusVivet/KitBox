using FluentValidation;
using FluentValidation.AspNetCore;
using KitBox.Domain;
using KitBox.Infrastructure;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Serilog básico no console – eu gosto pra log estruturado
Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// Minimal APIs + Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// FluentValidation (se eu quiser validar DTOs depois)
builder.Services.AddFluentValidationAutoValidation();

// Infra (Mongo + Repo)
builder.Services.AddInfrastructure(builder.Configuration);

// Validator simples pra criação/atualização (eu deixo no Program por rapidez)
builder.Services.AddSingleton<IValidator<Product>>(new InlineProductValidator());

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Health check simples
app.MapGet("/health", () => Results.Ok(new { status = "ok", at = DateTime.UtcNow }))
   .WithTags("Health");

// Produtos – rotas enxutas
app.MapGet("/products", async (string? name, string? category, int page, int pageSize, IProductRepository repo, CancellationToken ct) =>
{
    // paginação simples (eu padronizo page>=1)
    page = page <= 0 ? 1 : page;
    pageSize = pageSize is <= 0 or > 100 ? 20 : pageSize;
    var skip = (page - 1) * pageSize;

    var items = await repo.SearchAsync(name, category, skip, pageSize, ct);
    var total = await repo.CountAsync(ct);
    return Results.Ok(new { total, page, pageSize, items });
})
.WithTags("Products");

app.MapGet("/products/{id}", async (string id, IProductRepository repo, CancellationToken ct) =>
{
    var found = await repo.GetByIdAsync(id, ct);
    return found is null ? Results.NotFound() : Results.Ok(found);
})
.WithTags("Products");

app.MapPost("/products", async (Product input, IValidator<Product> validator, IProductRepository repo, CancellationToken ct) =>
{
    var validation = await validator.ValidateAsync(input, ct);
    if (!validation.IsValid) return Results.ValidationProblem(validation.ToDictionary());

    var created = await repo.CreateAsync(input, ct);
    return Results.Created($"/products/{created.Id}", created);
})
.WithTags("Products");

app.MapPut("/products/{id}", async (string id, Product input, IValidator<Product> validator, IProductRepository repo, CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(id)) return Results.BadRequest();

    input.Id = id; // eu tomo a rota como fonte da verdade pro Id
    var validation = await validator.ValidateAsync(input, ct);
    if (!validation.IsValid) return Results.ValidationProblem(validation.ToDictionary());

    var ok = await repo.UpdateAsync(input, ct);
    return ok ? Results.NoContent() : Results.NotFound();
})
.WithTags("Products");

app.MapDelete("/products/{id}", async (string id, IProductRepository repo, CancellationToken ct) =>
{
    var ok = await repo.DeleteAsync(id, ct);
    return ok ? Results.NoContent() : Results.NotFound();
})
.WithTags("Products");

app.Run();

// ========== Validators ==========
// Eu mantenho simples por enquanto; se crescer, movo pra camada Application
file class InlineProductValidator : AbstractValidator<Product>
{
    public InlineProductValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Description).MaximumLength(2000);
        RuleFor(x => x.Category).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Quantity).GreaterThanOrEqualTo(0);
    }
}
