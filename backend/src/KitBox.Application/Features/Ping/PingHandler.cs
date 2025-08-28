using MediatR;

namespace KitBox.Application.Features.Ping;

public sealed class PingHandler : IRequestHandler<PingQuery, string>
{
    public Task<string> Handle(PingQuery request, CancellationToken ct)
        => Task.FromResult($"pong: {request.Message}");
}