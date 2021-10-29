import {
  app,
  BrowserWindow,
  Menu,
  protocol,
  shell,
  ipcMain,
} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import kill from 'tree-kill'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import {
  DEVELOPMENT,
  STATUS,
  STATUS_PATH
} from './constants'
import path from 'path'
declare const __static: string

export class AppManager {
  public status
  public win
  public walletProcess
  public autoUpdater
  public createdProtocol
  private walletPid

  constructor() {
    this.status = DEVELOPMENT ? STATUS.READY : STATUS.WAIT
  }

  public setWalletPid(pid: string) {
    this.walletPid = pid
  }

  public async start() {
    // Scheme must be registered before the app is ready
    protocol.registerSchemesAsPrivileged([
      { scheme: 'app', privileges: { secure: true, standard: true } },
    ])


    // check if the second instance in locked
    const lock = app.requestSingleInstanceLock()

    if (!lock) {
      app.quit()
    } else {
      // if someone executes a second instace we should focus on the main window
      app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (this.win) {
          if (this.win.isMinimized()) this.win.restore()
          this.win.focus()
        }
      })
      app.whenReady().then(() => {})
    }

    // Quit when all windows are closed.
    app.on('window-all-closed', function (event) {
      event.preventDefault()
      this.sendShutdownMessage()
    })

    // ipc events
    // received from the client to close sheikah
    ipcMain.on('shutdown-finished', () => {
      this.win.hide()
      if (this.walletPid) {
        kill(this.walletPid)
      }
      app.exit()
    })

    return new Promise<void>((resolve, reject) => {
      // app events
      app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        this.win.show()
        if (this.win === null) {
          this.createWindow()
        }
        resolve()
      })

      // This method will be called when Electron has finished
      // initialization and is ready to create browser windows.
      // Some APIs can only be used after this event occurs.
      app.on('ready', async () => {
        if (DEVELOPMENT) {
          // Install Vue Devtools
          try {
            await installExtension(VUEJS_DEVTOOLS)
          } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
          }
        }

        this.createWindow()
        resolve()
      })
    }) 
  }

  public sendShutdownMessage() {
    this.win.webContents.send('shutdown')
  }

  public sendDownloadedMessage() {
    this.win.webContents.send('downloaded')
  }

  public sendDownloadingMessage() {
    this.win.webContents.send('downloading')
  }

  public sendProgressMessage(progress) {
    this.win.webContents.send('progress', progress)
  }

  public sendRunningMessage() {
    this.win.webContents.send('running')
  }

  public sendloadedMessage () {
    this.win.webContents.send('loaded', [{ isDefaultWallet: true }])
  }

  // TODO: if error when closing window in autoUpdate win.close()
  public closeWindow (event) {
    event.preventDefault()
    this.sendShutdownMessage()
  }

  public setStatus(status) {
    this.status = status
    this.loadUrl(status)
  }

  private createWindow() {
    // Create the browser window.
    this.win = new BrowserWindow({
      width: 1280,
      height: 720,
      minWidth: 1280,
      minHeight: 720,
      icon: path.join(__static, 'icon.png'),
      webPreferences: {
        nodeIntegration: true,
      },
      autoHideMenuBar: true,
    })
  
    if (!DEVELOPMENT) {
      // Hide electron toolbar in production environment
      this.win.setMenuBarVisibility(false)
    }
  
    this.loadUrl(this.status)
  
    this.win.webContents.on('did-finish-load', () => {
      // Disables zooming with pinch
      this.win.webContents.setZoomFactor(1)
    })
  
    this.win.webContents.on('new-window', (e, url) => {
      console.info('Opening link: ' + url + '  in os browser')
      e.preventDefault()
  
      shell.openExternal(url)
    })
  
    this.win.on('closed', () => {
      this.win = null
    })

    this.win.on('close', this.closeWindow.bind(this))
  
    if (DEVELOPMENT) {
      const menu = Menu.buildFromTemplate([
        {
          label: 'Menu',
          submenu: [
            {
              label: 'Quit',
              accelerator: 'CmdOrCtrl+Q',
              click: () => {
                this.sendShutdownMessage()
              },
            },
            { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => {} },
            { label: 'ZoomOut', accelerator: 'CmdOrCtrl+-', click: () => {} },
            { label: 'ZoomIn', accelerator: 'CmdOrCtrl+Plus', click: () => {} },
            { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
            { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
            { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
          ],
        },
      ])
  
      Menu.setApplicationMenu(menu)
    }
  }
  
  // load a url if browser window is ready according to the current status
  public loadUrl(status) {
    if (this.win) {
      if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        this.win.loadURL(
          `${process.env.WEBPACK_DEV_SERVER_URL}#/${STATUS_PATH[status]}`,
        )
      } else {
        if (!this.createdProtocol) {
          createProtocol('app')
          this.createdProtocol = true
        }
        // Load the index.html when not in development
        this.win.loadURL(`app://./index.html/#/${STATUS_PATH[status]}`)
      }
    }
  }
}

