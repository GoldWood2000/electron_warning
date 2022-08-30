
const { app, Tray, Menu, nativeImage, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const system = process.platform

app.whenReady().then(() => {

  //设置托盘
  const icon = nativeImage.createFromPath(path.join(__dirname, './assets/githubTemplate.png'))
  let tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    { label: '继续', click: () => { mainWindow.webContents.send('handleAudio', 1) } },
    { label: '暂停', click: () => { mainWindow.webContents.send('handleAudio', 0) } },
    { label: '退出程序', click: () => { app.quit() } },
  ])
  tray.setToolTip('云轨信息')
  tray.setContextMenu(contextMenu)

  //开启窗口
  const mainWindow = new BrowserWindow({
    width: 0,
    height: 0,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  //隐藏图标
  switch (true) {
    case system === 'darwin':
      app.dock.hide()
      break;
    case system === 'win32':
      Menu.setApplicationMenu(null)
      mainWindow.hide()
      break;
  }

  const urlLocation = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
  mainWindow.loadURL(urlLocation)
  mainWindow.webContents.openDevTools()
})
