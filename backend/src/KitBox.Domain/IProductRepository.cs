namespace KitBox.Domain;

public record PagedResult<T>(IReadOnlyList<T> Items, long Total, int Page, int PageSize);

public interface IProductRepository
{
    Task<IReadOnlyList<Product>> SearchAsync(
        string? name,
        string? category,
        int skip,
        int take,
        string sortBy,
        string sortDir,
        CancellationToken ct = default);

    Task<long> CountAsync(
        string? name,
        string? category,
        CancellationToken ct = default);

    Task<Product?> GetByIdAsync(string id, CancellationToken ct = default);
    Task<Product>  CreateAsync(Product p,   CancellationToken ct = default);
    Task<bool>     UpdateAsync(Product p,   CancellationToken ct = default);
    Task<bool>     DeleteAsync(string id,   CancellationToken ct = default);
}
