namespace KitBox.Domain;

public interface IProductRepository
{
    Task<Product?> GetByIdAsync(string id, CancellationToken ct = default);

    Task<IReadOnlyList<Product>> SearchAsync(
        string? name = null,
        string? category = null,
        int skip = 0,
        int take = 20,
        string sortBy = "name",
        string sortDir = "asc",
        CancellationToken ct = default
    );

    // total com os mesmos filtros
    Task<long> CountAsync(string? name = null, string? category = null, CancellationToken ct = default);

    Task<Product> CreateAsync(Product product, CancellationToken ct = default);
    Task<bool> UpdateAsync(Product product, CancellationToken ct = default);
    Task<bool> DeleteAsync(string id, CancellationToken ct = default);
}
