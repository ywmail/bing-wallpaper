const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const schedule = require('node-schedule');

// 获取Bing每日壁纸的URL
async function getBingWallpaperUrl() {
    const response = await axios.get('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1');
    const imageUrl = 'https://www.bing.com' + response.data.images[0].url;
    return imageUrl;
}

// 下载壁纸
async function downloadWallpaper(url, filepath) {
    const response = await axios({
        url,
        responseType: 'stream',
    });
    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

// 设置壁纸
async function setWallpaper(filepath) {
    const script = `
    $path = "${filepath}"
    Add-Type @"
    using System;
    using System.Runtime.InteropServices;
    public class Wallpaper {
        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        public static extern int SystemParametersInfo(int uAction, int uParam, string lpvParam, int fuWinIni);
        public static void SetWallpaper(string path) {
            SystemParametersInfo(0x0014, 0, path, 0x0001 | 0x0002);
        }
    }
    "@
    [Wallpaper]::SetWallpaper($path)
    `;
    exec(`powershell -command "${script}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error setting wallpaper: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`PowerShell error: ${stderr}`);
            return;
        }
        console.log('Wallpaper updated successfully!');
    });
}

// 主函数
async function updateWallpaper() {
    try {
        const url = await getBingWallpaperUrl();
        const filepath = path.join(__dirname, 'bing_wallpaper.jpg');
        await downloadWallpaper(url, filepath);
        await setWallpaper(filepath);
    } catch (error) {
        console.error('Failed to update wallpaper:', error);
    }
}

// 定时任务，每两个小时更新一次壁纸
schedule.scheduleJob('0 */2 * * *', () => {
    updateWallpaper();
});

// 立即更新一次壁纸
updateWallpaper();