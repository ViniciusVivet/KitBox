using KitBox.Domain;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;

namespace KitBox.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        // Eu leio do ambiente para não depender de appsettings no repositório público
        var conn = config["MONGO_URI"] ?? "mongodb://localhost:27017";
        var dbName = config["MONGO_DATABASE"] ?? "KitBoxDB";

        services.AddSingleton(new MongoSettings { ConnectionString = conn, Database = dbName });
        services.AddSingleton<IMongoClient>(_ => new MongoClient(conn));
        services.AddSingleton(sp =>
        {
            var settings = sp.GetRequiredService<MongoSettings>();
            var client = sp.GetRequiredService<IMongoClient>();
            return client.GetDatabase(settings.Database);
        });

        services.AddSingleton<IProductRepository, MongoProductRepository>();

        return services;
    }
}
