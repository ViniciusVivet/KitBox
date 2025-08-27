using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using KitBox.Domain;

namespace KitBox.Api.Controllers;

[ApiController]
[Route("metrics")]
public class MetricsController : ControllerBase
{
    private readonly IMongoCollection<Product> _col;

    public MetricsController(IMongoDatabase db)
    {
        _col = db.GetCollection<Product>("products");
    }

    [HttpGet("overview")]
    public async Task<IActionResult> Overview(CancellationToken ct = default)
    {
        var total = await _col.CountDocumentsAsync(FilterDefinition<Product>.Empty, cancellationToken: ct);

        var pipeline = new[]
        {
            new BsonDocument("$group", new BsonDocument
            {
                { "_id", BsonNull.Value },
                { "totalStockValue", new BsonDocument("$sum",
                    new BsonDocument("$multiply", new BsonArray { "$Price", "$Quantity" })) },
                { "lowStockCount", new BsonDocument("$sum",
                    new BsonDocument("$cond", new BsonArray {
                        new BsonDocument("$lt", new BsonArray { "$Quantity", 10 }),
                        1, 0
                    }))
                }
            })
        };

        var doc = await _col.Aggregate<BsonDocument>(pipeline).FirstOrDefaultAsync(ct);

        decimal totalStockValue = 0m;
        long lowStockCount = 0;

        if (doc != null)
        {
            if (doc.TryGetValue("totalStockValue", out var sv))
            {
                totalStockValue = sv.IsDecimal128 ? (decimal)sv.AsDecimal128 : (decimal)sv.ToDouble();
            }
            if (doc.TryGetValue("lowStockCount", out var lc))
            {
                lowStockCount = lc.ToInt64();
            }
        }

        return Ok(new
        {
            totalProducts = total,
            totalStockValue,
            lowStockCount
        });
    }

    public class CategoryStatDto
    {
        public string Category { get; set; } = string.Empty;
        public long Count { get; set; }
        public decimal StockValue { get; set; }
    }

    [HttpGet("by-category")]
    public async Task<IActionResult> ByCategory(CancellationToken ct = default)
    {
        var pipeline = new[]
        {
            new BsonDocument("$group", new BsonDocument
            {
                { "_id", "$Category" },
                { "count", new BsonDocument("$sum", 1) },
                { "stockValue", new BsonDocument("$sum",
                    new BsonDocument("$multiply", new BsonArray { "$Price", "$Quantity" })) }
            })
        };

        var docs = await _col.Aggregate<BsonDocument>(pipeline).ToListAsync(ct);

        var list = docs.Select(d => new CategoryStatDto
        {
            Category = d.GetValue("_id", BsonNull.Value).IsBsonNull ? "" : d["_id"].AsString,
            Count = d.GetValue("count", 0).ToInt64(),
            StockValue = d.TryGetValue("stockValue", out var sv)
                ? (sv.IsDecimal128 ? (decimal)sv.AsDecimal128 : (decimal)sv.ToDouble())
                : 0m
        })
        .OrderByDescending(x => x.Count)
        .ToList();

        return Ok(list);
    }

    [HttpGet("low-stock")]
    public async Task<IActionResult> LowStock([FromQuery] int threshold = 10, [FromQuery] int take = 10, CancellationToken ct = default)
    {
        var items = await _col.Find(p => p.Quantity < threshold)
                              .SortBy(p => p.Quantity)
                              .Limit(take)
                              .ToListAsync(ct);
        return Ok(items);
    }
}
