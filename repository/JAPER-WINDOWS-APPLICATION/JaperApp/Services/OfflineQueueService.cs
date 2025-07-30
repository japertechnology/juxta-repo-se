using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using LiteDB;
using Windows.Networking.Connectivity;
using JaperApp.Resources;

namespace JaperApp.Services
{
    /// <summary>
    /// Persists network messages when offline and flushes them when connectivity returns.
    /// </summary>
    public class OfflineQueueService : IDisposable
    {
        private readonly LiteDatabase _db;
        private readonly ILiteCollection<QueuedMessage> _collection;
        private readonly HttpClient _http = new();
        private readonly NetworkStatusChangedEventHandler _handler;
        private bool _isFlushing;

        public OfflineQueueService(string dbPath)
        {
            _db = new LiteDatabase(dbPath);
            _collection = _db.GetCollection<QueuedMessage>("offlineQueue");
            _handler = async (_) => await OnNetworkChangeAsync();
            NetworkInformation.NetworkStatusChanged += _handler;
        }

        public void Enqueue(string uri, string payload, bool isWebSocket)
        {
            _collection.Insert(new QueuedMessage
            {
                Uri = uri,
                Payload = payload,
                IsWebSocket = isWebSocket
            });
        }

        private async Task OnNetworkChangeAsync()
        {
            var profile = NetworkInformation.GetInternetConnectionProfile();
            if (profile != null &&
                profile.GetNetworkConnectivityLevel() == NetworkConnectivityLevel.InternetAccess)
            {
                await FlushAsync();
            }
        }

        public async Task FlushAsync()
        {
            if (_isFlushing) return;
            _isFlushing = true;
            try
            {
                var messages = _collection.FindAll().ToList();
                foreach (var msg in messages)
                {
                    bool success = false;
                    string detail = string.Empty;
                    try
                    {
                        if (msg.IsWebSocket)
                        {
                            using var ws = new ClientWebSocket();
                            await ws.ConnectAsync(new Uri(msg.Uri), CancellationToken.None);
                            var data = Encoding.UTF8.GetBytes(msg.Payload);
                            await ws.SendAsync(data, WebSocketMessageType.Text, true, CancellationToken.None);
                            await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
                            success = true;
                        }
                        else
                        {
                            var content = new StringContent(msg.Payload);
                            var response = await _http.PostAsync(msg.Uri, content);
                            success = response.IsSuccessStatusCode;
                            if (!success)
                                detail = response.StatusCode.ToString();
                        }
                    }
                    catch (Exception ex)
                    {
                        success = false;
                        detail = ex.Message;
                    }

                    if (!success && !string.IsNullOrEmpty(detail))
                    {
                        ErrorService.ShowStatus(Resources.Strings.WebhookError(detail));
                    }

                    if (success)
                    {
                        _collection.Delete(msg.Id);
                    }
                    else
                    {
                        // Stop processing if a message fails to send.
                        break;
                    }
                }
            }
            finally
            {
                _isFlushing = false;
            }
        }

        public void Dispose()
        {
            NetworkInformation.NetworkStatusChanged -= _handler;
            _db.Dispose();
            _http.Dispose();
        }

        private class QueuedMessage
        {
            public int Id { get; set; }
            public string Uri { get; set; } = string.Empty;
            public string Payload { get; set; } = string.Empty;
            public bool IsWebSocket { get; set; }
        }
    }
}
