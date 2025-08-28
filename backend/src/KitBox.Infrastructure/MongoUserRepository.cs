using System.Threading.Tasks;
using KitBox.Domain;
using MongoDB.Driver;

namespace KitBox.Infrastructure
{
    public class MongoUserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _users;

        public MongoUserRepository(IMongoDatabase db)
        {
            _users = db.GetCollection<User>("users");
        }

        public async Task<User?> FindByEmailAsync(string email)
        {
            return await _users.Find(x => x.Email == email).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(User user)
        {
            await _users.InsertOneAsync(user);
        }

        public async Task EnsureUniqueEmailIndexAsync()
        {
            var keys = Builders<User>.IndexKeys.Ascending(u => u.Email);
            var opts = new CreateIndexOptions { Unique = true, Name = "uq_users_email" };
            await _users.Indexes.CreateOneAsync(new CreateIndexModel<User>(keys, opts));
        }

        public async Task UpdatePasswordAndRoleAsync(string email, string passwordHash, string role)
        {
            var update = Builders<User>.Update
                .Set(u => u.PasswordHash, passwordHash)
                .Set(u => u.Role, role);
            await _users.UpdateOneAsync(u => u.Email == email, update);
        }
    }
}
