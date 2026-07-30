import introJs from 'intro.js';
import PropTypes from 'prop-types';
import { Component, isValidElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getIntroTarget, querySelector } from '../../utils/dom';

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
        element: PropTypes.oneOfType([
          PropTypes.string,
          typeof Element === 'undefined'
            ? PropTypes.any
            : PropTypes.instanceOf(Element),
        ]),
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
    if (this.props.isEnabled) {
      this.configureIntroJs();
      this.renderSteps();
    }
  }

  componentDidUpdate(prevProps) {
    const { isEnabled, steps, options } = this.props;
    const configChanged =
      !this.isConfigured ||
      prevProps.steps !== steps ||
      prevProps.options !== options;
    const enabledChanged = prevProps.isEnabled !== isEnabled;

    if (configChanged) {
      this.configureIntroJs();
    }
    if (configChanged || enabledChanged) {
      this.renderSteps();
    }
  }

  componentWillUnmount() {
    this.restoreDocumentQueryPatch();
    this.introJs?.exit();
  }

  onExit = () => {
    this.restoreDocumentQueryPatch();
    const { onExit } = this.props;
    this.isVisible = false;
    onExit(this.introJs._currentStep);
  };

  onBeforeExit = () => {
    const { onBeforeExit } = this.props;
    if (onBeforeExit) {
      return onBeforeExit(this.introJs._currentStep);
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
      const continueStep = onBeforeChange(
        this.introJs._currentStep,
        nextElement,
      );
      if (continueStep === false && onPreventChange) {
        setTimeout(() => {
          onPreventChange(this.introJs._currentStep);
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
      this.introJs.refresh(true);
    }
    const { onAfterChange } = this.props;
    if (onAfterChange) {
      onAfterChange(this.introJs._currentStep, element);
    }
  };

  onChange = (element) => {
    if (!this.isVisible) {
      return;
    }
    const { onChange } = this.props;
    if (onChange) {
      onChange(this.introJs._currentStep, element);
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
    const introItem = this.introJs?._introItems?.[stepIndex];
    const selector = step?._selector;
    if (!selector || !introItem) {
      return;
    }
    const element = querySelector(selector);
    if (element) {
      introItem.element = element;
      introItem.position = step.position || 'auto';
    }
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
        if (scoped.length) {
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
    if (typeof window === 'undefined') {
      return;
    }
    this.introJs = introJs(getIntroTarget());
    this.introJs.onexit(this.onExit);
    this.introJs.onbeforeexit(this.onBeforeExit);
    this.introJs.onbeforechange(this.onBeforeChange);
    this.introJs.onafterchange(this.onAfterChange);
    this.introJs.onchange(this.onChange);
    this.introJs.oncomplete(this.onComplete);
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
    const { isEnabled, initialStep, steps, onStart } = this.props;
    if (isEnabled && steps.length > 0 && !this.isVisible) {
      this.enableDocumentQueryPatch();
      this.configureIntroJs();
      this.introJs.start();
      this.refreshAllStepElements();
      this.isVisible = true;
      this.introJs.goToStepNumber(initialStep + 1);
      if (onStart) {
        onStart(this.introJs._currentStep);
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
