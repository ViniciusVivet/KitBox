namespace KitBox.Api.Dtos;

public record ProductInputDto(
    string Name,
    string Description,
    string Category,
    decimal Price,
    int Quantity
);

public record ProductOutputDto(
    string Id,
    string Name,
    string Description,
    string Category,
    decimal Price,
    int Quantity,
    DateTime CreatedAtUtc
);
