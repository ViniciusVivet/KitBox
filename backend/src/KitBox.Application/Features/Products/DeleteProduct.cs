using KitBox.Domain;
using MediatR;

namespace KitBox.Application.Features.Products;

public sealed record DeleteProductCommand(string Id) : IRequest<bool>;

public sealed class DeleteProductHandler(IProductRepository repo) : IRequestHandler<DeleteProductCommand, bool>
{
    public Task<bool> Handle(DeleteProductCommand req, CancellationToken ct)
        => repo.DeleteAsync(req.Id, ct);
}
