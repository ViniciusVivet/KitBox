namespace KitBox.Domain;

public interface ICategoryRepository
{
    Task<Category?> GetByIdAsync(string id, CancellationToken ct = default);
    Task<Category>  CreateAsync(Category c, CancellationToken ct = default);
    Task<bool>      UpdateAsync(Category c, CancellationToken ct = default);
    Task<bool>      DeleteAsync(string id, CancellationToken ct = default);

    Task<IReadOnlyList<Category>> SearchAsync(string? name, int skip, int take, string sortBy, string sortDir, CancellationToken ct = default);
    Task<long> CountAsync(string? name, CancellationToken ct = default);
}