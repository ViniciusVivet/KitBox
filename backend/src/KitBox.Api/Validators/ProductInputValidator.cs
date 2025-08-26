using FluentValidation;
using KitBox.Api.Dtos;

namespace KitBox.Api.Validators;

public class ProductInputValidator : AbstractValidator<ProductInputDto>
{
    public ProductInputValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MinimumLength(2).MaximumLength(100);
        RuleFor(x => x.Description).NotEmpty().MinimumLength(2).MaximumLength(500);
        RuleFor(x => x.Category).NotEmpty().MinimumLength(2).MaximumLength(100);
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Quantity).GreaterThanOrEqualTo(0);
    }
}
