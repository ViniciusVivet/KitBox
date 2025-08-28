using KitBox.Domain;
using MediatR;

namespace KitBox.Application.Features.Categories;

public sealed record DeleteCategoryCommand(string Id) : IRequest<bool>;

public sealed class DeleteCategoryHandler(ICategoryRepository repo) : IRequestHandler<DeleteCategoryCommand, bool>
{
    public Task<bool> Handle(DeleteCategoryCommand req, CancellationToken ct)
        => repo.DeleteAsync(req.Id, ct);
}
