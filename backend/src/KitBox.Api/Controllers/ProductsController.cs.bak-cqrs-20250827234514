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

    // GET /products?name=&category=&page=1&pageSize=12&sortBy=name&sortDir=asc
    [HttpGet]
    public async Task<IActionResult> Search(
        [FromQuery] string? name,
        [FromQuery] string? category,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12,
        [FromQuery] string? sortBy = "name",
        [FromQuery] string? sortDir = "asc",
        CancellationToken ct = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 12;

        sortBy = (sortBy ?? "name").ToLowerInvariant();
        sortDir = (sortDir ?? "asc").ToLowerInvariant();
        var allowed = new HashSet<string> { "name", "category", "price", "quantity", "createdatutc" };
        if (!allowed.Contains(sortBy)) sortBy = "name";
        if (sortDir != "asc" && sortDir != "desc") sortDir = "asc";

        var skip = (page - 1) * pageSize;

        var itemsTask = _repo.SearchAsync(name, category, skip, pageSize, sortBy, sortDir, ct);
        var totalTask = _repo.CountAsync(name, category, ct);
        await Task.WhenAll(itemsTask, totalTask);

        return Ok(new { total = totalTask.Result, page, pageSize, items = itemsTask.Result });
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
        var vr = await _validator.ValidateAsync(dto, ct);
        if (!vr.IsValid) return BadRequest(vr.Errors);

        var entity = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Category = dto.Category,
            Price = dto.Price,
            Quantity = dto.Quantity
        };

        entity = await _repo.CreateAsync(entity, ct);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] ProductInputDto dto, CancellationToken ct = default)
    {
        var vr = await _validator.ValidateAsync(dto, ct);
        if (!vr.IsValid) return BadRequest(vr.Errors);

        var updated = new Product
        {
            Id = id,
            Name = dto.Name,
            Description = dto.Description,
            Category = dto.Category,
            Price = dto.Price,
            Quantity = dto.Quantity
        };

        var ok = await _repo.UpdateAsync(updated, ct);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct = default)
    {
        var ok = await _repo.DeleteAsync(id, ct);
        return ok ? NoContent() : NotFound();
    }
}
