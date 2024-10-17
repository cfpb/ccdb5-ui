import * as sut from './httpRequests';

const url = 'http://www.example.org';

describe('actions:httpRequests', () => {
  describe('httpGet', () => {
    it('has defaults if the optional actions are not specified', () => {
      const expected = {
        type: sut.HTTP_GET_REQUEST,
        payload: {
          url,
          onSuccess: sut.HTTP_GET_REQUEST_SUCCEEDED,
          onFailure: sut.HTTP_GET_REQUEST_FAILED,
        },
      };

      const actual = sut.httpGet(url);
      expect(actual).toEqual(expected);
    });
  });
});
