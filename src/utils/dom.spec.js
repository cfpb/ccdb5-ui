import {
  getAppElement,
  getAppRoot,
  getElementById,
  getIntroTarget,
  getModalPortalParent,
  getOverlayPortalParent,
  getMountId,
  querySelector,
  querySelectorAll,
  registerDomGlobals,
  resolveTourStepElements,
} from './dom';

const clearConfig = () => {
  delete window.__CCDB_CONFIG__;
};

describe('dom utilities', () => {
  afterEach(() => {
    clearConfig();
    document.body.innerHTML = '';
  });

  describe('getMountId', () => {
    it('returns the default mount id', () => {
      expect(getMountId()).toBe('ccdb-ui-root');
    });

    it('returns a configured mount id', () => {
      window.__CCDB_CONFIG__ = { mountId: 'custom-root' };
      expect(getMountId()).toBe('custom-root');
    });
  });

  describe('getAppRoot', () => {
    it('returns document when no root is configured', () => {
      expect(getAppRoot()).toBe(document);
    });

    it('returns an element matched by a string selector', () => {
      const host = document.createElement('div');
      host.id = 'app-host';
      document.body.appendChild(host);
      window.__CCDB_CONFIG__ = { root: '#app-host' };
      expect(getAppRoot()).toBe(host);
    });

    it('falls back to document when a string selector does not match', () => {
      window.__CCDB_CONFIG__ = { root: '#missing-host' };
      expect(getAppRoot()).toBe(document);
    });

    it('returns a shadow root when configured', () => {
      const host = document.createElement('div');
      const shadow = host.attachShadow({ mode: 'open' });
      window.__CCDB_CONFIG__ = { root: shadow };
      expect(getAppRoot()).toBe(shadow);
    });

    it('returns an HTMLElement when configured', () => {
      const host = document.createElement('div');
      window.__CCDB_CONFIG__ = { root: host };
      expect(getAppRoot()).toBe(host);
    });
  });

  describe('getModalPortalParent', () => {
    it('returns document.body by default', () => {
      expect(getModalPortalParent()).toBe(document.body);
    });

    it('creates and returns a portal inside a shadow root', () => {
      const host = document.createElement('div');
      const shadow = host.attachShadow({ mode: 'open' });
      window.__CCDB_CONFIG__ = { root: shadow };

      const portal = getModalPortalParent();
      expect(portal.id).toBe('ccdb-ui-modal-portal');
      expect(shadow.querySelector('#ccdb-ui-modal-portal')).toBe(portal);

      const portalAgain = getModalPortalParent();
      expect(portalAgain).toBe(portal);
    });

    it('returns an HTMLElement root directly', () => {
      const host = document.createElement('div');
      window.__CCDB_CONFIG__ = { root: host };
      expect(getModalPortalParent()).toBe(host);
    });
  });

  describe('getOverlayPortalParent', () => {
    it('returns document.body by default', () => {
      expect(getOverlayPortalParent()).toBe(document.body);
    });

    it('creates and returns an overlay portal inside a shadow root', () => {
      const host = document.createElement('div');
      const shadow = host.attachShadow({ mode: 'open' });
      window.__CCDB_CONFIG__ = { root: shadow };

      const portal = getOverlayPortalParent();
      expect(portal.id).toBe('ccdb-ui-overlay-portal');
      expect(portal.className).toBe('ccdb-ui-overlay-portal');
      expect(shadow.querySelector('#ccdb-ui-overlay-portal')).toBe(portal);

      const portalAgain = getOverlayPortalParent();
      expect(portalAgain).toBe(portal);
    });

    it('returns an HTMLElement root directly', () => {
      const host = document.createElement('div');
      window.__CCDB_CONFIG__ = { root: host };
      expect(getOverlayPortalParent()).toBe(host);
    });
  });

  describe('getElementById', () => {
    it('finds elements inside the configured root', () => {
      const host = document.createElement('div');
      host.id = 'ccdb-ui-root';
      document.body.appendChild(host);
      window.__CCDB_CONFIG__ = { root: host };

      expect(getElementById('ccdb-ui-root')).toBe(host);
    });

    it('falls back to document.getElementById', () => {
      const el = document.createElement('div');
      el.id = 'document-only';
      document.body.appendChild(el);

      expect(getElementById('document-only')).toBe(el);
    });
  });

  describe('getAppElement', () => {
    it('returns the mount element when present', () => {
      const mount = document.createElement('div');
      mount.id = 'ccdb-ui-root';
      document.body.appendChild(mount);

      expect(getAppElement()).toBe(mount);
    });

    it('returns the shadow host when mount is missing', () => {
      const host = document.createElement('div');
      const shadow = host.attachShadow({ mode: 'open' });
      document.body.appendChild(host);
      window.__CCDB_CONFIG__ = { root: shadow };

      expect(getAppElement()).toBe(host);
    });

    it('returns an HTMLElement root when mount is missing', () => {
      const host = document.createElement('div');
      window.__CCDB_CONFIG__ = { root: host };

      expect(getAppElement()).toBe(host);
    });

    it('returns null when no mount or root element is available', () => {
      expect(getAppElement()).toBeNull();
    });
  });

  describe('querySelector', () => {
    it('queries inside the configured root first', () => {
      const host = document.createElement('div');
      const inner = document.createElement('span');
      inner.className = 'scoped-target';
      host.appendChild(inner);
      window.__CCDB_CONFIG__ = { root: host };

      expect(querySelector('.scoped-target')).toBe(inner);
    });

    it('does not fall back to document when the root is a shadow root', () => {
      const host = document.createElement('div');
      const shadow = host.attachShadow({ mode: 'open' });
      document.body.appendChild(host);

      const docTarget = document.createElement('p');
      docTarget.className = 'doc-target';
      document.body.appendChild(docTarget);

      window.__CCDB_CONFIG__ = { root: shadow };

      expect(querySelector('.doc-target')).toBeNull();
    });

    it('falls back to document when the root has no match', () => {
      const docTarget = document.createElement('p');
      docTarget.className = 'doc-target';
      document.body.appendChild(docTarget);

      const host = document.createElement('div');
      window.__CCDB_CONFIG__ = { root: host };

      expect(querySelector('.doc-target')).toBe(docTarget);
    });
  });

  describe('querySelectorAll', () => {
    it('returns matches from the configured root', () => {
      const host = document.createElement('div');
      host.appendChild(document.createElement('span'));
      host.appendChild(document.createElement('span'));
      window.__CCDB_CONFIG__ = { root: host };

      expect(querySelectorAll('span').length).toBe(2);
    });

    it('does not fall back to document when the root is a shadow root', () => {
      const host = document.createElement('div');
      const shadow = host.attachShadow({ mode: 'open' });
      document.body.appendChild(host);
      document.body.appendChild(document.createElement('li'));

      window.__CCDB_CONFIG__ = { root: shadow };

      expect(querySelectorAll('li').length).toBe(0);
    });

    it('falls back to document when the root has no matches', () => {
      document.body.appendChild(document.createElement('li'));
      const host = document.createElement('div');
      window.__CCDB_CONFIG__ = { root: host };

      expect(querySelectorAll('li').length).toBe(1);
    });
  });

  describe('getIntroTarget', () => {
    it('returns document.body when the root is document', () => {
      expect(getIntroTarget()).toBe(document.body);
    });

    it('returns a portal element inside a shadow root when configured', () => {
      const host = document.createElement('div');
      const shadow = host.attachShadow({ mode: 'open' });
      window.__CCDB_CONFIG__ = { root: shadow };

      const target = getIntroTarget();
      expect(target).toBeInstanceOf(HTMLElement);
      expect(target.id).toBe('ccdb-ui-modal-portal');
      expect(shadow.contains(target)).toBe(true);
      expect(typeof target.getBoundingClientRect).toBe('function');
    });

    it('returns an HTMLElement when configured', () => {
      const host = document.createElement('div');
      window.__CCDB_CONFIG__ = { root: host };

      expect(getIntroTarget()).toBe(host);
    });
  });

  describe('resolveTourStepElements', () => {
    it('returns undefined steps unchanged', () => {
      expect(resolveTourStepElements(undefined)).toBeUndefined();
    });

    it('resolves string selectors to elements', () => {
      const target = document.createElement('div');
      target.className = 'tour-target';
      document.body.appendChild(target);

      const steps = resolveTourStepElements([
        { element: '.tour-target', intro: 'Step one' },
      ]);

      expect(steps[0].element).toBe(target);
    });

    it('keeps unresolved string selectors for later resolution', () => {
      const steps = resolveTourStepElements([
        { element: '.missing-target', intro: 'Step one' },
      ]);

      expect(steps[0].element).toBe('.missing-target');
    });

    it('keeps non-string step elements', () => {
      const element = document.createElement('div');
      const steps = resolveTourStepElements([{ element, intro: 'Step one' }]);

      expect(steps[0].element).toBe(element);
    });
  });

  describe('registerDomGlobals', () => {
    it('exposes scoped query helpers on window', () => {
      registerDomGlobals();

      expect(window.__ccdbDom.querySelector).toBe(querySelector);
      expect(window.__ccdbDom.querySelectorAll).toBe(querySelectorAll);
    });
  });
});
