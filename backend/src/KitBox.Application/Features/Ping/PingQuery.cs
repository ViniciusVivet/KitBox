using MediatR;

namespace KitBox.Application.Features.Ping;

public sealed record PingQuery(string Message) : IRequest<string>;