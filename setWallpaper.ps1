param (
    [string]$wallpaper
)

# Function to set the wallpaper
function Set-Wallpaper {
    param (
        [string]$path
    )
    Add-Type -TypeDefinition @"
    using System;
    using System.Runtime.InteropServices;
    public class Wallpaper {
        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        public static extern int SystemParametersInfo(int uAction, int uParam, string lpvParam, int fuWinIni);
    }
"@
    [Wallpaper]::SystemParametersInfo(0x0014, 0, $path, 0x0001)
}

# Set the wallpaper
Set-Wallpaper -path $wallpaper

# Force the system to refresh the wallpaper settings
RUNDLL32.EXE user32.dll,UpdatePerUserSystemParameters ,1 ,True