
const { app, Tray, Menu, nativeImage, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')


app.whenReady().then(() => {

  //隐藏图标
  app.dock.hide()

  //设置托盘
  const icon = nativeImage.createFromPath(path.join(__dirname, './assets/githubTemplate.png'))
  let tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    { label: '退出程序', click: () => { app.quit() } },
  ])
  tray.setToolTip('云轨信息')
  tray.setContextMenu(contextMenu)

  //开启窗口
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    }
  })
  const urlLocation = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
  mainWindow.loadURL(urlLocation)
  mainWindow.webContents.openDevTools()
})
