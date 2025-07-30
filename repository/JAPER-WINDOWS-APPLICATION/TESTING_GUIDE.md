# Manual Testing Guide

This guide describes how to manually measure performance characteristics and verify accessibility of the JAPER Windows application.

## Startup scanning time
1. Build and launch the `JaperApp` project on a Windows machine.
2. Start a stopwatch when the main window appears.
3. Select a camera device from the drop‑down list.
4. Stop the stopwatch when the first video frame appears in the preview.
5. Record the elapsed time as the startup scanning time.

## Median decode latency
1. Run the `MedianDecodeLatency_IsReasonable` test from `JaperApp.Tests` or execute a similar loop manually.
2. The test decodes a QR code ten times and reports the median latency.
3. Review the test output to determine the typical decode time.

## Offline queue flushing
1. Disconnect the network and run the application.
2. Trigger an action that sends telemetry so that the offline queue stores a message.
3. Reconnect the network and wait for the queue to flush.
4. Verify that the message is sent (e.g., by inspecting the receiving server or checking that no items remain in `offlineQueue` within the LiteDB database).

## Accessibility checks
1. Inspect each interactive control in `MainWindow.xaml` and ensure it defines the `AutomationProperties.Name` attribute.
2. Verify that the `ResultText` element sets `AutomationProperties.LiveSetting="Polite"` so that screen readers announce barcode results.
3. Use Windows Narrator or another screen reader to confirm announcements when a barcode is scanned.
