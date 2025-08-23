using KitBox.Domain;
using MongoDB.Bson;
using MongoDB.Driver;

namespace KitBox.Infrastructure;

public class MongoProductRepository : IProductRepository
{
    private readonly IMongoCollection<Product> _collection;

    public MongoProductRepository(IMongoDatabase db)
    {
        // coleção: products – indexarei name e category
        _collection = db.GetCollection<Product>("products");

        // Garantir índices básicos (idempotente)
        try
        {
            var models = new List<CreateIndexModel<Product>>
            {
                new(Builders<Product>.IndexKeys.Ascending(p => p.Name)),
                new(Builders<Product>.IndexKeys.Ascending(p => p.Category))
            };
            _collection.Indexes.CreateMany(models);
        }
        catch
        {
            // evitar quebrar build/exec se indexação falhar em dev
        }
    }

    public async Task<Product?> GetByIdAsync(string id, CancellationToken ct = default)
    {
        var filter = Builders<Product>.Filter.Eq(p => p.Id, id);
        return await _collection.Find(filter).FirstOrDefaultAsync(ct);
    }

    public async Task<IReadOnlyList<Product>> SearchAsync(string? name = null, string? category = null, int skip = 0, int take = 20, CancellationToken ct = default)
    {
        var filter = Builders<Product>.Filter.Empty;

        if (!string.IsNullOrWhiteSpace(name))
            filter &= Builders<Product>.Filter.Regex(p => p.Name, new BsonRegularExpression(name, "i"));

        if (!string.IsNullOrWhiteSpace(category))
            filter &= Builders<Product>.Filter.Eq(p => p.Category, category);

        return await _collection.Find(filter).Skip(skip).Limit(take).ToListAsync(ct);
    }

    public async Task<Product> CreateAsync(Product product, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(product.Id))
            product.Id = ObjectId.GenerateNewId().ToString();

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

    public async Task<long> CountAsync(CancellationToken ct = default)
        => await _collection.CountDocumentsAsync(Builders<Product>.Filter.Empty, cancellationToken: ct);
}
