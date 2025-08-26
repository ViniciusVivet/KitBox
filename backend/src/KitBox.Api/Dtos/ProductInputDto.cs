﻿namespace KitBox.Api.Dtos;

public class ProductInputDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}
