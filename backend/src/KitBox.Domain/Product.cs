namespace KitBox.Domain;

public class Product
{
    // Id como string para mapear ObjectId com mais flexibilidade
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;        // eu prefiro não anulável + string.Empty
    public string Description { get; set; } = string.Empty; // evita warnings de null e deixa o modelo previsível
    public string Category { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
