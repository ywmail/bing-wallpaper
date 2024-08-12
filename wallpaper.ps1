# Define the paths to the wallpapers for each monitor
$wallpapers = @("C:\Path\To\Wallpaper1.jpg", "C:\Path\To\Wallpaper2.jpg")

# Get the list of all connected monitors
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class MonitorHelper {
    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    public static extern bool EnumDisplayMonitors(IntPtr hdc, IntPtr lprcClip, MonitorEnumProc lpfnEnum, IntPtr dwData);

    public delegate bool MonitorEnumProc(IntPtr hMonitor, IntPtr hdcMonitor, ref Rect lprcMonitor, IntPtr dwData);

    [StructLayout(LayoutKind.Sequential)]
    public struct Rect {
        public int left;
        public int top;
        public int right;
        public int bottom;
    }
}
"@

$monitors = @()
[MonitorHelper+MonitorEnumProc]$callback = {
    param (
        [IntPtr]$hMonitor,
        [IntPtr]$hdcMonitor,
        [ref] [MonitorHelper+Rect]$lprcMonitor,
        [IntPtr]$dwData
    )
    $monitors += $hMonitor
    return $true
}

[MonitorHelper]::EnumDisplayMonitors([IntPtr]::Zero, [IntPtr]::Zero, $callback, [IntPtr]::Zero) | Out-Null

# Set the wallpaper for each monitor
for ($i = 0; $i -lt $monitors.Length; $i++) {
    $monitor = $monitors[$i]
    $wallpaper = $wallpapers[$i % $wallpapers.Length]
    RUNDLL32.EXE user32.dll,UpdatePerUserSystemParameters ,1 ,True
    Add-Type -TypeDefinition @"
    using System;
    using System.Runtime.InteropServices;
    public class Wallpaper {
        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        public static extern int SystemParametersInfo(int uAction, int uParam, string lpvParam, int fuWinIni);
    }
    "@
    [Wallpaper]::SystemParametersInfo(0x0014, 0, $wallpaper, 0x0001)
}