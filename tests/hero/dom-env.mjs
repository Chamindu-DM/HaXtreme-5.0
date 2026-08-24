// tests/hero/dom-env.mjs
// Lightweight, fully-featured DOM & GSAP test environment for GSAP Hero testing

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class MockStyle {
  constructor() {
    this._props = {};
    this.transform = '';
    this.opacity = '1';
    this.visibility = 'visible';
    this.transformOrigin = '';
    this.overflow = 'visible';
    this.zIndex = '0';
    this.strokeDasharray = '';
    this.strokeDashoffset = '';
    this.width = '';
    this.height = '';

    return new Proxy(this, {
      get(target, prop) {
        if (typeof prop === 'symbol') return target[prop];
        if (prop in target) return target[prop];
        return target._props[prop] ?? '';
      },
      set(target, prop, value) {
        if (typeof prop === 'symbol') {
          target[prop] = value;
          return true;
        }
        const sVal = String(value);
        target._props[prop] = sVal;
        target[prop] = sVal;
        return true;
      }
    });
  }

  getPropertyValue(prop) {
    return this._props[prop] ?? this[prop] ?? '';
  }

  setProperty(prop, val) {
    this[prop] = String(val);
  }

  removeProperty(prop) {
    delete this._props[prop];
    delete this[prop];
  }
}

export class MockNode {
  constructor(nodeType = 1, nodeName = 'DIV') {
    this.nodeType = nodeType;
    this.nodeName = nodeName.toUpperCase();
    this.tagName = this.nodeName;
    this.id = '';
    this.className = '';
    this.style = new MockStyle();
    this.attributes = {};
    this.children = [];
    this.parentNode = null;
    this.dataset = {};
    this._listeners = {};
    this._textContent = '';
    this.ariaHidden = null;

    const self = this;
    this.classList = {
      _getClasses() {
        return self.className ? self.className.split(/\s+/).filter(Boolean) : [];
      },
      add(...classes) {
        const cur = new Set(this._getClasses());
        classes.forEach(c => cur.add(c));
        self.className = Array.from(cur).join(' ');
      },
      remove(...classes) {
        const cur = new Set(this._getClasses());
        classes.forEach(c => cur.delete(c));
        self.className = Array.from(cur).join(' ');
      },
      contains(c) {
        return this._getClasses().includes(c);
      },
      toggle(c) {
        if (this.contains(c)) {
          this.remove(c);
          return false;
        } else {
          this.add(c);
          return true;
        }
      }
    };
  }

  get textContent() {
    if (this._textContent) return this._textContent;
    if (this.children.length === 0) return '';
    return this.children.map(c => c.textContent).join('').trim();
  }

  set textContent(val) {
    this._textContent = val ? String(val).trim() : '';
  }

  getAttribute(name) {
    if (name === 'class') return this.className;
    if (name === 'id') return this.id;
    return this.attributes[name] ?? null;
  }

  setAttribute(name, val) {
    const sVal = String(val);
    if (name === 'class') {
      this.className = sVal;
    } else if (name === 'id') {
      this.id = sVal;
    } else if (name.startsWith('data-')) {
      const prop = name.slice(5).replace(/-([a-z])/g, (_, l) => l.toUpperCase());
      this.dataset[prop] = sVal;
      this.attributes[name] = sVal;
    } else {
      this.attributes[name] = sVal;
    }
  }

  removeAttribute(name) {
    if (name === 'class') this.className = '';
    else if (name === 'id') this.id = '';
    else delete this.attributes[name];
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parentNode = null;
    }
    return child;
  }

  insertBefore(newChild, refChild) {
    newChild.parentNode = this;
    const idx = this.children.indexOf(refChild);
    if (idx !== -1) {
      this.children.splice(idx, 0, newChild);
    } else {
      this.children.push(newChild);
    }
    return newChild;
  }

  contains(node) {
    if (node === this) return true;
    let cur = node ? node.parentNode : null;
    while (cur) {
      if (cur === this) return true;
      cur = cur.parentNode;
    }
    return false;
  }

  addEventListener(type, listener) {
    if (!this._listeners[type]) this._listeners[type] = [];
    this._listeners[type].push(listener);
  }

  removeEventListener(type, listener) {
    if (this._listeners[type]) {
      this._listeners[type] = this._listeners[type].filter(l => l !== listener);
    }
  }

  dispatchEvent(event) {
    const list = this._listeners[event.type] || [];
    list.forEach(l => l.call(this, event));
    return !event.defaultPrevented;
  }

  getBoundingClientRect() {
    return { top: 0, left: 0, width: 100, height: 100, bottom: 100, right: 100, x: 0, y: 0 };
  }

  getTotalLength() {
    return 600.304;
  }

  matches(selector) {
    const sel = selector.trim();
    if (!sel) return false;

    if (sel.includes(',')) {
      return sel.split(',').some(part => this.matches(part.trim()));
    }

    let baseSel = sel;
    let checkFirstChild = false;
    let checkLastChild = false;
    let checkFirstOfType = false;
    let checkLastOfType = false;

    if (baseSel.includes(':first-child')) {
      checkFirstChild = true;
      baseSel = baseSel.replace(/:first-child/g, '');
    }
    if (baseSel.includes(':last-child')) {
      checkLastChild = true;
      baseSel = baseSel.replace(/:last-child/g, '');
    }
    if (baseSel.includes(':first-of-type')) {
      checkFirstOfType = true;
      baseSel = baseSel.replace(/:first-of-type/g, '');
    }
    if (baseSel.includes(':last-of-type')) {
      checkLastOfType = true;
      baseSel = baseSel.replace(/:last-of-type/g, '');
    }

    if (checkFirstChild) {
      if (!this.parentNode || this.parentNode.children[0] !== this) return false;
    }
    if (checkLastChild) {
      if (!this.parentNode || this.parentNode.children[this.parentNode.children.length - 1] !== this) return false;
    }
    if (checkFirstOfType) {
      if (!this.parentNode) return false;
      const sameType = this.parentNode.children.filter(c => c.tagName === this.tagName);
      if (sameType[0] !== this) return false;
    }
    if (checkLastOfType) {
      if (!this.parentNode) return false;
      const sameType = this.parentNode.children.filter(c => c.tagName === this.tagName);
      if (sameType[sameType.length - 1] !== this) return false;
    }

    if (!baseSel) return true;

    if (baseSel.startsWith('#')) {
      return this.id === baseSel.slice(1);
    }

    if (baseSel.startsWith('.')) {
      const classes = baseSel.slice(1).split('.').filter(Boolean);
      return classes.every(c => this.classList.contains(c));
    }

    const match = baseSel.match(/^([a-zA-Z0-9_-]+)(.*)$/);
    if (match) {
      const tag = match[1].toUpperCase();
      const rest = match[2];
      if (tag !== '*' && this.tagName !== tag) return false;
      if (!rest) return true;
      if (rest.startsWith('#')) {
        return this.id === rest.slice(1);
      }
      if (rest.startsWith('.')) {
        const classes = rest.slice(1).split('.').filter(Boolean);
        return classes.every(c => this.classList.contains(c));
      }
    }

    return false;
  }

  querySelector(selector) {
    const results = this.querySelectorAll(selector);
    return results[0] || null;
  }

  querySelectorAll(selector) {
    const sel = selector.trim();
    if (sel.includes(',')) {
      const parts = sel.split(',').map(s => s.trim());
      const set = new Set();
      for (const part of parts) {
        for (const el of this.querySelectorAll(part)) {
          set.add(el);
        }
      }
      return Array.from(set);
    }

    const rawTokens = sel.split(/([>+~]|\s+)/).map(s => s.trim()).filter(Boolean);
    let curComb = ' ';
    const tokens = [];

    for (let i = 0; i < rawTokens.length; i++) {
      const t = rawTokens[i];
      if (t === '>' || t === '+' || t === '~') {
        curComb = t;
      } else {
        tokens.push({ comb: curComb, sel: t });
        curComb = ' ';
      }
    }

    if (tokens.length === 0) return [];

    let currentSet = this._getAllDescendants().filter(n => n.matches(tokens[0].sel));

    for (let i = 1; i < tokens.length; i++) {
      const { comb, sel: subSel } = tokens[i];
      const nextSet = new Set();
      for (const parent of currentSet) {
        if (comb === '>') {
          for (const child of parent.children) {
            if (child.matches(subSel)) nextSet.add(child);
          }
        } else {
          for (const desc of parent._getAllDescendants()) {
            if (desc.matches(subSel)) nextSet.add(desc);
          }
        }
      }
      currentSet = Array.from(nextSet);
    }

    return currentSet;
  }

  _getAllDescendants() {
    const list = [];
    const traverse = (node) => {
      for (const child of node.children) {
        list.push(child);
        traverse(child);
      }
    };
    traverse(this);
    return list;
  }
}

export function parseHTMLToMockDOM(htmlStr) {
  const root = new MockNode(1, 'DIV');
  root.className = 'test-root';

  const stack = [root];
  const voidTags = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source']);
  const tagRegex = /<!--[\s\S]*?-->|<(\/)?([a-zA-Z0-9:-]+)([^>]*?)(\/)?>|([^<]+)/g;
  let match;

  while ((match = tagRegex.exec(htmlStr)) !== null) {
    const [full, isClose, tagName, attrStr, isSelfClose, textContent] = match;

    if (full.startsWith('<!--')) {
      continue;
    }

    if (textContent) {
      const trimmed = textContent.trim();
      if (trimmed) {
        const parent = stack[stack.length - 1];
        if (parent) {
          parent.textContent = trimmed;
        }
      }
      continue;
    }

    if (tagName) {
      const lowerTag = tagName.toLowerCase();
      if (isClose) {
        for (let i = stack.length - 1; i > 0; i--) {
          if (stack[i].tagName.toLowerCase() === lowerTag) {
            stack.splice(i);
            break;
          }
        }
      } else {
        const node = new MockNode(1, tagName);
        if (attrStr) {
          const attrRegex = /([a-zA-Z0-9_:-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^>\s]+)))?/g;
          let attrMatch;
          while ((attrMatch = attrRegex.exec(attrStr)) !== null) {
            const attrName = attrMatch[1];
            const attrVal = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';
            node.setAttribute(attrName, attrVal);
          }
        }

        const parent = stack[stack.length - 1];
        parent.appendChild(node);

        if (!isSelfClose && !voidTags.has(lowerTag)) {
          stack.push(node);
        }
      }
    }
  }

  return root.children[0] || root;
}

let globalDocElement = null;
let globalBody = null;

export function evaluateMediaQuery(query, windowWidth, reducedMotion) {
  const parts = query.split(/\s+and\s+/i);
  return parts.every(part => {
    const clean = part.trim().replace(/^\(|\)$/g, '');
    const minWidthMatch = clean.match(/min-width:\s*(\d+)px/i);
    if (minWidthMatch) {
      return windowWidth >= parseInt(minWidthMatch[1], 10);
    }
    const maxWidthMatch = clean.match(/max-width:\s*(\d+)px/i);
    if (maxWidthMatch) {
      return windowWidth <= parseInt(maxWidthMatch[1], 10);
    }
    if (clean.includes('prefers-reduced-motion: reduce')) {
      return reducedMotion === true;
    }
    if (clean.includes('prefers-reduced-motion: no-preference')) {
      return reducedMotion === false;
    }
    return true;
  });
}

export function setupDOMEnvironment(options = {}) {
  const windowWidth = options.innerWidth ?? 1920;
  const windowHeight = options.innerHeight ?? 1080;
  const reducedMotion = options.reducedMotion ?? false;

  globalDocElement = new MockNode(1, 'HTML');
  globalBody = new MockNode(1, 'BODY');
  globalDocElement.appendChild(globalBody);

  const listeners = {
    resize: [],
    mousemove: []
  };

  const mediaListeners = [];

  const windowObj = {
    innerWidth: windowWidth,
    innerHeight: windowHeight,
    HTMLElement: MockNode,
    Element: MockNode,
    Node: MockNode,
    SVGElement: MockNode,
    addEventListener(type, fn) {
      if (!listeners[type]) listeners[type] = [];
      listeners[type].push(fn);
    },
    removeEventListener(type, fn) {
      if (listeners[type]) {
        listeners[type] = listeners[type].filter(f => f !== fn);
      }
    },
    dispatchEvent(event) {
      const fns = listeners[event.type] || [];
      fns.forEach(fn => fn(event));
    },
    matchMedia(query) {
      const matches = evaluateMediaQuery(query, windowObj.innerWidth, reducedMotion);
      const mediaObj = {
        get matches() {
          return evaluateMediaQuery(query, windowObj.innerWidth, reducedMotion);
        },
        media: query,
        addListener(fn) { mediaListeners.push(fn); },
        removeListener(fn) {
          const idx = mediaListeners.indexOf(fn);
          if (idx !== -1) mediaListeners.splice(idx, 1);
        },
        addEventListener(type, fn) { this.addListener(fn); },
        removeEventListener(type, fn) { this.removeListener(fn); }
      };
      return mediaObj;
    },
    requestAnimationFrame(cb) { return setTimeout(cb, 16); },
    cancelAnimationFrame(id) { clearTimeout(id); },
    getComputedStyle(el) { return el && el.style ? el.style : new MockStyle(); },
    document: null
  };

  const documentObj = {
    createElement(tag) { return new MockNode(1, tag.toUpperCase()); },
    createElementNS(ns, tag) { return new MockNode(1, tag.toUpperCase()); },
    documentElement: globalDocElement,
    body: globalBody,
    getElementById(id) {
      const list = globalDocElement._getAllDescendants();
      return list.find(el => el.id === id) || null;
    },
    querySelector(sel) {
      return globalDocElement.querySelector(sel);
    },
    querySelectorAll(sel) {
      return globalDocElement.querySelectorAll(sel);
    }
  };

  windowObj.document = documentObj;

  globalThis.window = windowObj;
  globalThis.document = documentObj;
  globalThis.getComputedStyle = windowObj.getComputedStyle;
  globalThis.HTMLElement = MockNode;
  globalThis.Element = MockNode;
  globalThis.Node = MockNode;
  globalThis.SVGElement = MockNode;

  return {
    window: windowObj,
    document: documentObj,
    listeners
  };
}

export function loadHeroHTML() {
  const heroHtmlPath = path.resolve(__dirname, '../../src/components/GSAP_Hero/hero.html');
  const htmlContent = fs.readFileSync(heroHtmlPath, 'utf8');
  return parseHTMLToMockDOM(htmlContent);
}
