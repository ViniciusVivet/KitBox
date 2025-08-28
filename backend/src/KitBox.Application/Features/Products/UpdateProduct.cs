using KitBox.Domain;
using MediatR;

namespace KitBox.Application.Features.Products;

public sealed record UpdateProductCommand(
    string Id,
    string Name,
    string? Description,
    string Category,
    decimal Price,
    int Quantity
) : IRequest<bool>;

public sealed class UpdateProductHandler(IProductRepository repo) : IRequestHandler<UpdateProductCommand, bool>
{
    public async Task<bool> Handle(UpdateProductCommand req, CancellationToken ct)
    {
        var entity = new Product
        {
            Id          = req.Id,
            Name        = req.Name,
            Description = req.Description ?? string.Empty,
            Category    = req.Category,
            Price       = req.Price,
            Quantity    = req.Quantity
        };
        return await repo.UpdateAsync(entity, ct);
    }
}

