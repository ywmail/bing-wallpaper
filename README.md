# Bing Wallpaper

A Node.js application that automatically downloads and sets Bing's daily wallpaper as your desktop background.

## Features

- Automatically downloads the daily Bing wallpaper
- Sets the wallpaper as your desktop background
- Configurable update schedule
- Built-in retry mechanism for error handling
- Detailed logging

## Requirements

- Node.js
- Windows Operating System

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the application:
   ```
   node index.js
   ```

## Configuration

The application can be configured by editing the `config.js` file:

- `bingApiUrl`: The Bing API URL to fetch wallpaper information
- `bingBaseUrl`: Base URL for Bing images
- `downloadDir`: Directory to store downloaded wallpapers
- `wallpaperFilename`: Filename for the downloaded wallpaper
- `updateSchedule`: Cron pattern for the update schedule
- `maxRetries`: Maximum number of retry attempts
- `retryDelay`: Delay between retries in milliseconds

## License

ISC
