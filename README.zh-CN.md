# Bing 壁纸

[English](README.md) | 简体中文

一个 Node.js 应用程序，可以自动下载 Bing 每日壁纸并将其设置为您的桌面背景。

## 功能特性

- 自动下载 Bing 每日壁纸
- 将壁纸设置为桌面背景
- 可配置的更新计划
- 内置错误处理重试机制
- 详细的日志记录

## 系统要求

- Node.js
- Windows 操作系统

## 安装

1. 克隆此仓库
2. 安装依赖：
   ```
   npm install
   ```
3. 运行应用程序：
   ```
   node index.js
   ```

## 配置

可以通过编辑 `config.js` 文件来配置应用程序：

- `bingApiUrl`: Bing API URL，用于获取壁纸信息
- `bingBaseUrl`: Bing 图片的基础 URL
- `downloadDir`: 存储下载壁纸的目录
- `wallpaperFilename`: 下载壁纸的文件名
- `updateSchedule`: 更新计划的 Cron 表达式
- `maxRetries`: 最大重试次数
- `retryDelay`: 重试之间的延迟时间（毫秒）

## 许可证

ISC
