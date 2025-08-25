using KitBox.Domain;
using MongoDB.Bson;
using MongoDB.Driver;

namespace KitBox.Infrastructure;

public class MongoProductRepository : IProductRepository
{
    private readonly IMongoCollection<Product> _collection;

    public MongoProductRepository(IMongoDatabase db)
    {
        _collection = db.GetCollection<Product>("products");

        try
        {
            var models = new List<CreateIndexModel<Product>>
            {
                new(Builders<Product>.IndexKeys.Ascending(p => p.Name)),
                new(Builders<Product>.IndexKeys.Ascending(p => p.Category)),
                new(Builders<Product>.IndexKeys.Ascending(p => p.CreatedAtUtc))
            };
            _collection.Indexes.CreateMany(models);
        }
        catch { }
    }

    public async Task<Product?> GetByIdAsync(string id, CancellationToken ct = default)
    {
        var filter = Builders<Product>.Filter.Eq(p => p.Id, id);
        return await _collection.Find(filter).FirstOrDefaultAsync(ct);
    }

    public async Task<IReadOnlyList<Product>> SearchAsync(
        string? name = null,
        string? category = null,
        int skip = 0,
        int take = 20,
        string sortBy = "name",
        string sortDir = "asc",
        CancellationToken ct = default)
    {
        var filter = BuildFilter(name, category);

        var find = _collection.Find(filter);

        // normaliza
        sortBy = (sortBy ?? "name").ToLowerInvariant();
        sortDir = (sortDir ?? "asc").ToLowerInvariant();
        var desc = sortDir == "desc";

        // aplica ordenação
        find = sortBy switch
        {
            "category"     => desc ? find.SortByDescending(p => p.Category)     : find.SortBy(p => p.Category),
            "price"        => desc ? find.SortByDescending(p => p.Price)        : find.SortBy(p => p.Price),
            "quantity"     => desc ? find.SortByDescending(p => p.Quantity)     : find.SortBy(p => p.Quantity),
            "createdatutc" => desc ? find.SortByDescending(p => p.CreatedAtUtc) : find.SortBy(p => p.CreatedAtUtc),
            _              => desc ? find.SortByDescending(p => p.Name)         : find.SortBy(p => p.Name),
        };

        return await find.Skip(skip).Limit(take).ToListAsync(ct);
    }

    public async Task<long> CountAsync(string? name = null, string? category = null, CancellationToken ct = default)
    {
        var filter = BuildFilter(name, category);
        return await _collection.CountDocumentsAsync(filter, cancellationToken: ct);
    }

    public async Task<Product> CreateAsync(Product product, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(product.Id))
            product.Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();

        product.CreatedAtUtc = DateTime.UtcNow;
        await _collection.InsertOneAsync(product, cancellationToken: ct);
        return product;
    }

    public async Task<bool> UpdateAsync(Product product, CancellationToken ct = default)
    {
        var filter = Builders<Product>.Filter.Eq(p => p.Id, product.Id);
        var result = await _collection.ReplaceOneAsync(filter, product, cancellationToken: ct);
        return result.IsAcknowledged && result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken ct = default)
    {
        var filter = Builders<Product>.Filter.Eq(p => p.Id, id);
        var result = await _collection.DeleteOneAsync(filter, ct);
        return result.IsAcknowledged && result.DeletedCount > 0;
    }

    private static FilterDefinition<Product> BuildFilter(string? name, string? category)
    {
        var filter = Builders<Product>.Filter.Empty;

        if (!string.IsNullOrWhiteSpace(name))
            filter &= Builders<Product>.Filter.Regex(p => p.Name, new BsonRegularExpression(name, "i"));

        if (!string.IsNullOrWhiteSpace(category))
            filter &= Builders<Product>.Filter.Eq(p => p.Category, category);

        return filter;
    }
}
