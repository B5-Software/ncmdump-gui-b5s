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

document.addEventListener('DOMContentLoaded', async () => {
  // 调试信息
  console.log('渲染进程已加载');
  console.log('Electron API 可用:', !!window.electronAPI);

  // 元素引用
  const dropZone = document.getElementById('drop-zone')
  const selectFilesBtn = document.getElementById('select-files-btn')
  const fileList = document.getElementById('file-list')
  const decryptBtn = document.getElementById('decrypt-btn')
  const progressText = document.getElementById('progress-text')
  const progressCount = document.getElementById('progress-count')
  const minimizeBtn = document.getElementById('minimize-btn')
  const maximizeBtn = document.getElementById('maximize-btn')
  const closeBtn = document.getElementById('close-btn')
  const toast = document.getElementById('toast')
  
  let files = []
  
  // 窗口控制
  minimizeBtn.addEventListener('click', () => window.electronAPI.windowControl('minimize'))
  maximizeBtn.addEventListener('click', () => window.electronAPI.windowControl('maximize'))
  closeBtn.addEventListener('click', () => window.electronAPI.windowControl('close'))
  
  // 阻止 window 默认拖放行为，避免浏览器接管
  window.addEventListener('dragover', e => { e.preventDefault(); });
  window.addEventListener('drop', e => { e.preventDefault(); });

   // 拖放功能
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault()
    dropZone.classList.add('active')
  })
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('active')
  })
  
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault()
    dropZone.classList.remove('active')
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles.map(f => f.path))
    } else {
      showToast('请拖放文件')
    }
  })

  // 文件选择按钮处理
  selectFilesBtn.addEventListener('click', async () => {
    const filePaths = await window.electronAPI.openFileDialog();
    
    if (filePaths && filePaths.length > 0) {
      const validFiles = filePaths.filter(path => 
        path && path.toLowerCase().endsWith('.ncm')
      );
      
      if (validFiles.length > 0) {
        addFiles(validFiles);
      } else {
        showToast('未选择有效的 .ncm 文件');
      }
    }
  });
  
  // 解密按钮
  decryptBtn.addEventListener('click', async () => {
    if (files.length === 0) return
    
    decryptBtn.disabled = true
    progressText.textContent = '正在解密...'
    progressCount.textContent = `${files.length} 个文件处理中`
    
    try {
      const result = await window.electronAPI.decryptFiles(files)
      showToast(`解密完成！文件已保存到 ${result.outputDir}`)
      progressText.textContent = '解密完成！'
      progressCount.textContent = `${files.length} 个文件已处理`
      
      // 打开输出目录
      setTimeout(() => {
        window.electronAPI.openOutputDir(result.outputDir)
      }, 1000)
      
    } catch (error) {
      console.error('解密失败:', error)
      showToast('解密失败: ' + error.message, true)
      progressText.textContent = '解密失败'
    } finally {
      setTimeout(() => {
        decryptBtn.disabled = false
      }, 2000)
    }
  })
  
  // 进度更新监听
  window.electronAPI.onProgressUpdate((event, { completed, total, stage }) => {
    if (stage === 'ffmpeg') {
      progressText.textContent = '正在转换格式...';
      progressCount.textContent = `${completed} / ${total} 个文件已转换`;
    } else {
      progressCount.textContent = `${total} 个文件处理中`;
      if (completed === total) {
        progressText.textContent = '解密完成！';
      }
    }
  })
  
  // 添加文件到列表
  function addFiles(filePaths) {
    if (!Array.isArray(filePaths)) {
      console.error('[addFiles] Invalid input:', filePaths);
      return;
    }
    
    const newFiles = filePaths.filter(path => 
      path && typeof path === 'string' && 
      path.toLowerCase().endsWith('.ncm') && 
      !files.includes(path)
    )
    
    if (newFiles.length === 0) {
      showToast('没有添加新的 .ncm 文件')
      return
    }
    
    files = [...files, ...newFiles]
    updateFileList()
    
    // 显示文件列表和进度信息
    fileList.style.display = 'flex'
    document.querySelector('.progress-container').style.display = 'flex'
    progressCount.textContent = `${files.length} 个文件待处理`
    
    // 显示添加的文件数量
    showToast(`已添加 ${newFiles.length} 个文件`)
  }
  
  // 更新文件列表显示
  function updateFileList() {
    fileList.innerHTML = ''
    
    files.forEach((filePath, index) => {
      const fileName = filePath.split('/').pop().split('\\').pop()
      
      const fileItem = document.createElement('div')
      fileItem.className = 'file-item fade-in'
      fileItem.innerHTML = `
        <i class="fas fa-music file-icon"></i>
        <span class="file-name" title="${filePath}">${fileName}</span>
        <i class="fas fa-times file-remove" data-index="${index}"></i>
      `
      
      fileList.appendChild(fileItem)
    })
    
    // 添加删除文件事件
    document.querySelectorAll('.file-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'))
        files.splice(index, 1)
        updateFileList()
        
        if (files.length === 0) {
          fileList.style.display = 'none'
          document.querySelector('.progress-container').style.display = 'none'
        } else {
          progressCount.textContent = `${files.length} 个文件待处理`
        }
      })
    })
    
    // 更新解密按钮状态
    decryptBtn.disabled = files.length === 0
    progressText.textContent = '准备就绪'
  }
  
  // 显示 toast 通知
  function showToast(message, isError = false) {
    toast.textContent = message
    toast.style.backgroundColor = isError ? 'var(--error)' : 'var(--surface)'
    toast.classList.add('show')
    
    setTimeout(() => {
      toast.classList.remove('show')
    }, 3000)
  }

  // 设置相关的DOM元素
  const settingsBtn = document.getElementById('settings-btn')
  const settingsModal = document.getElementById('settings-modal')
  const closeModalBtn = settingsModal.querySelector('.close-modal')
  const systemThemeCheckbox = document.getElementById('system-theme')
  const themeToggle = document.querySelector('.theme-toggle')
  const outputDirInput = document.getElementById('output-dir')
  const chooseOutputDirBtn = document.getElementById('choose-output-dir')
  const deleteSourceCheckbox = document.getElementById('delete-source')
  const convertToMp3Checkbox = document.getElementById('convert-to-mp3')

  // 在设置面板底部插入GPLv3和免费声明
  const modalBody = document.querySelector('.modal-body')
  if (modalBody && !document.getElementById('gpl3-declare')) {
    const gplDiv = document.createElement('div')
    gplDiv.id = 'gpl3-declare'
    gplDiv.style.cssText = 'margin-top:1.5rem;font-size:0.95em;color:var(--text-secondary);line-height:1.7;'
    gplDiv.innerHTML =
      '<b>开源协议：</b>本软件以 <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank">GPLv3</a> 协议开源，完全免费，任何收费行为均为诈骗！<br>' +
      '项目地址：<a href="https://github.com/B5-Software/ncmdump-gui-b5s" target="_blank">github.com/B5-Software/ncmdump-gui-b5s</a>'
    modalBody.appendChild(gplDiv)
  }
  
  // 初始化设置
  const settings = await window.electronAPI.getSettings()
  let currentTheme = settings.followSystemTheme 
    ? await window.electronAPI.getSystemTheme()
    : settings.theme

  systemThemeCheckbox.checked = settings.followSystemTheme
  themeToggle.style.display = settings.followSystemTheme ? 'none' : 'block'
  outputDirInput.value = settings.outputDir
  deleteSourceCheckbox.checked = settings.deleteSource
  convertToMp3Checkbox.checked = settings.convertToMp3
  document.documentElement.setAttribute('data-theme', currentTheme)
  
  // 主题切换相关事件处理
  systemThemeCheckbox.addEventListener('change', async (e) => {
    const followSystem = e.target.checked
    themeToggle.style.display = followSystem ? 'none' : 'block'
    
    if (followSystem) {
      currentTheme = await window.electronAPI.getSystemTheme()
      document.documentElement.setAttribute('data-theme', currentTheme)
    }
    
    await window.electronAPI.saveSettings({
      followSystemTheme: followSystem,
      theme: currentTheme
    })
  })
  
  document.querySelectorAll('input[name="theme"]').forEach(radio => {
    if (radio.value === currentTheme) radio.checked = true
    radio.addEventListener('change', async (e) => {
      if (e.target.checked) {
        currentTheme = e.target.value
        document.documentElement.setAttribute('data-theme', currentTheme)
        await window.electronAPI.saveSettings({ theme: currentTheme })
      }
    })
  })
  
  // 监听系统主题变化
  window.electronAPI.onSystemThemeChange((event, newTheme) => {
    if (settings.followSystemTheme) {
      currentTheme = newTheme
      document.documentElement.setAttribute('data-theme', currentTheme)
    }
  })
  
  // 输出目录选择
  chooseOutputDirBtn.addEventListener('click', async () => {
    const newPath = await window.electronAPI.chooseOutputDir()
    outputDirInput.value = newPath
  })
  
  // 其他设置项变更
  deleteSourceCheckbox.addEventListener('change', async (e) => {
    await window.electronAPI.saveSettings({
      deleteSource: e.target.checked
    })
  })
  
  convertToMp3Checkbox.addEventListener('change', async (e) => {
    await window.electronAPI.saveSettings({
      convertToMp3: e.target.checked
    })
  })
  
  // 模态框控制
  settingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('show')
  })
  
  closeModalBtn.addEventListener('click', () => {
    settingsModal.classList.remove('show')
  })
  
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.classList.remove('show')
    }
  })

  const showThanksBtn = document.getElementById('show-thanks-btn')
  const thanksModal = document.getElementById('thanks-modal')
  const closeThanksModalBtn = thanksModal.querySelector('.close-thanks-modal')

  showThanksBtn.addEventListener('click', () => {
    thanksModal.classList.add('show')
  })
  closeThanksModalBtn.addEventListener('click', () => {
    thanksModal.classList.remove('show')
  })
  thanksModal.addEventListener('click', (e) => {
    if (e.target === thanksModal) {
      thanksModal.classList.remove('show')
    }
  })
})