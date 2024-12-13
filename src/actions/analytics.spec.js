import Analytics from './analytics';

describe('action:analytics', () => {
  describe('.init()', () => {
    it('should properly set the google_tag_manager object', () => {
      const mockGTMObject = { testing: true };
      expect(Analytics.tagManagerIsLoaded).toBe(false);
      Analytics.init();
      window.google_tag_manager = mockGTMObject;
      expect(Analytics.tagManagerIsLoaded).toBe(true);
      expect(window.google_tag_manager).toEqual(mockGTMObject);
    });
  });

  it('creates an event object', () => {
    const mockCallback = jest.fn();
    const expectedEvent = {
      event: 'Consumer Complaint Search',
      action: 'action tracker',
      label: '',
      eventCallback: mockCallback,
      eventTimeout: 500,
    };
    expect(
      Analytics.getDataLayerOptions(
        'action tracker',
        false,
        'Consumer Complaint Search',
        mockCallback,
      ),
    ).toEqual(expectedEvent);
  });

  it('sends an event and runs the callback when !isLoaded', () => {
    let callbackConfirm = '';
    Analytics.tagManagerIsLoaded = false;

    const mockCallback = () => {
      callbackConfirm = 'hello world';
    };

    Analytics.sendEvent(
      Analytics.getDataLayerOptions(
        'woah nelly action',
        'label',
        'my category',
        mockCallback,
      ),
    );

    expect(callbackConfirm).toBe('hello world');
  });

  it('pushes to dataLayer when tagManager is Loaded', () => {
    window.dataLayer = [];
    Analytics.tagManagerIsLoaded = true;
    Analytics.sendEvent(
      Analytics.getDataLayerOptions('woah nelly action', 'label'),
    );
    expect(window.dataLayer.length > 0).toBe(true);
  });
});
