using KitBox.Domain;
using MediatR;

namespace KitBox.Application.Features.Categories;

public sealed record CreateCategoryCommand(string Name, string? Description) : IRequest<Category>;

public sealed class CreateCategoryHandler(ICategoryRepository repo) : IRequestHandler<CreateCategoryCommand, Category>
{
    public Task<Category> Handle(CreateCategoryCommand req, CancellationToken ct)
        => repo.CreateAsync(new Category {
            Name = req.Name,
            Description = req.Description ?? string.Empty
        }, ct);
}
