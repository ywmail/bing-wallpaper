// Configuration for Bing Wallpaper (via Peapix API)
module.exports = {
    // Peapix API URL (alternative Bing wallpaper provider)
    wallpaperApiUrl: 'https://peapix.com/bing/feed?country=jp&n=1',
    
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
