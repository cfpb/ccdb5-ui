import introJs from 'intro.js';
import PropTypes from 'prop-types';
import { Component, isValidElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getIntroTarget, querySelector } from '../../utils/dom';

const WIDE_TOOLTIP_VIEWPORT_PADDING = 16;

/**
 * The welcome tooltip is taller than many viewports. intro.js centers it,
 * which puts the title above the window. Keep its top edge in view.
 */
export const alignWideTooltip = () => {
  const tooltip = querySelector('.introjs-tooltip.wide');
  if (!tooltip) {
    return;
  }
  const { top, bottom } = tooltip.getBoundingClientRect();
  const viewportBottom = innerHeight - WIDE_TOOLTIP_VIEWPORT_PADDING;
  if (top < WIDE_TOOLTIP_VIEWPORT_PADDING || bottom > viewportBottom) {
    scrollBy(0, top - WIDE_TOOLTIP_VIEWPORT_PADDING);
  }
};

/**
 * intro.js 8 sets tooltip `onclick` to null when a step has no click handler.
 * The DOM spec ignores a null listener. happy-dom stores it, then throws on click.
 * Subclasses keep their own copy of addEventListener, so each prototype is patched.
 */
const ignoreNullEventListeners = () => {
  const targets = [document.createElement('div'), document, globalThis];

  for (const target of targets) {
    let proto = target;
    while (proto) {
      const descriptor = Object.getOwnPropertyDescriptor(
        proto,
        'addEventListener',
      );
      const original = descriptor?.value;
      if (typeof original === 'function' && !original.ignoresNullListeners) {
        class NullSafeEventTarget {
          addEventListener(type, listener, options) {
            if (listener == null) {
              return;
            }
            return original.call(this, type, listener, options);
          }
        }
        const wrapped = NullSafeEventTarget.prototype.addEventListener;
        wrapped.ignoresNullListeners = true;
        proto.addEventListener = wrapped;
      }
      proto = Object.getPrototypeOf(proto);
    }
  }
};

const tourElementPropType =
  typeof Element === 'undefined'
    ? PropTypes.any
    : PropTypes.instanceOf(Element);

/**
 * Intro.js Steps wrapper scoped to the CCDB app root (shadow DOM when embedded).
 * intro.js uses document.querySelector for its overlay UI; we temporarily redirect
 * introjs-* lookups into the app root while the tour runs.
 */
export class TourSteps extends Component {
  static propTypes = {
    isEnabled: PropTypes.bool,
    initialStep: PropTypes.number.isRequired,
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        element: PropTypes.oneOfType([PropTypes.string, tourElementPropType]),
        intro: PropTypes.node.isRequired,
        position: PropTypes.string,
        tooltipClass: PropTypes.string,
        highlightClass: PropTypes.string,
      }),
    ).isRequired,
    onStart: PropTypes.func,
    onExit: PropTypes.func.isRequired,
    onBeforeExit: PropTypes.func,
    onBeforeChange: PropTypes.func,
    onAfterChange: PropTypes.func,
    onChange: PropTypes.func,
    onPreventChange: PropTypes.func,
    onComplete: PropTypes.func,
    options: PropTypes.object,
  };

  static defaultProps = {
    isEnabled: false,
    onStart: null,
    onBeforeExit: null,
    onBeforeChange: null,
    onAfterChange: null,
    onChange: null,
    onPreventChange: null,
    onComplete: null,
    options: {},
  };

  getCurrentStepIndex = () => {
    const intro = this.introJs;
    if (!intro) {
      return;
    }
    if (typeof intro.getCurrentStep === 'function') {
      return intro.getCurrentStep();
    }
    if (typeof intro.currentStep === 'function') {
      return intro.currentStep();
    }
    return intro._currentStep;
  };

  onExit = () => {
    const stepIndex = this.getCurrentStepIndex();
    this.introJs?._root?.remove();
    this.restoreDocumentQueryPatch();
    const { onExit } = this.props;
    this.isVisible = false;
    onExit(stepIndex);
  };

  onBeforeExit = () => {
    const { onBeforeExit } = this.props;
    if (onBeforeExit) {
      return onBeforeExit(this.getCurrentStepIndex());
    }
    return true;
  };

  onBeforeChange = (nextElement) => {
    if (!this.isVisible) {
      return true;
    }
    this.refreshAllStepElements();
    const { onBeforeChange, onPreventChange } = this.props;
    if (onBeforeChange) {
      const stepIndex = this.getCurrentStepIndex();
      const continueStep = onBeforeChange(stepIndex, nextElement);
      if (continueStep === false && onPreventChange) {
        setTimeout(() => {
          onPreventChange(stepIndex);
        }, 0);
      }
      return continueStep;
    }
    return true;
  };

  onAfterChange = (element) => {
    if (!this.isVisible) {
      return;
    }
    this.refreshAllStepElements();
    if (typeof this.introJs?.refresh === 'function') {
      this.introJs.refresh();
    }
    const { onAfterChange } = this.props;
    if (onAfterChange) {
      onAfterChange(this.getCurrentStepIndex(), element);
    }
    alignWideTooltip();
    setTimeout(alignWideTooltip, 0);
  };

  onChange = (element) => {
    if (!this.isVisible) {
      return;
    }
    const { onChange } = this.props;
    if (onChange) {
      onChange(this.getCurrentStepIndex(), element);
    }
  };

  onComplete = () => {
    const { onComplete } = this.props;
    if (onComplete) {
      onComplete();
    }
  };

  updateStepElement = (stepIndex) => {
    const step = this.introJs?._options?.steps?.[stepIndex];
    const selector = step?._selector;
    if (!selector) {
      return;
    }
    const element = querySelector(selector);
    if (!element) {
      return;
    }
    const introItem =
      this.introJs?._introItems?.[stepIndex] ??
      this.introJs.getSteps?.()?.[stepIndex];
    if (!introItem) {
      return;
    }
    introItem.element = element;
    introItem.position = step.position || 'auto';
  };

  refreshAllStepElements = () => {
    const steps = this.introJs?._options?.steps || [];
    for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
      this.updateStepElement(stepIndex);
    }
  };

  prepareStep = (step) => {
    const selector = typeof step.element === 'string' ? step.element : null;
    let intro = step.intro;
    if (isValidElement(intro)) {
      intro = renderToStaticMarkup(intro);
    }
    if (!selector) {
      return { ...step, intro };
    }
    const element = querySelector(selector);
    return {
      ...step,
      intro,
      _selector: selector,
      element: element || undefined,
    };
  };

  constructor(props) {
    super(props);
    this.introJs = null;
    this.isConfigured = false;
    this.isVisible = false;
    this._documentQuerySelector = null;
    this._documentQuerySelectorAll = null;
    this._queryTarget = null;
    this.installIntroJs();
  }

  componentDidMount() {
    if (!this.props.isEnabled) {
      return;
    }

    this.configureIntroJs();
    this.renderSteps();
  }

  componentDidUpdate(prevProps) {
    const { isEnabled, steps, options } = this.props;
    const isConfigChanged =
      !this.isConfigured ||
      prevProps.steps !== steps ||
      prevProps.options !== options;
    const isEnabledChanged = prevProps.isEnabled !== isEnabled;

    if (isConfigChanged) {
      this.configureIntroJs();
    }
    if (isConfigChanged || isEnabledChanged) {
      this.renderSteps();
    }
  }

  componentWillUnmount() {
    this.isVisible = false;
    this.restoreDocumentQueryPatch();
    const intro = this.introJs;
    if (!intro) {
      return;
    }
    // intro.js 8 exits asynchronously. Drop the callbacks first so tearing
    // down this instance leaves a remounted tour on screen.
    intro.onexit(() => true);
    intro.onbeforeexit(() => true);
    intro.exit(true);
  }

  enableDocumentQueryPatch() {
    const target = getIntroTarget();
    if (target === document.body || this._documentQuerySelector) {
      return;
    }

    this._queryTarget = target;
    this._documentQuerySelector = document.querySelector;
    this._documentQuerySelectorAll = document.querySelectorAll;

    document.querySelector = (selector) => {
      if (typeof selector === 'string' && selector.includes('introjs')) {
        const scoped = this._queryTarget.querySelector(selector);
        if (scoped) {
          return scoped;
        }
      }
      return this._documentQuerySelector.call(document, selector);
    };

    document.querySelectorAll = (selector) => {
      if (typeof selector === 'string' && selector.includes('introjs')) {
        const scoped = this._queryTarget.querySelectorAll(selector);
        if (scoped.length > 0) {
          return scoped;
        }
      }
      return this._documentQuerySelectorAll.call(document, selector);
    };
  }

  restoreDocumentQueryPatch() {
    if (!this._documentQuerySelector) {
      return;
    }
    document.querySelector = this._documentQuerySelector;
    document.querySelectorAll = this._documentQuerySelectorAll;
    this._documentQuerySelector = null;
    this._documentQuerySelectorAll = null;
    this._queryTarget = null;
  }

  installIntroJs() {
    if (globalThis.window === undefined) {
      return;
    }
    ignoreNullEventListeners();
    this.introJs = introJs.tour(getIntroTarget());
    this.introJs.onexit(this.onExit);
    this.introJs.onbeforeexit(this.onBeforeExit);
    this.introJs.onbeforechange(this.onBeforeChange);
    this.introJs.onafterchange(this.onAfterChange);
    this.introJs.onchange(this.onChange);
    this.introJs.oncomplete(this.onComplete);
  }

  /**
   * intro.js 8 leaves the previous root mounted and ignores a second start()
   * on that same instance. Each open gets a new tour.
   */
  retireIntro() {
    const previous = this.introJs;
    previous.onexit(() => true);
    previous.onbeforeexit(() => true);
    previous._root?.remove();
    this.installIntroJs();
    this.isConfigured = false;
    void previous.exit(true);
  }

  configureIntroJs() {
    const { options, steps } = this.props;
    const sanitizedSteps = steps.map((step) => this.prepareStep(step));
    this.introJs.setOptions({
      ...options,
      steps: sanitizedSteps,
    });
    this.isConfigured = true;
  }

  renderSteps() {
    const { isEnabled, steps, onStart } = this.props;
    if (isEnabled && steps.length > 0 && !this.isVisible) {
      this.retireIntro();
      this.enableDocumentQueryPatch();
      this.configureIntroJs();
      this.isVisible = true;
      // start() shows the first step. A new tour instance is required because
      // intro.js 8 will not start the same instance twice.
      this.introJs.start();
      this.refreshAllStepElements();
      if (onStart) {
        onStart(this.getCurrentStepIndex());
      }
    } else if (!isEnabled && this.isVisible) {
      this.isVisible = false;
      this.introJs.exit();
      this.restoreDocumentQueryPatch();
    }
  }

  render() {
    return null;
  }
}
