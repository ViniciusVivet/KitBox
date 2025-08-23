using FluentValidation;
using KitBox.Api.Dtos;

namespace KitBox.Api.Validation;

public class ProductInputValidator : AbstractValidator<ProductInputDto>
{
    public ProductInputValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Category).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Description).MaximumLength(2000);
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Quantity).GreaterThanOrEqualTo(0);
    }
}
