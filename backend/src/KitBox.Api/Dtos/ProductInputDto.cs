namespace KitBox.Api.Dtos;

public sealed record ProductInputDto(
    string Name,
    string? Description,
    string Category,
    decimal Price,
    int Quantity
);