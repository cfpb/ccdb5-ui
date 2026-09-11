import { render } from '@testing-library/react';
import { TourSteps } from './tour-steps';
import introJs from 'intro.js';
import { getIntroTarget, getModalPortalParent } from '../../utils/dom';

rs.mock('intro.js');

const createIntroMock = () => ({
  onexit: rs.fn().mockReturnThis(),
  onbeforeexit: rs.fn().mockReturnThis(),
  onbeforechange: rs.fn().mockReturnThis(),
  onafterchange: rs.fn().mockReturnThis(),
  onchange: rs.fn().mockReturnThis(),
  oncomplete: rs.fn().mockReturnThis(),
  setOptions: rs.fn(),
  start: rs.fn(),
  exit: rs.fn(),
  goToStepNumber: rs.fn(),
  currentStep: rs.fn(() => 0),
  _currentStep: 0,
  _options: { steps: [] },
  _introItems: [],
});

const defaultSteps = [{ element: document.body, intro: 'Welcome' }];

describe('TourSteps', () => {
  let introInstance;

  beforeEach(() => {
    introInstance = createIntroMock();
    introJs.mockImplementation(() => introInstance);
    delete globalThis.__CCDB_CONFIG__;
  });

  afterEach(() => {
    delete globalThis.__CCDB_CONFIG__;
    document.body.replaceChildren();
    rs.clearAllMocks();
  });

  it('starts intro.js when enabled on mount', () => {
    render(
      <TourSteps
        isEnabled={true}
        initialStep={0}
        steps={defaultSteps}
        onExit={rs.fn()}
        options={{}}
      />,
    );

    expect(introJs).toHaveBeenCalledWith(getIntroTarget());
    expect(introInstance.setOptions).toHaveBeenCalled();
    expect(introInstance.start).toHaveBeenCalled();
    expect(introInstance.goToStepNumber).toHaveBeenCalledWith(1);
  });

  it('exits intro.js when disabled after being enabled', () => {
    const { rerender } = render(
      <TourSteps
        isEnabled={true}
        initialStep={0}
        steps={defaultSteps}
        onExit={rs.fn()}
        options={{}}
      />,
    );

    rerender(
      <TourSteps
        isEnabled={false}
        initialStep={0}
        steps={defaultSteps}
        onExit={rs.fn()}
        options={{}}
      />,
    );

    expect(introInstance.exit).toHaveBeenCalled();
  });

  it('calls onExit when intro.js exits', () => {
    const onExit = rs.fn();
    let exitCallback;

    introInstance.onexit.mockImplementation((callback) => {
      exitCallback = callback;
      return introInstance;
    });

    render(
      <TourSteps
        isEnabled={true}
        initialStep={0}
        steps={defaultSteps}
        onExit={onExit}
        options={{}}
      />,
    );

    exitCallback();
    expect(onExit).toHaveBeenCalledWith(0);
  });

  it('scopes introjs document queries to a shadow root while active', () => {
    const host = document.createElement('div');
    const shadow = host.attachShadow({ mode: 'open' });
    document.body.append(host);
    globalThis.__CCDB_CONFIG__ = { root: shadow };
    const portal = getModalPortalParent();
    const overlay = document.createElement('div');
    overlay.className = 'introjs-helperLayer';
    portal.append(overlay);

    const originalQuerySelector = document.querySelector;

    const { rerender } = render(
      <TourSteps
        isEnabled={true}
        initialStep={0}
        steps={defaultSteps}
        onExit={rs.fn()}
        options={{}}
      />,
    );

    expect(document.querySelector('.introjs-helperLayer')).toBe(overlay);

    rerender(
      <TourSteps
        isEnabled={false}
        initialStep={0}
        steps={defaultSteps}
        onExit={rs.fn()}
        options={{}}
      />,
    );

    expect(document.querySelector).toBe(originalQuerySelector);
  });
});
