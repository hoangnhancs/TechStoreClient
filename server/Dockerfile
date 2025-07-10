# ------------ Build Stage ------------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
COPY API/appsettings.json /app/appsettings.json
COPY API/appsettings.Development.json /app/appsettings.Development.json
COPY API/appsettings.Production.json /app/appsettings.Production.json

# ❗ FIX: dùng đúng tên thư mục có chữ hoa
WORKDIR /src/API
RUN dotnet restore "API.csproj"
RUN dotnet publish "API.csproj" -c Release -o /app/publish

# ------------ Runtime Stage ------------
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "API.dll"]
