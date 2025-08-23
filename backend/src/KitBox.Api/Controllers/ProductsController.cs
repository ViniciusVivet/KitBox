using FluentValidation;
using KitBox.Api.Dtos;
using KitBox.Domain;
using Microsoft.AspNetCore.Mvc;

namespace KitBox.Api.Controllers;

[ApiController]
[Route("/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductRepository _repo;
    private readonly IValidator<ProductInputDto> _validator;

    public ProductsController(IProductRepository repo, IValidator<ProductInputDto> validator)
    {
        _repo = repo;
        _validator = validator;
    }

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? name = null, [FromQuery] string? category = null, CancellationToken ct = default)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var skip = (page - 1) * pageSize;
        var items = await _repo.SearchAsync(name, category, skip, pageSize, ct);
        var total = await _repo.CountAsync(ct);

        Response.Headers["X-Total-Count"] = total.ToString();
        return Ok(new { total, page, pageSize, items });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
    {
        var p = await _repo.GetByIdAsync(id, ct);
        return p is null ? NotFound() : Ok(ToOutput(p));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProductInputDto input, CancellationToken ct)
    {
        var val = await _validator.ValidateAsync(input, ct);
        if (!val.IsValid) return BadRequest(val.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }));

        var product = new Product
        {
            Name = input.Name,
            Description = input.Description,
            Category = input.Category,
            Price = input.Price,
            Quantity = input.Quantity
        };

        var created = await _repo.CreateAsync(product, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, ToOutput(created));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] ProductInputDto input, CancellationToken ct)
    {
        var val = await _validator.ValidateAsync(input, ct);
        if (!val.IsValid) return BadRequest(val.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }));

        var existing = await _repo.GetByIdAsync(id, ct);
        if (existing is null) return NotFound();

        existing.Name = input.Name;
        existing.Description = input.Description;
        existing.Category = input.Category;
        existing.Price = input.Price;
        existing.Quantity = input.Quantity;

        var ok = await _repo.UpdateAsync(existing, ct);
        return ok ? Ok(ToOutput(existing)) : StatusCode(500);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        var ok = await _repo.DeleteAsync(id, ct);
        return ok ? NoContent() : NotFound();
    }

    private static ProductOutputDto ToOutput(Product p) =>
        new(p.Id, p.Name, p.Description, p.Category, p.Price, p.Quantity, p.CreatedAtUtc);
}
