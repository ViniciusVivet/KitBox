namespace KitBox.Infrastructure;

public class MongoSettings
{
    // Lerei do ambiente: MONGO_URI e MONGO_DATABASE
    public string ConnectionString { get; init; } = string.Empty;
    public string Database { get; init; } = string.Empty;
}
