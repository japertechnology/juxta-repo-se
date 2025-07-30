param(
    [string]$Configuration = "Release",
    [string]$Platform = "x64"
)

Write-Host "Restoring packages"
dotnet restore

try {
    Write-Host "Building MSIX package"
    dotnet msbuild "JaperApp.Package/JaperApp.Package.wapproj" /p:Configuration=$Configuration /p:Platform=$Platform
} catch {
    Write-Warning "MSIX packaging failed. Generating self-contained installer instead."
    dotnet publish "JaperApp/JaperApp.csproj" -c $Configuration -r win-$Platform --self-contained -p:PublishSingleFile=true
}
