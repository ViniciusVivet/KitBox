using KitBox.Domain;
using MediatR;

namespace KitBox.Application.Features.Products;

public sealed record CreateProductCommand(
    string Name,
    string? Description,
    string Category,
    decimal Price,
    int Quantity
) : IRequest<Product>;

public sealed class CreateProductHandler(IProductRepository repo) : IRequestHandler<CreateProductCommand, Product>
{
    public async Task<Product> Handle(CreateProductCommand req, CancellationToken ct)
    {
        var entity = new Product
        {
            Name        = req.Name,
            Description = req.Description ?? string.Empty,
            Category    = req.Category,
            Price       = req.Price,
            Quantity    = req.Quantity
        };
        return await repo.CreateAsync(entity, ct);
    }
}

