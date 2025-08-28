using KitBox.Domain;
using MediatR;

namespace KitBox.Application.Features.Categories;

public sealed record GetCategoryByIdQuery(string Id) : IRequest<Category?>;

public sealed class GetCategoryByIdHandler(ICategoryRepository repo) : IRequestHandler<GetCategoryByIdQuery, Category?>
{
    public Task<Category?> Handle(GetCategoryByIdQuery req, CancellationToken ct)
        => repo.GetByIdAsync(req.Id, ct);
}
