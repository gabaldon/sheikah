const {
  onShutdown,
  onRunningStatus,
  onDownloadingStatus,
  onLoadedStatus,
  onDownloadedStatus,
  onDownloadProgress,
  onMessage,
} = window['ipcAPI']

export {
  onShutdown,
  onDownloadProgress,
  onDownloadedStatus,
  onDownloadingStatus,
  onLoadedStatus,
  onMessage,
  onRunningStatus,
}
