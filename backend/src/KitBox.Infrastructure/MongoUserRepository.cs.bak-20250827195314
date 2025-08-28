using KitBox.Domain;
using MongoDB.Driver;

namespace KitBox.Infrastructure;

public class MongoUserRepository : IUserRepository
{
    private readonly IMongoCollection<User> _col;

    public MongoUserRepository(IMongoDatabase db)
    {
        _col = db.GetCollection<User>("users");
        // Índice único no email
        var idx = new CreateIndexModel<User>(
            Builders<User>.IndexKeys.Ascending(x => x.Email),
            new CreateIndexOptions { Unique = true });
        _col.Indexes.CreateOne(idx);
    }

    public async Task<User?> GetByEmailAsync(string email)
        => await _col.Find(x => x.Email == email).FirstOrDefaultAsync();

    public async Task<User> CreateAsync(User user)
    {
        await _col.InsertOneAsync(user);
        return user;
    }
}
