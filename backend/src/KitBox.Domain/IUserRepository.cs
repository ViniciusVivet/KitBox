using System.Threading.Tasks;

namespace KitBox.Domain
{
    public interface IUserRepository
    {
        Task<User?> FindByEmailAsync(string email);
        Task CreateAsync(User user);
        Task EnsureUniqueEmailIndexAsync();
        Task UpdatePasswordAndRoleAsync(string email, string passwordHash, string role);
    }
}
