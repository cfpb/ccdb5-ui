const DEFAULT_MOUNT_ID = 'ccdb-ui-root';
const MODAL_PORTAL_ID = 'ccdb-ui-modal-portal';

const getConfig = () => {
  if (typeof window === 'undefined') {
    return {};
  }
  return window.__CCDB_CONFIG__ || {};
};

const escapeId = (id) => {
  if (typeof CSS !== 'undefined' && CSS.escape) {
    return CSS.escape(id);
  }
  return String(id).replace(/[^a-zA-Z0-9_-]/g, '\\\\$&');
};

export const getMountId = () => {
  const { mountId } = getConfig();
  return mountId || DEFAULT_MOUNT_ID;
};

export const getAppRoot = () => {
  const { root } = getConfig();
  if (!root) {
    return document;
  }
  if (typeof root === 'string') {
    return document.querySelector(root) || document;
  }
  if (root instanceof ShadowRoot || root instanceof HTMLElement) {
    return root;
  }
  return document;
};

export const getModalPortalParent = () => {
  const root = getAppRoot();
  if (root instanceof ShadowRoot) {
    const escaped = escapeId(MODAL_PORTAL_ID);
    let portal = root.querySelector(`#${escaped}`);
    if (!portal) {
      portal = document.createElement('div');
      portal.id = MODAL_PORTAL_ID;
      root.appendChild(portal);
    }
    return portal;
  }
  if (root instanceof HTMLElement) {
    return root;
  }
  return document.body;
};

export const getElementById = (id) => {
  const root = getAppRoot();
  const escaped = escapeId(id);
  if (root && root.querySelector) {
    const match = root.querySelector(`#${escaped}`);
    if (match) {
      return match;
    }
  }
  return document.getElementById(id);
};

export const getAppElement = () => {
  const mount = getElementById(getMountId());
  if (mount) {
    return mount;
  }
  const root = getAppRoot();
  if (root instanceof ShadowRoot) {
    return root.host || null;
  }
  if (root instanceof HTMLElement) {
    return root;
  }
  return null;
};

export const querySelector = (selector) => {
  const root = getAppRoot();
  if (root && root.querySelector) {
    const match = root.querySelector(selector);
    if (match) {
      return match;
    }
  }
  // Avoid matching host-page elements when the app runs inside a shadow root.
  if (root instanceof ShadowRoot) {
    return null;
  }
  return document.querySelector(selector);
};

export const querySelectorAll = (selector) => {
  const root = getAppRoot();
  if (root && root.querySelectorAll) {
    const matches = root.querySelectorAll(selector);
    if (matches && matches.length) {
      return matches;
    }
  }
  if (root instanceof ShadowRoot) {
    return [];
  }
  return document.querySelectorAll(selector);
};

export const getIntroTarget = () => {
  const root = getAppRoot();
  // intro.js calls getBoundingClientRect on its target element; ShadowRoot has no such API.
  if (root instanceof ShadowRoot) {
    return getModalPortalParent();
  }
  if (root instanceof HTMLElement) {
    return root;
  }
  return document.body;
};

export const resolveTourStepElements = (steps) => {
  if (!steps) {
    return steps;
  }
  return steps.map((step) => {
    if (!step?.element || typeof step.element !== 'string') {
      return step;
    }
    const element = querySelector(step.element);
    return element ? { ...step, element } : step;
  });
};

export const registerDomGlobals = () => {
  if (typeof window === 'undefined') {
    return;
  }
  window.__ccdbDom = {
    querySelector,
    querySelectorAll,
  };
};
