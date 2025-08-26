using KitBox.Domain;
using MongoDB.Bson;
using MongoDB.Driver;

namespace KitBox.Infrastructure;

public class MongoProductRepository : IProductRepository
{
    private readonly IMongoCollection<Product> _col;

    public MongoProductRepository(IMongoDatabase db)
    {
        _col = db.GetCollection<Product>("products");
        // Índice básico por nome (opcional)
        var nameIdx = new CreateIndexModel<Product>(
            Builders<Product>.IndexKeys.Ascending(x => x.Name),
            new CreateIndexOptions { Background = true });
        _col.Indexes.CreateOne(nameIdx);
    }

    public async Task<PagedResult<Product>> GetPagedAsync(int page, int pageSize)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        var total = await _col.CountDocumentsAsync(FilterDefinition<Product>.Empty);
        var items = await _col.Find(FilterDefinition<Product>.Empty)
            .SortByDescending(x => x.Id) // se Id não for ordenável, troque por Name
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        return new PagedResult<Product>(items, total, page, pageSize);
    }

    public async Task<Product?> GetByIdAsync(string id)
    {
        return await _col.Find(x => x.Id == id).FirstOrDefaultAsync();
    }

    public async Task<Product> CreateAsync(Product p)
    {
        // Gera Id se vier vazio
        if (string.IsNullOrWhiteSpace(p.Id))
            p.Id = ObjectId.GenerateNewId().ToString();

        await _col.InsertOneAsync(p);
        return p;
    }

    public async Task<bool> UpdateAsync(string id, Product update)
    {
        // Atualização idempotente (ajuste os campos conforme seu Product)
        var set = Builders<Product>.Update
            .Set(x => x.Name, update.Name)
            .Set(x => x.Description, update.Description)
            .Set(x => x.Price, update.Price)
            .Set(x => x.Stock, update.Stock);

        var res = await _col.UpdateOneAsync(x => x.Id == id, set);
        return res.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var res = await _col.DeleteOneAsync(x => x.Id == id);
        return res.DeletedCount > 0;
    }
}
