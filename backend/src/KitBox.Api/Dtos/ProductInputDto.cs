namespace KitBox.Api.Dtos;

public record ProductInputDto(
    string Name,
    string? Description,
    string Category,
    decimal Price,
    int Quantity
);
