using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using KitBox.Api.Services;
using KitBox.Domain;

namespace KitBox.Api.Seeding
{
    public class SeedRunner : IHostedService
    {
        private readonly ILogger<SeedRunner> _logger;
        private readonly IConfiguration _config;
        private readonly IServiceScopeFactory _scopeFactory;

        public SeedRunner(ILogger<SeedRunner> logger, IConfiguration config, IServiceScopeFactory scopeFactory)
        {
            _logger = logger;
            _config = config;
            _scopeFactory = scopeFactory;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            if (!_config.GetValue<bool>("Seed:Enabled"))
            {
                _logger.LogInformation("Seed desativado.");
                return;
            }

            _logger.LogInformation("== Iniciando Seed ==");

            using var scope = _scopeFactory.CreateScope();
            var users  = scope.ServiceProvider.GetRequiredService<IUserRepository>();
            var cats   = scope.ServiceProvider.GetRequiredService<ICategoryRepository>();
            var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

            // Índice único de e-mail (users) se a infra implementar isso
            try { await users.EnsureUniqueEmailIndexAsync(); }
            catch (Exception ex)
            {
                _logger.LogWarning("Não foi possível garantir índice único de e-mail (ok em dev): {msg}", ex.Message);
            }

            // Admin
            var adminEmail = _config["Seed:Admin:Email"] ?? "admin@kitbox.local";
            var adminPass  = _config["Seed:Admin:Password"] ?? "ChangeMe123!";

            var existing = await users.FindByEmailAsync(adminEmail);
            if (existing is null)
            {
                await users.CreateAsync(new User
                {
                    Email = adminEmail,
                    PasswordHash = hasher.Hash(adminPass),
                    Role = "Admin"
                });
                _logger.LogInformation("Usuário admin criado: {email}", adminEmail);
            }
            else
            {
                // Garante hash BCrypt + role Admin
                var precisaRehash = !(existing.PasswordHash?.StartsWith("$2") == true);
                var precisaRole   = existing.Role != "Admin";
                if (precisaRehash || precisaRole)
                {
                    await users.UpdatePasswordAndRoleAsync(adminEmail, hasher.Hash(adminPass), "Admin");
                    _logger.LogInformation("Usuário admin ajustado (hash/role) para {email}", adminEmail);
                }
                else
                {
                    _logger.LogInformation("Usuário admin já ok.");
                }
            }

            // Categorias "idempotentes por tentativa": cria e, se já existir, registra aviso e segue.
            var defaults = _config.GetSection("Seed:Categories").Get<string[]>() ?? new[] { "Anéis", "Colares", "Brincos" };
            foreach (var name in defaults)
            {
                try
                {
                    await cats.CreateAsync(new Category { Name = name, Description = "Seed" });
                    _logger.LogInformation("Categoria criada: {name}", name);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning("Categoria '{name}' não criada (possivelmente já existe): {msg}", name, ex.Message);
                }
            }

            _logger.LogInformation("== Seed finalizado ==");
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
