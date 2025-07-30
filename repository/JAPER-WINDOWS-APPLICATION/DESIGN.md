# Design – Windows Desktop Edition

### Rule ZEROs

* Never create any media files; if an media is needed, emit an `{name}.{type}.json` file that describes the requirements for a human to supply.

---

## 1) Purpose

This will be the first of many advanced barcode tools to be incorporated into this single Windows Application.

A Windows app that turns any available **USB/UVC** or built‑in camera into a **fast barcode scanner** and **rebroadcasts** each successful read to chosen outputs (clipboard, focused‑field injection, WebSocket/HTTP endpoints, on‑device log). Processing is always local unless the user enables a network output.

---

## 2) Constraints of a native desktop app

| Topic                | Windows adaptation                                                                                         |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Deployment**       | Bundle as an **MSIX** (preferred) or self‑contained installer (.exe). No admin rights required.            |
| **Security context** | Runs in the user session; camera use triggers the standard **Windows privacy consent toast** on first run. |
| **No web‑server**    | All logic in the executable; network outputs use WinHTTP/WinSock.                                          |
| **TLS**              | For HTTP/WS outputs, default to TLS 1.2+. Honour system proxy and certificate store.                       |
| **CORS**             | Not relevant. Document that back‑end endpoints must simply accept the connection.                          |
| **Auto‑update**      | Optional: integrate MSIX auto‑update or in‑app updater hitting a signed update feed.                       |

---

## 3) Detection engines

* **Preferred:** **Windows.Devices.PointOfService BarcodeScanner** (fast, leverages hardware decoders if present).
  *Marks section as “Native Engine” in UI.*
* **Fallback:** Pure‑CPU libraries (e.g., **ZXing‑Net**, **Dynamsoft**, **OpenCV + ZBar**).
* **Engine indicator** in the status bar shows which path is active.

---

## 4) Supported symbologies (user‑toggleable)
Unchanged: **QR Code, Code 128, Code 39, EAN‑13/UPC‑A, EAN‑8, ITF, Data Matrix, PDF417.**

---

## 5) Camera & preview

| Feature            | Windows APIs / notes                                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Device enumeration | `MediaCapture::FindAllVideoDevicesAsync` or `DeviceInformation.FindAllAsync(DeviceClass.VideoCapture)`. Remember last `DeviceId`. |
| Preview            | **SwapChainPanel** (WinUI 3) or `CaptureElement`. Mirror toggle via negative `ScaleX`.                                            |
| Resolution presets | Query `VideoDeviceController.GetAvailableMediaStreamProperties`.                                                                  |
| Torch              | `VideoDeviceController.TorchControl`; if unsupported, grey out control.                                                           |
| Stream loss        | Handle `MediaCaptureFailed` & device‑removed events; surface a “Reconnect” action.                                                |

---

## 6) Region‑of‑interest (ROI) scanning
Same behaviour; ROI percentages translate to pixel rectangles before handing a frame to the decoder. Heavy processing offloaded to a background thread or a **WinRT `DispatcherQueueController`** to keep UI responsive.

---

## 7) Performance policy

* **Target ≈ 15 FPS** using `CompositionTarget.Rendering` timing or a `DispatcherTimer`.
* Thread pool or **C++/WinRT concurrency** for decoding.
* Dynamic resolution ladder identical to web spec.
* Duplicate suppression & cool‑downs identical.

---

## 8) Outputs (“repeater” behaviours)

| Output                      | Windows implementation                                                                                                                       |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Clipboard**               | `Windows.ApplicationModel.DataTransfer.Clipboard.SetContent` (UWP) or `SetClipboardData` (Win32).                                            |
| **Focused‑field injection** | Use `SendInput` or UI Automation’s `ValuePattern.SetValue`; requires foreground window & may be blocked by elevated apps (document caveats). |
| **WebSocket**               | `System.Net.WebSockets.ClientWebSocket`.                                                                                                     |
| **HTTP webhook(s)**         | `HttpClient` with async/await and TLS validation.                                                                                            |
| **Local session log**       | In‑memory collection + **SQLite** or **LiteDB** stored in `%LocalAppData%\Company\Product\logs.db`.                                          |
| **Feedback**                | Toast notification via **Windows Notifications**, `MessageBeep`, `SpeechSynthesizer`, `VibrationDevice` (Surface devices).                   |

---

## 9) Accessibility & theming

* **WinUI 3 / WPF Themes:** Light, Dark, High‑contrast; respect system theme by default.
* **Narrator & UIA:** Use **UI Automation** properties; live results announced via `AutomationPeer.RaiseAutomationEvent`.
* All controls keyboard‑navigable; focus visuals follow Windows guidelines.

---

## 10) Offline‑first
Not applicable; the binary is local. Network outputs queue to SQLite when offline and flush when connectivity resumes (network‑change events via **NetworkInformation.NetworkStatusChanged**).

---

## 11) Privacy & security

* **Local‑first default** remains.
* First‑run dialog explains camera usage and local processing.
* Settings allow opting‑out of telemetry (counts/timings only).
* **App‑container** (if MSIX/UWP) locks down file‑system; otherwise store data under `%LocalAppData%`.

---

## 12) Settings to persist

Same list; store as `settings.json` in `%LocalAppData%\Company\Product\` or via `ApplicationData.Current.LocalSettings`.

---

## 13) Error states & messages

| Condition                | Windows‑specific message                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| Camera permission denied | “Camera access is off in Windows privacy settings → Settings > Privacy > Camera.”          |
| No detection engine      | “No compatible decoder found. Install Windows 22H2 or enable Fallback Engine in Settings.” |
| Clipboard blocked        | “Another app is locking the clipboard; retry.”                                             |
| Webhook/WS errors        | Show HTTP status / WebSocket close codes; suggest firewall/proxy checks.                   |

---

## 14) Quality bars / acceptance
Unchanged (first scan ≤ 2 s, median decode latency, accessibility, offline queue flushing, etc.).

