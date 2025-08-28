using FluentValidation;

namespace KitBox.Application.Features.Ping;

public sealed class PingValidator : AbstractValidator<PingQuery>
{
    public PingValidator()
    {
        RuleFor(x => x.Message).NotEmpty().MaximumLength(100);
    }
}