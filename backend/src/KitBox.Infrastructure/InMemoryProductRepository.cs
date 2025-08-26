using System.Collections.Concurrent;
using KitBox.Domain;

namespace KitBox.Infrastructure;

public class InMemoryProductRepository : IProductRepository
{
    private static readonly ConcurrentDictionary<string, Product> _db = new();

    static InMemoryProductRepository()
    {
        // Seed leve (só se vazio)
        if (_db.IsEmpty)
        {
            var seed = new[]
            {
                new Product { Name="Colar Minimalista de Prata", Description="Prata 925", Price=129.90m, Stock=20 },
                new Product { Name="Pulseira Couro Preto", Description="Couro legítimo", Price=89.90m, Stock=15 },
                new Product { Name="Anel Solitário Dourado", Description="Folheado a ouro 18k", Price=159.90m, Stock=25 },
                new Product { Name="Brinco Argola Aço", Description="Aço inox", Price=49.90m, Stock=30 },
                new Product { Name="Relógio Digital Sport", Description="Cronômetro e iluminação", Price=299.90m, Stock=12 },
            };
            foreach (var p in seed) _db[p.Id] = p;
        }
    }

    public Task<PagedResult<Product>> GetPagedAsync(int page, int pageSize)
    {
        if (page < 1) page = 1;
        if (pageSize <= 0) pageSize = 10;

        var all = _db.Values.OrderBy(p => p.Name).ToList();
        var total = all.Count;
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        return Task.FromResult(new PagedResult<Product>(items, total, page, pageSize));
    }

    public Task<Product?> GetByIdAsync(string id)
    {
        _db.TryGetValue(id, out var p);
        return Task.FromResult(p);
    }

    public Task<Product> CreateAsync(Product p)
    {
        // Garante Id
        if (string.IsNullOrWhiteSpace(p.Id))
            p.Id = Guid.NewGuid().ToString("N");
        _db[p.Id] = p;
        return Task.FromResult(p);
    }

    public Task<bool> UpdateAsync(string id, Product update)
    {
        if (!_db.ContainsKey(id)) return Task.FromResult(false);
        update.Id = id;
        _db[id] = update;
        return Task.FromResult(true);
    }

    public Task<bool> DeleteAsync(string id)
    {
        return Task.FromResult(_db.TryRemove(id, out _));
    }
}
