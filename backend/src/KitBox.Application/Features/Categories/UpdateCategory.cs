using KitBox.Domain;
using MediatR;

namespace KitBox.Application.Features.Categories;

public sealed record UpdateCategoryCommand(string Id, string Name, string? Description) : IRequest<bool>;

public sealed class UpdateCategoryHandler(ICategoryRepository repo) : IRequestHandler<UpdateCategoryCommand, bool>
{
    public Task<bool> Handle(UpdateCategoryCommand req, CancellationToken ct)
        => repo.UpdateAsync(new Category {
            Id = req.Id,
            Name = req.Name,
            Description = req.Description ?? string.Empty
        }, ct);
}
