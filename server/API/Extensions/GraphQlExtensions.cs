using System;
using API.GraphQL.Mutations;
using API.GraphQL.Queries;

namespace API.Extensions;

public static class GraphQlExtensions
{
    public static IServiceCollection AddGraphQlServerConfig(this IServiceCollection services)
    {
        services
            .AddGraphQLServer()
            .AddQueryType(d => d.Name("Query"))
                .AddTypeExtension<BrandQuery>()
            .AddMutationType(d => d.Name("Mutation"))
                .AddTypeExtension<UserActionTrackingMutation>()
            .AddAuthorization()
            .AddFiltering()
            .AddSorting()
            .AddProjections();
        return services;
    }

    public static IEndpointRouteBuilder MapGraphQlEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapGraphQL();
        return app;
    }
}
