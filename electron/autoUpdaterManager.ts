import { autoUpdater } from 'electron-updater'
import { BrowserWindow, MessageBoxOptions, dialog } from 'electron'
import { WalletManager } from './walletManager'
import { Actions } from './main'

export class AutoUpdaterManager {
  public isBeingUpdated: boolean = false
  public wallet
  public win

  constructor(walletManager: WalletManager, win: BrowserWindow) {
    this.wallet = walletManager
    this.win = win
  }

  public run() {
    autoUpdater.on('update-available', this.showDialog.bind(this))
    autoUpdater.on('error', err => {
      console.log('Error in auto-updater. ' + err)
    })
    autoUpdater.on('update-downloaded', this.closeWindowAndRestart.bind(this))

    autoUpdater.autoDownload = false
    autoUpdater.checkForUpdatesAndNotify()
  }

  private showDialog() {
    const options = {
      type: 'info',
      title: 'DOClever',
      message: `There is a new Sheikah version`,
      buttons: ['Download and install', 'Cancel'],
      defaultId: 0, // bound to buttons array
      cancelId: 1, // bound to buttons array
    } as MessageBoxOptions
    this.wallet.setIsUpdating(true)
    dialog.showMessageBox(this.win, options).then(result => {
        if (result.response === 0) {
          autoUpdater
            .downloadUpdate()
            .then(path => {
              console.log('Release path to download', path)
            })
            .catch(e => {
              console.log('Error', e)
            })
        } else if (result.response === 1) {
          this.wallet.setIsUpdating(false)
          this.wallet.runWallet()
        }
      })
  }

  private closeWindowAndRestart(actions: Actions) {
    if (this.wallet.walletProcess) {
      this.wallet.walletProcess.kill(9)
    }
    if (this.win != null) {
      actions.closeWindow()
    }
    try {
      setImmediate(() => {
        autoUpdater.quitAndInstall()
      })
    } catch (err) {
      console.log(err)
    }
  }
}
