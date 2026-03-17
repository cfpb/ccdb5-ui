const DEFAULT_MOUNT_ID = 'ccdb-ui-root';

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
  return document.querySelectorAll(selector);
};
