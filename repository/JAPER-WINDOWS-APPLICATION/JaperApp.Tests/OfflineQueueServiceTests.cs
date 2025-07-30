using System;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using JaperApp.Services;

namespace JaperApp.Tests;

public class OfflineQueueServiceTests
{
    [Fact]
    public async Task FlushAsync_SendsQueuedMessages()
    {
        string tempPath = System.IO.Path.Combine(System.IO.Path.GetTempPath(), Guid.NewGuid().ToString()+".db");
        using var service = new OfflineQueueService(tempPath);

        int port = GetFreePort();
        string url = $"http://localhost:{port}/";
        using var listener = new HttpListener();
        listener.Prefixes.Add(url);
        listener.Start();

        service.Enqueue(url, "payload", isWebSocket: false);
        var flushTask = service.FlushAsync();

        var context = await listener.GetContextAsync();
        string body;
        using(var reader = new System.IO.StreamReader(context.Request.InputStream, context.Request.ContentEncoding))
        {
            body = await reader.ReadToEndAsync();
        }
        context.Response.StatusCode = 200;
        context.Response.Close();
        await flushTask;

        Assert.Equal("payload", body);
        listener.Stop();
    }

    private static int GetFreePort()
    {
        var listener = new System.Net.Sockets.TcpListener(IPAddress.Loopback, 0);
        listener.Start();
        int port = ((IPEndPoint)listener.LocalEndpoint).Port;
        listener.Stop();
        return port;
    }
}
