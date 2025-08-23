using KitBox.Domain;
using KitBox.Api.Dtos;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace KitBox.Api.Controllers;

[ApiController]
[Route("[controller]")]
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
    public async Task<IActionResult> Search([FromQuery] string? name, [FromQuery] string? category, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken ct = default)
    {
        var skip = (page - 1) * pageSize;
        var items = await _repo.SearchAsync(name, category, skip, pageSize, ct);
        var total = await _repo.CountAsync(ct);

        return Ok(new { total, page, pageSize, items });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
    {
        var item = await _repo.GetByIdAsync(id, ct);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProductInputDto dto, CancellationToken ct = default)
    {
        var result = await _validator.ValidateAsync(dto, ct);
        if (!result.IsValid)
            return BadRequest(result.Errors);

        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Category = dto.Category,
            Price = dto.Price,
            Quantity = dto.Quantity
        };

        product = await _repo.CreateAsync(product, ct);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] ProductInputDto dto, CancellationToken ct = default)
    {
        var result = await _validator.ValidateAsync(dto, ct);
        if (!result.IsValid)
            return BadRequest(result.Errors);

        var product = new Product
        {
            Id = id,
            Name = dto.Name,
            Description = dto.Description,
            Category = dto.Category,
            Price = dto.Price,
            Quantity = dto.Quantity
        };

        var ok = await _repo.UpdateAsync(product, ct);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct = default)
    {
        var ok = await _repo.DeleteAsync(id, ct);
        return ok ? NoContent() : NotFound();
    }
}
