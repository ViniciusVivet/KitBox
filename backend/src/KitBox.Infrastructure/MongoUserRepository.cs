using KitBox.Domain;
using MongoDB.Bson;
using MongoDB.Driver;

namespace KitBox.Infrastructure;

public class MongoUserRepository : IUserRepository
{
    private readonly IMongoCollection<User> _collection;

    public MongoUserRepository(IMongoDatabase db)
    {
        _collection = db.GetCollection<User>("users");

        // Índice único em Email
        var emailIndex = new CreateIndexModel<User>(
            Builders<User>.IndexKeys.Ascending(u => u.Email),
            new CreateIndexOptions { Unique = true });
        _collection.Indexes.CreateOne(emailIndex);
    }

    public async Task<User?> GetByEmailAsync(string email)
        => await _collection.Find(u => u.Email == email).FirstOrDefaultAsync();

    public async Task<User?> GetByIdAsync(string id)
        => await _collection.Find(u => u.Id == id).FirstOrDefaultAsync();

    public async Task<User> CreateAsync(User user)
    {
        if (string.IsNullOrWhiteSpace(user.Id))
            user.Id = ObjectId.GenerateNewId().ToString();

        await _collection.InsertOneAsync(user);
        return user;
    }
}