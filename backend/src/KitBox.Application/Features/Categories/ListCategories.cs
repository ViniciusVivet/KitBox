using KitBox.Domain;
using MediatR;

namespace KitBox.Application.Features.Categories;

public sealed record ListCategoriesQuery(
    string? Name,
    int Page = 1,
    int PageSize = 20,
    string? SortBy = "createdAtUtc",
    string? SortDir = "desc"
) : IRequest<PagedResult<Category>>;

public sealed class ListCategoriesHandler(ICategoryRepository repo)
    : IRequestHandler<ListCategoriesQuery, PagedResult<Category>>
{
    public async Task<PagedResult<Category>> Handle(ListCategoriesQuery q, CancellationToken ct)
    {
        var page     = q.Page <= 0 ? 1  : q.Page;
        var pageSize = q.PageSize <= 0 ? 20 : q.PageSize;
        var skip     = (page - 1) * pageSize;

        var sortBy  = string.IsNullOrWhiteSpace(q.SortBy)  ? "createdAtUtc" : q.SortBy!;
        var sortDir = string.IsNullOrWhiteSpace(q.SortDir) ? "desc"         : q.SortDir!;

        var items = await repo.SearchAsync(q.Name, skip, pageSize, sortBy, sortDir, ct);
        var total = await repo.CountAsync(q.Name, ct);

        return new PagedResult<Category>(items, total, page, pageSize);
    }
}
