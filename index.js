const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const schedule = require('node-schedule');
const { ProxyAgent } = require('proxy-agent');
const config = require('./config');

const agent = new ProxyAgent();

// Simple logging function
function log(message, isError = false) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    if (isError) {
        console.error(logMessage);
    } else {
        console.log(logMessage);
    }
}

/**
 * Get the URL of today's Bing wallpaper
 * @returns {Promise<string>} The URL of the wallpaper
 */
async function getBingWallpaperUrl() {
    try {
        const response = await axios.get(config.bingApiUrl, {
            httpAgent: agent,
            httpsAgent: agent,
        });

        if (!response.data.images || !response.data.images.length) {
            throw new Error('Invalid response from Bing API');
        }

        const imageUrl = config.bingBaseUrl + response.data.images[0].url;
        log(`Retrieved wallpaper URL: ${imageUrl}`);
        return imageUrl;
    } catch (error) {
        log(`Error retrieving wallpaper URL: ${error.message}`, true);
        throw error;
    }
}

/**
 * Download wallpaper from the given URL and save it to the specified filepath
 * @param {string} url - The URL of the wallpaper
 * @param {string} filepath - The path to save the wallpaper
 * @returns {Promise<void>}
 */
async function downloadWallpaper(url, filepath) {
    try {
        const response = await axios({
            url,
            responseType: 'stream',
            httpAgent: agent,
            httpsAgent: agent,
        });

        // Ensure the directory exists
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        
        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filepath);
            response.data.pipe(writer);
            writer.on('finish', () => {
                log(`Wallpaper downloaded successfully to: ${filepath}`);
                resolve();
            });
            writer.on('error', (err) => {
                log(`Error writing wallpaper to file: ${err.message}`, true);
                reject(err);
            });
        });
    } catch (error) {
        log(`Error downloading wallpaper: ${error.message}`, true);
        throw error;
    }
}

/**
 * Set wallpaper using PowerShell script
 * @param {string} filepath - The path to the wallpaper file
 * @returns {Promise<void>}
 */
async function setWallpaper(filepath) {
    // Define the path to the PowerShell script
    const psScriptPath = path.join(__dirname, 'setWallpaper.ps1');
    
    // Return a promise that resolves when the wallpaper is set
    return new Promise((resolve, reject) => {
        execFile('powershell.exe', ['-File', psScriptPath, filepath], 
            { windowsHide: true }, 
            (error, stdout, stderr) => {
                if (error) {
                    log(`Error setting wallpaper: ${error.message}`, true);
                    reject(error);
                    return;
                }
                if (stderr) {
                    log(`Warning while setting wallpaper: ${stderr}`, true);
                    // Don't reject here as stderr might contain non-fatal warnings
                }
                log(`Wallpaper set successfully: ${stdout.trim()}`);
                resolve();
            }
        );
    });
}

/**
 * Utility function for implementing retry logic
 * @param {Function} fn - The function to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} delay - Delay between retries in milliseconds
 * @returns {Promise<any>} - Result of the function call
 */
async function withRetry(fn, maxRetries = config.maxRetries, delay = config.retryDelay) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            log(`Attempt ${attempt}/${maxRetries} failed: ${error.message}`, true);
            
            if (attempt < maxRetries) {
                log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    throw lastError;
}

/**
 * Main function to update the wallpaper
 */
async function updateWallpaper() {
    log('Starting wallpaper update');
    
    try {
        // Get the wallpaper URL with retry logic
        const url = await withRetry(() => getBingWallpaperUrl());
        
        // Prepare the filepath
        const filepath = path.join(__dirname, config.downloadDir, config.wallpaperFilename);
        
        // Download and set the wallpaper with retry logic
        await withRetry(() => downloadWallpaper(url, filepath));
        await withRetry(() => setWallpaper(filepath));
        
        log('Wallpaper update completed successfully');
    } catch (error) {
        log(`Failed to update wallpaper after multiple attempts: ${error.message}`, true);
    }
}

// Schedule the wallpaper update based on configuration
log(`Scheduling wallpaper updates with cron pattern: ${config.updateSchedule}`);
schedule.scheduleJob(config.updateSchedule, () => {
    log('Running scheduled wallpaper update');
    updateWallpaper();
});

// Update the wallpaper immediately on startup
log('Running initial wallpaper update');
updateWallpaper();