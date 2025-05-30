// Configuration for Bing Wallpaper
module.exports = {
    // Bing wallpaper API URL
    bingApiUrl: 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=ja-JP',
    
    // Base URL for Bing images
    bingBaseUrl: 'https://www.bing.com',
    
    // Wallpaper download directory
    downloadDir: 'download',
    
    // Wallpaper filename
    wallpaperFilename: 'bing_wallpaper.jpg',
    
    // Update schedule (cron format)
    // Default: every 2 hours
    updateSchedule: '0 */2 * * *',
    
    // Maximum retry attempts
    maxRetries: 3,
    
    // Retry delay in milliseconds
    retryDelay: 5000
};
