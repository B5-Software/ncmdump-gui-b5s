/*
 * ncmdump-gui-b5s
 * Copyright (C) 2025 B5-Software
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * 本软件完全免费，任何收费行为均为诈骗！
 */

const { app, BrowserWindow, ipcMain, shell, dialog, nativeTheme } = require('electron')
const path = require('path')
const fs = require('fs-extra').default || require('fs-extra')
const { spawn } = require('child_process')
const os = require('os')

let mainWindow
const userPrefsPath = path.join(app.getPath('userData'), 'user-preferences.json')

// 默认设置
const defaultSettings = {
  followSystemTheme: true,
  theme: 'light',
  outputDir: path.join(os.homedir(), 'Desktop', 'Decrypted-Audio-Output'),
  deleteSource: false,
  convertToMp3: false
}

// 读取设置
function loadSettings() {
  try {
    return { ...defaultSettings, ...fs.readJSONSync(userPrefsPath) }
  } catch (error) {
    return defaultSettings
  }
}

// 保存设置
function saveSettings(settings) {
  fs.writeJSONSync(userPrefsPath, settings)
  return settings
}

const settings = loadSettings()

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 760, // 初始高度由600提升到760，确保文件列表和按钮完整可见
    minWidth: 600,
    minHeight: 600, // 最小高度同步提升，避免窗口太小遮挡按钮
    title: '音乐文件解密器',
    icon: path.join(__dirname, 'assets/icons/icon.png'),
    webPreferences: {
      devTools: false, // 禁用 DevTools
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true
    },
    frame: false,
    backgroundColor: '#1e1e2e'
  })

  await mainWindow.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// 获取平台对应的 ncmdump 二进制路径
function getNcmdumpPath() {
  const platform = process.platform
  const arch = process.arch
  const isDev = !app.isPackaged;
  const basePath = isDev ? __dirname : process.resourcesPath;

  let binPath
  if (platform === 'win32') {
    binPath = path.join(
      basePath,
      'assets/ncmdump/win-x64/ncmdump.exe'
    )
  } else if (platform === 'darwin') {
    const macArch = arch === 'arm64' ? 'darwin-arm64' : 'darwin-x64'
    binPath = path.join(
      basePath,
      `assets/ncmdump/${macArch}/ncmdump`
    )
  } else {
    throw new Error('Unsupported platform')
  }
  return binPath
}

// 获取平台对应的 ffmpeg 二进制路径 (GPLv3)
function getFfmpegPath() {
  // GPLv3: 本功能依赖 GPLv3 许可的 ffmpeg 二进制文件
  const platform = process.platform
  const arch = process.arch
  const isDev = !app.isPackaged;
  const basePath = isDev ? __dirname : process.resourcesPath;

  let binPath
  if (platform === 'win32') {
    binPath = path.join(
      basePath,
      'assets/ffmpeg/win-x64/ffmpeg.exe'
    )
  } else if (platform === 'darwin') {
    const macArch = arch === 'arm64' ? 'darwin-arm64' : 'darwin-x64'
    binPath = path.join(
      basePath,
      `assets/ffmpeg/${macArch}/ffmpeg`
    )
  } else {
    throw new Error('Unsupported platform')
  }
  return binPath
}

// 设置相关的IPC处理器
ipcMain.handle('get-settings', () => {
  return settings
})

ipcMain.handle('save-settings', async (event, newSettings) => {
  Object.assign(settings, newSettings)
  return saveSettings(settings)
})

ipcMain.handle('get-system-theme', () => {
  return nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
})

ipcMain.handle('choose-output-dir', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  
  if (!result.canceled && result.filePaths.length > 0) {
    settings.outputDir = result.filePaths[0]
    saveSettings(settings)
    return settings.outputDir
  }
  return settings.outputDir
})

// 监听系统主题变化
nativeTheme.on('updated', () => {
  if (settings.followSystemTheme) {
    mainWindow.webContents.send('system-theme-change', 
      nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
    )
  }
})

// 处理文件路径获取
ipcMain.handle('get-file-paths', async (event, filesData) => {
  try {
    console.log('[主进程] 收到文件数据:', filesData);
    
    // 处理传入的文件数据
    return filesData.map(file => {
      // macOS 下，我们使用 name 属性作为文件名
      if (process.platform === 'darwin') {
        // 如果文件对象包含完整路径信息
        if (file.path) {
          return file.path;
        }
        
        // 否则尝试从拖放事件中获取文件路径
        if (file.name) {
          // 为了安全起见，我们需要验证文件是否真实存在
          const possiblePaths = [
            `${app.getPath('downloads')}/${file.name}`,
            `${app.getPath('desktop')}/${file.name}`,
            `${app.getPath('documents')}/${file.name}`
          ];
          
          for (const path of possiblePaths) {
            if (require('fs').existsSync(path)) {
              console.log('[主进程] 找到文件路径:', path);
              return path;
            }
          }
        }
      }
      
      // 其他平台或默认情况下返回 path 属性
      return file.path || null;
    }).filter(Boolean); // 过滤掉无效的路径
    
  } catch (err) {
    console.error('[主进程] 获取文件路径时出错:', err);
    return [];
  }
})

// 处理文件解密
ipcMain.handle('decrypt-files', async (event, files) => {
  await fs.ensureDir(settings.outputDir)
  
  const ncmdumpPath = getNcmdumpPath()
  const args = [...files, '-o', settings.outputDir]
  
  // 不再添加 --remove-source 参数
  
  return new Promise((resolve, reject) => {
    const processFiles = async () => {
      const child = spawn(ncmdumpPath, args)
      let output = ''
      let completed = 0
      
      child.stdout.on('data', (data) => {
        output += data.toString()
        // 解析进度信息
        const matches = output.match(/Processing file (\d+) of (\d+)/g)
        if (matches && matches.length) {
          const lastMatch = matches[matches.length - 1]
          const progressMatch = lastMatch.match(/Processing file (\d+) of (\d+)/)
          if (progressMatch) {
            completed = parseInt(progressMatch[1])
            const total = parseInt(progressMatch[2])
            mainWindow.webContents.send('progress-update', { completed, total })
          }
        }
      })
      
      child.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`)
      })
      
      child.on('close', async (code) => {
        if (code !== 0) {
          reject(new Error('解密失败'))
          return
        }

        // 解密后如需删除原始ncm文件
        if (settings.deleteSource) {
          try {
            for (const file of files) {
              // 仅删除 .ncm 文件，防止误删
              if (file.toLowerCase().endsWith('.ncm')) {
                await fs.remove(file)
              }
            }
          } catch (e) {
            console.error('删除原始NCM文件失败:', e)
          }
        }

        if (settings.convertToMp3) {
          // === 以下代码为GPLv3相关 ===
          // 使用ffmpeg(GPLv3)转换FLAC到MP3
          const ffmpegPath = getFfmpegPath(); // GPLv3
          const flacFiles = (await fs.readdir(settings.outputDir)).filter(f => f.toLowerCase().endsWith('.flac'));
          let ffmpegCompleted = 0;
          for (const file of flacFiles) {
            const inputPath = path.join(settings.outputDir, file)
            const outputPath = path.join(settings.outputDir, file.replace(/\.flac$/i, '.mp3'))
            try {
              await new Promise((resolveFfmpeg, rejectFfmpeg) => {
                const ffmpeg = require('fluent-ffmpeg')
                ffmpeg(inputPath)
                  .setFfmpegPath(ffmpegPath) // GPLv3: 指定本地ffmpeg二进制
                  .toFormat('mp3')
                  .save(outputPath)
                  .on('end', () => {
                    fs.removeSync(inputPath)
                    ffmpegCompleted++;
                    mainWindow.webContents.send('progress-update', { completed: ffmpegCompleted, total: flacFiles.length, stage: 'ffmpeg' });
                    resolveFfmpeg()
                  })
                  .on('error', rejectFfmpeg)
              })
            } catch (error) {
              console.error(`转换失败: ${file}`, error)
            }
          }
          // === GPLv3相关代码结束 ===
        }

        resolve({ outputDir: settings.outputDir })
      })
    }

    processFiles().catch(reject)
  })
})

// 打开文件对话框
ipcMain.handle('open-file-dialog', async () => {
  const { dialog } = require('electron')
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'NCM Files', extensions: ['ncm'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })
  return result.filePaths
})

// 打开输出目录
ipcMain.handle('open-output-dir', async (event, dirPath) => {
  await shell.openPath(dirPath)
})

// 窗口控制
ipcMain.on('window-control', (event, action) => {
  if (!mainWindow) return
  
  switch (action) {
    case 'minimize':
      mainWindow.minimize()
      break
    case 'maximize':
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
      } else {
        mainWindow.maximize()
      }
      break
    case 'close':
      mainWindow.close()
      break
  }
})

ipcMain.handle('get-assets-path', () => {
  const isDev = !app.isPackaged;
  if (isDev) {
    return path.join(__dirname, 'assets');
  } else {
    return path.join(process.resourcesPath, 'assets');
  }
});