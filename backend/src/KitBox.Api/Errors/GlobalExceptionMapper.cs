using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace KitBox.Api.Errors;

public static class GlobalExceptionMapper
{
    public static IEndpointRouteBuilder MapGlobalErrorEndpoint(this IEndpointRouteBuilder app)
    {
        app.Map("/error", async (HttpContext ctx) =>
        {
            var ex = ctx.Features.Get<IExceptionHandlerFeature>()?.Error;

            var problem = ex switch
            {
                UnauthorizedAccessException => new ProblemDetails
                {
                    Title  = "Unauthorized",
                    Status = StatusCodes.Status401Unauthorized,
                    Detail = ex!.Message
                },
                ArgumentException => new ProblemDetails
                {
                    Title  = "Bad request",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = ex!.Message
                },
                _ => new ProblemDetails
                {
                    Title  = "Unexpected error",
                    Status = StatusCodes.Status500InternalServerError,
                    Detail = ex?.Message
                }
            };

            problem.Instance = ctx.Request.Path;
            problem.Extensions["traceId"] = ctx.TraceIdentifier;

            await Results.Problem(problem).ExecuteAsync(ctx);
        })
        .AllowAnonymous();

        return app;
    }
}