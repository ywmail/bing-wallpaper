const axios = require('axios');
const fs = require('fs');

const { execFile } = require('child_process');
const path = require('path');
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

    // Define the path to the PowerShell script
    const psScriptPath = path.join(__dirname, 'setWallpaper.ps1');

    // Define the path to the wallpaper image
    const wallpaperPath = path.join(__dirname, 'download/bing_wallpaper.jpg');

    // Execute the PowerShell script with the wallpaper path as an argument


    execFile('powershell.exe', ['-File', psScriptPath, wallpaperPath], (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`Stdout: ${stdout}`);
    });

}

// 主函数
async function updateWallpaper() {
    try {
        const url = await getBingWallpaperUrl();
        const filepath = path.join(__dirname, 'download/bing_wallpaper.jpg');
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