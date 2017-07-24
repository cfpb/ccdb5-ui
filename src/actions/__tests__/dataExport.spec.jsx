
import { showExportDialog } from '../dataExport'
import * as types from '../../constants'

describe('action:dataExport', () => {
  describe('showExportDialog', () => {
    it('creates a simple action', () => {
        const expectedAction = {
          type: types.MODAL_SHOWN,
          modalType: types.MODAL_TYPE_DATA_EXPORT,
          modalProps: {}
        }
        expect(showExportDialog()).toEqual(expectedAction)
    })
  })
})
