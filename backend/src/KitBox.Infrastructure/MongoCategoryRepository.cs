using KitBox.Domain;
using MongoDB.Bson;
using MongoDB.Driver;

namespace KitBox.Infrastructure;

public class MongoCategoryRepository : ICategoryRepository
{
    private readonly IMongoCollection<Category> _col;

    public MongoCategoryRepository(IMongoDatabase db)
    {
        _col = db.GetCollection<Category>("categories");
        var nameIdx = new CreateIndexModel<Category>(
            Builders<Category>.IndexKeys.Ascending(x => x.Name),
            new CreateIndexOptions { Background = true });
        _col.Indexes.CreateOne(nameIdx);
    }

    public async Task<Category?> GetByIdAsync(string id, CancellationToken ct = default)
        => await _col.Find(x => x.Id == id).FirstOrDefaultAsync(ct);

    public async Task<Category> CreateAsync(Category c, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(c.Id))
            c.Id = ObjectId.GenerateNewId().ToString();
        if (c.CreatedAtUtc == default)
            c.CreatedAtUtc = DateTime.UtcNow;

        await _col.InsertOneAsync(c, cancellationToken: ct);
        return c;
    }

    public async Task<bool> UpdateAsync(Category c, CancellationToken ct = default)
    {
        var set = Builders<Category>.Update
            .Set(x => x.Name,        c.Name)
            .Set(x => x.Description, c.Description);

        var res = await _col.UpdateOneAsync(x => x.Id == c.Id, set, cancellationToken: ct);
        return res.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken ct = default)
    {
        var res = await _col.DeleteOneAsync(x => x.Id == id, ct);
        return res.DeletedCount > 0;
    }

    public async Task<IReadOnlyList<Category>> SearchAsync(string? name, int skip, int take, string sortBy, string sortDir, CancellationToken ct = default)
    {
        var filter = Builders<Category>.Filter.Empty;

        if (!string.IsNullOrWhiteSpace(name))
        {
            var rx = new BsonRegularExpression(name, "i");
            filter &= Builders<Category>.Filter.Or(
                Builders<Category>.Filter.Regex("Name", rx),
                Builders<Category>.Filter.Regex("Description", rx)
            );
        }

        if (skip < 0) skip = 0;
        if (take <= 0) take = 10;

        var sort = BuildSort(sortBy, sortDir);

        var items = await _col.Find(filter)
            .Sort(sort)
            .Skip(skip)
            .Limit(take)
            .ToListAsync(ct);

        return items;
    }

    public async Task<long> CountAsync(string? name, CancellationToken ct = default)
    {
        var filter = Builders<Category>.Filter.Empty;

        if (!string.IsNullOrWhiteSpace(name))
        {
            var rx = new BsonRegularExpression(name, "i");
            filter &= Builders<Category>.Filter.Or(
                Builders<Category>.Filter.Regex("Name", rx),
                Builders<Category>.Filter.Regex("Description", rx)
            );
        }

        return await _col.CountDocumentsAsync(filter, cancellationToken: ct);
    }

    private static SortDefinition<Category> BuildSort(string? sortBy, string? sortDir)
    {
        var desc = string.Equals(sortDir, "desc", StringComparison.OrdinalIgnoreCase);
        var sort = Builders<Category>.Sort;

        return (sortBy ?? "createdAtUtc").ToLowerInvariant() switch
        {
            "name"         => desc ? sort.Descending(x => x.Name)         : sort.Ascending(x => x.Name),
            "createdatutc" => desc ? sort.Descending(x => x.CreatedAtUtc) : sort.Ascending(x => x.CreatedAtUtc),
            _              => desc ? sort.Descending(x => x.CreatedAtUtc) : sort.Ascending(x => x.CreatedAtUtc),
        };
    }
}