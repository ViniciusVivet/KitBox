using KitBox.Domain;
using MediatR;

namespace KitBox.Application.Features.Products;

public sealed record ListProductsQuery(
    string? Name,
    string? Category,
    decimal? MinPrice,
    decimal? MaxPrice,
    int Page = 1,
    int PageSize = 20,
    string? SortBy = "createdAtUtc",
    string? SortDir = "desc"
) : IRequest<PagedResult<Product>>;

public sealed class ListProductsHandler(IProductRepository repo)
    : IRequestHandler<ListProductsQuery, PagedResult<Product>>
{
    public async Task<PagedResult<Product>> Handle(ListProductsQuery q, CancellationToken ct)
    {
        var page     = (q.Page     <= 0) ? 1  : q.Page;
        var pageSize = (q.PageSize <= 0) ? 20 : q.PageSize;
        var skip     = (page - 1) * pageSize;

        var sortBy  = string.IsNullOrWhiteSpace(q.SortBy)  ? "createdAtUtc" : q.SortBy!;
        var sortDir = string.IsNullOrWhiteSpace(q.SortDir) ? "desc"         : q.SortDir!;

        var items = await repo.SearchAsync(
            q.Name,
            q.Category,
            skip,
            pageSize,
            sortBy,
            sortDir,
            ct);

        var total = await repo.CountAsync(q.Name, q.Category, ct);

        return new PagedResult<Product>(items, total, page, pageSize);
    }
}