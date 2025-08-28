using KitBox.Domain;
using MediatR;

namespace KitBox.Application.Features.Products;

public sealed record GetProductByIdQuery(string Id) : IRequest<Product?>;

public sealed class GetProductByIdHandler(IProductRepository repo) : IRequestHandler<GetProductByIdQuery, Product?>
{
    public Task<Product?> Handle(GetProductByIdQuery req, CancellationToken ct)
        => repo.GetByIdAsync(req.Id, ct);
}
