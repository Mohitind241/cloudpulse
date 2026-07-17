# ── Stage 1: Build ──────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy project file and restore dependencies (layer caching)
COPY *.csproj ./
RUN dotnet restore

# Copy all source files and publish
COPY . ./
RUN dotnet publish -c Release -o /app/publish --no-restore

# ── Stage 2: Runtime ─────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Create non-root user for security
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

# Copy published output from build stage
COPY --from=build --chown=appuser:appgroup /app/publish .

# Expose HTTP port
EXPOSE 80
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "CloudPulse.dll"]
