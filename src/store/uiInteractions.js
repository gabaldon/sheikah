import Vue from 'vue'
import { LocalStorageApi } from '@/api'

export default {
  state: {
    receiveTransactionClicked: false,
    generateAddressLoading: false,
    generateRadRequestResultLoading: false,
    setupMessage: 'Updating wallet backend',
    setupProgress: 0,
    sessionExpired: false,
    localStorage: new LocalStorageApi(),
    isResyncConfirmationVisible: false,
    isWalletDescriptionVisible: false,
    isRenameWalletConfirmationVisible: false,
    isDeleteWalletConfirmationVisible: false,
  },
  mutations: {
    showResyncConfirmation(state) {
      state.isResyncConfirmationVisible = true
    },
    showLogoutModal(state) {
      state.sessionExpired = true
    },
    showDescriptionModal(state) {
      state.isWalletDescriptionVisible = true
    },
    showDeleteWalletModal(state) {
      state.isDeleteWalletConfirmationVisible = true
    },
    showRenameConfirmationModal(state) {
      state.isRenameWalletConfirmationVisible = true
    },
    closeResyncConfirmation(state) {
      state.isResyncConfirmationVisible = false
    },
    closeDeleteWalletConfirmation(state) {
      state.isDeleteWalletConfirmationVisible = false
    },
    closeLogoutModal(state) {
      state.sessionExpired = false
    },
    closeDescriptionModal(state) {
      state.isWalletDescriptionVisible = false
    },
    closeRenameConfirmationModal(state) {
      state.isRenameWalletConfirmationVisible = false
    },
    receiveTransactionClicked(state) {
      state.receiveTransactionClicked = true
    },
    clearTransactionClicked(state) {
      state.receiveTransactionClicked = false
    },
    generateAddressLoading(state) {
      state.generateAddressLoading = true
    },
    generateRadRequestResultLoading(state) {
      state.generateRadRequestResultLoading = true
    },
    clearGenerateAddressLoading(state) {
      state.generateAddressLoading = false
    },
    clearGenerateRadRequestResultLoading(state) {
      state.generateRadRequestResultLoading = false
    },
    setMessage(state, { message }) {
      state.setupMessage = message
    },
    setProgress(state, { progress }) {
      state.setupProgress = progress
    },
    cleanMessage(state) {
      state.setupMessage = 'Updating wallet backend'
    },
    closeAllModals(state) {
      state.isResyncConfirmationVisible = false
      state.isWalletDescriptionVisible = false
      state.isRenameWalletConfirmationVisible = false
      state.isDeleteWalletConfirmationVisible = false
    },
  },
  actions: {
    notify(context, payload) {
      Vue.prototype.$notify(payload)
    },
    saveShowModalAgain(context, val) {
      context.state.localStorage.setSkipSessionExpirationInfo(val)
    },
  },
}
