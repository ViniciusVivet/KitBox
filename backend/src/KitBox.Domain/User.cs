namespace KitBox.Domain
{
    public class User
    {
        public string Id { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string PasswordHash { get; set; } = default!;
        public string Role { get; set; } = "User";
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
