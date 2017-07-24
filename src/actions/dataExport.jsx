// Tip of the hat to: https://stackoverflow.com/questions/35623656

import { MODAL_SHOWN, MODAL_TYPE_DATA_EXPORT } from '../constants'

export function showExportDialog() {
  return {
    type: MODAL_SHOWN,
    modalType: MODAL_TYPE_DATA_EXPORT,
    modalProps: {}
  }
}
