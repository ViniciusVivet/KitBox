using System.Collections.Concurrent;
using KitBox.Domain;

namespace KitBox.Infrastructure;

public class InMemoryProductRepository : IProductRepository
{
    private static readonly ConcurrentDictionary<string, Product> _db = new();

    static InMemoryProductRepository()
    {
        if (_db.IsEmpty)
        {
            var seed = new[]
            {
                new Product { Id = Guid.NewGuid().ToString("N"), Name="Colar Minimalista de Prata", Description="Prata 925",              Category="Colares",  Price=129.90m, Quantity=20, CreatedAtUtc=DateTime.UtcNow },
                new Product { Id = Guid.NewGuid().ToString("N"), Name="Pulseira Couro Preto",         Description="Couro legítimo",       Category="Pulseiras",Price= 89.90m, Quantity=15, CreatedAtUtc=DateTime.UtcNow },
                new Product { Id = Guid.NewGuid().ToString("N"), Name="Anel Solitário Dourado",       Description="Folheado a ouro 18k",  Category="Anéis",    Price=159.90m, Quantity=25, CreatedAtUtc=DateTime.UtcNow },
                new Product { Id = Guid.NewGuid().ToString("N"), Name="Brinco Argola Aço",            Description="Aço inox",             Category="Brincos",  Price= 49.90m, Quantity=30, CreatedAtUtc=DateTime.UtcNow },
                new Product { Id = Guid.NewGuid().ToString("N"), Name="Relógio Digital Sport",        Description="Cronômetro, iluminação",Category="Relógios",Price=299.90m, Quantity=12, CreatedAtUtc=DateTime.UtcNow },
            };
            foreach (var p in seed) _db[p.Id] = p;
        }
    }

    public Task<IReadOnlyList<Product>> SearchAsync(
        string? name, string? category, int skip, int take, string sortBy, string sortDir, CancellationToken ct = default)
    {
        var q = _db.Values.AsQueryable();

        if (!string.IsNullOrWhiteSpace(name))
        {
            var n = name.Trim().ToLowerInvariant();
            q = q.Where(p =>
                (p.Name ?? string.Empty).ToLower().Contains(n) ||
                (p.Description ?? string.Empty).ToLower().Contains(n));
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            var c = category.Trim().ToLowerInvariant();
            q = q.Where(p => (p.Category ?? string.Empty).ToLower().Contains(c));
        }

        q = ApplySort(q, sortBy, sortDir);

        if (skip < 0) skip = 0;
        if (take <= 0) take = 10;

        var items = q.Skip(skip).Take(take).ToList();
        return Task.FromResult((IReadOnlyList<Product>)items);
    }

    public Task<long> CountAsync(string? name, string? category, CancellationToken ct = default)
    {
        var q = _db.Values.AsQueryable();

        if (!string.IsNullOrWhiteSpace(name))
        {
            var n = name.Trim().ToLowerInvariant();
            q = q.Where(p =>
                (p.Name ?? string.Empty).ToLower().Contains(n) ||
                (p.Description ?? string.Empty).ToLower().Contains(n));
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            var c = category.Trim().ToLowerInvariant();
            q = q.Where(p => (p.Category ?? string.Empty).ToLower().Contains(c));
        }

        return Task.FromResult((long)q.Count());
    }

    public Task<Product?> GetByIdAsync(string id, CancellationToken ct = default)
    {
        _db.TryGetValue(id, out var p);
        return Task.FromResult(p);
    }

    public Task<Product> CreateAsync(Product p, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(p.Id))
            p.Id = Guid.NewGuid().ToString("N");
        if (p.CreatedAtUtc == default)
            p.CreatedAtUtc = DateTime.UtcNow;

        _db[p.Id] = p;
        return Task.FromResult(p);
    }

    public Task<bool> UpdateAsync(Product p, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(p.Id) || !_db.ContainsKey(p.Id))
            return Task.FromResult(false);

        var existing = _db[p.Id];
        existing.Name        = p.Name;
        existing.Description = p.Description;
        existing.Category    = p.Category;
        existing.Price       = p.Price;
        existing.Quantity    = p.Quantity;
        _db[p.Id] = existing;

        return Task.FromResult(true);
    }

    public Task<bool> DeleteAsync(string id, CancellationToken ct = default)
        => Task.FromResult(_db.TryRemove(id, out _));

    private static IQueryable<Product> ApplySort(IQueryable<Product> q, string? sortBy, string? sortDir)
    {
        var desc = string.Equals(sortDir, "desc", StringComparison.OrdinalIgnoreCase);
        switch ((sortBy ?? "name").ToLowerInvariant())
        {
            case "name":         return desc ? q.OrderByDescending(p => p.Name)         : q.OrderBy(p => p.Name);
            case "category":     return desc ? q.OrderByDescending(p => p.Category)     : q.OrderBy(p => p.Category);
            case "price":        return desc ? q.OrderByDescending(p => p.Price)        : q.OrderBy(p => p.Price);
            case "quantity":     return desc ? q.OrderByDescending(p => p.Quantity)     : q.OrderBy(p => p.Quantity);
            case "createdatutc": return desc ? q.OrderByDescending(p => p.CreatedAtUtc) : q.OrderBy(p => p.CreatedAtUtc);
            default:             return desc ? q.OrderByDescending(p => p.Name)         : q.OrderBy(p => p.Name);
        }
    }
}
