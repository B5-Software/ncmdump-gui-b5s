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

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  decryptFiles: (files) => ipcRenderer.invoke('decrypt-files', files),
  getFilePaths: (files) => ipcRenderer.invoke('get-file-paths', files),
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  openOutputDir: (dirPath) => ipcRenderer.invoke('open-output-dir', dirPath),
  onProgressUpdate: (callback) => ipcRenderer.on('progress-update', callback),
  windowControl: (action) => ipcRenderer.send('window-control', action),
  // 新增API
  chooseOutputDir: () => ipcRenderer.invoke('choose-output-dir'),
  getSystemTheme: () => ipcRenderer.invoke('get-system-theme'),
  onSystemThemeChange: (callback) => ipcRenderer.on('system-theme-change', callback),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  getAssetsPath: () => ipcRenderer.invoke('get-assets-path')
})