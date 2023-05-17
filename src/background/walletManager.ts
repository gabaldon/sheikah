import path from 'path'
import cp from 'child_process'
import util from 'util'
import stream from 'stream'
import semver from 'semver'
import fs from 'fs-extra'
import axios, { AxiosResponse } from 'axios'
import progress from 'progress-stream'
import tar from 'tar'
import {
  SHEIKAH_PATH,
  VERSION_FILE_NAME,
  WITNET_FILE_NAME,
  WITNET_RUST_VERSION,
  WITNET_CONFIG_FILE_NAME,
  WALLET_COMPRESS_FILE_NAME,
  Status,
  DEFAULT_WALLET_LOG_LEVEL,
  ARCH,
  PLATFORM,
  OS_ARCH,
  RELEASE_BASE_URL,
} from './constants'
import { AppManager } from './appManager'
import getVersionFromName from './utils/getVersionFromName'
import overwriteWitnetNodeConfiguration from './utils/overwriteWitnetNodeConfiguration'
import sleep from './utils/sleep'

interface GithubReleaseAsset {
  // eslint-disable-next-line camelcase
  browser_download_url: string
}

interface GithubTagInfo {
  assets: Array<GithubReleaseAsset>
}

export class WalletManager {
  public app: AppManager
  public isUpdating: boolean = false
  public walletProcess: cp.ChildProcessWithoutNullStreams | null = null
  private existDirectory: boolean
  private needToDownloadWallet: boolean = true
  private latestWitnetRustVersion: string = WITNET_RUST_VERSION
  private witnetRustVersion: string = WITNET_RUST_VERSION
  private decompressWallet = {
    win32: this.decompressWin32Wallet,
    darwin: this.decompressDarwinWallet,
    linux: this.decompressLinuxWallet,
  }[PLATFORM]

  constructor(appManager: AppManager) {
    this.app = appManager

    this.existDirectory = fs.existsSync(SHEIKAH_PATH)
  }

  //  Start running the wallet release and download it when is necessary
  public async run() {
    if (this.existDirectory) {
      this.latestWitnetRustVersion = await getLatestWitnetRustRelease()
      // Check if latest version is compatible or needs to be downloaded
      try {
        const versionName = fs.readFileSync(
          path.join(SHEIKAH_PATH, VERSION_FILE_NAME),
          'utf8',
        )
        const installedVersion = getVersionFromName(versionName)
        const isLatestVersionInstalled =
          installedVersion === this.latestWitnetRustVersion
        const isCompatibleRelease = semver.satisfies(
          this.latestWitnetRustVersion,
          `~${WITNET_RUST_VERSION}`,
        )
        this.needToDownloadWallet =
          isCompatibleRelease && !isLatestVersionInstalled
        if (isLatestVersionInstalled) {
          console.info(
            `Latest wallet version ${this.latestWitnetRustVersion} already installed`,
          )
        } else if (!this.needToDownloadWallet) {
          console.info(
            `Latest wallet version ${this.latestWitnetRustVersion} is not compatible with this version of sheikah, so it will not be installed`,
          )
        }
      } catch (err) {
        console.error('An error occured trying to read version file', err)
      }
    }
    this.witnetRustVersion = this.needToDownloadWallet
      ? this.latestWitnetRustVersion
      : WITNET_RUST_VERSION

    const downloadUrl: string | undefined = await fetchReleaseDownloadUrl(
      `${RELEASE_BASE_URL}${this.witnetRustVersion}`,
      ARCH,
      PLATFORM,
    )

    if (downloadUrl) {
      if (!this.existDirectory) {
        // Create sheikah directory for wallet
        console.info(
          "Sheikah's directory not found. Creating a new one in: ",
          SHEIKAH_PATH,
        )
        fs.mkdirSync(SHEIKAH_PATH)
      }

      if (this.needToDownloadWallet) {
        await this.downloadWallet(downloadUrl)
      } else {
        this.app.sendDownloadedMessage()
        await sleep(3000)
      }

      if (!this.isUpdating) {
        this.runWallet()
      }
    } else {
      this.app.setStatus(Status.OsNotSupported)
      console.info('Your OS is not supported yet')
    }
  }

  // Setter for isUpdating attribute
  public setIsUpdating(status: boolean) {
    this.isUpdating = status
  }

  // Download a wallet release from the url specified
  public async downloadWallet(releaseUrl: string) {
    console.info(
      `Fetching release from: ${RELEASE_BASE_URL}${this.witnetRustVersion}`,
    )
    this.app.sendDownloadingMessage()
    await sleep(2500)
    this.app.setStatus(Status.Wait)
    // FIXME: Remove promise and use async / await
    return new Promise<void>(resolve => {
      axios
        .get(releaseUrl, { responseType: 'stream' })
        .then(async response => {
          this.handleDownloadWalletResponse(response)
          resolve()
        })
        .catch(err => {
          console.error(
            'An error happened while trying to download the wallet',
            err,
          )
        })
    })
  }

  // Decompress downloaded wallet release on macOS
  private async decompressDarwinWallet(file: string) {
    try {
      const currentCwd = process.cwd()
      process.chdir(SHEIKAH_PATH)
      cp.execSync(`tar -xvf ${file}`)
      process.chdir(currentCwd)
      await sleep(3000)
      overwriteWitnetNodeConfiguration(true)
      fs.writeFileSync(
        path.join(SHEIKAH_PATH, VERSION_FILE_NAME),
        this.witnetRustVersion,
      )
    } catch (err) {
      console.error(err)
    }
  }

  // Decompress downloaded wallet release on windows
  private async decompressWin32Wallet(file: string) {
    tar.x({ file, sync: true })
    fs.copyFileSync(WITNET_FILE_NAME, path.join(SHEIKAH_PATH, WITNET_FILE_NAME))
    fs.copyFileSync(
      'witnet.toml',
      path.join(SHEIKAH_PATH, WITNET_CONFIG_FILE_NAME),
    )
    await sleep(3000)
    overwriteWitnetNodeConfiguration(true)
    fs.writeFileSync(
      path.join(SHEIKAH_PATH, VERSION_FILE_NAME),
      this.witnetRustVersion,
    )
  }

  // Decompress downloaded wallet release on linux
  private async decompressLinuxWallet(file: string) {
    tar.x({ file, sync: true })
    fs.copyFileSync('witnet', path.join(SHEIKAH_PATH, WITNET_FILE_NAME))
    fs.copyFileSync(
      'witnet.toml',
      path.join(SHEIKAH_PATH, WITNET_CONFIG_FILE_NAME),
    )
    await sleep(3000)
    overwriteWitnetNodeConfiguration(true)
    cp.execSync(`chmod 777 ${path.join(SHEIKAH_PATH, WITNET_FILE_NAME)}`)
    fs.writeFileSync(
      path.join(SHEIKAH_PATH, VERSION_FILE_NAME),
      this.witnetRustVersion,
    )
  }

  private async handleDownloadWalletResponse(response: AxiosResponse) {
    const walletCompressPath = path.join(
      SHEIKAH_PATH,
      WALLET_COMPRESS_FILE_NAME,
    )
    const str = progress({
      length: response.headers['content-length'],
      time: 100 /* ms */,
    })
    str.on('progress', (progress: number) => {
      this.app.sendProgressMessage(progress)
    })
    const pipeline = util.promisify(stream.pipeline)
    // Promise equivalent for response.data.pipe(writeStream)
    await pipeline(response.data, str, fs.createWriteStream(walletCompressPath))
    console.info('witnet release downloaded succesfully')

    const existWitnetFile = fs.existsSync(
      path.join(SHEIKAH_PATH, WITNET_FILE_NAME),
    )
    // delete witnet file before decompress
    if (existWitnetFile) {
      fs.unlinkSync(path.join(SHEIKAH_PATH, WITNET_FILE_NAME))
    }

    console.info('Decompressing wallet release...')
    this.decompressWallet(walletCompressPath)
    // remove compressed file
    fs.unlinkSync(walletCompressPath)
  }

  // Run Witnet wallet and load "ready" url
  public async runWallet() {
    await sleep(3000)
    console.info('Running wallet...')
    if (!this.existDirectory) {
      // Is first time running Sheikah
      overwriteWitnetNodeConfiguration(true)
    }
    this.app.sendRunningMessage()
    await sleep(3000)

    const walletConfigurationPath = path.join(SHEIKAH_PATH, 'witnet.toml')

    console.info('... with witnet.toml from ' + walletConfigurationPath)
    this.walletProcess = cp.spawn(
      path.join(SHEIKAH_PATH, WITNET_FILE_NAME),
      ['-c', walletConfigurationPath, 'wallet', 'server'],
      {
        argv0: OS_ARCH === 'arm64' ? 'arch -x86_64' : undefined,
        env: {
          RUST_LOG: `witnet=${DEFAULT_WALLET_LOG_LEVEL}`,
          ...process.env,
        },
      },
    )
    this.walletProcess?.stdout.on('data', async data => {
      console.info('stdout: ' + data.toString())
      this.app.sendLoadedMessage()
      await sleep(3000)
      this.app.setStatus(Status.Ready)
    })

    this.walletProcess?.stderr.on('data', function (data) {
      console.info('stderr: ' + data.toString())
    })

    if (this.walletProcess.pid) {
      this.app.setWalletPid(this.walletProcess.pid)
    }
  }
}

async function getLatestWitnetRustRelease(): Promise<string> {
  try {
    const result: AxiosResponse<any> = await axios.get(
      'https://api.github.com/repos/witnet/witnet-rust/releases/latest',
    )
    return (await result.data.tag_name) || ''
  } catch (err) {
    console.log(
      'There was an error getting the latest Witnet Rust Release name:',
      err,
    )
    return ''
  }
}

// Fetch the release information for the given system architecture and platform
async function fetchReleaseDownloadUrl(
  releaseUrl: string,
  arch: string,
  platform: string,
) {
  const result: AxiosResponse<GithubTagInfo> = await axios.get(releaseUrl)

  const release = result.data.assets.find(
    asset =>
      asset.browser_download_url.includes(arch === 'ia32' ? 'x86_64' : arch) &&
      asset.browser_download_url.includes(
        platform === 'win32' ? 'windows' : platform,
      ),
  )

  return release?.browser_download_url
}
