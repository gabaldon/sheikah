require('dotenv').config()
const { notarize } = require('@electron/notarize')

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context

  // skip notarization for no macOS platforms
  if (electronPlatformName !== 'darwin') {
    return
  }

  // Skip notarization when SIGN env is false
  if (
    !process.env.SIGN ||
    process.env.SIGN === 'false' ||
    process.env.SIGN === '0'
  ) {
    return
  }
  console.log('appOutDir >>>', appOutDir)
  const appName = context.packager.appInfo.productFilename
  return await notarize({
    tool: 'notarytool',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
    teamId: process.env.APPLETEAMID,
  })
}
