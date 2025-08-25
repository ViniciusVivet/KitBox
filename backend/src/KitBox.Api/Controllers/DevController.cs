using KitBox.Domain;
using Microsoft.AspNetCore.Mvc;

namespace KitBox.Api.Controllers;

[ApiController]
[Route("dev")]
public class DevController : ControllerBase
{
    private readonly IProductRepository _repo;
    public DevController(IProductRepository repo) { _repo = repo; }

    [HttpPost("seed")]
    public async Task<IActionResult> Seed(CancellationToken ct)
    {
        var samples = new []
        {
            new Product { Name = "Anel Minimalista", Category = "acessorios", Price = 199.90m, Quantity = 5,  Description = "Aço inox" },
            new Product { Name = "Colar Coração",    Category = "acessorios", Price = 121.00m, Quantity = 23, Description = "Cravejado" },
            new Product { Name = "Pulseira Trançada",Category = "acessorios", Price = 89.90m,  Quantity = 12, Description = "Ajustável" }
        };
        foreach (var p in samples) await _repo.CreateAsync(p, ct);
        return Ok(new { inserted = samples.Length });
    }
}
