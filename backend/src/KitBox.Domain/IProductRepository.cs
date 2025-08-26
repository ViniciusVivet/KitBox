namespace KitBox.Domain;

public record PagedResult<T>(IReadOnlyList<T> Items, long Total, int Page, int PageSize);

public interface IProductRepository
{
    Task<PagedResult<Product>> GetPagedAsync(int page, int pageSize);
    Task<Product?> GetByIdAsync(string id);
    Task<Product> CreateAsync(Product p);
    Task<bool> UpdateAsync(string id, Product update);
    Task<bool> DeleteAsync(string id);
}
