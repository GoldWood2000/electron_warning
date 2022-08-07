
const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')


app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 680,
    webPreferences: {
      nodeIntegration: true
    }
  })
  const urlLocation = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
  mainWindow.loadURL(urlLocation)
  mainWindow.webContents.openDevTools()
})
