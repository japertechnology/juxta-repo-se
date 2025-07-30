# JAPER Windows Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) ![AI](https://img.shields.io/badge/Assisted-Development-2b2bff?logo=openai&logoColor=white) 

This repository contains the JAPER Windows Application.

## Building

The project requires the Windows App SDK and .NET 8. To build on Windows, open a Developer Command Prompt and run:

```bash
dotnet restore
msbuild JaperWindowsApplication.sln
```

### Packaging

To create an **MSIX** package on Windows run:

```powershell
./build.ps1
```

If MSIX packaging fails (for example on non‑Windows hosts) the script falls back
to producing a self‑contained executable installer.

The included solution contains a `JaperApp` project that demonstrates a minimal WinUI 3 application.

## Scanning pipeline

Frames are captured using a `DispatcherQueueTimer` to maintain roughly **15 FPS**.
Decoding runs on a thread‑pool task and the service automatically steps through
a resolution ladder when scans fail. Successful decodes reset the resolution to
the lowest entry. Duplicate results are ignored for a short cooldown period so
outputs aren’t spammed.

## Development environment

This repository includes a `global.json` file that locks the .NET SDK version to **8.0.100**. Using the matching SDK ensures the project restores and builds consistently.

A basic `.editorconfig` is also provided to maintain consistent coding style across editors.

Continuous integration is configured via GitHub Actions to build and test the solution on every push and pull request. The workflow runs on `windows-latest` and invokes `dotnet restore`, `msbuild` and `dotnet test`.

## Running tests

Unit tests are implemented using **xUnit** under the `JaperApp.Tests` project. Execute them locally with:

```bash
dotnet test JaperWindowsApplication.sln
```

Building and running the tests requires Windows because the application targets WinUI.

Additional manual testing steps for measuring performance and accessibility are provided in [TESTING_GUIDE.md](TESTING_GUIDE.md).

## Developing with Visual Studio Code

The easiest way to contribute is to use Visual Studio Code on Windows.

1. [Install Visual Studio Code](https://code.visualstudio.com/).
2. Install the [.NET&nbsp;8 SDK](https://dotnet.microsoft.com/download) and the [Windows App SDK](https://learn.microsoft.com/windows/apps/windows-app-sdk/).
3. Clone this repository and open the folder in VS Code (`File` → `Open Folder…`).
4. When prompted, install the **C#** extension (or **C# Dev Kit**) so VS Code can build and debug.
5. Restore packages from the integrated terminal:

   ```bash
   dotnet restore
   ```

6. Press `F5` to build and launch the `JaperApp` project.
7. Run the unit tests from the Test Explorer or with:

   ```bash
   dotnet test JaperWindowsApplication.sln
   ```

![JAPER](https://github.com/japertechnology/DEVELOPER-JAPER-IO/blob/df569f40620c4f737ecd81938f2bcf0df4760f3b/asset/images/JAPER-White.png)
