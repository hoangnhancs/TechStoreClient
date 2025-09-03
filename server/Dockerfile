# ------------ Build Stage ------------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /source

# Sao chép các file .csproj và restore dependencies trước
# Điều này tận dụng Docker cache. Nếu các file .csproj không đổi, layer này sẽ được dùng lại.
COPY ./*.sln .
COPY ./API/*.csproj ./API/
COPY ./Application/*.csproj ./Application/
COPY ./Domain/*.csproj ./Domain/
COPY ./Infrastructure/*.csproj ./Infrastructure/
COPY ./Persistence/*.csproj ./Persistence/

RUN dotnet restore "./API/API.csproj"

# Sao chép toàn bộ source code còn lại
COPY . .

# Publish ứng dụng, tạo ra output sẵn sàng để chạy
RUN dotnet publish "./API/API.csproj" -c Release -o /app/publish --no-restore

# ------------ Runtime Stage ------------
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    ln -s /usr/bin/python3 /usr/bin/python

COPY ./ApplicationPythonScripts/requirements.txt .
RUN pip3 install -r requirements.txt

COPY --from=build /app/publish .

# Entrypoint để chạy ứng dụng
ENTRYPOINT ["dotnet", "API.dll"]
