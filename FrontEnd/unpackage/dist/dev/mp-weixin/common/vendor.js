"use strict";
/**
* @vue/shared v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function makeMap(str, expectsLowerCase) {
  const set2 = new Set(str.split(","));
  return expectsLowerCase ? (val) => set2.has(val.toLowerCase()) : (val) => set2.has(val);
}
const EMPTY_OBJ = Object.freeze({});
const EMPTY_ARR = Object.freeze([]);
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const isBuiltInDirective = /* @__PURE__ */ makeMap(
  "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction((str) => {
  const s = str ? `on${capitalize(str)}` : ``;
  return s;
});
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns$1 = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const looseToNumber = (val) => {
  const n2 = parseFloat(val);
  return isNaN(n2) ? val : n2;
};
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
};
const LOCALE_ZH_HANS = "zh-Hans";
const LOCALE_ZH_HANT = "zh-Hant";
const LOCALE_EN = "en";
const LOCALE_FR = "fr";
const LOCALE_ES = "es";
function include(str, parts) {
  return !!parts.find((part) => str.indexOf(part) !== -1);
}
function startsWith(str, parts) {
  return parts.find((part) => str.indexOf(part) === 0);
}
function normalizeLocale(locale, messages) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, "-");
  if (messages && messages[locale]) {
    return locale;
  }
  locale = locale.toLowerCase();
  if (locale === "chinese") {
    return LOCALE_ZH_HANS;
  }
  if (locale.indexOf("zh") === 0) {
    if (locale.indexOf("-hans") > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("-hant") > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  let locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
  if (messages && Object.keys(messages).length > 0) {
    locales = Object.keys(messages);
  }
  const lang = startsWith(locale, locales);
  if (lang) {
    return lang;
  }
}
const SLOT_DEFAULT_NAME = "d";
const ON_SHOW = "onShow";
const ON_HIDE = "onHide";
const ON_LAUNCH = "onLaunch";
const ON_ERROR = "onError";
const ON_THEME_CHANGE = "onThemeChange";
const ON_PAGE_NOT_FOUND = "onPageNotFound";
const ON_UNHANDLE_REJECTION = "onUnhandledRejection";
const ON_EXIT = "onExit";
const ON_LOAD = "onLoad";
const ON_READY = "onReady";
const ON_UNLOAD = "onUnload";
const ON_INIT = "onInit";
const ON_SAVE_EXIT_STATE = "onSaveExitState";
const ON_RESIZE = "onResize";
const ON_BACK_PRESS = "onBackPress";
const ON_PAGE_SCROLL = "onPageScroll";
const ON_TAB_ITEM_TAP = "onTabItemTap";
const ON_REACH_BOTTOM = "onReachBottom";
const ON_PULL_DOWN_REFRESH = "onPullDownRefresh";
const ON_SHARE_TIMELINE = "onShareTimeline";
const ON_SHARE_CHAT = "onShareChat";
const ON_ADD_TO_FAVORITES = "onAddToFavorites";
const ON_SHARE_APP_MESSAGE = "onShareAppMessage";
const ON_NAVIGATION_BAR_BUTTON_TAP = "onNavigationBarButtonTap";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED = "onNavigationBarSearchInputClicked";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED = "onNavigationBarSearchInputChanged";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED = "onNavigationBarSearchInputConfirmed";
const ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED = "onNavigationBarSearchInputFocusChanged";
const VIRTUAL_HOST_STYLE = "virtualHostStyle";
const VIRTUAL_HOST_CLASS = "virtualHostClass";
const VIRTUAL_HOST_HIDDEN = "virtualHostHidden";
const VIRTUAL_HOST_ID = "virtualHostId";
function hasLeadingSlash(str) {
  return str.indexOf("/") === 0;
}
function addLeadingSlash(str) {
  return hasLeadingSlash(str) ? str : "/" + str;
}
const invokeArrayFns = (fns, arg) => {
  let ret;
  for (let i = 0; i < fns.length; i++) {
    ret = fns[i](arg);
  }
  return ret;
};
function once(fn, ctx = null) {
  let res;
  return (...args) => {
    if (fn) {
      res = fn.apply(ctx, args);
      fn = null;
    }
    return res;
  };
}
function getValueByDataPath(obj, path) {
  if (!isString(path)) {
    return;
  }
  path = path.replace(/\[(\d+)\]/g, ".$1");
  const parts = path.split(".");
  let key = parts[0];
  if (!obj) {
    obj = {};
  }
  if (parts.length === 1) {
    return obj[key];
  }
  return getValueByDataPath(obj[key], parts.slice(1).join("."));
}
function sortObject(obj) {
  let sortObj = {};
  if (isPlainObject(obj)) {
    Object.keys(obj).sort().forEach((key) => {
      const _key = key;
      sortObj[_key] = obj[_key];
    });
  }
  return !Object.keys(sortObj) ? obj : sortObj;
}
const customizeRE = /:/g;
function customizeEvent(str) {
  return camelize(str.replace(customizeRE, "-"));
}
const encode = encodeURIComponent;
function stringifyQuery(obj, encodeStr = encode) {
  const res = obj ? Object.keys(obj).map((key) => {
    let val = obj[key];
    if (typeof val === void 0 || val === null) {
      val = "";
    } else if (isPlainObject(val)) {
      val = JSON.stringify(val);
    }
    return encodeStr(key) + "=" + encodeStr(val);
  }).filter((x) => x.length > 0).join("&") : null;
  return res ? `?${res}` : "";
}
const PAGE_HOOKS = [
  ON_INIT,
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_SHARE_APP_MESSAGE,
  ON_SHARE_CHAT,
  ON_ADD_TO_FAVORITES,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED
];
function isRootHook(name) {
  return PAGE_HOOKS.indexOf(name) > -1;
}
const UniLifecycleHooks = [
  ON_SHOW,
  ON_HIDE,
  ON_LAUNCH,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION,
  ON_EXIT,
  ON_INIT,
  ON_LOAD,
  ON_READY,
  ON_UNLOAD,
  ON_RESIZE,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_ADD_TO_FAVORITES,
  ON_SHARE_APP_MESSAGE,
  ON_SHARE_CHAT,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED
];
const MINI_PROGRAM_PAGE_RUNTIME_HOOKS = /* @__PURE__ */ (() => {
  return {
    onPageScroll: 1,
    onShareAppMessage: 1 << 1,
    onShareTimeline: 1 << 2
  };
})();
function isUniLifecycleHook(name, value, checkType = true) {
  if (checkType && !isFunction(value)) {
    return false;
  }
  if (UniLifecycleHooks.indexOf(name) > -1) {
    return true;
  } else if (name.indexOf("on") === 0) {
    return true;
  }
  return false;
}
let vueApp;
const createVueAppHooks = [];
function onCreateVueApp(hook) {
  if (vueApp) {
    return hook(vueApp);
  }
  createVueAppHooks.push(hook);
}
function invokeCreateVueAppHook(app2) {
  vueApp = app2;
  createVueAppHooks.forEach((hook) => hook(app2));
}
const invokeCreateErrorHandler = once((app2, createErrorHandler2) => {
  return createErrorHandler2(app2);
});
const E = function() {
};
E.prototype = {
  _id: 1,
  on: function(name, callback, ctx) {
    var e2 = this.e || (this.e = {});
    (e2[name] || (e2[name] = [])).push({
      fn: callback,
      ctx,
      _id: this._id
    });
    return this._id++;
  },
  once: function(name, callback, ctx) {
    var self2 = this;
    function listener() {
      self2.off(name, listener);
      callback.apply(ctx, arguments);
    }
    listener._ = callback;
    return this.on(name, listener, ctx);
  },
  emit: function(name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;
    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }
    return this;
  },
  off: function(name, event) {
    var e2 = this.e || (this.e = {});
    var evts = e2[name];
    var liveEvents = [];
    if (evts && event) {
      for (var i = evts.length - 1; i >= 0; i--) {
        if (evts[i].fn === event || evts[i].fn._ === event || evts[i]._id === event) {
          evts.splice(i, 1);
          break;
        }
      }
      liveEvents = evts;
    }
    liveEvents.length ? e2[name] = liveEvents : delete e2[name];
    return this;
  }
};
var E$1 = E;
/**
* @dcloudio/uni-mp-vue v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function warn$2(msg, ...args) {
  console.warn(`[Vue warn] ${msg}`, ...args);
}
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    } else {
      warn$2(`cannot run an inactive effect scope.`);
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function recordEffectScope(effect2, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect2);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
let activeEffect;
class ReactiveEffect {
  constructor(fn, trigger2, scheduler, scope) {
    this.fn = fn;
    this.trigger = trigger2;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this._dirtyLevel = 4;
    this._trackId = 0;
    this._runnings = 0;
    this._shouldSchedule = false;
    this._depsLength = 0;
    recordEffectScope(this, scope);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1;
      pauseTracking();
      for (let i = 0; i < this._depsLength; i++) {
        const dep = this.deps[i];
        if (dep.computed) {
          triggerComputed(dep.computed);
          if (this._dirtyLevel >= 4) {
            break;
          }
        }
      }
      if (this._dirtyLevel === 1) {
        this._dirtyLevel = 0;
      }
      resetTracking();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(v) {
    this._dirtyLevel = v ? 4 : 0;
  }
  run() {
    this._dirtyLevel = 0;
    if (!this.active) {
      return this.fn();
    }
    let lastShouldTrack = shouldTrack;
    let lastEffect = activeEffect;
    try {
      shouldTrack = true;
      activeEffect = this;
      this._runnings++;
      preCleanupEffect(this);
      return this.fn();
    } finally {
      postCleanupEffect(this);
      this._runnings--;
      activeEffect = lastEffect;
      shouldTrack = lastShouldTrack;
    }
  }
  stop() {
    var _a;
    if (this.active) {
      preCleanupEffect(this);
      postCleanupEffect(this);
      (_a = this.onStop) == null ? void 0 : _a.call(this);
      this.active = false;
    }
  }
}
function triggerComputed(computed2) {
  return computed2.value;
}
function preCleanupEffect(effect2) {
  effect2._trackId++;
  effect2._depsLength = 0;
}
function postCleanupEffect(effect2) {
  if (effect2.deps.length > effect2._depsLength) {
    for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
      cleanupDepEffect(effect2.deps[i], effect2);
    }
    effect2.deps.length = effect2._depsLength;
  }
}
function cleanupDepEffect(dep, effect2) {
  const trackId = dep.get(effect2);
  if (trackId !== void 0 && effect2._trackId !== trackId) {
    dep.delete(effect2);
    if (dep.size === 0) {
      dep.cleanup();
    }
  }
}
let shouldTrack = true;
let pauseScheduleStack = 0;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function pauseScheduling() {
  pauseScheduleStack++;
}
function resetScheduling() {
  pauseScheduleStack--;
  while (!pauseScheduleStack && queueEffectSchedulers.length) {
    queueEffectSchedulers.shift()();
  }
}
function trackEffect(effect2, dep, debuggerEventExtraInfo) {
  var _a;
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    const oldDep = effect2.deps[effect2._depsLength];
    if (oldDep !== dep) {
      if (oldDep) {
        cleanupDepEffect(oldDep, effect2);
      }
      effect2.deps[effect2._depsLength++] = dep;
    } else {
      effect2._depsLength++;
    }
    {
      (_a = effect2.onTrack) == null ? void 0 : _a.call(effect2, extend({ effect: effect2 }, debuggerEventExtraInfo));
    }
  }
}
const queueEffectSchedulers = [];
function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
  var _a;
  pauseScheduling();
  for (const effect2 of dep.keys()) {
    let tracking;
    if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
      effect2._dirtyLevel = dirtyLevel;
    }
    if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      {
        (_a = effect2.onTrigger) == null ? void 0 : _a.call(effect2, extend({ effect: effect2 }, debuggerEventExtraInfo));
      }
      effect2.trigger();
      if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
        effect2._shouldSchedule = false;
        if (effect2.scheduler) {
          queueEffectSchedulers.push(effect2.scheduler);
        }
      }
    }
  }
  resetScheduling();
}
const createDep = (cleanup, computed2) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.computed = computed2;
  return dep;
};
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol("iterate");
const MAP_KEY_ITERATE_KEY = Symbol("Map key iterate");
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
    }
    trackEffect(
      activeEffect,
      dep,
      {
        target,
        type,
        key
      }
    );
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || !isSymbol(key2) && key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  pauseScheduling();
  for (const dep of deps) {
    if (dep) {
      triggerEffects(
        dep,
        4,
        {
          target,
          type,
          key,
          newValue,
          oldValue,
          oldTarget
        }
      );
    }
  }
  resetScheduling();
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      pauseScheduling();
      const res = toRaw(this)[key].apply(this, args);
      resetScheduling();
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key) {
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    {
      warn$2(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
  deleteProperty(target, key) {
    {
      warn$2(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
  true
);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value, oldValue);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget = isMap(target) ? new Map(target) : new Set(target);
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0, oldTarget);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      warn$2(
        `${capitalize(type)} operation ${key}failed: target is readonly.`,
        toRaw(this)
      );
    }
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
function checkIdentityKeys(target, has2, key) {
  const rawKey = toRaw(key);
  if (rawKey !== key && has2.call(target, rawKey)) {
    const type = toRawType(target);
    warn$2(
      `Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    {
      warn$2(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  if (Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
const COMPUTED_SIDE_EFFECT_WARN = `Computed is still dirty after getter evaluation, likely because a computed is mutating its own dependency in its getter. State mutations in computed getters should be avoided.  Check the docs for more details: https://vuejs.org/guide/essentials/computed.html#getters-should-be-side-effect-free`;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this.getter = getter;
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => triggerRefValue(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    );
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    if ((!self2._cacheable || self2.effect.dirty) && hasChanged(self2._value, self2._value = self2.effect.run())) {
      triggerRefValue(self2, 4);
    }
    trackRefValue(self2);
    if (self2.effect._dirtyLevel >= 2) {
      if (this._warnRecursive) {
        warn$2(COMPUTED_SIDE_EFFECT_WARN, `

getter: `, this.getter);
      }
      triggerRefValue(self2, 2);
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(v) {
    this.effect.dirty = v;
  }
  // #endregion
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => {
      warn$2("Write operation failed: computed value is readonly");
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  if (debugOptions && !isSSR) {
    cRef.effect.onTrack = debugOptions.onTrack;
    cRef.effect.onTrigger = debugOptions.onTrigger;
  }
  return cRef;
}
function trackRefValue(ref2) {
  var _a;
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    trackEffect(
      activeEffect,
      (_a = ref2.dep) != null ? _a : ref2.dep = createDep(
        () => ref2.dep = void 0,
        ref2 instanceof ComputedRefImpl ? ref2 : void 0
      ),
      {
        target: ref2,
        type: "get",
        key: "value"
      }
    );
  }
}
function triggerRefValue(ref2, dirtyLevel = 4, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    triggerEffects(
      dep,
      dirtyLevel,
      {
        target: ref2,
        type: "set",
        key: "value",
        newValue: newVal
      }
    );
  }
}
function isRef(r2) {
  return !!(r2 && r2.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this, 4, newVal);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
const stack = [];
function pushWarningContext(vnode) {
  stack.push(vnode);
}
function popWarningContext() {
  stack.pop();
}
function warn$1(msg, ...args) {
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
const ErrorTypeStrings = {
  ["sp"]: "serverPrefetch hook",
  ["bc"]: "beforeCreate hook",
  ["c"]: "created hook",
  ["bm"]: "beforeMount hook",
  ["m"]: "mounted hook",
  ["bu"]: "beforeUpdate hook",
  ["u"]: "updated",
  ["bum"]: "beforeUnmount hook",
  ["um"]: "unmounted hook",
  ["a"]: "activated hook",
  ["da"]: "deactivated hook",
  ["ec"]: "errorCaptured hook",
  ["rtc"]: "renderTracked hook",
  ["rtg"]: "renderTriggered hook",
  [0]: "setup function",
  [1]: "render function",
  [2]: "watcher getter",
  [3]: "watcher callback",
  [4]: "watcher cleanup function",
  [5]: "native event handler",
  [6]: "component event handler",
  [7]: "vnode hook",
  [8]: "directive hook",
  [9]: "transition hook",
  [10]: "app errorHandler",
  [11]: "app warnHandler",
  [12]: "ref function",
  [13]: "async component loader",
  [14]: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://github.com/vuejs/core ."
};
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = ErrorTypeStrings[type] || type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    const info = ErrorTypeStrings[type] || type;
    if (contextVNode) {
      pushWarningContext(contextVNode);
    }
    warn$1(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
    if (contextVNode) {
      popWarningContext();
    }
    if (throwInDev) {
      console.error(err);
    } else {
      console.error(err);
    }
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue$1 = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
const RECURSION_LIMIT = 100;
function nextTick$1(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue$1.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue$1[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.pre) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!queue$1.length || !queue$1.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue$1.push(job);
    } else {
      queue$1.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function hasQueueJob(job) {
  return queue$1.indexOf(job) > -1;
}
function invalidateJob(job) {
  const i = queue$1.indexOf(job);
  if (i > flushIndex) {
    queue$1.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = isFlushing ? flushIndex + 1 : 0) {
  {
    seen = seen || /* @__PURE__ */ new Map();
  }
  for (; i < queue$1.length; i++) {
    const cb = queue$1[i];
    if (cb && cb.pre) {
      if (checkRecursiveUpdates(seen, cb)) {
        continue;
      }
      queue$1.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      if (checkRecursiveUpdates(seen, activePostFlushCbs[postFlushIndex])) {
        continue;
      }
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff2 = getId(a) - getId(b);
  if (diff2 === 0) {
    if (a.pre && !b.pre)
      return -1;
    if (b.pre && !a.pre)
      return 1;
  }
  return diff2;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  {
    seen = seen || /* @__PURE__ */ new Map();
  }
  queue$1.sort(comparator);
  const check = (job) => checkRecursiveUpdates(seen, job);
  try {
    for (flushIndex = 0; flushIndex < queue$1.length; flushIndex++) {
      const job = queue$1[flushIndex];
      if (job && job.active !== false) {
        if (check(job)) {
          continue;
        }
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue$1.length = 0;
    flushPostFlushCbs(seen);
    isFlushing = false;
    currentFlushPromise = null;
    if (queue$1.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
function checkRecursiveUpdates(seen, fn) {
  if (!seen.has(fn)) {
    seen.set(fn, 1);
  } else {
    const count = seen.get(fn);
    if (count > RECURSION_LIMIT) {
      const instance = fn.ownerInstance;
      const componentName = instance && getComponentName(instance.type);
      handleError(
        `Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
        null,
        10
      );
      return true;
    } else {
      seen.set(fn, count + 1);
    }
  }
}
let devtools;
let buffer = [];
let devtoolsNotInstalled = false;
function emit$1(event, ...args) {
  if (devtools) {
    devtools.emit(event, ...args);
  } else if (!devtoolsNotInstalled) {
    buffer.push({ event, args });
  }
}
function setDevtoolsHook(hook, target) {
  var _a, _b;
  devtools = hook;
  if (devtools) {
    devtools.enabled = true;
    buffer.forEach(({ event, args }) => devtools.emit(event, ...args));
    buffer = [];
  } else if (
    // handle late devtools injection - only do this if we are in an actual
    // browser environment to avoid the timer handle stalling test runner exit
    // (#4815)
    typeof window !== "undefined" && // some envs mock window but not fully
    window.HTMLElement && // also exclude jsdom
    !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))
  ) {
    const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
    replay.push((newHook) => {
      setDevtoolsHook(newHook, target);
    });
    setTimeout(() => {
      if (!devtools) {
        target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
        devtoolsNotInstalled = true;
        buffer = [];
      }
    }, 3e3);
  } else {
    devtoolsNotInstalled = true;
    buffer = [];
  }
}
function devtoolsInitApp(app2, version2) {
  emit$1("app:init", app2, version2, {
    Fragment,
    Text,
    Comment,
    Static
  });
}
const devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:added"
  /* COMPONENT_ADDED */
);
const devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:updated"
  /* COMPONENT_UPDATED */
);
const _devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:removed"
  /* COMPONENT_REMOVED */
);
const devtoolsComponentRemoved = (component) => {
  if (devtools && typeof devtools.cleanupBuffer === "function" && // remove the component if it wasn't buffered
  !devtools.cleanupBuffer(component)) {
    _devtoolsComponentRemoved(component);
  }
};
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function createDevtoolsComponentHook(hook) {
  return (component) => {
    emit$1(
      hook,
      component.appContext.app,
      component.uid,
      // fixed by xxxxxx
      // 为 0 是 App，无 parent 是 Page 指向 App
      component.uid === 0 ? void 0 : component.parent ? component.parent.uid : 0,
      component
    );
  };
}
const devtoolsPerfStart = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:start"
  /* PERFORMANCE_START */
);
const devtoolsPerfEnd = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:end"
  /* PERFORMANCE_END */
);
function createDevtoolsPerformanceHook(hook) {
  return (component, type, time) => {
    emit$1(hook, component.appContext.app, component.uid, component, type, time);
  };
}
function devtoolsComponentEmit(component, event, params) {
  emit$1(
    "component:emit",
    component.appContext.app,
    component,
    event,
    params
  );
}
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  {
    const {
      emitsOptions,
      propsOptions: [propsOptions]
    } = instance;
    if (emitsOptions) {
      if (!(event in emitsOptions) && true) {
        if (!propsOptions || !(toHandlerKey(event) in propsOptions)) {
          warn$1(
            `Component emitted event "${event}" but it is neither declared in the emits option nor as an "${toHandlerKey(event)}" prop.`
          );
        }
      } else {
        const validator = emitsOptions[event];
        if (isFunction(validator)) {
          const isValid = validator(...rawArgs);
          if (!isValid) {
            warn$1(
              `Invalid event arguments: event validation failed for event "${event}".`
            );
          }
        }
      }
    }
  }
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  {
    devtoolsComponentEmit(instance, event, args);
  }
  {
    const lowerCaseEvent = event.toLowerCase();
    if (lowerCaseEvent !== event && props[toHandlerKey(lowerCaseEvent)]) {
      warn$1(
        `Event "${lowerCaseEvent}" is emitted in component ${formatComponentName(
          instance,
          instance.type
        )} but the handler is registered for "${event}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${hyphenate(
          event
        )}" instead of "${event}".`
      );
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  instance && instance.type.__scopeId || null;
  return prev;
}
const COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component2 = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(
        Component2,
        false
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component2;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component2[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component2;
    }
    if (warnMissing && !res) {
      const extra = type === COMPONENTS ? `
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.` : ``;
      warn$1(`Failed to resolve ${type.slice(0, -1)}: ${name}${extra}`);
    }
    return res;
  } else {
    warn$1(
      `resolve${capitalize(type.slice(0, -1))} can only be used in render() or setup().`
    );
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  if (!isFunction(cb)) {
    warn$1(
      `\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`
    );
  }
  return doWatch(source, cb, options);
}
function doWatch(source, cb, {
  immediate,
  deep,
  flush,
  once: once2,
  onTrack,
  onTrigger
} = EMPTY_OBJ) {
  if (cb && once2) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      unwatch();
    };
  }
  if (deep !== void 0 && typeof deep === "number") {
    warn$1(
      `watch() "deep" option with number value will be used as watch depth in future versions. Please use a boolean instead to avoid potential breakage.`
    );
  }
  if (!cb) {
    if (immediate !== void 0) {
      warn$1(
        `watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (deep !== void 0) {
      warn$1(
        `watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (once2 !== void 0) {
      warn$1(
        `watch() "once" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
  }
  const warnInvalidSource = (s2) => {
    warn$1(
      `Invalid watch source: `,
      s2,
      `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`
    );
  };
  const instance = currentInstance;
  const reactiveGetter = (source2) => deep === true ? source2 : (
    // for deep: false, only traverse root-level properties
    traverse(source2, deep === false ? 1 : void 0)
  );
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s2) => isReactive(s2) || isShallow(s2));
    getter = () => source.map((s2) => {
      if (isRef(s2)) {
        return s2.value;
      } else if (isReactive(s2)) {
        return reactiveGetter(s2);
      } else if (isFunction(s2)) {
        return callWithErrorHandling(s2, instance, 2);
      } else {
        warnInvalidSource(s2);
      }
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
    warnInvalidSource(source);
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect2.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
      cleanup = effect2.onStop = void 0;
    };
  };
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect2.active || !effect2.dirty) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect2.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect$1(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect2 = new ReactiveEffect(getter, NOOP, scheduler);
  const scope = getCurrentScope();
  const unwatch = () => {
    effect2.stop();
    if (scope) {
      remove(scope.effects, effect2);
    }
  };
  {
    effect2.onTrack = onTrack;
    effect2.onTrigger = onTrigger;
  }
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect2.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect$1(
      effect2.run.bind(effect2),
      instance && instance.suspense
    );
  } else {
    effect2.run();
  }
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, depth, currentDepth = 0, seen) {
  if (!isObject(value) || value["__v_skip"]) {
    return value;
  }
  if (depth && depth > 0) {
    if (currentDepth >= depth) {
      return value;
    }
    currentDepth++;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, depth, currentDepth, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, currentDepth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, currentDepth, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], depth, currentDepth, seen);
    }
  }
  return value;
}
function validateDirectiveName(name) {
  if (isBuiltInDirective(name)) {
    warn$1("Do not use built-in directive ids as custom directive id: " + name);
  }
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      warn$1(`root props passed to app.mount() must be an object.`);
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    const app2 = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
        {
          warn$1(
            `app.config cannot be replaced. Modify individual options instead.`
          );
        }
      },
      use(plugin2, ...options) {
        if (installedPlugins.has(plugin2)) {
          warn$1(`Plugin has already been applied to target app.`);
        } else if (plugin2 && isFunction(plugin2.install)) {
          installedPlugins.add(plugin2);
          plugin2.install(app2, ...options);
        } else if (isFunction(plugin2)) {
          installedPlugins.add(plugin2);
          plugin2(app2, ...options);
        } else {
          warn$1(
            `A plugin must either be a function or an object with an "install" function.`
          );
        }
        return app2;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          } else {
            warn$1(
              "Mixin has already been applied to target app" + (mixin.name ? `: ${mixin.name}` : "")
            );
          }
        }
        return app2;
      },
      component(name, component) {
        {
          validateComponentName(name, context.config);
        }
        if (!component) {
          return context.components[name];
        }
        if (context.components[name]) {
          warn$1(`Component "${name}" has already been registered in target app.`);
        }
        context.components[name] = component;
        return app2;
      },
      directive(name, directive) {
        {
          validateDirectiveName(name);
        }
        if (!directive) {
          return context.directives[name];
        }
        if (context.directives[name]) {
          warn$1(`Directive "${name}" has already been registered in target app.`);
        }
        context.directives[name] = directive;
        return app2;
      },
      // fixed by xxxxxx
      mount() {
      },
      // fixed by xxxxxx
      unmount() {
      },
      provide(key, value) {
        if (key in context.provides) {
          warn$1(
            `App already provides property with key "${String(key)}". It will be overwritten with the new value.`
          );
        }
        context.provides[key] = value;
        return app2;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app2;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app2;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance) {
    {
      warn$1(`provide() can only be used inside setup().`);
    }
  } else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
    if (currentInstance.type.mpType === "app") {
      currentInstance.appContext.app.provide(key, value);
    }
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else {
      warn$1(`injection "${String(key)}" not found.`);
    }
  } else {
    warn$1(`inject() can only be used inside setup() or functional components.`);
  }
}
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    if (isRootHook(type)) {
      target = target.root;
    }
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  } else {
    const apiName = toHandlerKey(
      (ErrorTypeStrings[type] || type.replace(/^on/, "")).replace(/ hook$/, "")
    );
    warn$1(
      `${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup().`
    );
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook(
  "rtg"
);
const onRenderTracked = createHook(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    // fixed by xxxxxx vue-i18n 在 dev 模式，访问了 $el，故模拟一个假的
    // $el: i => i.vnode.el,
    $el: (i) => i.__$el || (i.__$el = {}),
    $data: (i) => i.data,
    $props: (i) => shallowReadonly(i.props),
    $attrs: (i) => shallowReadonly(i.attrs),
    $slots: (i) => shallowReadonly(i.slots),
    $refs: (i) => shallowReadonly(i.refs),
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      i.effect.dirty = true;
      queueJob(i.update);
    }),
    // $nextTick: i => i.n || (i.n = nextTick.bind(i.proxy!)),// fixed by xxxxxx
    $watch: (i) => instanceWatch.bind(i)
  })
);
const isReservedPrefix = (key) => key === "_" || key === "$";
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    if (key === "__isVue") {
      return true;
    }
    let normalizedProps;
    if (key[0] !== "$") {
      const n2 = accessCache[key];
      if (n2 !== void 0) {
        switch (n2) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      } else if (key === "$slots") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else if (currentRenderingInstance && (!isString(key) || // #1091 avoid internal isRef/isVNode checks on component instance leading
    // to infinite warning loop
    key.indexOf("__v") !== 0)) {
      if (data !== EMPTY_OBJ && isReservedPrefix(key[0]) && hasOwn(data, key)) {
        warn$1(
          `Property ${JSON.stringify(
            key
          )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
        );
      } else if (instance === currentRenderingInstance) {
        warn$1(
          `Property ${JSON.stringify(key)} was accessed during render but is not defined on instance.`
        );
      }
    }
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (setupState.__isScriptSetup && hasOwn(setupState, key)) {
      warn$1(`Cannot mutate <script setup> binding "${key}" from Options API.`);
      return false;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      warn$1(`Attempting to mutate prop "${key}". Props are readonly.`);
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      warn$1(
        `Attempting to mutate public property "${key}". Properties starting with $ are reserved and readonly.`
      );
      return false;
    } else {
      if (key in instance.appContext.config.globalProperties) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          value
        });
      } else {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
{
  PublicInstanceProxyHandlers.ownKeys = (target) => {
    warn$1(
      `Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`
    );
    return Reflect.ownKeys(target);
  };
}
function createDevRenderContext(instance) {
  const target = {};
  Object.defineProperty(target, `_`, {
    configurable: true,
    enumerable: false,
    get: () => instance
  });
  Object.keys(publicPropertiesMap).forEach((key) => {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: false,
      get: () => publicPropertiesMap[key](instance),
      // intercepted by the proxy so no need for implementation,
      // but needed to prevent set errors
      set: NOOP
    });
  });
  return target;
}
function exposePropsOnRenderContext(instance) {
  const {
    ctx,
    propsOptions: [propsOptions]
  } = instance;
  if (propsOptions) {
    Object.keys(propsOptions).forEach((key) => {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => instance.props[key],
        set: NOOP
      });
    });
  }
}
function exposeSetupStateOnRenderContext(instance) {
  const { ctx, setupState } = instance;
  Object.keys(toRaw(setupState)).forEach((key) => {
    if (!setupState.__isScriptSetup) {
      if (isReservedPrefix(key[0])) {
        warn$1(
          `setup() return property ${JSON.stringify(
            key
          )} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
        );
        return;
      }
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => setupState[key],
        set: NOOP
      });
    }
  });
}
function normalizePropsOrEmits(props) {
  return isArray(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
function createDuplicateChecker() {
  const cache = /* @__PURE__ */ Object.create(null);
  return (type, key) => {
    if (cache[key]) {
      warn$1(`${type} property "${key}" is already defined in ${cache[key]}.`);
    } else {
      cache[key] = type;
    }
  };
}
let shouldCacheAccess = true;
function applyOptions$1(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = createDuplicateChecker();
  {
    const [propsOptions] = instance.propsOptions;
    if (propsOptions) {
      for (const key in propsOptions) {
        checkDuplicateProperties("Props", key);
      }
    }
  }
  function initInjections() {
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties);
    }
  }
  {
    initInjections();
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          Object.defineProperty(ctx, key, {
            value: methodHandler.bind(publicThis),
            configurable: true,
            enumerable: true,
            writable: true
          });
        }
        {
          checkDuplicateProperties("Methods", key);
        }
      } else {
        warn$1(
          `Method "${key}" has type "${typeof methodHandler}" in the component definition. Did you reference the function correctly?`
        );
      }
    }
  }
  if (dataOptions) {
    if (!isFunction(dataOptions)) {
      warn$1(
        `The data option must be a function. Plain object usage is no longer supported.`
      );
    }
    const data = dataOptions.call(publicThis, publicThis);
    if (isPromise(data)) {
      warn$1(
        `data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.`
      );
    }
    if (!isObject(data)) {
      warn$1(`data() should return an object.`);
    } else {
      instance.data = reactive(data);
      {
        for (const key in data) {
          checkDuplicateProperties("Data", key);
          if (!isReservedPrefix(key[0])) {
            Object.defineProperty(ctx, key, {
              configurable: true,
              enumerable: true,
              get: () => data[key],
              set: NOOP
            });
          }
        }
      }
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      if (get2 === NOOP) {
        warn$1(`Computed property "${key}" has no getter.`);
      }
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : () => {
        warn$1(
          `Write operation failed: computed property "${key}" is readonly.`
        );
      };
      const c2 = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c2.value,
        set: (v) => c2.value = v
      });
      {
        checkDuplicateProperties("Computed", key);
      }
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  function initProvides() {
    if (provideOptions) {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
  }
  {
    initProvides();
  }
  {
    if (created) {
      callHook$1(created, instance, "c");
    }
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
  if (instance.ctx.$onApplyOptions) {
    instance.ctx.$onApplyOptions(options, instance, publicThis);
  }
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
    {
      checkDuplicateProperties("Inject", key);
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    } else {
      warn$1(`Invalid watch handler specified by key "${raw}"`, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject(raw)) {
    if (isArray(raw)) {
      raw.forEach((r2) => createWatcher(r2, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      } else {
        warn$1(`Invalid watch handler specified by key "${raw.handler}"`, handler);
      }
    }
  } else {
    warn$1(`Invalid watch option: "${key}"`, raw);
  }
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m2) => mergeOptions(resolved, m2, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m2) => mergeOptions(to, m2, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") {
      warn$1(
        `"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.`
      );
    } else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray$1,
  created: mergeAsArray$1,
  beforeMount: mergeAsArray$1,
  mounted: mergeAsArray$1,
  beforeUpdate: mergeAsArray$1,
  updated: mergeAsArray$1,
  beforeDestroy: mergeAsArray$1,
  beforeUnmount: mergeAsArray$1,
  destroyed: mergeAsArray$1,
  unmounted: mergeAsArray$1,
  activated: mergeAsArray$1,
  deactivated: mergeAsArray$1,
  errorCaptured: mergeAsArray$1,
  serverPrefetch: mergeAsArray$1,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray$1(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray(to) && isArray(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray$1(to[key], from[key]);
  }
  return merged;
}
function initProps$1(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  {
    validateProps(rawProps || {}, props, instance);
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function isInHmrContext(instance) {
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    !isInHmrContext() && (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue$1(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue$1(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
  {
    validateProps(rawProps || {}, props, instance);
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue$1(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue$1(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      if (!isString(raw[i])) {
        warn$1(`props must be strings when using array syntax.`, raw[i]);
      }
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    if (!isObject(raw)) {
      warn$1(`invalid props options`, raw);
    }
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  } else {
    warn$1(`Invalid prop name: "${key}" is a reserved property.`);
  }
  return false;
}
function getType$1(ctor) {
  if (ctor === null) {
    return "null";
  }
  if (typeof ctor === "function") {
    return ctor.name || "";
  } else if (typeof ctor === "object") {
    const name = ctor.constructor && ctor.constructor.name;
    return name || "";
  }
  return "";
}
function isSameType(a, b) {
  return getType$1(a) === getType$1(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex((t2) => isSameType(t2, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
function validateProps(rawProps, props, instance) {
  const resolvedValues = toRaw(props);
  const options = instance.propsOptions[0];
  for (const key in options) {
    let opt = options[key];
    if (opt == null)
      continue;
    validateProp$1(
      key,
      resolvedValues[key],
      opt,
      shallowReadonly(resolvedValues),
      !hasOwn(rawProps, key) && !hasOwn(rawProps, hyphenate(key))
    );
  }
}
function validateProp$1(name, value, prop, props, isAbsent) {
  const { type, required, validator, skipCheck } = prop;
  if (required && isAbsent) {
    warn$1('Missing required prop: "' + name + '"');
    return;
  }
  if (value == null && !required) {
    return;
  }
  if (type != null && type !== true && !skipCheck) {
    let isValid = false;
    const types = isArray(type) ? type : [type];
    const expectedTypes = [];
    for (let i = 0; i < types.length && !isValid; i++) {
      const { valid, expectedType } = assertType$1(value, types[i]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      warn$1(getInvalidTypeMessage$1(name, value, expectedTypes));
      return;
    }
  }
  if (validator && !validator(value, props)) {
    warn$1('Invalid prop: custom validator check failed for prop "' + name + '".');
  }
}
const isSimpleType$1 = /* @__PURE__ */ makeMap(
  "String,Number,Boolean,Function,Symbol,BigInt"
);
function assertType$1(value, type) {
  let valid;
  const expectedType = getType$1(type);
  if (isSimpleType$1(expectedType)) {
    const t2 = typeof value;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = isObject(value);
  } else if (expectedType === "Array") {
    valid = isArray(value);
  } else if (expectedType === "null") {
    valid = value === null;
  } else {
    valid = value instanceof type;
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage$1(name, value, expectedTypes) {
  if (expectedTypes.length === 0) {
    return `Prop type [] for prop "${name}" won't match anything. Did you mean to use type Array instead?`;
  }
  let message = `Invalid prop: type check failed for prop "${name}". Expected ${expectedTypes.map(capitalize).join(" | ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue$1(value, expectedType);
  const receivedValue = styleValue$1(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable$1(expectedType) && !isBoolean$1(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable$1(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function styleValue$1(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable$1(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean$1(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
let supported;
let perf;
function startMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    perf.mark(`vue-${type}-${instance.uid}`);
  }
  {
    devtoolsPerfStart(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function endMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    const startTag = `vue-${type}-${instance.uid}`;
    const endTag = startTag + `:end`;
    perf.mark(endTag);
    perf.measure(
      `<${formatComponentName(instance, instance.type)}> ${type}`,
      startTag,
      endTag
    );
    perf.clearMarks(startTag);
    perf.clearMarks(endTag);
  }
  {
    devtoolsPerfEnd(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function isSupported() {
  if (supported !== void 0) {
    return supported;
  }
  if (typeof window !== "undefined" && window.performance) {
    supported = true;
    perf = window.performance;
  } else {
    supported = false;
  }
  return supported;
}
const queuePostRenderEffect$1 = queuePostFlushCb;
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null,
    // fixed by xxxxxx 用于存储uni-app的元素缓存
    $uniElements: /* @__PURE__ */ new Map(),
    $templateUniElementRefs: [],
    $templateUniElementStyles: {},
    $eS: {},
    $eA: {}
  };
  {
    instance.ctx = createDevRenderContext(instance);
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  internalSetCurrentInstance = (i) => {
    currentInstance = i;
  };
  setInSSRSetupState = (v) => {
    isInSSRComponentSetup = v;
  };
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
const isBuiltInTag = /* @__PURE__ */ makeMap("slot,component");
function validateComponentName(name, { isNativeTag }) {
  if (isBuiltInTag(name) || isNativeTag(name)) {
    warn$1(
      "Do not use built-in or reserved HTML elements as component id: " + name
    );
  }
}
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isSSR && setInSSRSetupState(isSSR);
  const {
    props
    /*, children*/
  } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps$1(instance, props, isStateful, isSSR);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component2 = instance.type;
  {
    if (Component2.name) {
      validateComponentName(Component2.name, instance.appContext.config);
    }
    if (Component2.components) {
      const names = Object.keys(Component2.components);
      for (let i = 0; i < names.length; i++) {
        validateComponentName(names[i], instance.appContext.config);
      }
    }
    if (Component2.directives) {
      const names = Object.keys(Component2.directives);
      for (let i = 0; i < names.length; i++) {
        validateDirectiveName(names[i]);
      }
    }
    if (Component2.compilerOptions && isRuntimeOnly()) {
      warn$1(
        `"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.`
      );
    }
  }
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  {
    exposePropsOnRenderContext(instance);
  }
  const { setup } = Component2;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        shallowReadonly(instance.props),
        setupContext
      ]
    );
    resetTracking();
    reset();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      {
        warn$1(
          `setup() returned a Promise, but the version of Vue you are using does not support it yet.`
        );
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    if (isVNode(setupResult)) {
      warn$1(
        `setup() should not return VNodes directly - return a render function instead.`
      );
    }
    {
      instance.devtoolsRawSetupState = setupResult;
    }
    instance.setupState = proxyRefs(setupResult);
    {
      exposeSetupStateOnRenderContext(instance);
    }
  } else if (setupResult !== void 0) {
    warn$1(
      `setup() should return an object. Received: ${setupResult === null ? "null" : typeof setupResult}`
    );
  }
  finishComponentSetup(instance, isSSR);
}
let compile;
const isRuntimeOnly = () => !compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component2 = instance.type;
  if (!instance.render) {
    instance.render = Component2.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions$1(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
  if (!Component2.render && instance.render === NOOP && !isSSR) {
    if (Component2.template) {
      warn$1(
        `Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
      );
    } else {
      warn$1(`Component is missing template or render function.`);
    }
  }
}
function getAttrsProxy(instance) {
  return instance.attrsProxy || (instance.attrsProxy = new Proxy(
    instance.attrs,
    {
      get(target, key) {
        track(instance, "get", "$attrs");
        return target[key];
      },
      set() {
        warn$1(`setupContext.attrs is readonly.`);
        return false;
      },
      deleteProperty() {
        warn$1(`setupContext.attrs is readonly.`);
        return false;
      }
    }
  ));
}
function getSlotsProxy(instance) {
  return instance.slotsProxy || (instance.slotsProxy = new Proxy(instance.slots, {
    get(target, key) {
      track(instance, "get", "$slots");
      return target[key];
    }
  }));
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    {
      if (instance.exposed) {
        warn$1(`expose() should be called only once per setup().`);
      }
      if (exposed != null) {
        let exposedType = typeof exposed;
        if (exposedType === "object") {
          if (isArray(exposed)) {
            exposedType = "array";
          } else if (isRef(exposed)) {
            exposedType = "ref";
          }
        }
        if (exposedType !== "object") {
          warn$1(
            `expose() should be passed a plain object, received ${exposedType}.`
          );
        }
      }
    }
    instance.exposed = exposed || {};
  };
  {
    return Object.freeze({
      get attrs() {
        return getAttrsProxy(instance);
      },
      get slots() {
        return getSlotsProxy(instance);
      },
      get emit() {
        return (event, ...args) => instance.emit(event, ...args);
      },
      expose
    });
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        }
        return instance.proxy[key];
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c2) => c2.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component2, includeInferred = true) {
  return isFunction(Component2) ? Component2.displayName || Component2.name : Component2.name || includeInferred && Component2.__name;
}
function formatComponentName(instance, Component2, isRoot = false) {
  let name = getComponentName(Component2);
  if (!name && Component2.__file) {
    const match = Component2.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component2) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
const computed = (getterOrOptions, debugOptions) => {
  const c2 = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  {
    const i = getCurrentInstance();
    if (i && i.appContext.config.warnRecursiveComputed) {
      c2._warnRecursive = true;
    }
  }
  return c2;
};
const version = "3.4.21";
const warn = warn$1;
function unwrapper(target) {
  return unref(target);
}
const ARRAYTYPE = "[object Array]";
const OBJECTTYPE = "[object Object]";
function diff(current, pre) {
  const result = {};
  syncKeys(current, pre);
  _diff(current, pre, "", result);
  return result;
}
function syncKeys(current, pre) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
    for (let key in pre) {
      const currentValue = current[key];
      if (currentValue === void 0) {
        current[key] = null;
      } else {
        syncKeys(currentValue, pre[key]);
      }
    }
  } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
    if (current.length >= pre.length) {
      pre.forEach((item, index2) => {
        syncKeys(current[index2], item);
      });
    }
  }
}
function _diff(current, pre, path, result) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE) {
    if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
      setResult(result, path, current);
    } else {
      for (let key in current) {
        const currentValue = unwrapper(current[key]);
        const preValue = pre[key];
        const currentType = toTypeString(currentValue);
        const preType = toTypeString(preValue);
        if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
          if (currentValue != preValue) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          }
        } else if (currentType == ARRAYTYPE) {
          if (preType != ARRAYTYPE) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          } else {
            if (currentValue.length < preValue.length) {
              setResult(
                result,
                (path == "" ? "" : path + ".") + key,
                currentValue
              );
            } else {
              currentValue.forEach((item, index2) => {
                _diff(
                  item,
                  preValue[index2],
                  (path == "" ? "" : path + ".") + key + "[" + index2 + "]",
                  result
                );
              });
            }
          }
        } else if (currentType == OBJECTTYPE) {
          if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          } else {
            for (let subKey in currentValue) {
              _diff(
                currentValue[subKey],
                preValue[subKey],
                (path == "" ? "" : path + ".") + key + "." + subKey,
                result
              );
            }
          }
        }
      }
    }
  } else if (rootCurrentType == ARRAYTYPE) {
    if (rootPreType != ARRAYTYPE) {
      setResult(result, path, current);
    } else {
      if (current.length < pre.length) {
        setResult(result, path, current);
      } else {
        current.forEach((item, index2) => {
          _diff(item, pre[index2], path + "[" + index2 + "]", result);
        });
      }
    }
  } else {
    setResult(result, path, current);
  }
}
function setResult(result, k, v) {
  result[k] = v;
}
function hasComponentEffect(instance) {
  return queue$1.includes(instance.update);
}
function flushCallbacks(instance) {
  const ctx = instance.ctx;
  const callbacks = ctx.__next_tick_callbacks;
  if (callbacks && callbacks.length) {
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }
}
function nextTick(instance, fn) {
  const ctx = instance.ctx;
  if (!ctx.__next_tick_pending && !hasComponentEffect(instance)) {
    return nextTick$1(fn && fn.bind(instance.proxy));
  }
  let _resolve;
  if (!ctx.__next_tick_callbacks) {
    ctx.__next_tick_callbacks = [];
  }
  ctx.__next_tick_callbacks.push(() => {
    if (fn) {
      callWithErrorHandling(
        fn.bind(instance.proxy),
        instance,
        14
      );
    } else if (_resolve) {
      _resolve(instance.proxy);
    }
  });
  return new Promise((resolve2) => {
    _resolve = resolve2;
  });
}
function clone(src, seen) {
  src = unwrapper(src);
  const type = typeof src;
  if (type === "object" && src !== null) {
    let copy = seen.get(src);
    if (typeof copy !== "undefined") {
      return copy;
    }
    if (isArray(src)) {
      const len = src.length;
      copy = new Array(len);
      seen.set(src, copy);
      for (let i = 0; i < len; i++) {
        copy[i] = clone(src[i], seen);
      }
    } else {
      copy = {};
      seen.set(src, copy);
      for (const name in src) {
        if (hasOwn(src, name)) {
          copy[name] = clone(src[name], seen);
        }
      }
    }
    return copy;
  }
  if (type !== "symbol") {
    return src;
  }
}
function deepCopy(src) {
  return clone(src, typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : /* @__PURE__ */ new Map());
}
function getMPInstanceData(instance, keys) {
  const data = instance.data;
  const ret = /* @__PURE__ */ Object.create(null);
  keys.forEach((key) => {
    ret[key] = data[key];
  });
  return ret;
}
function patch(instance, data, oldData) {
  if (!data) {
    return;
  }
  data = deepCopy(data);
  data.$eS = instance.$eS || {};
  data.$eA = instance.$eA || {};
  const ctx = instance.ctx;
  const mpType = ctx.mpType;
  if (mpType === "page" || mpType === "component") {
    data.r0 = 1;
    const mpInstance = ctx.$scope;
    const keys = Object.keys(data);
    const diffData = diff(data, oldData || getMPInstanceData(mpInstance, keys));
    if (Object.keys(diffData).length) {
      ctx.__next_tick_pending = true;
      mpInstance.setData(diffData, () => {
        ctx.__next_tick_pending = false;
        flushCallbacks(instance);
      });
      flushPreFlushCbs();
    } else {
      flushCallbacks(instance);
    }
  }
}
function initAppConfig(appConfig) {
  appConfig.globalProperties.$nextTick = function $nextTick(fn) {
    return nextTick(this.$, fn);
  };
}
function onApplyOptions(options, instance, publicThis) {
  instance.appContext.config.globalProperties.$applyOptions(
    options,
    instance,
    publicThis
  );
  const computedOptions = options.computed;
  if (computedOptions) {
    const keys = Object.keys(computedOptions);
    if (keys.length) {
      const ctx = instance.ctx;
      if (!ctx.$computedKeys) {
        ctx.$computedKeys = [];
      }
      ctx.$computedKeys.push(...keys);
    }
  }
  delete instance.ctx.$onApplyOptions;
}
function setRef$1(instance, isUnmount = false) {
  const {
    setupState,
    $templateRefs,
    $templateUniElementRefs,
    ctx: { $scope, $mpPlatform }
  } = instance;
  if ($mpPlatform === "mp-alipay") {
    return;
  }
  if (!$scope || !$templateRefs && !$templateUniElementRefs) {
    return;
  }
  if (isUnmount) {
    $templateRefs && $templateRefs.forEach(
      (templateRef) => setTemplateRef(templateRef, null, setupState)
    );
    $templateUniElementRefs && $templateUniElementRefs.forEach(
      (templateRef) => setTemplateRef(templateRef, null, setupState)
    );
    return;
  }
  const check = $mpPlatform === "mp-baidu" || $mpPlatform === "mp-toutiao";
  const doSetByRefs = (refs) => {
    if (refs.length === 0) {
      return [];
    }
    const mpComponents = (
      // 字节小程序 selectAllComponents 可能返回 null
      // https://github.com/dcloudio/uni-app/issues/3954
      ($scope.selectAllComponents(".r") || []).concat(
        $scope.selectAllComponents(".r-i-f") || []
      )
    );
    return refs.filter((templateRef) => {
      const refValue = findComponentPublicInstance(mpComponents, templateRef.i);
      if (check && refValue === null) {
        return true;
      }
      setTemplateRef(templateRef, refValue, setupState);
      return false;
    });
  };
  const doSet = () => {
    if ($templateRefs) {
      const refs = doSetByRefs($templateRefs);
      if (refs.length && instance.proxy && instance.proxy.$scope) {
        instance.proxy.$scope.setData({ r1: 1 }, () => {
          doSetByRefs(refs);
        });
      }
    }
  };
  if ($templateUniElementRefs && $templateUniElementRefs.length) {
    nextTick(instance, () => {
      $templateUniElementRefs.forEach((templateRef) => {
        if (isArray(templateRef.v)) {
          templateRef.v.forEach((v) => {
            setTemplateRef(templateRef, v, setupState);
          });
        } else {
          setTemplateRef(templateRef, templateRef.v, setupState);
        }
      });
    });
  }
  if ($scope._$setRef) {
    $scope._$setRef(doSet);
  } else {
    nextTick(instance, doSet);
  }
}
function toSkip(value) {
  if (isObject(value)) {
    markRaw(value);
  }
  return value;
}
function findComponentPublicInstance(mpComponents, id) {
  const mpInstance = mpComponents.find(
    (com) => com && (com.properties || com.props).uI === id
  );
  if (mpInstance) {
    const vm = mpInstance.$vm;
    if (vm) {
      return getExposeProxy(vm.$) || vm;
    }
    return toSkip(mpInstance);
  }
  return null;
}
function setTemplateRef({ r: r2, f: f2 }, refValue, setupState) {
  if (isFunction(r2)) {
    r2(refValue, {});
  } else {
    const _isString = isString(r2);
    const _isRef = isRef(r2);
    if (_isString || _isRef) {
      if (f2) {
        if (!_isRef) {
          return;
        }
        if (!isArray(r2.value)) {
          r2.value = [];
        }
        const existing = r2.value;
        if (existing.indexOf(refValue) === -1) {
          existing.push(refValue);
          if (!refValue) {
            return;
          }
          if (refValue.$) {
            onBeforeUnmount(() => remove(existing, refValue), refValue.$);
          }
        }
      } else if (_isString) {
        if (hasOwn(setupState, r2)) {
          setupState[r2] = refValue;
        }
      } else if (isRef(r2)) {
        r2.value = refValue;
      } else {
        warnRef(r2);
      }
    } else {
      warnRef(r2);
    }
  }
}
function warnRef(ref2) {
  warn("Invalid template ref type:", ref2, `(${typeof ref2})`);
}
const queuePostRenderEffect = queuePostFlushCb;
function mountComponent(initialVNode, options) {
  const instance = initialVNode.component = createComponentInstance(initialVNode, options.parentComponent, null);
  {
    instance.ctx.$onApplyOptions = onApplyOptions;
    instance.ctx.$children = [];
  }
  if (options.mpType === "app") {
    instance.render = NOOP;
  }
  if (options.onBeforeSetup) {
    options.onBeforeSetup(instance, options);
  }
  {
    pushWarningContext(initialVNode);
    startMeasure(instance, `mount`);
  }
  {
    startMeasure(instance, `init`);
  }
  setupComponent(instance);
  {
    endMeasure(instance, `init`);
  }
  {
    if (options.parentComponent && instance.proxy) {
      options.parentComponent.ctx.$children.push(getExposeProxy(instance) || instance.proxy);
    }
  }
  setupRenderEffect(instance);
  {
    popWarningContext();
    endMeasure(instance, `mount`);
  }
  return instance.proxy;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
function renderComponentRoot(instance) {
  const {
    type: Component2,
    vnode,
    proxy,
    withProxy,
    props,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    data,
    setupState,
    ctx,
    uid: uid2,
    appContext: {
      app: {
        config: {
          globalProperties: { pruneComponentPropsCache: pruneComponentPropsCache2 }
        }
      }
    },
    inheritAttrs
  } = instance;
  instance.$uniElementIds = /* @__PURE__ */ new Map();
  instance.$templateRefs = [];
  instance.$templateUniElementRefs = [];
  instance.$templateUniElementStyles = {};
  instance.$ei = 0;
  pruneComponentPropsCache2(uid2);
  instance.__counter = instance.__counter === 0 ? 1 : 0;
  let result;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      fallthroughAttrs(inheritAttrs, props, propsOptions, attrs);
      const proxyToUse = withProxy || proxy;
      result = render.call(
        proxyToUse,
        proxyToUse,
        renderCache,
        props,
        setupState,
        data,
        ctx
      );
    } else {
      fallthroughAttrs(
        inheritAttrs,
        props,
        propsOptions,
        Component2.props ? attrs : getFunctionalFallthrough(attrs)
      );
      const render2 = Component2;
      result = render2.length > 1 ? render2(props, { attrs, slots, emit: emit2 }) : render2(
        props,
        null
        /* we know it doesn't need it */
      );
    }
  } catch (err) {
    handleError(err, instance, 1);
    result = false;
  }
  setRef$1(instance);
  setCurrentRenderingInstance(prev);
  return result;
}
function fallthroughAttrs(inheritAttrs, props, propsOptions, fallthroughAttrs2) {
  if (props && fallthroughAttrs2 && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs2).filter(
      (key) => key !== "class" && key !== "style"
    );
    if (!keys.length) {
      return;
    }
    if (propsOptions && keys.some(isModelListener)) {
      keys.forEach((key) => {
        if (!isModelListener(key) || !(key.slice(9) in propsOptions)) {
          props[key] = fallthroughAttrs2[key];
        }
      });
    } else {
      keys.forEach((key) => props[key] = fallthroughAttrs2[key]);
    }
  }
}
const updateComponentPreRender = (instance) => {
  pauseTracking();
  flushPreFlushCbs();
  resetTracking();
};
function componentUpdateScopedSlotsFn() {
  const scopedSlotsData = this.$scopedSlotsData;
  if (!scopedSlotsData || scopedSlotsData.length === 0) {
    return;
  }
  const mpInstance = this.ctx.$scope;
  const oldData = mpInstance.data;
  const diffData = /* @__PURE__ */ Object.create(null);
  scopedSlotsData.forEach(({ path, index: index2, data }) => {
    const oldScopedSlotData = getValueByDataPath(oldData, path);
    const diffPath = isString(index2) ? `${path}.${index2}` : `${path}[${index2}]`;
    if (typeof oldScopedSlotData === "undefined" || typeof oldScopedSlotData[index2] === "undefined") {
      diffData[diffPath] = data;
    } else {
      const diffScopedSlotData = diff(
        data,
        oldScopedSlotData[index2]
      );
      Object.keys(diffScopedSlotData).forEach((name) => {
        diffData[diffPath + "." + name] = diffScopedSlotData[name];
      });
    }
  });
  scopedSlotsData.length = 0;
  if (Object.keys(diffData).length) {
    mpInstance.setData(diffData);
  }
}
function toggleRecurse({ effect: effect2, update }, allowed) {
  effect2.allowRecurse = update.allowRecurse = allowed;
}
function setupRenderEffect(instance) {
  const updateScopedSlots = componentUpdateScopedSlotsFn.bind(
    instance
  );
  instance.$updateScopedSlots = () => nextTick$1(() => queueJob(updateScopedSlots));
  const componentUpdateFn = () => {
    if (!instance.isMounted) {
      onBeforeUnmount(() => {
        setRef$1(instance, true);
      }, instance);
      {
        startMeasure(instance, `patch`);
      }
      patch(instance, renderComponentRoot(instance));
      {
        endMeasure(instance, `patch`);
      }
      {
        devtoolsComponentAdded(instance);
      }
    } else {
      const { next, bu, u } = instance;
      {
        pushWarningContext(next || instance.vnode);
      }
      toggleRecurse(instance, false);
      updateComponentPreRender();
      if (bu) {
        invokeArrayFns$1(bu);
      }
      toggleRecurse(instance, true);
      {
        startMeasure(instance, `patch`);
      }
      patch(instance, renderComponentRoot(instance));
      {
        endMeasure(instance, `patch`);
      }
      if (u) {
        queuePostRenderEffect(u);
      }
      {
        devtoolsComponentUpdated(instance);
      }
      {
        popWarningContext();
      }
    }
  };
  const effect2 = instance.effect = new ReactiveEffect(
    componentUpdateFn,
    NOOP,
    () => queueJob(update),
    instance.scope
    // track it in component's effect scope
  );
  const update = instance.update = () => {
    if (effect2.dirty) {
      effect2.run();
    }
  };
  update.id = instance.uid;
  toggleRecurse(instance, true);
  {
    effect2.onTrack = instance.rtc ? (e2) => invokeArrayFns$1(instance.rtc, e2) : void 0;
    effect2.onTrigger = instance.rtg ? (e2) => invokeArrayFns$1(instance.rtg, e2) : void 0;
    update.ownerInstance = instance;
  }
  {
    update();
  }
}
function unmountComponent(instance) {
  const { bum, scope, update, um } = instance;
  if (bum) {
    invokeArrayFns$1(bum);
  }
  {
    const parentInstance = instance.parent;
    if (parentInstance) {
      const $children = parentInstance.ctx.$children;
      const target = getExposeProxy(instance) || instance.proxy;
      const index2 = $children.indexOf(target);
      if (index2 > -1) {
        $children.splice(index2, 1);
      }
    }
  }
  scope.stop();
  if (update) {
    update.active = false;
  }
  if (um) {
    queuePostRenderEffect(um);
  }
  queuePostRenderEffect(() => {
    instance.isUnmounted = true;
  });
  {
    devtoolsComponentRemoved(instance);
  }
}
const oldCreateApp = createAppAPI();
function getTarget() {
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  if (typeof my !== "undefined") {
    return my;
  }
}
function createVueApp(rootComponent, rootProps = null) {
  const target = getTarget();
  target.__VUE__ = true;
  {
    setDevtoolsHook(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
  }
  const app2 = oldCreateApp(rootComponent, rootProps);
  const appContext = app2._context;
  initAppConfig(appContext.config);
  const createVNode2 = (initialVNode) => {
    initialVNode.appContext = appContext;
    initialVNode.shapeFlag = 6;
    return initialVNode;
  };
  const createComponent2 = function createComponent22(initialVNode, options) {
    return mountComponent(createVNode2(initialVNode), options);
  };
  const destroyComponent = function destroyComponent2(component) {
    return component && unmountComponent(component.$);
  };
  app2.mount = function mount() {
    rootComponent.render = NOOP;
    const instance = mountComponent(
      createVNode2({ type: rootComponent }),
      {
        mpType: "app",
        mpInstance: null,
        parentComponent: null,
        slots: [],
        props: null
      }
    );
    app2._instance = instance.$;
    {
      devtoolsInitApp(app2, version);
    }
    instance.$app = app2;
    instance.$createComponent = createComponent2;
    instance.$destroyComponent = destroyComponent;
    appContext.$appInstance = instance;
    return instance;
  };
  app2.unmount = function unmount() {
    warn(`Cannot unmount an app.`);
  };
  return app2;
}
function injectLifecycleHook(name, hook, publicThis, instance) {
  if (isFunction(hook)) {
    injectHook(name, hook.bind(publicThis), instance);
  }
}
function initHooks$1(options, instance, publicThis) {
  const mpType = options.mpType || publicThis.$mpType;
  if (!mpType || mpType === "component") {
    return;
  }
  Object.keys(options).forEach((name) => {
    if (isUniLifecycleHook(name, options[name], false)) {
      const hooks = options[name];
      if (isArray(hooks)) {
        hooks.forEach((hook) => injectLifecycleHook(name, hook, publicThis, instance));
      } else {
        injectLifecycleHook(name, hooks, publicThis, instance);
      }
    }
  });
}
function applyOptions$2(options, instance, publicThis) {
  initHooks$1(options, instance, publicThis);
}
function set(target, key, val) {
  return target[key] = val;
}
function $callMethod(method, ...args) {
  const fn = this[method];
  if (fn) {
    return fn(...args);
  }
  console.error(`method ${method} not found`);
  return null;
}
function createErrorHandler(app2) {
  const userErrorHandler = app2.config.errorHandler;
  return function errorHandler(err, instance, info) {
    if (userErrorHandler) {
      userErrorHandler(err, instance, info);
    }
    const appInstance = app2._instance;
    if (!appInstance || !appInstance.proxy) {
      throw err;
    }
    if (appInstance[ON_ERROR]) {
      {
        appInstance.proxy.$callHook(ON_ERROR, err);
      }
    } else {
      logError(err, info, instance ? instance.$.vnode : null, false);
    }
  };
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function initOptionMergeStrategies(optionMergeStrategies) {
  UniLifecycleHooks.forEach((name) => {
    optionMergeStrategies[name] = mergeAsArray;
  });
}
let realAtob;
const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const b64re = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
if (typeof atob !== "function") {
  realAtob = function(str) {
    str = String(str).replace(/[\t\n\f\r ]+/g, "");
    if (!b64re.test(str)) {
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    }
    str += "==".slice(2 - (str.length & 3));
    var bitmap;
    var result = "";
    var r1;
    var r2;
    var i = 0;
    for (; i < str.length; ) {
      bitmap = b64.indexOf(str.charAt(i++)) << 18 | b64.indexOf(str.charAt(i++)) << 12 | (r1 = b64.indexOf(str.charAt(i++))) << 6 | (r2 = b64.indexOf(str.charAt(i++)));
      result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }
    return result;
  };
} else {
  realAtob = atob;
}
function b64DecodeUnicode(str) {
  return decodeURIComponent(realAtob(str).split("").map(function(c2) {
    return "%" + ("00" + c2.charCodeAt(0).toString(16)).slice(-2);
  }).join(""));
}
function getCurrentUserInfo() {
  const token = index.getStorageSync("uni_id_token") || "";
  const tokenArr = token.split(".");
  if (!token || tokenArr.length !== 3) {
    return {
      uid: null,
      role: [],
      permission: [],
      tokenExpired: 0
    };
  }
  let userInfo;
  try {
    userInfo = JSON.parse(b64DecodeUnicode(tokenArr[1]));
  } catch (error) {
    throw new Error("获取当前用户信息出错，详细错误信息为：" + error.message);
  }
  userInfo.tokenExpired = userInfo.exp * 1e3;
  delete userInfo.exp;
  delete userInfo.iat;
  return userInfo;
}
function uniIdMixin(globalProperties) {
  globalProperties.uniIDHasRole = function(roleId) {
    const { role } = getCurrentUserInfo();
    return role.indexOf(roleId) > -1;
  };
  globalProperties.uniIDHasPermission = function(permissionId) {
    const { permission } = getCurrentUserInfo();
    return this.uniIDHasRole("admin") || permission.indexOf(permissionId) > -1;
  };
  globalProperties.uniIDTokenValid = function() {
    const { tokenExpired } = getCurrentUserInfo();
    return tokenExpired > Date.now();
  };
}
function initApp(app2) {
  const appConfig = app2.config;
  appConfig.errorHandler = invokeCreateErrorHandler(app2, createErrorHandler);
  initOptionMergeStrategies(appConfig.optionMergeStrategies);
  const globalProperties = appConfig.globalProperties;
  {
    uniIdMixin(globalProperties);
  }
  {
    globalProperties.$set = set;
    globalProperties.$applyOptions = applyOptions$2;
    globalProperties.$callMethod = $callMethod;
  }
  {
    index.invokeCreateVueAppHook(app2);
  }
}
const propsCaches = /* @__PURE__ */ Object.create(null);
function pruneComponentPropsCache(uid2) {
  delete propsCaches[uid2];
}
function findComponentPropsData(up) {
  if (!up) {
    return;
  }
  const [uid2, propsId] = up.split(",");
  if (!propsCaches[uid2]) {
    return;
  }
  return propsCaches[uid2][parseInt(propsId)];
}
var plugin = {
  install(app2) {
    initApp(app2);
    app2.config.globalProperties.pruneComponentPropsCache = pruneComponentPropsCache;
    const oldMount = app2.mount;
    app2.mount = function mount(rootContainer) {
      const instance = oldMount.call(app2, rootContainer);
      const createApp2 = getCreateApp();
      if (createApp2) {
        createApp2(instance);
      } else {
        if (typeof createMiniProgramApp !== "undefined") {
          createMiniProgramApp(instance);
        }
      }
      return instance;
    };
  }
};
function getCreateApp() {
  const method = "createApp";
  if (typeof global !== "undefined" && typeof global[method] !== "undefined") {
    return global[method];
  } else if (typeof my !== "undefined") {
    return my[method];
  }
}
function vOn(value, key) {
  const instance = getCurrentInstance();
  const ctx = instance.ctx;
  const extraKey = typeof key !== "undefined" && (ctx.$mpPlatform === "mp-weixin" || ctx.$mpPlatform === "mp-qq" || ctx.$mpPlatform === "mp-xhs") && (isString(key) || typeof key === "number") ? "_" + key : "";
  const name = "e" + instance.$ei++ + extraKey;
  const mpInstance = ctx.$scope;
  if (!value) {
    delete mpInstance[name];
    return name;
  }
  const existingInvoker = mpInstance[name];
  if (existingInvoker) {
    existingInvoker.value = value;
  } else {
    mpInstance[name] = createInvoker(value, instance);
  }
  return name;
}
function createInvoker(initialValue, instance) {
  const invoker = (e2) => {
    patchMPEvent(e2);
    let args = [e2];
    if (instance && instance.ctx.$getTriggerEventDetail) {
      if (typeof e2.detail === "number") {
        e2.detail = instance.ctx.$getTriggerEventDetail(e2.detail);
      }
    }
    if (e2.detail && e2.detail.__args__) {
      args = e2.detail.__args__;
    }
    const eventValue = invoker.value;
    const invoke = () => callWithAsyncErrorHandling(patchStopImmediatePropagation(e2, eventValue), instance, 5, args);
    const eventTarget = e2.target;
    const eventSync = eventTarget ? eventTarget.dataset ? String(eventTarget.dataset.eventsync) === "true" : false : false;
    if (bubbles.includes(e2.type) && !eventSync) {
      setTimeout(invoke);
    } else {
      const res = invoke();
      if (e2.type === "input" && (isArray(res) || isPromise(res))) {
        return;
      }
      return res;
    }
  };
  invoker.value = initialValue;
  return invoker;
}
const bubbles = [
  // touch事件暂不做延迟，否则在 Android 上会影响性能，比如一些拖拽跟手手势等
  // 'touchstart',
  // 'touchmove',
  // 'touchcancel',
  // 'touchend',
  "tap",
  "longpress",
  "longtap",
  "transitionend",
  "animationstart",
  "animationiteration",
  "animationend",
  "touchforcechange"
];
function patchMPEvent(event, instance) {
  if (event.type && event.target) {
    event.preventDefault = NOOP;
    event.stopPropagation = NOOP;
    event.stopImmediatePropagation = NOOP;
    if (!hasOwn(event, "detail")) {
      event.detail = {};
    }
    if (hasOwn(event, "markerId")) {
      event.detail = typeof event.detail === "object" ? event.detail : {};
      event.detail.markerId = event.markerId;
    }
    if (isPlainObject(event.detail) && hasOwn(event.detail, "checked") && !hasOwn(event.detail, "value")) {
      event.detail.value = event.detail.checked;
    }
    if (isPlainObject(event.detail)) {
      event.target = extend({}, event.target, event.detail);
    }
  }
}
function patchStopImmediatePropagation(e2, value) {
  if (isArray(value)) {
    const originalStop = e2.stopImmediatePropagation;
    e2.stopImmediatePropagation = () => {
      originalStop && originalStop.call(e2);
      e2._stopped = true;
    };
    return value.map((fn) => (e3) => !e3._stopped && fn(e3));
  } else {
    return value;
  }
}
function vFor(source, renderItem) {
  let ret;
  if (isArray(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, i);
    }
  } else if (typeof source === "number") {
    if (!Number.isInteger(source)) {
      warn(`The v-for range expect an integer value but got ${source}.`);
      return [];
    }
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, i);
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, (item, i) => renderItem(item, i, i));
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
const o = (value, key) => vOn(value, key);
const f = (source, renderItem) => vFor(source, renderItem);
const e = (target, ...sources) => extend(target, ...sources);
const n = (value) => normalizeClass(value);
const t = (val) => toDisplayString(val);
function createApp$1(rootComponent, rootProps = null) {
  rootComponent && (rootComponent.mpType = "app");
  return createVueApp(rootComponent, rootProps).use(plugin);
}
const createSSRApp = createApp$1;
function getLocaleLanguage$1() {
  let localeLanguage = "";
  {
    const appBaseInfo = wx.getAppBaseInfo();
    const language = appBaseInfo && appBaseInfo.language ? appBaseInfo.language : LOCALE_EN;
    localeLanguage = normalizeLocale(language) || LOCALE_EN;
  }
  return localeLanguage;
}
function validateProtocolFail(name, msg) {
  console.warn(`${name}: ${msg}`);
}
function validateProtocol(name, data, protocol, onFail) {
  if (!onFail) {
    onFail = validateProtocolFail;
  }
  for (const key in protocol) {
    const errMsg = validateProp(key, data[key], protocol[key], !hasOwn(data, key));
    if (isString(errMsg)) {
      onFail(name, errMsg);
    }
  }
}
function validateProtocols(name, args, protocol, onFail) {
  if (!protocol) {
    return;
  }
  if (!isArray(protocol)) {
    return validateProtocol(name, args[0] || /* @__PURE__ */ Object.create(null), protocol, onFail);
  }
  const len = protocol.length;
  const argsLen = args.length;
  for (let i = 0; i < len; i++) {
    const opts = protocol[i];
    const data = /* @__PURE__ */ Object.create(null);
    if (argsLen > i) {
      data[opts.name] = args[i];
    }
    validateProtocol(name, data, { [opts.name]: opts }, onFail);
  }
}
function validateProp(name, value, prop, isAbsent) {
  if (!isPlainObject(prop)) {
    prop = { type: prop };
  }
  const { type, required, validator } = prop;
  if (required && isAbsent) {
    return 'Missing required args: "' + name + '"';
  }
  if (value == null && !required) {
    return;
  }
  if (type != null) {
    let isValid = false;
    const types = isArray(type) ? type : [type];
    const expectedTypes = [];
    for (let i = 0; i < types.length && !isValid; i++) {
      const { valid, expectedType } = assertType(value, types[i]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      return getInvalidTypeMessage(name, value, expectedTypes);
    }
  }
  if (validator) {
    return validator(value);
  }
}
const isSimpleType = /* @__PURE__ */ makeMap("String,Number,Boolean,Function,Symbol");
function assertType(value, type) {
  let valid;
  const expectedType = getType(type);
  if (isSimpleType(expectedType)) {
    const t2 = typeof value;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = isObject(value);
  } else if (expectedType === "Array") {
    valid = isArray(value);
  } else {
    {
      valid = value instanceof type;
    }
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage(name, value, expectedTypes) {
  let message = `Invalid args: type check failed for args "${name}". Expected ${expectedTypes.map(capitalize).join(", ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue(value, expectedType);
  const receivedValue = styleValue(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : "";
}
function styleValue(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
function tryCatch(fn) {
  return function() {
    try {
      return fn.apply(fn, arguments);
    } catch (e2) {
      console.error(e2);
    }
  };
}
let invokeCallbackId = 1;
const invokeCallbacks = {};
function addInvokeCallback(id, name, callback, keepAlive = false) {
  invokeCallbacks[id] = {
    name,
    keepAlive,
    callback
  };
  return id;
}
function invokeCallback(id, res, extras) {
  if (typeof id === "number") {
    const opts = invokeCallbacks[id];
    if (opts) {
      if (!opts.keepAlive) {
        delete invokeCallbacks[id];
      }
      return opts.callback(res, extras);
    }
  }
  return res;
}
const API_SUCCESS = "success";
const API_FAIL = "fail";
const API_COMPLETE = "complete";
function getApiCallbacks(args) {
  const apiCallbacks = {};
  for (const name in args) {
    const fn = args[name];
    if (isFunction(fn)) {
      apiCallbacks[name] = tryCatch(fn);
      delete args[name];
    }
  }
  return apiCallbacks;
}
function normalizeErrMsg(errMsg, name) {
  if (!errMsg || errMsg.indexOf(":fail") === -1) {
    return name + ":ok";
  }
  return name + errMsg.substring(errMsg.indexOf(":fail"));
}
function createAsyncApiCallback(name, args = {}, { beforeAll, beforeSuccess } = {}) {
  if (!isPlainObject(args)) {
    args = {};
  }
  const { success, fail, complete } = getApiCallbacks(args);
  const hasSuccess = isFunction(success);
  const hasFail = isFunction(fail);
  const hasComplete = isFunction(complete);
  const callbackId = invokeCallbackId++;
  addInvokeCallback(callbackId, name, (res) => {
    res = res || {};
    res.errMsg = normalizeErrMsg(res.errMsg, name);
    isFunction(beforeAll) && beforeAll(res);
    if (res.errMsg === name + ":ok") {
      isFunction(beforeSuccess) && beforeSuccess(res, args);
      hasSuccess && success(res);
    } else {
      hasFail && fail(res);
    }
    hasComplete && complete(res);
  });
  return callbackId;
}
const HOOK_SUCCESS = "success";
const HOOK_FAIL = "fail";
const HOOK_COMPLETE = "complete";
const globalInterceptors = {};
const scopedInterceptors = {};
function wrapperHook(hook, params) {
  return function(data) {
    return hook(data, params) || data;
  };
}
function queue(hooks, data, params) {
  let promise = false;
  for (let i = 0; i < hooks.length; i++) {
    const hook = hooks[i];
    if (promise) {
      promise = Promise.resolve(wrapperHook(hook, params));
    } else {
      const res = hook(data, params);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then() {
          },
          catch() {
          }
        };
      }
    }
  }
  return promise || {
    then(callback) {
      return callback(data);
    },
    catch() {
    }
  };
}
function wrapperOptions(interceptors2, options = {}) {
  [HOOK_SUCCESS, HOOK_FAIL, HOOK_COMPLETE].forEach((name) => {
    const hooks = interceptors2[name];
    if (!isArray(hooks)) {
      return;
    }
    const oldCallback = options[name];
    options[name] = function callbackInterceptor(res) {
      queue(hooks, res, options).then((res2) => {
        return isFunction(oldCallback) && oldCallback(res2) || res2;
      });
    };
  });
  return options;
}
function wrapperReturnValue(method, returnValue) {
  const returnValueHooks = [];
  if (isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push(...globalInterceptors.returnValue);
  }
  const interceptor = scopedInterceptors[method];
  if (interceptor && isArray(interceptor.returnValue)) {
    returnValueHooks.push(...interceptor.returnValue);
  }
  returnValueHooks.forEach((hook) => {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}
function getApiInterceptorHooks(method) {
  const interceptor = /* @__PURE__ */ Object.create(null);
  Object.keys(globalInterceptors).forEach((hook) => {
    if (hook !== "returnValue") {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  const scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach((hook) => {
      if (hook !== "returnValue") {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}
function invokeApi(method, api, options, params) {
  const interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (isArray(interceptor.invoke)) {
      const res = queue(interceptor.invoke, options);
      return res.then((options2) => {
        return api(wrapperOptions(getApiInterceptorHooks(method), options2), ...params);
      });
    } else {
      return api(wrapperOptions(interceptor, options), ...params);
    }
  }
  return api(options, ...params);
}
function hasCallback(args) {
  if (isPlainObject(args) && [API_SUCCESS, API_FAIL, API_COMPLETE].find((cb) => isFunction(args[cb]))) {
    return true;
  }
  return false;
}
function handlePromise(promise) {
  return promise;
}
function promisify$1(name, fn) {
  return (args = {}, ...rest) => {
    if (hasCallback(args)) {
      return wrapperReturnValue(name, invokeApi(name, fn, args, rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve2, reject) => {
      invokeApi(name, fn, extend(args, { success: resolve2, fail: reject }), rest);
    })));
  };
}
function formatApiArgs(args, options) {
  args[0];
  {
    return;
  }
}
function invokeSuccess(id, name, res) {
  const result = {
    errMsg: name + ":ok"
  };
  return invokeCallback(id, extend(res || {}, result));
}
function invokeFail(id, name, errMsg, errRes = {}) {
  const errMsgPrefix = name + ":fail";
  let apiErrMsg = "";
  if (!errMsg) {
    apiErrMsg = errMsgPrefix;
  } else if (errMsg.indexOf(errMsgPrefix) === 0) {
    apiErrMsg = errMsg;
  } else {
    apiErrMsg = errMsgPrefix + " " + errMsg;
  }
  {
    delete errRes.errCode;
  }
  let res = extend({ errMsg: apiErrMsg }, errRes);
  return invokeCallback(id, res);
}
function beforeInvokeApi(name, args, protocol, options) {
  {
    validateProtocols(name, args, protocol);
  }
  const errMsg = formatApiArgs(args);
  if (errMsg) {
    return errMsg;
  }
}
function parseErrMsg(errMsg) {
  if (!errMsg || isString(errMsg)) {
    return errMsg;
  }
  if (errMsg.stack) {
    if (typeof globalThis === "undefined" || !globalThis.harmonyChannel) {
      console.error(errMsg.message + "\n" + errMsg.stack);
    }
    return errMsg.message;
  }
  return errMsg;
}
function wrapperTaskApi(name, fn, protocol, options) {
  return (args) => {
    const id = createAsyncApiCallback(name, args, options);
    const errMsg = beforeInvokeApi(name, [args], protocol);
    if (errMsg) {
      return invokeFail(id, name, errMsg);
    }
    return fn(args, {
      resolve: (res) => invokeSuccess(id, name, res),
      reject: (errMsg2, errRes) => invokeFail(id, name, parseErrMsg(errMsg2), errRes)
    });
  };
}
function wrapperSyncApi(name, fn, protocol, options) {
  return (...args) => {
    const errMsg = beforeInvokeApi(name, args, protocol);
    if (errMsg) {
      throw new Error(errMsg);
    }
    return fn.apply(null, args);
  };
}
function wrapperAsyncApi(name, fn, protocol, options) {
  return wrapperTaskApi(name, fn, protocol, options);
}
function defineSyncApi(name, fn, protocol, options) {
  return wrapperSyncApi(name, fn, protocol);
}
function defineAsyncApi(name, fn, protocol, options) {
  return promisify$1(name, wrapperAsyncApi(name, fn, protocol, options));
}
const API_UPX2PX = "upx2px";
const Upx2pxProtocol = [
  {
    name: "upx",
    type: [Number, String],
    required: true
  }
];
const EPS = 1e-4;
const BASE_DEVICE_WIDTH = 750;
let isIOS = false;
let deviceWidth = 0;
let deviceDPR = 0;
function checkDeviceWidth() {
  const { windowWidth, pixelRatio, platform } = Object.assign({}, wx.getWindowInfo(), {
    platform: wx.getDeviceInfo().platform
  });
  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === "ios";
}
const upx2px = defineSyncApi(API_UPX2PX, (number, newDeviceWidth) => {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }
  number = Number(number);
  if (number === 0) {
    return 0;
  }
  let width = newDeviceWidth || deviceWidth;
  let result = number / BASE_DEVICE_WIDTH * width;
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      result = 1;
    } else {
      result = 0.5;
    }
  }
  return number < 0 ? -result : result;
}, Upx2pxProtocol);
function __f__(type, filename, ...args) {
  if (filename) {
    args.push(filename);
  }
  console[type].apply(console, args);
}
const API_ADD_INTERCEPTOR = "addInterceptor";
const API_REMOVE_INTERCEPTOR = "removeInterceptor";
const AddInterceptorProtocol = [
  {
    name: "method",
    type: [String, Object],
    required: true
  }
];
const RemoveInterceptorProtocol = AddInterceptorProtocol;
function mergeInterceptorHook(interceptors2, interceptor) {
  Object.keys(interceptor).forEach((hook) => {
    if (isFunction(interceptor[hook])) {
      interceptors2[hook] = mergeHook(interceptors2[hook], interceptor[hook]);
    }
  });
}
function removeInterceptorHook(interceptors2, interceptor) {
  if (!interceptors2 || !interceptor) {
    return;
  }
  Object.keys(interceptor).forEach((name) => {
    const hooks = interceptors2[name];
    const hook = interceptor[name];
    if (isArray(hooks) && isFunction(hook)) {
      remove(hooks, hook);
    }
  });
}
function mergeHook(parentVal, childVal) {
  const res = childVal ? parentVal ? parentVal.concat(childVal) : isArray(childVal) ? childVal : [childVal] : parentVal;
  return res ? dedupeHooks(res) : res;
}
function dedupeHooks(hooks) {
  const res = [];
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}
const addInterceptor = defineSyncApi(API_ADD_INTERCEPTOR, (method, interceptor) => {
  if (isString(method) && isPlainObject(interceptor)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), interceptor);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}, AddInterceptorProtocol);
const removeInterceptor = defineSyncApi(API_REMOVE_INTERCEPTOR, (method, interceptor) => {
  if (isString(method)) {
    if (isPlainObject(interceptor)) {
      removeInterceptorHook(scopedInterceptors[method], interceptor);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}, RemoveInterceptorProtocol);
const interceptors = {};
const API_ON = "$on";
const OnProtocol = [
  {
    name: "event",
    type: String,
    required: true
  },
  {
    name: "callback",
    type: Function,
    required: true
  }
];
const API_ONCE = "$once";
const OnceProtocol = OnProtocol;
const API_OFF = "$off";
const OffProtocol = [
  {
    name: "event",
    type: [String, Array]
  },
  {
    name: "callback",
    type: [Function, Number]
  }
];
const API_EMIT = "$emit";
const EmitProtocol = [
  {
    name: "event",
    type: String,
    required: true
  }
];
class EventBus {
  constructor() {
    this.$emitter = new E$1();
  }
  on(name, callback) {
    return this.$emitter.on(name, callback);
  }
  once(name, callback) {
    return this.$emitter.once(name, callback);
  }
  off(name, callback) {
    if (!name) {
      this.$emitter.e = {};
      return;
    }
    this.$emitter.off(name, callback);
  }
  emit(name, ...args) {
    this.$emitter.emit(name, ...args);
  }
}
const eventBus = new EventBus();
const $on = defineSyncApi(API_ON, (name, callback) => {
  eventBus.on(name, callback);
  return () => eventBus.off(name, callback);
}, OnProtocol);
const $once = defineSyncApi(API_ONCE, (name, callback) => {
  eventBus.once(name, callback);
  return () => eventBus.off(name, callback);
}, OnceProtocol);
const $off = defineSyncApi(API_OFF, (name, callback) => {
  if (!isArray(name))
    name = name ? [name] : [];
  name.forEach((n2) => {
    eventBus.off(n2, callback);
  });
}, OffProtocol);
const $emit = defineSyncApi(API_EMIT, (name, ...args) => {
  eventBus.emit(name, ...args);
}, EmitProtocol);
let cid;
let cidErrMsg;
let enabled;
function normalizePushMessage(message) {
  try {
    return JSON.parse(message);
  } catch (e2) {
  }
  return message;
}
function invokePushCallback(args) {
  if (args.type === "enabled") {
    enabled = true;
  } else if (args.type === "clientId") {
    cid = args.cid;
    cidErrMsg = args.errMsg;
    invokeGetPushCidCallbacks(cid, args.errMsg);
  } else if (args.type === "pushMsg") {
    const message = {
      type: "receive",
      data: normalizePushMessage(args.message)
    };
    for (let i = 0; i < onPushMessageCallbacks.length; i++) {
      const callback = onPushMessageCallbacks[i];
      callback(message);
      if (message.stopped) {
        break;
      }
    }
  } else if (args.type === "click") {
    onPushMessageCallbacks.forEach((callback) => {
      callback({
        type: "click",
        data: normalizePushMessage(args.message)
      });
    });
  }
}
const getPushCidCallbacks = [];
function invokeGetPushCidCallbacks(cid2, errMsg) {
  getPushCidCallbacks.forEach((callback) => {
    callback(cid2, errMsg);
  });
  getPushCidCallbacks.length = 0;
}
const API_GET_PUSH_CLIENT_ID = "getPushClientId";
const getPushClientId = defineAsyncApi(API_GET_PUSH_CLIENT_ID, (_, { resolve: resolve2, reject }) => {
  Promise.resolve().then(() => {
    if (typeof enabled === "undefined") {
      enabled = false;
      cid = "";
      cidErrMsg = "uniPush is not enabled";
    }
    getPushCidCallbacks.push((cid2, errMsg) => {
      if (cid2) {
        resolve2({ cid: cid2 });
      } else {
        reject(errMsg);
      }
    });
    if (typeof cid !== "undefined") {
      invokeGetPushCidCallbacks(cid, cidErrMsg);
    }
  });
});
const onPushMessageCallbacks = [];
const onPushMessage = (fn) => {
  if (onPushMessageCallbacks.indexOf(fn) === -1) {
    onPushMessageCallbacks.push(fn);
  }
};
const offPushMessage = (fn) => {
  if (!fn) {
    onPushMessageCallbacks.length = 0;
  } else {
    const index2 = onPushMessageCallbacks.indexOf(fn);
    if (index2 > -1) {
      onPushMessageCallbacks.splice(index2, 1);
    }
  }
};
const SYNC_API_RE = /^\$|__f__|getLocale|setLocale|sendNativeEvent|restoreGlobal|requireGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|rpx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64|getDeviceInfo|getAppBaseInfo|getWindowInfo|getSystemSetting|getAppAuthorizeSetting/;
const CONTEXT_API_RE = /^create|Manager$/;
const CONTEXT_API_RE_EXC = ["createBLEConnection"];
const TASK_APIS = ["request", "downloadFile", "uploadFile", "connectSocket"];
const ASYNC_API = ["createBLEConnection"];
const CALLBACK_API_RE = /^on|^off/;
function isContextApi(name) {
  return CONTEXT_API_RE.test(name) && CONTEXT_API_RE_EXC.indexOf(name) === -1;
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name) && ASYNC_API.indexOf(name) === -1;
}
function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== "onPush";
}
function isTaskApi(name) {
  return TASK_APIS.indexOf(name) !== -1;
}
function shouldPromise(name) {
  if (isContextApi(name) || isSyncApi(name) || isCallbackApi(name)) {
    return false;
  }
  return true;
}
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function(onfinally) {
    const promise = this.constructor;
    return this.then((value) => promise.resolve(onfinally && onfinally()).then(() => value), (reason) => promise.resolve(onfinally && onfinally()).then(() => {
      throw reason;
    }));
  };
}
function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  if (!isFunction(api)) {
    return api;
  }
  return function promiseApi(options = {}, ...rest) {
    if (isFunction(options.success) || isFunction(options.fail) || isFunction(options.complete)) {
      return wrapperReturnValue(name, invokeApi(name, api, options, rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve2, reject) => {
      invokeApi(name, api, extend({}, options, {
        success: resolve2,
        fail: reject
      }), rest);
    })));
  };
}
const CALLBACKS = ["success", "fail", "cancel", "complete"];
function initWrapper(protocols2) {
  function processCallback(methodName, method, returnValue) {
    return function(res) {
      return method(processReturnValue(methodName, res, returnValue));
    };
  }
  function processArgs(methodName, fromArgs, argsOption = {}, returnValue = {}, keepFromArgs = false) {
    if (isPlainObject(fromArgs)) {
      const toArgs = keepFromArgs === true ? fromArgs : {};
      if (isFunction(argsOption)) {
        argsOption = argsOption(fromArgs, toArgs) || {};
      }
      for (const key in fromArgs) {
        if (hasOwn(argsOption, key)) {
          let keyOption = argsOption[key];
          if (isFunction(keyOption)) {
            keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
          }
          if (!keyOption) {
            console.warn(`微信小程序 ${methodName} 暂不支持 ${key}`);
          } else if (isString(keyOption)) {
            toArgs[keyOption] = fromArgs[key];
          } else if (isPlainObject(keyOption)) {
            toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
          }
        } else if (CALLBACKS.indexOf(key) !== -1) {
          const callback = fromArgs[key];
          if (isFunction(callback)) {
            toArgs[key] = processCallback(methodName, callback, returnValue);
          }
        } else {
          if (!keepFromArgs && !hasOwn(toArgs, key)) {
            toArgs[key] = fromArgs[key];
          }
        }
      }
      return toArgs;
    } else if (isFunction(fromArgs)) {
      if (isFunction(argsOption)) {
        argsOption(fromArgs, {});
      }
      fromArgs = processCallback(methodName, fromArgs, returnValue);
    }
    return fromArgs;
  }
  function processReturnValue(methodName, res, returnValue, keepReturnValue = false) {
    if (isFunction(protocols2.returnValue)) {
      res = protocols2.returnValue(methodName, res);
    }
    const realKeepReturnValue = keepReturnValue || false;
    return processArgs(methodName, res, returnValue, {}, realKeepReturnValue);
  }
  return function wrapper(methodName, method) {
    const hasProtocol = hasOwn(protocols2, methodName);
    if (!hasProtocol && typeof wx[methodName] !== "function") {
      return method;
    }
    const needWrapper = hasProtocol || isFunction(protocols2.returnValue) || isContextApi(methodName) || isTaskApi(methodName);
    const hasMethod = hasProtocol || isFunction(method);
    if (!hasProtocol && !method) {
      return function() {
        console.error(`微信小程序 暂不支持${methodName}`);
      };
    }
    if (!needWrapper || !hasMethod) {
      return method;
    }
    const protocol = protocols2[methodName];
    return function(arg1, arg2) {
      let options = protocol || {};
      if (isFunction(protocol)) {
        options = protocol(arg1);
      }
      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);
      const args = [arg1];
      if (typeof arg2 !== "undefined") {
        args.push(arg2);
      }
      const returnValue = wx[options.name || methodName].apply(wx, args);
      if (isContextApi(methodName) || isTaskApi(methodName)) {
        if (returnValue && !returnValue.__v_skip) {
          returnValue.__v_skip = true;
        }
      }
      if (isSyncApi(methodName)) {
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  };
}
const getLocale = () => {
  const app2 = isFunction(getApp) && getApp({ allowDefault: true });
  if (app2 && app2.$vm) {
    return app2.$vm.$locale;
  }
  return getLocaleLanguage$1();
};
const setLocale = (locale) => {
  const app2 = isFunction(getApp) && getApp();
  if (!app2) {
    return false;
  }
  const oldLocale = app2.$vm.$locale;
  if (oldLocale !== locale) {
    app2.$vm.$locale = locale;
    onLocaleChangeCallbacks.forEach((fn) => fn({ locale }));
    return true;
  }
  return false;
};
const onLocaleChangeCallbacks = [];
const onLocaleChange = (fn) => {
  if (onLocaleChangeCallbacks.indexOf(fn) === -1) {
    onLocaleChangeCallbacks.push(fn);
  }
};
if (typeof global !== "undefined") {
  global.getLocale = getLocale;
}
const UUID_KEY = "__DC_STAT_UUID";
let deviceId;
function useDeviceId(global2 = wx) {
  return function addDeviceId(_, toRes) {
    deviceId = deviceId || global2.getStorageSync(UUID_KEY);
    if (!deviceId) {
      deviceId = Date.now() + "" + Math.floor(Math.random() * 1e7);
      wx.setStorage({
        key: UUID_KEY,
        data: deviceId
      });
    }
    toRes.deviceId = deviceId;
  };
}
function addSafeAreaInsets(fromRes, toRes) {
  if (fromRes.safeArea) {
    const safeArea = fromRes.safeArea;
    toRes.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: fromRes.windowWidth - safeArea.right,
      bottom: fromRes.screenHeight - safeArea.bottom
    };
  }
}
function getOSInfo(system, platform) {
  let osName = "";
  let osVersion = "";
  if (platform && false) {
    osName = platform;
    osVersion = system;
  } else {
    osName = system.split(" ")[0] || "";
    osVersion = system.split(" ")[1] || "";
  }
  return {
    osName: osName.toLocaleLowerCase(),
    osVersion
  };
}
function populateParameters(fromRes, toRes) {
  const { brand = "", model = "", system = "", language = "", theme, version: version2, platform, fontSizeSetting, SDKVersion, pixelRatio, deviceOrientation } = fromRes;
  const { osName, osVersion } = getOSInfo(system, platform);
  let hostVersion = version2;
  let deviceType = getGetDeviceType(fromRes, model);
  let deviceBrand = getDeviceBrand(brand);
  let _hostName = getHostName(fromRes);
  let _deviceOrientation = deviceOrientation;
  let _devicePixelRatio = pixelRatio;
  let _SDKVersion = SDKVersion;
  const hostLanguage = (language || "").replace(/_/g, "-");
  const parameters = {
    appId: "",
    appName: "ASR_test",
    appVersion: "1.0.0",
    appVersionCode: "100",
    appLanguage: getAppLanguage(hostLanguage),
    uniCompileVersion: "4.56",
    uniCompilerVersion: "4.56",
    uniRuntimeVersion: "4.56",
    uniPlatform: "mp-weixin",
    deviceBrand,
    deviceModel: model,
    deviceType,
    devicePixelRatio: _devicePixelRatio,
    deviceOrientation: _deviceOrientation,
    osName,
    osVersion,
    hostTheme: theme,
    hostVersion,
    hostLanguage,
    hostName: _hostName,
    hostSDKVersion: _SDKVersion,
    hostFontSizeSetting: fontSizeSetting,
    windowTop: 0,
    windowBottom: 0,
    // TODO
    osLanguage: void 0,
    osTheme: void 0,
    ua: void 0,
    hostPackageName: void 0,
    browserName: void 0,
    browserVersion: void 0,
    isUniAppX: false
  };
  extend(toRes, parameters);
}
function getGetDeviceType(fromRes, model) {
  let deviceType = fromRes.deviceType || "phone";
  {
    const deviceTypeMaps = {
      ipad: "pad",
      windows: "pc",
      mac: "pc"
    };
    const deviceTypeMapsKeys = Object.keys(deviceTypeMaps);
    const _model = model.toLocaleLowerCase();
    for (let index2 = 0; index2 < deviceTypeMapsKeys.length; index2++) {
      const _m = deviceTypeMapsKeys[index2];
      if (_model.indexOf(_m) !== -1) {
        deviceType = deviceTypeMaps[_m];
        break;
      }
    }
  }
  return deviceType;
}
function getDeviceBrand(brand) {
  let deviceBrand = brand;
  if (deviceBrand) {
    deviceBrand = deviceBrand.toLocaleLowerCase();
  }
  return deviceBrand;
}
function getAppLanguage(defaultLanguage) {
  return getLocale ? getLocale() : defaultLanguage;
}
function getHostName(fromRes) {
  const _platform = "WeChat";
  let _hostName = fromRes.hostName || _platform;
  {
    if (fromRes.environment) {
      _hostName = fromRes.environment;
    } else if (fromRes.host && fromRes.host.env) {
      _hostName = fromRes.host.env;
    }
  }
  return _hostName;
}
const getSystemInfo = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    useDeviceId()(fromRes, toRes);
    populateParameters(fromRes, toRes);
  }
};
const getSystemInfoSync = getSystemInfo;
const redirectTo = {};
const previewImage = {
  args(fromArgs, toArgs) {
    let currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    const urls = fromArgs.urls;
    if (!isArray(urls)) {
      return;
    }
    const len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      toArgs.current = urls[currentIndex];
      toArgs.urls = urls.filter((item, index2) => index2 < currentIndex ? item !== urls[currentIndex] : true);
    } else {
      toArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false
    };
  }
};
const showActionSheet = {
  args(fromArgs, toArgs) {
    toArgs.alertText = fromArgs.title;
  }
};
const getDeviceInfo = {
  returnValue: (fromRes, toRes) => {
    const { brand, model, system = "", platform = "" } = fromRes;
    let deviceType = getGetDeviceType(fromRes, model);
    let deviceBrand = getDeviceBrand(brand);
    useDeviceId()(fromRes, toRes);
    const { osName, osVersion } = getOSInfo(system, platform);
    toRes = sortObject(extend(toRes, {
      deviceType,
      deviceBrand,
      deviceModel: model,
      osName,
      osVersion
    }));
  }
};
const getAppBaseInfo = {
  returnValue: (fromRes, toRes) => {
    const { version: version2, language, SDKVersion, theme } = fromRes;
    let _hostName = getHostName(fromRes);
    let hostLanguage = (language || "").replace(/_/g, "-");
    const parameters = {
      hostVersion: version2,
      hostLanguage,
      hostName: _hostName,
      hostSDKVersion: SDKVersion,
      hostTheme: theme,
      appId: "",
      appName: "ASR_test",
      appVersion: "1.0.0",
      appVersionCode: "100",
      appLanguage: getAppLanguage(hostLanguage),
      isUniAppX: false,
      uniPlatform: "mp-weixin",
      uniCompileVersion: "4.56",
      uniCompilerVersion: "4.56",
      uniRuntimeVersion: "4.56"
    };
    extend(toRes, parameters);
  }
};
const getWindowInfo = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    toRes = sortObject(extend(toRes, {
      windowTop: 0,
      windowBottom: 0
    }));
  }
};
const getAppAuthorizeSetting = {
  returnValue: function(fromRes, toRes) {
    const { locationReducedAccuracy } = fromRes;
    toRes.locationAccuracy = "unsupported";
    if (locationReducedAccuracy === true) {
      toRes.locationAccuracy = "reduced";
    } else if (locationReducedAccuracy === false) {
      toRes.locationAccuracy = "full";
    }
  }
};
const onError = {
  args(fromArgs) {
    const app2 = getApp({ allowDefault: true }) || {};
    if (!app2.$vm) {
      if (!wx.$onErrorHandlers) {
        wx.$onErrorHandlers = [];
      }
      wx.$onErrorHandlers.push(fromArgs);
    } else {
      injectHook(ON_ERROR, fromArgs, app2.$vm.$);
    }
  }
};
const offError = {
  args(fromArgs) {
    const app2 = getApp({ allowDefault: true }) || {};
    if (!app2.$vm) {
      if (!wx.$onErrorHandlers) {
        return;
      }
      const index2 = wx.$onErrorHandlers.findIndex((fn) => fn === fromArgs);
      if (index2 !== -1) {
        wx.$onErrorHandlers.splice(index2, 1);
      }
    } else if (fromArgs.__weh) {
      const onErrors = app2.$vm.$[ON_ERROR];
      if (onErrors) {
        const index2 = onErrors.indexOf(fromArgs.__weh);
        if (index2 > -1) {
          onErrors.splice(index2, 1);
        }
      }
    }
  }
};
const onSocketOpen = {
  args() {
    if (wx.__uni_console__) {
      if (wx.__uni_console_warned__) {
        return;
      }
      wx.__uni_console_warned__ = true;
      console.warn(`开发模式下小程序日志回显会使用 socket 连接，为了避免冲突，建议使用 SocketTask 的方式去管理 WebSocket 或手动关闭日志回显功能。[详情](https://uniapp.dcloud.net.cn/tutorial/run/mp-log.html)`);
    }
  }
};
const onSocketMessage = onSocketOpen;
const baseApis = {
  $on,
  $off,
  $once,
  $emit,
  upx2px,
  rpx2px: upx2px,
  interceptors,
  addInterceptor,
  removeInterceptor,
  onCreateVueApp,
  invokeCreateVueAppHook,
  getLocale,
  setLocale,
  onLocaleChange,
  getPushClientId,
  onPushMessage,
  offPushMessage,
  invokePushCallback,
  __f__
};
function initUni(api, protocols2, platform = wx) {
  const wrapper = initWrapper(protocols2);
  const UniProxyHandlers = {
    get(target, key) {
      if (hasOwn(target, key)) {
        return target[key];
      }
      if (hasOwn(api, key)) {
        return promisify(key, api[key]);
      }
      if (hasOwn(baseApis, key)) {
        return promisify(key, baseApis[key]);
      }
      return promisify(key, wrapper(key, platform[key]));
    }
  };
  return new Proxy({}, UniProxyHandlers);
}
function initGetProvider(providers) {
  return function getProvider2({ service, success, fail, complete }) {
    let res;
    if (providers[service]) {
      res = {
        errMsg: "getProvider:ok",
        service,
        provider: providers[service]
      };
      isFunction(success) && success(res);
    } else {
      res = {
        errMsg: "getProvider:fail:服务[" + service + "]不存在"
      };
      isFunction(fail) && fail(res);
    }
    isFunction(complete) && complete(res);
  };
}
const objectKeys = [
  "qy",
  "env",
  "error",
  "version",
  "lanDebug",
  "cloud",
  "serviceMarket",
  "router",
  "worklet",
  "__webpack_require_UNI_MP_PLUGIN__"
];
const singlePageDisableKey = ["lanDebug", "router", "worklet"];
const launchOption = wx.getLaunchOptionsSync ? wx.getLaunchOptionsSync() : null;
function isWxKey(key) {
  if (launchOption && launchOption.scene === 1154 && singlePageDisableKey.includes(key)) {
    return false;
  }
  return objectKeys.indexOf(key) > -1 || typeof wx[key] === "function";
}
function initWx() {
  const newWx = {};
  for (const key in wx) {
    if (isWxKey(key)) {
      newWx[key] = wx[key];
    }
  }
  if (typeof globalThis !== "undefined" && typeof requireMiniProgram === "undefined") {
    globalThis.wx = newWx;
  }
  return newWx;
}
const mocks$1 = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
const getProvider = initGetProvider({
  oauth: ["weixin"],
  share: ["weixin"],
  payment: ["wxpay"],
  push: ["weixin"]
});
function initComponentMocks(component) {
  const res = /* @__PURE__ */ Object.create(null);
  mocks$1.forEach((name) => {
    res[name] = component[name];
  });
  return res;
}
function createSelectorQuery() {
  const query = wx$2.createSelectorQuery();
  const oldIn = query.in;
  query.in = function newIn(component) {
    if (component.$scope) {
      return oldIn.call(this, component.$scope);
    }
    return oldIn.call(this, initComponentMocks(component));
  };
  return query;
}
const wx$2 = initWx();
if (!wx$2.canIUse("getAppBaseInfo")) {
  wx$2.getAppBaseInfo = wx$2.getSystemInfoSync;
}
if (!wx$2.canIUse("getWindowInfo")) {
  wx$2.getWindowInfo = wx$2.getSystemInfoSync;
}
if (!wx$2.canIUse("getDeviceInfo")) {
  wx$2.getDeviceInfo = wx$2.getSystemInfoSync;
}
let baseInfo = wx$2.getAppBaseInfo && wx$2.getAppBaseInfo();
if (!baseInfo) {
  baseInfo = wx$2.getSystemInfoSync();
}
const host = baseInfo ? baseInfo.host : null;
const shareVideoMessage = host && host.env === "SAAASDK" ? wx$2.miniapp.shareVideoMessage : wx$2.shareVideoMessage;
var shims = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  createSelectorQuery,
  getProvider,
  shareVideoMessage
});
const compressImage = {
  args(fromArgs, toArgs) {
    if (fromArgs.compressedHeight && !toArgs.compressHeight) {
      toArgs.compressHeight = fromArgs.compressedHeight;
    }
    if (fromArgs.compressedWidth && !toArgs.compressWidth) {
      toArgs.compressWidth = fromArgs.compressedWidth;
    }
  }
};
var protocols = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  compressImage,
  getAppAuthorizeSetting,
  getAppBaseInfo,
  getDeviceInfo,
  getSystemInfo,
  getSystemInfoSync,
  getWindowInfo,
  offError,
  onError,
  onSocketMessage,
  onSocketOpen,
  previewImage,
  redirectTo,
  showActionSheet
});
const wx$1 = initWx();
var index = initUni(shims, protocols, wx$1);
function initRuntimeSocket(hosts, port, id) {
  if (hosts == "" || port == "" || id == "")
    return Promise.resolve(null);
  return hosts.split(",").reduce((promise, host2) => {
    return promise.then((socket) => {
      if (socket != null)
        return Promise.resolve(socket);
      return tryConnectSocket(host2, port, id);
    });
  }, Promise.resolve(null));
}
const SOCKET_TIMEOUT = 500;
function tryConnectSocket(host2, port, id) {
  return new Promise((resolve2, reject) => {
    const socket = index.connectSocket({
      url: `ws://${host2}:${port}/${id}`,
      multiple: true,
      // 支付宝小程序 是否开启多实例
      fail() {
        resolve2(null);
      }
    });
    const timer = setTimeout(() => {
      socket.close({
        code: 1006,
        reason: "connect timeout"
      });
      resolve2(null);
    }, SOCKET_TIMEOUT);
    socket.onOpen((e2) => {
      clearTimeout(timer);
      resolve2(socket);
    });
    socket.onClose((e2) => {
      clearTimeout(timer);
      resolve2(null);
    });
    socket.onError((e2) => {
      clearTimeout(timer);
      resolve2(null);
    });
  });
}
function formatMessage(type, args) {
  try {
    return {
      type,
      args: formatArgs(args)
    };
  } catch (e2) {
  }
  return {
    type,
    args: []
  };
}
function formatArgs(args) {
  return args.map((arg) => formatArg(arg));
}
function formatArg(arg, depth = 0) {
  if (depth >= 7) {
    return {
      type: "object",
      value: "[Maximum depth reached]"
    };
  }
  const type = typeof arg;
  switch (type) {
    case "string":
      return formatString(arg);
    case "number":
      return formatNumber(arg);
    case "boolean":
      return formatBoolean(arg);
    case "object":
      return formatObject(arg, depth);
    case "undefined":
      return formatUndefined();
    case "function":
      return formatFunction(arg);
    case "symbol": {
      return formatSymbol(arg);
    }
    case "bigint":
      return formatBigInt(arg);
  }
}
function formatFunction(value) {
  return {
    type: "function",
    value: `function ${value.name}() {}`
  };
}
function formatUndefined() {
  return {
    type: "undefined"
  };
}
function formatBoolean(value) {
  return {
    type: "boolean",
    value: String(value)
  };
}
function formatNumber(value) {
  return {
    type: "number",
    value: String(value)
  };
}
function formatBigInt(value) {
  return {
    type: "bigint",
    value: String(value)
  };
}
function formatString(value) {
  return {
    type: "string",
    value
  };
}
function formatSymbol(value) {
  return {
    type: "symbol",
    value: value.description
  };
}
function formatObject(value, depth) {
  if (value === null) {
    return {
      type: "null"
    };
  }
  {
    if (isComponentPublicInstance(value)) {
      return formatComponentPublicInstance(value, depth);
    }
    if (isComponentInternalInstance(value)) {
      return formatComponentInternalInstance(value, depth);
    }
    if (isUniElement(value)) {
      return formatUniElement(value, depth);
    }
    if (isCSSStyleDeclaration(value)) {
      return formatCSSStyleDeclaration(value, depth);
    }
  }
  if (Array.isArray(value)) {
    return {
      type: "object",
      subType: "array",
      value: {
        properties: value.map((v, i) => formatArrayElement(v, i, depth + 1))
      }
    };
  }
  if (value instanceof Set) {
    return {
      type: "object",
      subType: "set",
      className: "Set",
      description: `Set(${value.size})`,
      value: {
        entries: Array.from(value).map((v) => formatSetEntry(v, depth + 1))
      }
    };
  }
  if (value instanceof Map) {
    return {
      type: "object",
      subType: "map",
      className: "Map",
      description: `Map(${value.size})`,
      value: {
        entries: Array.from(value.entries()).map((v) => formatMapEntry(v, depth + 1))
      }
    };
  }
  if (value instanceof Promise) {
    return {
      type: "object",
      subType: "promise",
      value: {
        properties: []
      }
    };
  }
  if (value instanceof RegExp) {
    return {
      type: "object",
      subType: "regexp",
      value: String(value),
      className: "Regexp"
    };
  }
  if (value instanceof Date) {
    return {
      type: "object",
      subType: "date",
      value: String(value),
      className: "Date"
    };
  }
  if (value instanceof Error) {
    return {
      type: "object",
      subType: "error",
      value: value.message || String(value),
      className: value.name || "Error"
    };
  }
  let className = void 0;
  {
    const constructor = value.constructor;
    if (constructor) {
      if (constructor.get$UTSMetadata$) {
        className = constructor.get$UTSMetadata$().name;
      }
    }
  }
  return {
    type: "object",
    className,
    value: {
      properties: Object.entries(value).map((entry) => formatObjectProperty(entry[0], entry[1], depth + 1))
    }
  };
}
function isComponentPublicInstance(value) {
  return value.$ && isComponentInternalInstance(value.$);
}
function isComponentInternalInstance(value) {
  return value.type && value.uid != null && value.appContext;
}
function formatComponentPublicInstance(value, depth) {
  return {
    type: "object",
    className: "ComponentPublicInstance",
    value: {
      properties: Object.entries(value.$.type).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function formatComponentInternalInstance(value, depth) {
  return {
    type: "object",
    className: "ComponentInternalInstance",
    value: {
      properties: Object.entries(value.type).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function isUniElement(value) {
  return value.style && value.tagName != null && value.nodeName != null;
}
function formatUniElement(value, depth) {
  return {
    type: "object",
    // 非 x 没有 UniElement 的概念
    // className: 'UniElement',
    value: {
      properties: Object.entries(value).filter(([name]) => [
        "id",
        "tagName",
        "nodeName",
        "dataset",
        "offsetTop",
        "offsetLeft",
        "style"
      ].includes(name)).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function isCSSStyleDeclaration(value) {
  return typeof value.getPropertyValue === "function" && typeof value.setProperty === "function" && value.$styles;
}
function formatCSSStyleDeclaration(style, depth) {
  return {
    type: "object",
    value: {
      properties: Object.entries(style.$styles).map(([name, value]) => formatObjectProperty(name, value, depth + 1))
    }
  };
}
function formatObjectProperty(name, value, depth) {
  const result = formatArg(value, depth);
  result.name = name;
  return result;
}
function formatArrayElement(value, index2, depth) {
  const result = formatArg(value, depth);
  result.name = `${index2}`;
  return result;
}
function formatSetEntry(value, depth) {
  return {
    value: formatArg(value, depth)
  };
}
function formatMapEntry(value, depth) {
  return {
    key: formatArg(value[0], depth),
    value: formatArg(value[1], depth)
  };
}
const CONSOLE_TYPES = ["log", "warn", "error", "info", "debug"];
let sendConsole = null;
const messageQueue = [];
const messageExtra = {};
function sendConsoleMessages(messages) {
  if (sendConsole == null) {
    messageQueue.push(...messages);
    return;
  }
  sendConsole(JSON.stringify(Object.assign({
    type: "console",
    data: messages
  }, messageExtra)));
}
function setSendConsole(value, extra = {}) {
  sendConsole = value;
  Object.assign(messageExtra, extra);
  if (value != null && messageQueue.length > 0) {
    const messages = messageQueue.slice();
    messageQueue.length = 0;
    sendConsoleMessages(messages);
  }
}
const originalConsole = /* @__PURE__ */ CONSOLE_TYPES.reduce((methods, type) => {
  methods[type] = console[type].bind(console);
  return methods;
}, {});
const atFileRegex = /^\s*at\s+[\w/./-]+:\d+$/;
function rewriteConsole() {
  function wrapConsole(type) {
    return function(...args) {
      const originalArgs = [...args];
      if (originalArgs.length) {
        const maybeAtFile = originalArgs[originalArgs.length - 1];
        if (typeof maybeAtFile === "string" && atFileRegex.test(maybeAtFile)) {
          originalArgs.pop();
        }
      }
      {
        originalConsole[type](...originalArgs);
      }
      sendConsoleMessages([formatMessage(type, args)]);
    };
  }
  if (isConsoleWritable()) {
    CONSOLE_TYPES.forEach((type) => {
      console[type] = wrapConsole(type);
    });
    return function restoreConsole() {
      CONSOLE_TYPES.forEach((type) => {
        console[type] = originalConsole[type];
      });
    };
  } else {
    {
      if (typeof index !== "undefined" && index.__f__) {
        const oldLog = index.__f__;
        if (oldLog) {
          index.__f__ = function(...args) {
            const [type, filename, ...rest] = args;
            oldLog(type, "", ...rest);
            sendConsoleMessages([formatMessage(type, [...rest, filename])]);
          };
          return function restoreConsole() {
            index.__f__ = oldLog;
          };
        }
      }
    }
  }
  return function restoreConsole() {
  };
}
function isConsoleWritable() {
  const value = console.log;
  const sym = Symbol();
  try {
    console.log = sym;
  } catch (ex) {
    return false;
  }
  const isWritable = console.log === sym;
  console.log = value;
  return isWritable;
}
let sendError = null;
const errorQueue = /* @__PURE__ */ new Set();
const errorExtra = {};
function sendErrorMessages(errors) {
  if (sendError == null) {
    errors.forEach((error) => {
      errorQueue.add(error);
    });
    return;
  }
  const data = errors.map((err) => {
    const isPromiseRejection = err && "promise" in err && "reason" in err;
    const prefix = isPromiseRejection ? "UnhandledPromiseRejection: " : "";
    if (isPromiseRejection) {
      err = err.reason;
    }
    if (err instanceof Error && err.stack) {
      if (err.message && !err.stack.includes(err.message)) {
        return `${prefix}${err.message}
${err.stack}`;
      }
      return `${prefix}${err.stack}`;
    }
    if (typeof err === "object" && err !== null) {
      try {
        return prefix + JSON.stringify(err);
      } catch (err2) {
        return prefix + String(err2);
      }
    }
    return prefix + String(err);
  }).filter(Boolean);
  if (data.length > 0) {
    sendError(JSON.stringify(Object.assign({
      type: "error",
      data
    }, errorExtra)));
  }
}
function setSendError(value, extra = {}) {
  sendError = value;
  Object.assign(errorExtra, extra);
  if (value != null && errorQueue.size > 0) {
    const errors = Array.from(errorQueue);
    errorQueue.clear();
    sendErrorMessages(errors);
  }
}
function initOnError() {
  function onError2(error) {
    try {
      if (typeof PromiseRejectionEvent !== "undefined" && error instanceof PromiseRejectionEvent && error.reason instanceof Error && error.reason.message && error.reason.message.includes(`Cannot create property 'errMsg' on string 'taskId`)) {
        return;
      }
      if (true) {
        originalConsole.error(error);
      }
      sendErrorMessages([error]);
    } catch (err) {
      originalConsole.error(err);
    }
  }
  if (typeof index.onError === "function") {
    index.onError(onError2);
  }
  if (typeof index.onUnhandledRejection === "function") {
    index.onUnhandledRejection(onError2);
  }
  return function offError2() {
    if (typeof index.offError === "function") {
      index.offError(onError2);
    }
    if (typeof index.offUnhandledRejection === "function") {
      index.offUnhandledRejection(onError2);
    }
  };
}
function initRuntimeSocketService() {
  const hosts = "169.254.143.239,192.168.98.1,192.168.137.1,10.30.53.205,127.0.0.1,172.18.96.1,172.27.48.1";
  const port = "8090";
  const id = "mp-weixin_gbVfTS";
  const lazy = typeof swan !== "undefined";
  let restoreError = lazy ? () => {
  } : initOnError();
  let restoreConsole = lazy ? () => {
  } : rewriteConsole();
  return Promise.resolve().then(() => {
    if (lazy) {
      restoreError = initOnError();
      restoreConsole = rewriteConsole();
    }
    return initRuntimeSocket(hosts, port, id).then((socket) => {
      if (!socket) {
        restoreError();
        restoreConsole();
        originalConsole.error(wrapError("开发模式下日志通道建立 socket 连接失败。"));
        originalConsole.error(wrapError("如果是小程序平台，请勾选不校验合法域名配置。"));
        originalConsole.error(wrapError("如果是运行到真机，请确认手机与电脑处于同一网络。"));
        return false;
      }
      initMiniProgramGlobalFlag();
      socket.onClose(() => {
        originalConsole.error(wrapError("开发模式下日志通道 socket 连接关闭，请在 HBuilderX 中重新运行。"));
        restoreError();
        restoreConsole();
      });
      setSendConsole((data) => {
        socket.send({
          data
        });
      });
      setSendError((data) => {
        socket.send({
          data
        });
      });
      return true;
    });
  });
}
const ERROR_CHAR = "‌";
function wrapError(error) {
  return `${ERROR_CHAR}${error}${ERROR_CHAR}`;
}
function initMiniProgramGlobalFlag() {
  if (typeof wx$1 !== "undefined") {
    wx$1.__uni_console__ = true;
  } else if (typeof my !== "undefined") {
    my.__uni_console__ = true;
  } else if (typeof tt !== "undefined") {
    tt.__uni_console__ = true;
  } else if (typeof swan !== "undefined") {
    swan.__uni_console__ = true;
  } else if (typeof qq !== "undefined") {
    qq.__uni_console__ = true;
  } else if (typeof ks !== "undefined") {
    ks.__uni_console__ = true;
  } else if (typeof jd !== "undefined") {
    jd.__uni_console__ = true;
  } else if (typeof xhs !== "undefined") {
    xhs.__uni_console__ = true;
  } else if (typeof has !== "undefined") {
    has.__uni_console__ = true;
  } else if (typeof qa !== "undefined") {
    qa.__uni_console__ = true;
  }
}
initRuntimeSocketService();
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
function initVueIds(vueIds, mpInstance) {
  if (!vueIds) {
    return;
  }
  const ids = vueIds.split(",");
  const len = ids.length;
  if (len === 1) {
    mpInstance._$vueId = ids[0];
  } else if (len === 2) {
    mpInstance._$vueId = ids[0];
    mpInstance._$vuePid = ids[1];
  }
}
const EXTRAS = ["externalClasses"];
function initExtraOptions(miniProgramComponentOptions, vueOptions) {
  EXTRAS.forEach((name) => {
    if (hasOwn(vueOptions, name)) {
      miniProgramComponentOptions[name] = vueOptions[name];
    }
  });
}
const WORKLET_RE = /_(.*)_worklet_factory_/;
function initWorkletMethods(mpMethods, vueMethods) {
  if (vueMethods) {
    Object.keys(vueMethods).forEach((name) => {
      const matches = name.match(WORKLET_RE);
      if (matches) {
        const workletName = matches[1];
        mpMethods[name] = vueMethods[name];
        mpMethods[workletName] = vueMethods[workletName];
      }
    });
  }
}
function initWxsCallMethods(methods, wxsCallMethods) {
  if (!isArray(wxsCallMethods)) {
    return;
  }
  wxsCallMethods.forEach((callMethod) => {
    methods[callMethod] = function(args) {
      return this.$vm[callMethod](args);
    };
  });
}
function selectAllComponents(mpInstance, selector, $refs) {
  const components = mpInstance.selectAllComponents(selector);
  components.forEach((component) => {
    const ref2 = component.properties.uR;
    $refs[ref2] = component.$vm || component;
  });
}
function initRefs(instance, mpInstance) {
  Object.defineProperty(instance, "refs", {
    get() {
      const $refs = {};
      selectAllComponents(mpInstance, ".r", $refs);
      const forComponents = mpInstance.selectAllComponents(".r-i-f");
      forComponents.forEach((component) => {
        const ref2 = component.properties.uR;
        if (!ref2) {
          return;
        }
        if (!$refs[ref2]) {
          $refs[ref2] = [];
        }
        $refs[ref2].push(component.$vm || component);
      });
      return $refs;
    }
  });
}
function findVmByVueId(instance, vuePid) {
  const $children = instance.$children;
  for (let i = $children.length - 1; i >= 0; i--) {
    const childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  let parentVm;
  for (let i = $children.length - 1; i >= 0; i--) {
    parentVm = findVmByVueId($children[i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}
function getLocaleLanguage() {
  let localeLanguage = "";
  {
    const appBaseInfo = wx.getAppBaseInfo();
    const language = appBaseInfo && appBaseInfo.language ? appBaseInfo.language : LOCALE_EN;
    localeLanguage = normalizeLocale(language) || LOCALE_EN;
  }
  return localeLanguage;
}
const MP_METHODS = [
  "createSelectorQuery",
  "createIntersectionObserver",
  "selectAllComponents",
  "selectComponent"
];
function createEmitFn(oldEmit, ctx) {
  return function emit2(event, ...args) {
    const scope = ctx.$scope;
    if (scope && event) {
      const detail = { __args__: args };
      {
        scope.triggerEvent(event, detail);
      }
    }
    return oldEmit.apply(this, [event, ...args]);
  };
}
function initBaseInstance(instance, options) {
  const ctx = instance.ctx;
  ctx.mpType = options.mpType;
  ctx.$mpType = options.mpType;
  ctx.$mpPlatform = "mp-weixin";
  ctx.$scope = options.mpInstance;
  {
    Object.defineProperties(ctx, {
      // only id
      [VIRTUAL_HOST_ID]: {
        get() {
          const id = this.$scope.data[VIRTUAL_HOST_ID];
          return id === void 0 ? "" : id;
        }
      }
    });
  }
  ctx.$mp = {};
  {
    ctx._self = {};
  }
  instance.slots = {};
  if (isArray(options.slots) && options.slots.length) {
    options.slots.forEach((name) => {
      instance.slots[name] = true;
    });
    if (instance.slots[SLOT_DEFAULT_NAME]) {
      instance.slots.default = true;
    }
  }
  ctx.getOpenerEventChannel = function() {
    {
      return options.mpInstance.getOpenerEventChannel();
    }
  };
  ctx.$hasHook = hasHook;
  ctx.$callHook = callHook;
  instance.emit = createEmitFn(instance.emit, ctx);
}
function initComponentInstance(instance, options) {
  initBaseInstance(instance, options);
  const ctx = instance.ctx;
  MP_METHODS.forEach((method) => {
    ctx[method] = function(...args) {
      const mpInstance = ctx.$scope;
      if (mpInstance && mpInstance[method]) {
        return mpInstance[method].apply(mpInstance, args);
      }
    };
  });
}
function initMocks(instance, mpInstance, mocks2) {
  const ctx = instance.ctx;
  mocks2.forEach((mock) => {
    if (hasOwn(mpInstance, mock)) {
      instance[mock] = ctx[mock] = mpInstance[mock];
    }
  });
}
function hasHook(name) {
  const hooks = this.$[name];
  if (hooks && hooks.length) {
    return true;
  }
  return false;
}
function callHook(name, args) {
  if (name === "mounted") {
    callHook.call(this, "bm");
    this.$.isMounted = true;
    name = "m";
  }
  const hooks = this.$[name];
  return hooks && invokeArrayFns(hooks, args);
}
const PAGE_INIT_HOOKS = [
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_RESIZE,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_ADD_TO_FAVORITES
  // 'onReady', // lifetimes.ready
  // 'onPageScroll', // 影响性能，开发者手动注册
  // 'onShareTimeline', // 右上角菜单，开发者手动注册
  // 'onShareAppMessage' // 右上角菜单，开发者手动注册
];
function findHooks(vueOptions, hooks = /* @__PURE__ */ new Set()) {
  if (vueOptions) {
    Object.keys(vueOptions).forEach((name) => {
      if (isUniLifecycleHook(name, vueOptions[name])) {
        hooks.add(name);
      }
    });
    {
      const { extends: extendsOptions, mixins } = vueOptions;
      if (mixins) {
        mixins.forEach((mixin) => findHooks(mixin, hooks));
      }
      if (extendsOptions) {
        findHooks(extendsOptions, hooks);
      }
    }
  }
  return hooks;
}
function initHook(mpOptions, hook, excludes) {
  if (excludes.indexOf(hook) === -1 && !hasOwn(mpOptions, hook)) {
    mpOptions[hook] = function(args) {
      return this.$vm && this.$vm.$callHook(hook, args);
    };
  }
}
const EXCLUDE_HOOKS = [ON_READY];
function initHooks(mpOptions, hooks, excludes = EXCLUDE_HOOKS) {
  hooks.forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initUnknownHooks(mpOptions, vueOptions, excludes = EXCLUDE_HOOKS) {
  findHooks(vueOptions).forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initRuntimeHooks(mpOptions, runtimeHooks) {
  if (!runtimeHooks) {
    return;
  }
  const hooks = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
  hooks.forEach((hook) => {
    if (runtimeHooks & MINI_PROGRAM_PAGE_RUNTIME_HOOKS[hook]) {
      initHook(mpOptions, hook, []);
    }
  });
}
const findMixinRuntimeHooks = /* @__PURE__ */ once(() => {
  const runtimeHooks = [];
  const app2 = isFunction(getApp) && getApp({ allowDefault: true });
  if (app2 && app2.$vm && app2.$vm.$) {
    const mixins = app2.$vm.$.appContext.mixins;
    if (isArray(mixins)) {
      const hooks = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
      mixins.forEach((mixin) => {
        hooks.forEach((hook) => {
          if (hasOwn(mixin, hook) && !runtimeHooks.includes(hook)) {
            runtimeHooks.push(hook);
          }
        });
      });
    }
  }
  return runtimeHooks;
});
function initMixinRuntimeHooks(mpOptions) {
  initHooks(mpOptions, findMixinRuntimeHooks());
}
const HOOKS = [
  ON_SHOW,
  ON_HIDE,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION
];
function parseApp(instance, parseAppOptions) {
  const internalInstance = instance.$;
  const appOptions = {
    globalData: instance.$options && instance.$options.globalData || {},
    $vm: instance,
    // mp-alipay 组件 data 初始化比 onLaunch 早，提前挂载
    onLaunch(options) {
      this.$vm = instance;
      const ctx = internalInstance.ctx;
      if (this.$vm && ctx.$scope && ctx.$callHook) {
        return;
      }
      initBaseInstance(internalInstance, {
        mpType: "app",
        mpInstance: this,
        slots: []
      });
      ctx.globalData = this.globalData;
      instance.$callHook(ON_LAUNCH, options);
    }
  };
  const onErrorHandlers = wx.$onErrorHandlers;
  if (onErrorHandlers) {
    onErrorHandlers.forEach((fn) => {
      injectHook(ON_ERROR, fn, internalInstance);
    });
    onErrorHandlers.length = 0;
  }
  initLocale(instance);
  const vueOptions = instance.$.type;
  initHooks(appOptions, HOOKS);
  initUnknownHooks(appOptions, vueOptions);
  {
    const methods = vueOptions.methods;
    methods && extend(appOptions, methods);
  }
  return appOptions;
}
function initCreateApp(parseAppOptions) {
  return function createApp2(vm) {
    return App(parseApp(vm));
  };
}
function initCreateSubpackageApp(parseAppOptions) {
  return function createApp2(vm) {
    const appOptions = parseApp(vm);
    const app2 = isFunction(getApp) && getApp({
      allowDefault: true
    });
    if (!app2)
      return;
    vm.$.ctx.$scope = app2;
    const globalData = app2.globalData;
    if (globalData) {
      Object.keys(appOptions.globalData).forEach((name) => {
        if (!hasOwn(globalData, name)) {
          globalData[name] = appOptions.globalData[name];
        }
      });
    }
    Object.keys(appOptions).forEach((name) => {
      if (!hasOwn(app2, name)) {
        app2[name] = appOptions[name];
      }
    });
    initAppLifecycle(appOptions, vm);
  };
}
function initAppLifecycle(appOptions, vm) {
  if (isFunction(appOptions.onLaunch)) {
    const args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    appOptions.onLaunch(args);
  }
  if (isFunction(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow((args) => {
      vm.$callHook("onShow", args);
    });
  }
  if (isFunction(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide((args) => {
      vm.$callHook("onHide", args);
    });
  }
}
function initLocale(appVm) {
  const locale = ref(getLocaleLanguage());
  Object.defineProperty(appVm, "$locale", {
    get() {
      return locale.value;
    },
    set(v) {
      locale.value = v;
    }
  });
}
const builtInProps = [
  // 百度小程序,快手小程序自定义组件不支持绑定动态事件，动态dataset，故通过props传递事件信息
  // event-opts
  "eO",
  // 组件 ref
  "uR",
  // 组件 ref-in-for
  "uRIF",
  // 组件 id
  "uI",
  // 组件类型 m: 小程序组件
  "uT",
  // 组件 props
  "uP",
  // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
  "uS"
];
function initDefaultProps(options, isBehavior = false) {
  const properties = {};
  if (!isBehavior) {
    let observerSlots = function(newVal) {
      const $slots = /* @__PURE__ */ Object.create(null);
      newVal && newVal.forEach((slotName) => {
        $slots[slotName] = true;
      });
      this.setData({
        $slots
      });
    };
    builtInProps.forEach((name) => {
      properties[name] = {
        type: null,
        value: ""
      };
    });
    properties.uS = {
      type: null,
      value: []
    };
    {
      properties.uS.observer = observerSlots;
    }
  }
  if (options.behaviors) {
    if (options.behaviors.includes("wx://form-field")) {
      if (!options.properties || !options.properties.name) {
        properties.name = {
          type: null,
          value: ""
        };
      }
      if (!options.properties || !options.properties.value) {
        properties.value = {
          type: null,
          value: ""
        };
      }
    }
  }
  return properties;
}
function initVirtualHostProps(options) {
  const properties = {};
  {
    if (options && options.virtualHost) {
      properties[VIRTUAL_HOST_STYLE] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_CLASS] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_HIDDEN] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_ID] = {
        type: null,
        value: ""
      };
    }
  }
  return properties;
}
function initProps(mpComponentOptions) {
  if (!mpComponentOptions.properties) {
    mpComponentOptions.properties = {};
  }
  extend(mpComponentOptions.properties, initDefaultProps(mpComponentOptions), initVirtualHostProps(mpComponentOptions.options));
}
const PROP_TYPES = [String, Number, Boolean, Object, Array, null];
function parsePropType(type, defaultValue) {
  if (isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}
function normalizePropType(type, defaultValue) {
  const res = parsePropType(type);
  return PROP_TYPES.indexOf(res) !== -1 ? res : null;
}
function initPageProps({ properties }, rawProps) {
  if (isArray(rawProps)) {
    rawProps.forEach((key) => {
      properties[key] = {
        type: String,
        value: ""
      };
    });
  } else if (isPlainObject(rawProps)) {
    Object.keys(rawProps).forEach((key) => {
      const opts = rawProps[key];
      if (isPlainObject(opts)) {
        let value = opts.default;
        if (isFunction(value)) {
          value = value();
        }
        const type = opts.type;
        opts.type = normalizePropType(type);
        properties[key] = {
          type: opts.type,
          value
        };
      } else {
        properties[key] = {
          type: normalizePropType(opts)
        };
      }
    });
  }
}
function findPropsData(properties, isPage2) {
  return (isPage2 ? findPagePropsData(properties) : findComponentPropsData(resolvePropValue(properties.uP))) || {};
}
function findPagePropsData(properties) {
  const propsData = {};
  if (isPlainObject(properties)) {
    Object.keys(properties).forEach((name) => {
      if (builtInProps.indexOf(name) === -1) {
        propsData[name] = resolvePropValue(properties[name]);
      }
    });
  }
  return propsData;
}
function initFormField(vm) {
  const vueOptions = vm.$options;
  if (isArray(vueOptions.behaviors) && vueOptions.behaviors.includes("uni://form-field")) {
    vm.$watch("modelValue", () => {
      vm.$scope && vm.$scope.setData({
        name: vm.name,
        value: vm.modelValue
      });
    }, {
      immediate: true
    });
  }
}
function resolvePropValue(prop) {
  return prop;
}
function initData(_) {
  return {};
}
function initPropsObserver(componentOptions) {
  const observe = function observe2() {
    const up = this.properties.uP;
    if (!up) {
      return;
    }
    if (this.$vm) {
      updateComponentProps(resolvePropValue(up), this.$vm.$);
    } else if (resolvePropValue(this.properties.uT) === "m") {
      updateMiniProgramComponentProperties(resolvePropValue(up), this);
    }
  };
  {
    if (!componentOptions.observers) {
      componentOptions.observers = {};
    }
    componentOptions.observers.uP = observe;
  }
}
function updateMiniProgramComponentProperties(up, mpInstance) {
  const prevProps = mpInstance.properties;
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps, false)) {
    mpInstance.setData(nextProps);
  }
}
function updateComponentProps(up, instance) {
  const prevProps = toRaw(instance.props);
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps)) {
    updateProps(instance, nextProps, prevProps, false);
    if (hasQueueJob(instance.update)) {
      invalidateJob(instance.update);
    }
    {
      instance.update();
    }
  }
}
function hasPropsChanged(prevProps, nextProps, checkLen = true) {
  const nextKeys = Object.keys(nextProps);
  if (checkLen && nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }
  return false;
}
function initBehaviors(vueOptions) {
  const vueBehaviors = vueOptions.behaviors;
  let vueProps = vueOptions.props;
  if (!vueProps) {
    vueOptions.props = vueProps = [];
  }
  const behaviors = [];
  if (isArray(vueBehaviors)) {
    vueBehaviors.forEach((behavior) => {
      behaviors.push(behavior.replace("uni://", "wx://"));
      if (behavior === "uni://form-field") {
        if (isArray(vueProps)) {
          vueProps.push("name");
          vueProps.push("modelValue");
        } else {
          vueProps.name = {
            type: String,
            default: ""
          };
          vueProps.modelValue = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: ""
          };
        }
      }
    });
  }
  return behaviors;
}
function applyOptions(componentOptions, vueOptions) {
  componentOptions.data = initData();
  componentOptions.behaviors = initBehaviors(vueOptions);
}
function parseComponent(vueOptions, { parse, mocks: mocks2, isPage: isPage2, isPageInProject, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 }) {
  vueOptions = vueOptions.default || vueOptions;
  const options = {
    multipleSlots: true,
    // styleIsolation: 'apply-shared',
    addGlobalClass: true,
    pureDataPattern: /^uP$/
  };
  if (isArray(vueOptions.mixins)) {
    vueOptions.mixins.forEach((item) => {
      if (isObject(item.options)) {
        extend(options, item.options);
      }
    });
  }
  if (vueOptions.options) {
    extend(options, vueOptions.options);
  }
  const mpComponentOptions = {
    options,
    lifetimes: initLifetimes2({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }),
    pageLifetimes: {
      show() {
        this.$vm && this.$vm.$callHook("onPageShow");
      },
      hide() {
        this.$vm && this.$vm.$callHook("onPageHide");
      },
      resize(size2) {
        this.$vm && this.$vm.$callHook("onPageResize", size2);
      }
    },
    methods: {
      __l: handleLink2
    }
  };
  {
    applyOptions(mpComponentOptions, vueOptions);
  }
  initProps(mpComponentOptions);
  initPropsObserver(mpComponentOptions);
  initExtraOptions(mpComponentOptions, vueOptions);
  initWxsCallMethods(mpComponentOptions.methods, vueOptions.wxsCallMethods);
  {
    initWorkletMethods(mpComponentOptions.methods, vueOptions.methods);
  }
  if (parse) {
    parse(mpComponentOptions, { handleLink: handleLink2 });
  }
  return mpComponentOptions;
}
function initCreateComponent(parseOptions2) {
  return function createComponent2(vueComponentOptions) {
    return Component(parseComponent(vueComponentOptions, parseOptions2));
  };
}
let $createComponentFn;
let $destroyComponentFn;
function getAppVm() {
  return getApp().$vm;
}
function $createComponent(initialVNode, options) {
  if (!$createComponentFn) {
    $createComponentFn = getAppVm().$createComponent;
  }
  const proxy = $createComponentFn(initialVNode, options);
  return getExposeProxy(proxy.$) || proxy;
}
function $destroyComponent(instance) {
  if (!$destroyComponentFn) {
    $destroyComponentFn = getAppVm().$destroyComponent;
  }
  return $destroyComponentFn(instance);
}
function parsePage(vueOptions, parseOptions2) {
  const { parse, mocks: mocks2, isPage: isPage2, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 } = parseOptions2;
  const miniProgramPageOptions = parseComponent(vueOptions, {
    mocks: mocks2,
    isPage: isPage2,
    isPageInProject: true,
    initRelation: initRelation2,
    handleLink: handleLink2,
    initLifetimes: initLifetimes2
  });
  initPageProps(miniProgramPageOptions, (vueOptions.default || vueOptions).props);
  const methods = miniProgramPageOptions.methods;
  methods.onLoad = function(query) {
    {
      this.options = query;
    }
    this.$page = {
      fullPath: addLeadingSlash(this.route + stringifyQuery(query))
    };
    return this.$vm && this.$vm.$callHook(ON_LOAD, query);
  };
  initHooks(methods, PAGE_INIT_HOOKS);
  {
    initUnknownHooks(methods, vueOptions);
  }
  initRuntimeHooks(methods, vueOptions.__runtimeHooks);
  initMixinRuntimeHooks(methods);
  parse && parse(miniProgramPageOptions, { handleLink: handleLink2 });
  return miniProgramPageOptions;
}
function initCreatePage(parseOptions2) {
  return function createPage2(vuePageOptions) {
    return Component(parsePage(vuePageOptions, parseOptions2));
  };
}
function initCreatePluginApp(parseAppOptions) {
  return function createApp2(vm) {
    initAppLifecycle(parseApp(vm), vm);
  };
}
const MPPage = Page;
const MPComponent = Component;
function initTriggerEvent(mpInstance) {
  const oldTriggerEvent = mpInstance.triggerEvent;
  const newTriggerEvent = function(event, ...args) {
    return oldTriggerEvent.apply(mpInstance, [
      customizeEvent(event),
      ...args
    ]);
  };
  try {
    mpInstance.triggerEvent = newTriggerEvent;
  } catch (error) {
    mpInstance._triggerEvent = newTriggerEvent;
  }
}
function initMiniProgramHook(name, options, isComponent) {
  const oldHook = options[name];
  if (!oldHook) {
    options[name] = function() {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function(...args) {
      initTriggerEvent(this);
      return oldHook.apply(this, args);
    };
  }
}
Page = function(options) {
  initMiniProgramHook(ON_LOAD, options);
  return MPPage(options);
};
Component = function(options) {
  initMiniProgramHook("created", options);
  const isVueComponent = options.properties && options.properties.uP;
  if (!isVueComponent) {
    initProps(options);
    initPropsObserver(options);
  }
  return MPComponent(options);
};
function initLifetimes({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }) {
  return {
    attached() {
      let properties = this.properties;
      initVueIds(properties.uI, this);
      const relationOptions = {
        vuePid: this._$vuePid
      };
      initRelation2(this, relationOptions);
      const mpInstance = this;
      const isMiniProgramPage = isPage2(mpInstance);
      let propsData = properties;
      this.$vm = $createComponent({
        type: vueOptions,
        props: findPropsData(propsData, isMiniProgramPage)
      }, {
        mpType: isMiniProgramPage ? "page" : "component",
        mpInstance,
        slots: properties.uS || {},
        // vueSlots
        parentComponent: relationOptions.parent && relationOptions.parent.$,
        onBeforeSetup(instance, options) {
          initRefs(instance, mpInstance);
          initMocks(instance, mpInstance, mocks2);
          initComponentInstance(instance, options);
        }
      });
      if (!isMiniProgramPage) {
        initFormField(this.$vm);
      }
    },
    ready() {
      if (this.$vm) {
        {
          this.$vm.$callHook("mounted");
          this.$vm.$callHook(ON_READY);
        }
      }
    },
    detached() {
      if (this.$vm) {
        pruneComponentPropsCache(this.$vm.$.uid);
        $destroyComponent(this.$vm);
      }
    }
  };
}
const mocks = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
function isPage(mpInstance) {
  return !!mpInstance.route;
}
function initRelation(mpInstance, detail) {
  mpInstance.triggerEvent("__l", detail);
}
function handleLink(event) {
  const detail = event.detail || event.value;
  const vuePid = detail.vuePid;
  let parentVm;
  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }
  if (!parentVm) {
    parentVm = this.$vm;
  }
  detail.parent = parentVm;
}
var parseOptions = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  handleLink,
  initLifetimes,
  initRelation,
  isPage,
  mocks
});
const createApp = initCreateApp();
const createPage = initCreatePage(parseOptions);
const createComponent = initCreateComponent(parseOptions);
const createPluginApp = initCreatePluginApp();
const createSubpackageApp = initCreateSubpackageApp();
{
  wx.createApp = global.createApp = createApp;
  wx.createPage = createPage;
  wx.createComponent = createComponent;
  wx.createPluginApp = global.createPluginApp = createPluginApp;
  wx.createSubpackageApp = global.createSubpackageApp = createSubpackageApp;
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var recorderCore = { exports: {} };
(function(module2) {
  (function(factory) {
    var browser = typeof window == "object" && !!window.document;
    var win = browser ? window : Object;
    factory(win, browser);
    if (module2.exports) {
      module2.exports = win.Recorder;
    }
  })(function(Export, isBrowser) {
    var NOOP2 = function() {
    };
    var IsNum = function(v) {
      return typeof v == "number";
    };
    var ToJson = function(v) {
      return JSON.stringify(v);
    };
    var Recorder2 = function(set2) {
      return new initFn(set2);
    };
    var LM = Recorder2.LM = "2025-01-11 09:28";
    var GitUrl = "https://github.com/xiangyuecn/Recorder";
    var RecTxt = "Recorder";
    var getUserMediaTxt = "getUserMedia";
    var srcSampleRateTxt = "srcSampleRate";
    var sampleRateTxt = "sampleRate";
    var bitRateTxt = "bitRate";
    var CatchTxt = "catch";
    var WRec2 = Export[RecTxt];
    if (WRec2 && WRec2.LM == LM) {
      WRec2.CLog(WRec2.i18n.$T("K8zP::重复导入{1}", 0, RecTxt), 3);
      return;
    }
    Recorder2.IsOpen = function() {
      var stream = Recorder2.Stream;
      if (stream) {
        var tracks = Tracks_(stream), track2 = tracks[0];
        if (track2) {
          var state = track2.readyState;
          return state == "live" || state == track2.LIVE;
        }
      }
      return false;
    };
    Recorder2.BufferSize = 4096;
    Recorder2.Destroy = function() {
      CLog(RecTxt + " Destroy");
      Disconnect();
      for (var k in DestroyList) {
        DestroyList[k]();
      }
    };
    var DestroyList = {};
    Recorder2.BindDestroy = function(key, call) {
      DestroyList[key] = call;
    };
    Recorder2.Support = function() {
      if (!isBrowser)
        return false;
      var scope = navigator.mediaDevices || {};
      if (!scope[getUserMediaTxt]) {
        scope = navigator;
        scope[getUserMediaTxt] || (scope[getUserMediaTxt] = scope.webkitGetUserMedia || scope.mozGetUserMedia || scope.msGetUserMedia);
      }
      if (!scope[getUserMediaTxt]) {
        return false;
      }
      Recorder2.Scope = scope;
      if (!Recorder2.GetContext()) {
        return false;
      }
      return true;
    };
    Recorder2.GetContext = function(tryNew) {
      if (!isBrowser)
        return null;
      var AC = window.AudioContext;
      if (!AC) {
        AC = window.webkitAudioContext;
      }
      if (!AC) {
        return null;
      }
      var ctx = Recorder2.Ctx, isNew = 0;
      if (!ctx) {
        ctx = Recorder2.Ctx = new AC();
        isNew = 1;
        Recorder2.NewCtxs = Recorder2.NewCtxs || [];
        Recorder2.BindDestroy("Ctx", function() {
          var ctx2 = Recorder2.Ctx;
          if (ctx2 && ctx2.close) {
            CloseCtx(ctx2);
            Recorder2.Ctx = 0;
          }
          var arr = Recorder2.NewCtxs;
          Recorder2.NewCtxs = [];
          for (var i = 0; i < arr.length; i++)
            CloseCtx(arr[i]);
        });
      }
      if (tryNew && ctx.close) {
        if (!isNew) {
          if (!ctx._useC)
            CloseCtx(ctx);
          ctx = new AC();
        }
        ctx._useC = 1;
        Recorder2.NewCtxs.push(ctx);
      }
      return ctx;
    };
    Recorder2.CloseNewCtx = function(ctx) {
      if (ctx && ctx.close) {
        CloseCtx(ctx);
        var arr = Recorder2.NewCtxs || [], L = arr.length;
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] == ctx) {
            arr.splice(i, 1);
            break;
          }
        }
        CLog($T("mSxV::剩{1}个GetContext未close", 0, L + "-1=" + arr.length), arr.length ? 3 : 0);
      }
    };
    var CloseCtx = function(ctx) {
      if (ctx && ctx.close && !ctx._isC) {
        ctx._isC = 1;
        if (ctx.state != "closed") {
          try {
            ctx.close();
          } catch (e2) {
            CLog("ctx close err", 1, e2);
          }
        }
      }
    };
    var ResumeCtx = Recorder2.ResumeCtx = function(ctx, check, True, False) {
      var isEnd = 0, isBind = 0, isLsSC = 0, runC = 0, EL = "EventListener", Tag = "ResumeCtx ";
      var end = function(err, ok) {
        if (isBind) {
          bind();
        }
        if (!isEnd) {
          isEnd = 1;
          err && False(err, runC);
          ok && True(runC);
        }
        if (ok) {
          if (!ctx._LsSC && ctx["add" + EL])
            ctx["add" + EL]("statechange", run);
          ctx._LsSC = 1;
          isLsSC = 1;
        }
      };
      var bind = function(add2) {
        if (add2 && isBind)
          return;
        isBind = add2 ? 1 : 0;
        var types = ["focus", "mousedown", "mouseup", "touchstart", "touchend"];
        for (var i = 0; i < types.length; i++)
          window[(add2 ? "add" : "remove") + EL](types[i], run, true);
      };
      var run = function() {
        var sVal = ctx.state, spEnd = CtxSpEnd(sVal);
        if (!isEnd && !check(spEnd ? ++runC : runC))
          return end();
        if (spEnd) {
          if (isLsSC)
            CLog(Tag + "sc " + sVal, 3);
          bind(1);
          ctx.resume().then(function() {
            if (isLsSC)
              CLog(Tag + "sc " + ctx.state);
            end(0, 1);
          })[CatchTxt](function(e2) {
            CLog(Tag + "error", 1, e2);
            if (!CtxSpEnd(ctx.state)) {
              end(e2.message || "error");
            }
          });
        } else if (sVal == "closed") {
          if (isLsSC && !ctx._isC)
            CLog(Tag + "sc " + sVal, 1);
          end("ctx closed");
        } else {
          end(0, 1);
        }
      };
      run();
    };
    var CtxSpEnd = Recorder2.CtxSpEnd = function(v) {
      return v == "suspended" || v == "interrupted";
    };
    var CtxState = function(ctx) {
      var v = ctx.state, msg = "ctx.state=" + v;
      if (CtxSpEnd(v))
        msg += $T("nMIy::（注意：ctx不是running状态，rec.open和start至少要有一个在用户操作(触摸、点击等)时进行调用，否则将在rec.start时尝试进行ctx.resume，可能会产生兼容性问题(仅iOS)，请参阅文档中runningContext配置）");
      return msg;
    };
    var ConnectEnableWebM = "ConnectEnableWebM";
    Recorder2[ConnectEnableWebM] = true;
    var ConnectEnableWorklet = "ConnectEnableWorklet";
    Recorder2[ConnectEnableWorklet] = false;
    var Connect = function(streamStore) {
      var bufferSize = streamStore.BufferSize || Recorder2.BufferSize;
      var stream = streamStore.Stream;
      var ctx = stream._c, ctxSR = ctx[sampleRateTxt], srChunk = {};
      var tracks = Tracks_(stream), track2 = tracks[0], trackSet = null, tsMsg = "";
      if (track2 && track2.getSettings) {
        trackSet = track2.getSettings();
        var trackSR = trackSet[sampleRateTxt];
        if (trackSR && trackSR != ctxSR) {
          tsMsg = $T("eS8i::Stream的采样率{1}不等于{2}，将进行采样率转换（注意：音质不会变好甚至可能变差），主要在移动端未禁用回声消除时会产生此现象，浏览器有回声消除时可能只会返回16k采样率的音频数据，", 0, trackSR, ctxSR);
        }
      }
      stream._ts = trackSet;
      CLog(tsMsg + "Stream TrackSet: " + ToJson(trackSet), tsMsg ? 3 : 0);
      var mediaConn = function(node) {
        var media = stream._m = ctx.createMediaStreamSource(stream);
        var ctxDest = ctx.destination, cmsdTxt = "createMediaStreamDestination";
        if (ctx[cmsdTxt]) {
          ctxDest = stream._d = ctx[cmsdTxt]();
        }
        media.connect(node);
        node.connect(ctxDest);
      };
      var isWebM, isWorklet, badInt, webMTips = "";
      var calls = stream._call;
      var onReceive = function(float32Arr, arrSR) {
        for (var k0 in calls) {
          if (arrSR != ctxSR) {
            srChunk.index = 0;
            srChunk = Recorder2.SampleData([float32Arr], arrSR, ctxSR, srChunk, { _sum: 1 });
            var pcm = srChunk.data;
            var sum = srChunk._sum;
          } else {
            srChunk = {};
            var size2 = float32Arr.length;
            var pcm = new Int16Array(size2);
            var sum = 0;
            for (var j = 0; j < size2; j++) {
              var s = Math.max(-1, Math.min(1, float32Arr[j]));
              s = s < 0 ? s * 32768 : s * 32767;
              pcm[j] = s;
              sum += Math.abs(s);
            }
          }
          for (var k in calls) {
            calls[k](pcm, sum);
          }
          return;
        }
      };
      var scriptProcessor = "ScriptProcessor";
      var audioWorklet = "audioWorklet";
      var recAudioWorklet = RecTxt + " " + audioWorklet;
      var RecProc = "RecProc";
      var MediaRecorderTxt = "MediaRecorder";
      var MRWebMPCM = MediaRecorderTxt + ".WebM.PCM";
      var oldFn = ctx.createScriptProcessor || ctx.createJavaScriptNode;
      var oldIsBest = $T("ZGlf::。由于{1}内部1秒375次回调，在移动端可能会有性能问题导致回调丢失录音变短，PC端无影响，暂不建议开启{1}。", 0, audioWorklet);
      var oldScript = function() {
        isWorklet = stream.isWorklet = false;
        _Disconn_n(stream);
        CLog($T("7TU0::Connect采用老的{1}，", 0, scriptProcessor) + i18n.get(
          Recorder2[ConnectEnableWorklet] ? $T("JwCL::但已设置{1}尝试启用{2}", 2) : $T("VGjB::可设置{1}尝试启用{2}", 2),
          [RecTxt + "." + ConnectEnableWorklet + "=true", audioWorklet]
        ) + webMTips + oldIsBest, 3);
        var process = stream._p = oldFn.call(ctx, bufferSize, 1, 1);
        mediaConn(process);
        process.onaudioprocess = function(e2) {
          var arr = e2.inputBuffer.getChannelData(0);
          onReceive(arr, ctxSR);
        };
      };
      var connWorklet = function() {
        isWebM = stream.isWebM = false;
        _Disconn_r(stream);
        isWorklet = stream.isWorklet = !oldFn || Recorder2[ConnectEnableWorklet];
        var AwNode = window.AudioWorkletNode;
        if (!(isWorklet && ctx[audioWorklet] && AwNode)) {
          oldScript();
          return;
        }
        var clazzUrl = function() {
          var xf = function(f2) {
            return f2.toString().replace(/^function|DEL_/g, "").replace(/\$RA/g, recAudioWorklet);
          };
          var clazz = "class " + RecProc + " extends AudioWorkletProcessor{";
          clazz += "constructor " + xf(function(option) {
            DEL_super(option);
            var This = this, bufferSize2 = option.processorOptions.bufferSize;
            This.bufferSize = bufferSize2;
            This.buffer = new Float32Array(bufferSize2 * 2);
            This.pos = 0;
            This.port.onmessage = function(e2) {
              if (e2.data.kill) {
                This.kill = true;
                $C.log("$RA kill call");
              }
            };
            $C.log("$RA .ctor call", option);
          });
          clazz += "process " + xf(function(input, b, c) {
            var This = this, bufferSize2 = This.bufferSize;
            var buffer2 = This.buffer, pos = This.pos;
            input = (input[0] || [])[0] || [];
            if (input.length) {
              buffer2.set(input, pos);
              pos += input.length;
              var len = ~~(pos / bufferSize2) * bufferSize2;
              if (len) {
                this.port.postMessage({ val: buffer2.slice(0, len) });
                var more = buffer2.subarray(len, pos);
                buffer2 = new Float32Array(bufferSize2 * 2);
                buffer2.set(more);
                pos = more.length;
                This.buffer = buffer2;
              }
              This.pos = pos;
            }
            return !This.kill;
          });
          clazz += '}try{registerProcessor("' + RecProc + '", ' + RecProc + ')}catch(e){$C.error("' + recAudioWorklet + ' Reg Error",e)}';
          clazz = clazz.replace(/\$C\./g, "console.");
          return "data:text/javascript;base64," + btoa(unescape(encodeURIComponent(clazz)));
        };
        var awNext = function() {
          return isWorklet && stream._na;
        };
        var nodeAlive = stream._na = function() {
          if (badInt !== "") {
            clearTimeout(badInt);
            badInt = setTimeout(function() {
              badInt = 0;
              if (awNext()) {
                CLog($T("MxX1::{1}未返回任何音频，恢复使用{2}", 0, audioWorklet, scriptProcessor), 3);
                oldFn && oldScript();
              }
            }, 500);
          }
        };
        var createNode = function() {
          if (!awNext())
            return;
          var node = stream._n = new AwNode(ctx, RecProc, {
            processorOptions: { bufferSize }
          });
          mediaConn(node);
          node.port.onmessage = function(e2) {
            if (badInt) {
              clearTimeout(badInt);
              badInt = "";
            }
            if (awNext()) {
              onReceive(e2.data.val, ctxSR);
            } else if (!isWorklet) {
              CLog($T("XUap::{1}多余回调", 0, audioWorklet), 3);
            }
          };
          CLog($T("yOta::Connect采用{1}，设置{2}可恢复老式{3}", 0, audioWorklet, RecTxt + "." + ConnectEnableWorklet + "=false", scriptProcessor) + webMTips + oldIsBest, 3);
        };
        var ctxOK = function() {
          if (!awNext())
            return;
          if (ctx[RecProc]) {
            createNode();
            return;
          }
          var url = clazzUrl();
          ctx[audioWorklet].addModule(url).then(function(e2) {
            if (!awNext())
              return;
            ctx[RecProc] = 1;
            createNode();
            if (badInt) {
              nodeAlive();
            }
          })[CatchTxt](function(e2) {
            CLog(audioWorklet + ".addModule Error", 1, e2);
            awNext() && oldScript();
          });
        };
        ResumeCtx(ctx, function() {
          return awNext();
        }, ctxOK, ctxOK);
      };
      var connWebM = function() {
        var MR = window[MediaRecorderTxt];
        var onData = "ondataavailable";
        var webmType = "audio/webm; codecs=pcm";
        isWebM = stream.isWebM = Recorder2[ConnectEnableWebM];
        var supportMR = MR && onData in MR.prototype && MR.isTypeSupported(webmType);
        webMTips = supportMR ? "" : $T("VwPd::（此浏览器不支持{1}）", 0, MRWebMPCM);
        if (!isWebM || !supportMR) {
          connWorklet();
          return;
        }
        var mrNext = function() {
          return isWebM && stream._ra;
        };
        stream._ra = function() {
          if (badInt !== "") {
            clearTimeout(badInt);
            badInt = setTimeout(function() {
              if (mrNext()) {
                CLog($T("vHnb::{1}未返回任何音频，降级使用{2}", 0, MediaRecorderTxt, audioWorklet), 3);
                connWorklet();
              }
            }, 500);
          }
        };
        var mrSet = Object.assign({ mimeType: webmType }, Recorder2.ConnectWebMOptions);
        var mr = stream._r = new MR(stream, mrSet);
        var webmData = stream._rd = {};
        mr[onData] = function(e2) {
          var reader = new FileReader();
          reader.onloadend = function() {
            if (mrNext()) {
              var f32arr = WebM_Extract(new Uint8Array(reader.result), webmData);
              if (!f32arr)
                return;
              if (f32arr == -1) {
                connWorklet();
                return;
              }
              if (badInt) {
                clearTimeout(badInt);
                badInt = "";
              }
              onReceive(f32arr, webmData.webmSR);
            } else if (!isWebM) {
              CLog($T("O9P7::{1}多余回调", 0, MediaRecorderTxt), 3);
            }
          };
          reader.readAsArrayBuffer(e2.data);
        };
        try {
          mr.start(~~(bufferSize / 48));
          CLog($T("LMEm::Connect采用{1}，设置{2}可恢复使用{3}或老式{4}", 0, MRWebMPCM, RecTxt + "." + ConnectEnableWebM + "=false", audioWorklet, scriptProcessor));
        } catch (e2) {
          CLog("mr start err", 1, e2);
          connWorklet();
        }
      };
      connWebM();
    };
    var ConnAlive = function(stream) {
      if (stream._na)
        stream._na();
      if (stream._ra)
        stream._ra();
    };
    var _Disconn_n = function(stream) {
      stream._na = null;
      if (stream._n) {
        stream._n.port.postMessage({ kill: true });
        stream._n.disconnect();
        stream._n = null;
      }
    };
    var _Disconn_r = function(stream) {
      stream._ra = null;
      if (stream._r) {
        try {
          stream._r.stop();
        } catch (e2) {
          CLog("mr stop err", 1, e2);
        }
        stream._r = null;
      }
    };
    var Disconnect = function(streamStore) {
      streamStore = streamStore || Recorder2;
      var isGlobal = streamStore == Recorder2;
      var stream = streamStore.Stream;
      if (stream) {
        if (stream._m) {
          stream._m.disconnect();
          stream._m = null;
        }
        if (!stream._RC && stream._c) {
          Recorder2.CloseNewCtx(stream._c);
        }
        stream._RC = null;
        stream._c = null;
        if (stream._d) {
          StopS_(stream._d.stream);
          stream._d = null;
        }
        if (stream._p) {
          stream._p.disconnect();
          stream._p.onaudioprocess = stream._p = null;
        }
        _Disconn_n(stream);
        _Disconn_r(stream);
        if (isGlobal) {
          StopS_(stream);
        }
      }
      streamStore.Stream = 0;
    };
    var StopS_ = Recorder2.StopS_ = function(stream) {
      var tracks = Tracks_(stream);
      for (var i = 0; i < tracks.length; i++) {
        var track2 = tracks[i];
        track2.stop && track2.stop();
      }
      stream.stop && stream.stop();
    };
    var Tracks_ = function(stream) {
      var arr1 = 0, arr2 = 0, arr = [];
      if (stream.getAudioTracks) {
        arr1 = stream.getAudioTracks();
        arr2 = stream.getVideoTracks();
      }
      if (!arr1) {
        arr1 = stream.audioTracks;
        arr2 = stream.videoTracks;
      }
      for (var i = 0, L = arr1 ? arr1.length : 0; i < L; i++)
        arr.push(arr1[i]);
      for (var i = 0, L = arr2 ? arr2.length : 0; i < L; i++)
        arr.push(arr2[i]);
      return arr;
    };
    Recorder2.SampleData = function(pcmDatas, pcmSampleRate, newSampleRate, prevChunkInfo, option) {
      var Txt = "SampleData";
      prevChunkInfo || (prevChunkInfo = {});
      var index2 = prevChunkInfo.index || 0;
      var offset = prevChunkInfo.offset || 0;
      var raisePrev = prevChunkInfo.raisePrev || 0;
      var filter = prevChunkInfo.filter;
      if (filter && filter.fn && (filter.sr && filter.sr != pcmSampleRate || filter.srn && filter.srn != newSampleRate)) {
        filter = null;
        CLog($T("d48C::{1}的filter采样率变了，重设滤波", 0, Txt), 3);
      }
      if (!filter) {
        if (newSampleRate <= pcmSampleRate) {
          var freq = newSampleRate > pcmSampleRate * 3 / 4 ? 0 : newSampleRate / 2 * 3 / 4;
          filter = { fn: freq ? Recorder2.IIRFilter(true, pcmSampleRate, freq) : 0 };
        } else {
          var freq = pcmSampleRate > newSampleRate * 3 / 4 ? 0 : pcmSampleRate / 2 * 3 / 4;
          filter = { fn: freq ? Recorder2.IIRFilter(true, newSampleRate, freq) : 0 };
        }
      }
      filter.sr = pcmSampleRate;
      filter.srn = newSampleRate;
      var filterFn = filter.fn;
      var frameNext = prevChunkInfo.frameNext || [];
      option || (option = {});
      var frameSize = option.frameSize || 1;
      if (option.frameType) {
        frameSize = option.frameType == "mp3" ? 1152 : 1;
      }
      var useSum = option._sum, _sum = 0;
      var nLen = pcmDatas.length;
      if (index2 > nLen + 1) {
        CLog($T("tlbC::{1}似乎传入了未重置chunk {2}", 0, Txt, index2 + ">" + nLen), 3);
      }
      var size2 = 0;
      for (var i = index2; i < nLen; i++) {
        size2 += pcmDatas[i].length;
      }
      var step = pcmSampleRate / newSampleRate;
      if (step > 1) {
        size2 = Math.max(0, size2 - Math.floor(offset));
        size2 = Math.floor(size2 / step);
      } else if (step < 1) {
        var raiseStep = 1 / step;
        size2 = Math.floor(size2 * raiseStep);
      }
      size2 += frameNext.length;
      var res = new Int16Array(size2);
      var idx = 0;
      for (var i = 0; i < frameNext.length; i++) {
        res[idx] = frameNext[i];
        idx++;
      }
      for (; index2 < nLen; index2++) {
        var o2 = pcmDatas[index2], isF32 = o2 instanceof Float32Array;
        var i = offset, il = o2.length;
        var F = filterFn && filterFn.Embed, F1 = 0, F2 = 0, Fx = 0, Fy = 0;
        if (step < 1) {
          var idx1 = idx + i, prev = raisePrev;
          for (var i0 = 0; i0 < il; i0++) {
            var oVal = o2[i0];
            if (isF32) {
              oVal = Math.max(-1, Math.min(1, oVal));
              oVal = oVal < 0 ? oVal * 32768 : oVal * 32767;
            }
            var pos = Math.floor(idx1);
            idx1 += raiseStep;
            var end = Math.floor(idx1);
            var n2 = (oVal - prev) / (end - pos);
            for (var j = 1; pos < end; pos++, j++) {
              var s = Math.floor(prev + j * n2);
              if (F) {
                Fx = s;
                Fy = F.b0 * Fx + F.b1 * F.x1 + F.b0 * F.x2 - F.a1 * F.y1 - F.a2 * F.y2;
                F.x2 = F.x1;
                F.x1 = Fx;
                F.y2 = F.y1;
                F.y1 = Fy;
                s = Fy;
              } else {
                s = filterFn ? filterFn(s) : s;
              }
              if (s > 32767)
                s = 32767;
              else if (s < -32768)
                s = -32768;
              if (useSum)
                _sum += Math.abs(s);
              res[pos] = s;
              idx++;
            }
            prev = raisePrev = oVal;
            i += raiseStep;
          }
          offset = i % 1;
          continue;
        }
        for (var i0 = 0, i2 = 0; i0 < il; i0++, i2++) {
          if (i2 < il) {
            var oVal = o2[i2];
            if (isF32) {
              oVal = Math.max(-1, Math.min(1, oVal));
              oVal = oVal < 0 ? oVal * 32768 : oVal * 32767;
            }
            if (F) {
              Fx = oVal;
              Fy = F.b0 * Fx + F.b1 * F.x1 + F.b0 * F.x2 - F.a1 * F.y1 - F.a2 * F.y2;
              F.x2 = F.x1;
              F.x1 = Fx;
              F.y2 = F.y1;
              F.y1 = Fy;
            } else {
              Fy = filterFn ? filterFn(oVal) : oVal;
            }
          }
          F1 = F2;
          F2 = Fy;
          if (i2 == 0) {
            i0--;
            continue;
          }
          var before = Math.floor(i);
          if (i0 != before)
            continue;
          var after = Math.ceil(i);
          var atPoint = i - before;
          var beforeVal = F1;
          var afterVal = after < il ? F2 : beforeVal;
          var val = beforeVal + (afterVal - beforeVal) * atPoint;
          if (val > 32767)
            val = 32767;
          else if (val < -32768)
            val = -32768;
          if (useSum)
            _sum += Math.abs(val);
          res[idx] = val;
          idx++;
          i += step;
        }
        offset = Math.max(0, i - il);
      }
      if (step < 1 && idx + 1 == size2) {
        size2--;
        res = new Int16Array(res.buffer.slice(0, size2 * 2));
      }
      if (idx - 1 != size2 && idx != size2)
        CLog(Txt + " idx:" + idx + " != size:" + size2, 3);
      frameNext = null;
      var frameNextSize = size2 % frameSize;
      if (frameNextSize > 0) {
        var u8Pos = (size2 - frameNextSize) * 2;
        frameNext = new Int16Array(res.buffer.slice(u8Pos));
        res = new Int16Array(res.buffer.slice(0, u8Pos));
      }
      var obj = {
        index: index2,
        offset,
        raisePrev,
        filter,
        frameNext,
        sampleRate: newSampleRate,
        data: res
      };
      if (useSum)
        obj._sum = _sum;
      return obj;
    };
    Recorder2.IIRFilter = function(useLowPass, sampleRate, freq) {
      var ov = 2 * Math.PI * freq / sampleRate;
      var sn = Math.sin(ov);
      var cs = Math.cos(ov);
      var alpha = sn / 2;
      var a0 = 1 + alpha;
      var a1 = -2 * cs / a0;
      var a2 = (1 - alpha) / a0;
      if (useLowPass) {
        var b0 = (1 - cs) / 2 / a0;
        var b1 = (1 - cs) / a0;
      } else {
        var b0 = (1 + cs) / 2 / a0;
        var b1 = -(1 + cs) / a0;
      }
      var x1 = 0, x2 = 0, y = 0, y1 = 0, y2 = 0;
      var fn = function(x) {
        y = b0 * x + b1 * x1 + b0 * x2 - a1 * y1 - a2 * y2;
        x2 = x1;
        x1 = x;
        y2 = y1;
        y1 = y;
        return y;
      };
      fn.Embed = { x1: 0, x2: 0, y1: 0, y2: 0, b0, b1, a1, a2 };
      return fn;
    };
    Recorder2.PowerLevel = function(pcmAbsSum, pcmLength) {
      var power = pcmAbsSum / pcmLength || 0;
      var level;
      if (power < 1251) {
        level = Math.round(power / 1250 * 10);
      } else {
        level = Math.round(Math.min(100, Math.max(0, (1 + Math.log(power / 1e4) / Math.log(10)) * 100)));
      }
      return level;
    };
    Recorder2.PowerDBFS = function(maxSample) {
      var val = Math.max(0.1, maxSample || 0), Pref = 32767;
      val = Math.min(val, Pref);
      val = 20 * Math.log(val / Pref) / Math.log(10);
      return Math.max(-100, Math.round(val));
    };
    Recorder2.CLog = function(msg, err) {
      if (typeof console != "object")
        return;
      var now = /* @__PURE__ */ new Date();
      var t2 = ("0" + now.getMinutes()).substr(-2) + ":" + ("0" + now.getSeconds()).substr(-2) + "." + ("00" + now.getMilliseconds()).substr(-3);
      var recID = this && this.envIn && this.envCheck && this.id;
      var arr = ["[" + t2 + " " + RecTxt + (recID ? ":" + recID : "") + "]" + msg];
      var a = arguments, cwe = Recorder2.CLog;
      var i = 2, fn = cwe.log || console.log;
      if (IsNum(err)) {
        fn = err == 1 ? cwe.error || console.error : err == 3 ? cwe.warn || console.warn : fn;
      } else {
        i = 1;
      }
      for (; i < a.length; i++) {
        arr.push(a[i]);
      }
      if (IsLoser) {
        fn && fn("[IsLoser]" + arr[0], arr.length > 1 ? arr : "");
      } else {
        fn.apply(console, arr);
      }
    };
    var CLog = function() {
      Recorder2.CLog.apply(this, arguments);
    };
    var IsLoser = true;
    try {
      IsLoser = !console.log.apply;
    } catch (e2) {
    }
    var ID = 0;
    function initFn(set2) {
      var This = this;
      This.id = ++ID;
      Traffic();
      var o2 = {
        type: "mp3",
        onProcess: NOOP2
        //fn(buffers,powerLevel,bufferDuration,bufferSampleRate,newBufferIdx,asyncEnd) buffers=[[Int16,...],...]：缓冲的PCM数据，为从开始录音到现在的所有pcm片段；powerLevel：当前缓冲的音量级别0-100，bufferDuration：已缓冲时长，bufferSampleRate：缓冲使用的采样率（当type支持边录边转码(Worker)时，此采样率和设置的采样率相同，否则不一定相同）；newBufferIdx:本次回调新增的buffer起始索引；asyncEnd:fn() 如果onProcess是异步的(返回值为true时)，处理完成时需要调用此回调，如果不是异步的请忽略此参数，此方法回调时必须是真异步（不能真异步时需用setTimeout包裹）。onProcess返回值：如果返回true代表开启异步模式，在某些大量运算的场合异步是必须的，必须在异步处理完成时调用asyncEnd(不能真异步时需用setTimeout包裹)，在onProcess执行后新增的buffer会全部替换成空数组，因此本回调开头应立即将newBufferIdx到本次回调结尾位置的buffer全部保存到另外一个数组内，处理完成后写回buffers中本次回调的结尾位置。
        //*******高级设置******
        //,sourceStream:MediaStream Object
        //可选直接提供一个媒体流，从这个流中录制、实时处理音频数据（当前Recorder实例独享此流）；不提供时为普通的麦克风录音，由getUserMedia提供音频流（所有Recorder实例共享同一个流）
        //比如：audio、video标签dom节点的captureStream方法（实验特性，不同浏览器支持程度不高）返回的流；WebRTC中的remote流；自己创建的流等
        //注意：流内必须至少存在一条音轨(Audio Track)，比如audio标签必须等待到可以开始播放后才会有音轨，否则open会失败
        //,runningContext:AudioContext
        //可选提供一个state为running状态的AudioContext对象(ctx)；默认会在rec.open时自动创建一个新的ctx，无用户操作（触摸、点击等）时调用rec.open的ctx.state可能为suspended，会在rec.start时尝试进行ctx.resume，如果也无用户操作ctx.resume可能不会恢复成running状态（目前仅iOS上有此兼容性问题），导致无法去读取媒体流，这时请提前在用户操作时调用Recorder.GetContext(true)来得到一个running状态AudioContext（用完需调用CloseNewCtx(ctx)关闭）
        //,audioTrackSet:{ deviceId:"",groupId:"", autoGainControl:true, echoCancellation:true, noiseSuppression:true }
        //普通麦克风录音时getUserMedia方法的audio配置参数，比如指定设备id，回声消除、降噪开关；注意：提供的任何配置值都不一定会生效
        //由于麦克风是全局共享的，所以新配置后需要close掉以前的再重新open
        //同样可配置videoTrackSet，更多参考: https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
        //,disableEnvInFix:false 内部参数，禁用设备卡顿时音频输入丢失补偿功能
        //,takeoffEncodeChunk:NOOP //fn(chunkBytes) chunkBytes=[Uint8,...]：实时编码环境下接管编码器输出，当编码器实时编码出一块有效的二进制音频数据时实时回调此方法；参数为二进制的Uint8Array，就是编码出来的音频数据片段，所有的chunkBytes拼接在一起即为完整音频。本实现的想法最初由QQ2543775048提出
        //当提供此回调方法时，将接管编码器的数据输出，编码器内部将放弃存储生成的音频数据；如果当前编码器或环境不支持实时编码处理，将在open时直接走fail逻辑
        //因此提供此回调后调用stop方法将无法获得有效的音频数据，因为编码器内没有音频数据，因此stop时返回的blob将是一个字节长度为0的blob
        //大部分录音格式编码器都支持实时编码（边录边转码），比如mp3格式：会实时的将编码出来的mp3片段通过此方法回调，所有的chunkBytes拼接到一起即为完整的mp3，此种拼接的结果比mock方法实时生成的音质更加，因为天然避免了首尾的静默
        //不支持实时编码的录音格式不可以提供此回调（wav格式不支持，因为wav文件头中需要提供文件最终长度），提供了将在open时直接走fail逻辑
      };
      for (var k in set2) {
        o2[k] = set2[k];
      }
      This.set = o2;
      var vB = o2[bitRateTxt], vS = o2[sampleRateTxt];
      if (vB && !IsNum(vB) || vS && !IsNum(vS)) {
        This.CLog($T.G("IllegalArgs-1", [$T("VtS4::{1}和{2}必须是数值", 0, sampleRateTxt, bitRateTxt)]), 1, set2);
      }
      o2[bitRateTxt] = +vB || 16;
      o2[sampleRateTxt] = +vS || 16e3;
      This.state = 0;
      This._S = 9;
      This.Sync = { O: 9, C: 9 };
    }
    Recorder2.Sync = {
      /*open*/
      O: 9,
      /*close*/
      C: 9
    };
    Recorder2.prototype = initFn.prototype = {
      CLog,
      _streamStore: function() {
        if (this.set.sourceStream) {
          return this;
        } else {
          return Recorder2;
        }
      },
      _streamGet: function() {
        return this._streamStore().Stream;
      },
      _streamCtx: function() {
        var m = this._streamGet();
        return m && m._c;
      },
      open: function(True, False) {
        var This = this, set2 = This.set, streamStore = This._streamStore(), newCtx = 0;
        True = True || NOOP2;
        var failCall = function(errMsg, isUserNotAllow) {
          isUserNotAllow = !!isUserNotAllow;
          This.CLog($T("5tWi::录音open失败：") + errMsg + ",isUserNotAllow:" + isUserNotAllow, 1);
          if (newCtx)
            Recorder2.CloseNewCtx(newCtx);
          False && False(errMsg, isUserNotAllow);
        };
        This._streamTag = getUserMediaTxt;
        var ok = function() {
          This.CLog("open ok, id:" + This.id + " stream:" + This._streamTag);
          True();
          This._SO = 0;
        };
        var Lock = streamStore.Sync;
        var lockOpen = ++Lock.O, lockClose = Lock.C;
        This._O = This._O_ = lockOpen;
        This._SO = This._S;
        var lockFail = function() {
          if (lockClose != Lock.C || !This._O) {
            var err = $T("dFm8::open被取消");
            if (lockOpen == Lock.O) {
              This.close();
            } else {
              err = $T("VtJO::open被中断");
            }
            failCall(err);
            return true;
          }
        };
        if (!isBrowser) {
          failCall($T.G("NonBrowser-1", ["open"]) + $T("EMJq::，可尝试使用RecordApp解决方案") + "(" + GitUrl + "/tree/master/app-support-sample)");
          return;
        }
        var checkMsg = This.envCheck({ envName: "H5", canProcess: true });
        if (checkMsg) {
          failCall($T("A5bm::不能录音：") + checkMsg);
          return;
        }
        var ctx;
        var getCtx = function() {
          ctx = set2.runningContext;
          if (!ctx)
            ctx = newCtx = Recorder2.GetContext(true);
        };
        if (set2.sourceStream) {
          This._streamTag = "set.sourceStream";
          if (!Recorder2.GetContext()) {
            failCall($T("1iU7::不支持此浏览器从流中获取录音"));
            return;
          }
          getCtx();
          Disconnect(streamStore);
          var stream = This.Stream = set2.sourceStream;
          stream._c = ctx;
          stream._RC = set2.runningContext;
          stream._call = {};
          try {
            Connect(streamStore);
          } catch (e2) {
            Disconnect(streamStore);
            failCall($T("BTW2::从流中打开录音失败：") + e2.message);
            return;
          }
          ok();
          return;
        }
        var codeFail = function(code, msg) {
          try {
            window.top.a;
          } catch (e2) {
            failCall($T("Nclz::无权录音(跨域，请尝试给iframe添加麦克风访问策略，如{1})", 0, 'allow="camera;microphone"'));
            return;
          }
          if (codeErr1(1, code)) {
            if (/Found/i.test(code)) {
              failCall(msg + $T("jBa9::，无可用麦克风"));
            } else {
              failCall(msg);
            }
          }
        };
        var codeErr1 = function(call, code) {
          if (/Permission|Allow/i.test(code)) {
            if (call)
              failCall($T("gyO5::用户拒绝了录音权限"), true);
          } else if (window.isSecureContext === false) {
            if (call)
              failCall($T("oWNo::浏览器禁止不安全页面录音，可开启https解决"));
          } else {
            return 1;
          }
        };
        if (Recorder2.IsOpen()) {
          ok();
          return;
        }
        if (!Recorder2.Support()) {
          codeFail("", $T("COxc::此浏览器不支持录音"));
          return;
        }
        getCtx();
        var f1 = function(stream2) {
          setTimeout(function() {
            stream2._call = {};
            var oldStream = Recorder2.Stream;
            if (oldStream) {
              Disconnect();
              stream2._call = oldStream._call;
            }
            Recorder2.Stream = stream2;
            stream2._c = ctx;
            stream2._RC = set2.runningContext;
            if (lockFail())
              return;
            if (Recorder2.IsOpen()) {
              if (oldStream)
                This.CLog($T("upb8::发现同时多次调用open"), 1);
              Connect(streamStore);
              ok();
            } else {
              failCall($T("Q1GA::录音功能无效：无音频流"));
            }
          }, 100);
        };
        var f2 = function(e2) {
          var code = e2.name || e2.message || e2.code + ":" + e2;
          var tryMsg = "";
          if (callUmCount == 1 && codeErr1(0, code)) {
            tryMsg = $T("KxE2::，将尝试禁用回声消除后重试");
          }
          var msg1 = $T("xEQR::请求录音权限错误"), msg2 = $T("bDOG::无法录音：");
          This.CLog(msg1 + tryMsg + "|" + e2, tryMsg || f2_e ? 3 : 1, e2);
          if (tryMsg) {
            f2_c = code;
            f2_e = e2;
            callUserMedia(1);
          } else if (f2_e) {
            This.CLog(msg1 + "|" + f2_e, 1, f2_e);
            codeFail(f2_c, msg2 + f2_e);
          } else {
            codeFail(code, msg2 + e2);
          }
        };
        var callUmCount = 0, f2_c, f2_e;
        var callUserMedia = function(retry) {
          callUmCount++;
          var atsTxt = "audioTrackSet";
          var t_AGC = "autoGainControl", t_AEC = "echoCancellation", t_ANS = "noiseSuppression";
          var atsTxtJs = atsTxt + ":{" + t_AEC + "," + t_ANS + "," + t_AGC + "}";
          var trackSet = JSON.parse(ToJson(set2[atsTxt] || true));
          This.CLog("open... " + callUmCount + " " + atsTxt + ":" + ToJson(trackSet));
          if (retry) {
            if (typeof trackSet != "object")
              trackSet = {};
            trackSet[t_AGC] = false;
            trackSet[t_AEC] = false;
            trackSet[t_ANS] = false;
          }
          if (trackSet[sampleRateTxt]) {
            This.CLog($T("IjL3::注意：已配置{1}参数，可能会出现浏览器不能正确选用麦克风、移动端无法启用回声消除等现象", 0, atsTxt + "." + sampleRateTxt), 3);
          }
          var mSet = { audio: trackSet, video: set2.videoTrackSet || false };
          try {
            var pro = Recorder2.Scope[getUserMediaTxt](mSet, f1, f2);
          } catch (e2) {
            This.CLog(getUserMediaTxt, 3, e2);
            mSet = { audio: true, video: false };
            pro = Recorder2.Scope[getUserMediaTxt](mSet, f1, f2);
          }
          This.CLog(getUserMediaTxt + "(" + ToJson(mSet) + ") " + CtxState(ctx) + $T("RiWe::，未配置 {1} 时浏览器可能会自动启用回声消除，移动端未禁用回声消除时可能会降低系统播放音量（关闭录音后可恢复）和仅提供16k采样率的音频流（不需要回声消除时可明确配置成禁用来获得48k高音质的流），请参阅文档中{2}配置", 0, atsTxtJs, atsTxt) + "(" + GitUrl + ") LM:" + LM + " UA:" + navigator.userAgent);
          if (pro && pro.then) {
            pro.then(f1)[CatchTxt](f2);
          }
        };
        callUserMedia();
      },
      close: function(call) {
        call = call || NOOP2;
        var This = this, streamStore = This._streamStore();
        This._stop();
        var sTag = " stream:" + This._streamTag;
        var Lock = streamStore.Sync;
        This._O = 0;
        if (This._O_ != Lock.O) {
          This.CLog($T("hWVz::close被忽略（因为同时open了多个rec，只有最后一个会真正close）") + sTag, 3);
          call();
          return;
        }
        Lock.C++;
        Disconnect(streamStore);
        This.CLog("close," + sTag);
        call();
      },
      mock: function(pcmData, pcmSampleRate) {
        var This = this;
        This._stop();
        This.isMock = 1;
        This.mockEnvInfo = null;
        This.buffers = [pcmData];
        This.recSize = pcmData.length;
        This._setSrcSR(pcmSampleRate);
        This._streamTag = "mock";
        return This;
      },
      _setSrcSR: function(sampleRate) {
        var This = this, set2 = This.set;
        var setSr = set2[sampleRateTxt];
        if (setSr > sampleRate) {
          set2[sampleRateTxt] = sampleRate;
        } else {
          setSr = 0;
        }
        This[srcSampleRateTxt] = sampleRate;
        This.CLog(srcSampleRateTxt + ": " + sampleRate + " set." + sampleRateTxt + ": " + set2[sampleRateTxt] + (setSr ? " " + $T("UHvm::忽略") + ": " + setSr : ""), setSr ? 3 : 0);
      },
      envCheck: function(envInfo) {
        var errMsg, This = this, set2 = This.set;
        var tag = "CPU_BE";
        if (!errMsg && !Recorder2[tag] && typeof Int8Array == "function" && !new Int8Array(new Int32Array([1]).buffer)[0]) {
          Traffic(tag);
          errMsg = $T("Essp::不支持{1}架构", 0, tag);
        }
        if (!errMsg) {
          var type = set2.type, hasFn = This[type + "_envCheck"];
          if (set2.takeoffEncodeChunk) {
            if (!hasFn) {
              errMsg = $T("2XBl::{1}类型不支持设置takeoffEncodeChunk", 0, type) + (This[type] ? "" : $T("LG7e::(未加载编码器)"));
            } else if (!envInfo.canProcess) {
              errMsg = $T("7uMV::{1}环境不支持实时处理", 0, envInfo.envName);
            }
          }
          if (!errMsg && hasFn) {
            errMsg = This[type + "_envCheck"](envInfo, set2);
          }
        }
        return errMsg || "";
      },
      envStart: function(mockEnvInfo, sampleRate) {
        var This = this, set2 = This.set;
        This.isMock = mockEnvInfo ? 1 : 0;
        This.mockEnvInfo = mockEnvInfo;
        This.buffers = [];
        This.recSize = 0;
        if (mockEnvInfo) {
          This._streamTag = "env$" + mockEnvInfo.envName;
        }
        This.state = 1;
        This.envInLast = 0;
        This.envInFirst = 0;
        This.envInFix = 0;
        This.envInFixTs = [];
        This._setSrcSR(sampleRate);
        This.engineCtx = 0;
        if (This[set2.type + "_start"]) {
          var engineCtx = This.engineCtx = This[set2.type + "_start"](set2);
          if (engineCtx) {
            engineCtx.pcmDatas = [];
            engineCtx.pcmSize = 0;
          }
        }
      },
      envResume: function() {
        this.envInFixTs = [];
      },
      envIn: function(pcm, sum) {
        var This = this, set2 = This.set, engineCtx = This.engineCtx;
        if (This.state != 1) {
          if (!This.state)
            This.CLog("envIn at state=0", 3);
          return;
        }
        var bufferSampleRate = This[srcSampleRateTxt];
        var size2 = pcm.length;
        var powerLevel = Recorder2.PowerLevel(sum, size2);
        var buffers = This.buffers;
        var bufferFirstIdx = buffers.length;
        buffers.push(pcm);
        var buffersThis = buffers;
        var bufferFirstIdxThis = bufferFirstIdx;
        var now = Date.now();
        var pcmTime = Math.round(size2 / bufferSampleRate * 1e3);
        This.envInLast = now;
        if (This.buffers.length == 1) {
          This.envInFirst = now - pcmTime;
        }
        var envInFixTs = This.envInFixTs;
        envInFixTs.splice(0, 0, { t: now, d: pcmTime });
        var tsInStart = now, tsPcm = 0;
        for (var i = 0; i < envInFixTs.length; i++) {
          var o2 = envInFixTs[i];
          if (now - o2.t > 3e3) {
            envInFixTs.length = i;
            break;
          }
          tsInStart = o2.t;
          tsPcm += o2.d;
        }
        var tsInPrev = envInFixTs[1];
        var tsIn = now - tsInStart;
        var lost = tsIn - tsPcm;
        if (lost > tsIn / 3 && (tsInPrev && tsIn > 1e3 || envInFixTs.length >= 6)) {
          var addTime = now - tsInPrev.t - pcmTime;
          if (addTime > pcmTime / 5) {
            var fixOpen = !set2.disableEnvInFix;
            This.CLog("[" + now + "]" + i18n.get(fixOpen ? $T("4Kfd::补偿{1}ms", 1) : $T("bM5i::未补偿{1}ms", 1), [addTime]), 3);
            This.envInFix += addTime;
            if (fixOpen) {
              var addPcm = new Int16Array(addTime * bufferSampleRate / 1e3);
              size2 += addPcm.length;
              buffers.push(addPcm);
            }
          }
        }
        var sizeOld = This.recSize, addSize = size2;
        var bufferSize = sizeOld + addSize;
        This.recSize = bufferSize;
        if (engineCtx) {
          var chunkInfo = Recorder2.SampleData(buffers, bufferSampleRate, set2[sampleRateTxt], engineCtx.chunkInfo);
          engineCtx.chunkInfo = chunkInfo;
          sizeOld = engineCtx.pcmSize;
          addSize = chunkInfo.data.length;
          bufferSize = sizeOld + addSize;
          engineCtx.pcmSize = bufferSize;
          buffers = engineCtx.pcmDatas;
          bufferFirstIdx = buffers.length;
          buffers.push(chunkInfo.data);
          bufferSampleRate = chunkInfo[sampleRateTxt];
        }
        var duration = Math.round(bufferSize / bufferSampleRate * 1e3);
        var bufferNextIdx = buffers.length;
        var bufferNextIdxThis = buffersThis.length;
        var asyncEnd = function() {
          var num = asyncBegin ? 0 : -addSize;
          var hasClear2 = buffers[0] == null;
          for (var i2 = bufferFirstIdx; i2 < bufferNextIdx; i2++) {
            var buffer2 = buffers[i2];
            if (buffer2 == null) {
              hasClear2 = 1;
            } else {
              num += buffer2.length;
              if (engineCtx && buffer2.length) {
                This[set2.type + "_encode"](engineCtx, buffer2);
              }
            }
          }
          if (hasClear2 && engineCtx) {
            var i2 = bufferFirstIdxThis;
            if (buffersThis[0]) {
              i2 = 0;
            }
            for (; i2 < bufferNextIdxThis; i2++) {
              buffersThis[i2] = null;
            }
          }
          if (hasClear2) {
            num = asyncBegin ? addSize : 0;
            buffers[0] = null;
          }
          if (engineCtx) {
            engineCtx.pcmSize += num;
          } else {
            This.recSize += num;
          }
        };
        var asyncBegin = 0, procTxt = "rec.set.onProcess";
        try {
          asyncBegin = set2.onProcess(buffers, powerLevel, duration, bufferSampleRate, bufferFirstIdx, asyncEnd);
          asyncBegin = asyncBegin === true;
        } catch (e2) {
          index.__f__("error", "at node_modules/recorder-core/src/recorder-core.js:1396", procTxt + $T("gFUF::回调出错是不允许的，需保证不会抛异常"), e2);
        }
        var slowT = Date.now() - now;
        if (slowT > 10 && This.envInFirst - now > 1e3) {
          This.CLog(procTxt + $T("2ghS::低性能，耗时{1}ms", 0, slowT), 3);
        }
        if (asyncBegin) {
          var hasClear = 0;
          for (var i = bufferFirstIdx; i < bufferNextIdx; i++) {
            if (buffers[i] == null) {
              hasClear = 1;
            } else {
              buffers[i] = new Int16Array(0);
            }
          }
          if (hasClear) {
            This.CLog($T("ufqH::未进入异步前不能清除buffers"), 3);
          } else {
            if (engineCtx) {
              engineCtx.pcmSize -= addSize;
            } else {
              This.recSize -= addSize;
            }
          }
        } else {
          asyncEnd();
        }
      },
      start: function() {
        var This = this;
        var isOpen = 1;
        if (This.set.sourceStream) {
          if (!This.Stream) {
            isOpen = 0;
          }
        } else if (!Recorder2.IsOpen()) {
          isOpen = 0;
        }
        if (!isOpen) {
          This.CLog($T("6WmN::start失败：未open"), 1);
          return;
        }
        var ctx = This._streamCtx();
        This.CLog($T("kLDN::start 开始录音，") + CtxState(ctx) + " stream:" + This._streamTag);
        This._stop();
        This.envStart(null, ctx[sampleRateTxt]);
        This.state = 3;
        if (This._SO && This._SO + 1 != This._S) {
          This.CLog($T("Bp2y::start被中断"), 3);
          return;
        }
        This._SO = 0;
        var end = function() {
          if (This.state == 3) {
            This.state = 1;
            This.resume();
          }
        };
        var tag = "AudioContext resume: ";
        var stream = This._streamGet();
        stream._call[This.id] = function() {
          This.CLog(tag + ctx.state + "|stream ok");
          end();
        };
        ResumeCtx(ctx, function(runC) {
          runC && This.CLog(tag + "wait...");
          return This.state == 3;
        }, function(runC) {
          runC && This.CLog(tag + ctx.state);
          end();
        }, function(err) {
          This.CLog(tag + ctx.state + $T("upkE::，可能无法录音：") + err, 1);
          end();
        });
      },
      pause: function() {
        var This = this, stream = This._streamGet();
        if (This.state) {
          This.state = 2;
          This.CLog("pause");
          if (stream)
            delete stream._call[This.id];
        }
      },
      resume: function() {
        var This = this, stream = This._streamGet();
        var tag = "resume", tag3 = tag + "(wait ctx)";
        if (This.state == 3) {
          This.CLog(tag3);
        } else if (This.state) {
          This.state = 1;
          This.CLog(tag);
          This.envResume();
          if (stream) {
            stream._call[This.id] = function(pcm, sum) {
              if (This.state == 1) {
                This.envIn(pcm, sum);
              }
            };
            ConnAlive(stream);
          }
          var ctx = This._streamCtx();
          if (ctx) {
            ResumeCtx(ctx, function(runC) {
              runC && This.CLog(tag3 + "...");
              return This.state == 1;
            }, function(runC) {
              runC && This.CLog(tag3 + ctx.state);
              ConnAlive(stream);
            }, function(err) {
              This.CLog(tag3 + ctx.state + "[err]" + err, 1);
            });
          }
        }
      },
      _stop: function(keepEngine) {
        var This = this, set2 = This.set;
        if (!This.isMock) {
          This._S++;
        }
        if (This.state) {
          This.pause();
          This.state = 0;
        }
        if (!keepEngine && This[set2.type + "_stop"]) {
          This[set2.type + "_stop"](This.engineCtx);
          This.engineCtx = 0;
        }
      },
      stop: function(True, False, autoClose) {
        var This = this, set2 = This.set, t1;
        var envInMS = This.envInLast - This.envInFirst, envInLen = envInMS && This.buffers.length;
        This.CLog($T("Xq4s::stop 和start时差:") + (envInMS ? envInMS + "ms " + $T("3CQP::补偿:") + This.envInFix + "ms envIn:" + envInLen + " fps:" + (envInLen / envInMS * 1e3).toFixed(1) : "-") + " stream:" + This._streamTag + " (" + GitUrl + ") LM:" + LM);
        var end = function() {
          This._stop();
          if (autoClose) {
            This.close();
          }
        };
        var err = function(msg) {
          This.CLog($T("u8JG::结束录音失败：") + msg, 1);
          False && False(msg);
          end();
        };
        var ok = function(blob, mime, duration2) {
          var tBlob = "blob", tABuf = "arraybuffer", tDT = "dataType", tDDT = "DefaultDataType";
          var dType = This[tDT] || Recorder2[tDDT] || tBlob, dTag = tDT + "=" + dType;
          var isAB = blob instanceof ArrayBuffer, dErr = 0;
          var dLen = isAB ? blob.byteLength : blob.size;
          if (dType == tABuf) {
            if (!isAB)
              dErr = 1;
          } else if (dType == tBlob) {
            if (typeof Blob != "function") {
              dErr = $T.G("NonBrowser-1", [dTag]) + $T("1skY::，请设置{1}", 0, RecTxt + "." + tDDT + '="' + tABuf + '"');
            } else {
              if (isAB)
                blob = new Blob([blob], { type: mime });
              if (!(blob instanceof Blob))
                dErr = 1;
              mime = blob.type || mime;
            }
          } else {
            dErr = $T.G("NotSupport-1", [dTag]);
          }
          This.CLog($T("Wv7l::结束录音 编码花{1}ms 音频时长{2}ms 文件大小{3}b", 0, Date.now() - t1, duration2, dLen) + " " + dTag + "," + mime);
          if (dErr) {
            err(dErr != 1 ? dErr : $T("Vkbd::{1}编码器返回的不是{2}", 0, set2.type, dType) + ", " + dTag);
            return;
          }
          if (set2.takeoffEncodeChunk) {
            This.CLog($T("QWnr::启用takeoffEncodeChunk后stop返回的blob长度为0不提供音频数据"), 3);
          } else if (dLen < Math.max(50, duration2 / 5)) {
            err($T("Sz2H::生成的{1}无效", 0, set2.type));
            return;
          }
          True && True(blob, duration2, mime);
          end();
        };
        if (!This.isMock) {
          var isCtxWait = This.state == 3;
          if (!This.state || isCtxWait) {
            err($T("wf9t::未开始录音") + (isCtxWait ? $T("Dl2c::，开始录音前无用户交互导致AudioContext未运行") : ""));
            return;
          }
        }
        This._stop(true);
        var size2 = This.recSize;
        if (!size2) {
          err($T("Ltz3::未采集到录音"));
          return;
        }
        if (!This[set2.type]) {
          err($T("xGuI::未加载{1}编码器，请尝试到{2}的src/engine内找到{1}的编码器并加载", 0, set2.type, RecTxt));
          return;
        }
        if (This.isMock) {
          var checkMsg = This.envCheck(This.mockEnvInfo || { envName: "mock", canProcess: false });
          if (checkMsg) {
            err($T("AxOH::录音错误：") + checkMsg);
            return;
          }
        }
        var engineCtx = This.engineCtx;
        if (This[set2.type + "_complete"] && engineCtx) {
          var duration = Math.round(engineCtx.pcmSize / set2[sampleRateTxt] * 1e3);
          t1 = Date.now();
          This[set2.type + "_complete"](engineCtx, function(blob, mime) {
            ok(blob, mime, duration);
          }, err);
          return;
        }
        t1 = Date.now();
        if (!This.buffers[0]) {
          err($T("xkKd::音频buffers被释放"));
          return;
        }
        var chunk = Recorder2.SampleData(This.buffers, This[srcSampleRateTxt], set2[sampleRateTxt]);
        set2[sampleRateTxt] = chunk[sampleRateTxt];
        var res = chunk.data;
        var duration = Math.round(res.length / set2[sampleRateTxt] * 1e3);
        This.CLog($T("CxeT::采样:{1} 花:{2}ms", 0, size2 + "->" + res.length, Date.now() - t1));
        setTimeout(function() {
          t1 = Date.now();
          This[set2.type](res, function(blob, mime) {
            ok(blob, mime, duration);
          }, function(msg) {
            err(msg);
          });
        });
      }
    };
    var WebM_Extract = function(inBytes, scope) {
      if (!scope.pos) {
        scope.pos = [0];
        scope.tracks = {};
        scope.bytes = [];
      }
      var tracks = scope.tracks, position = [scope.pos[0]];
      var endPos = function() {
        scope.pos[0] = position[0];
      };
      var sBL = scope.bytes.length;
      var bytes = new Uint8Array(sBL + inBytes.length);
      bytes.set(scope.bytes);
      bytes.set(inBytes, sBL);
      scope.bytes = bytes;
      if (!scope._ht) {
        readMatroskaVInt(bytes, position);
        readMatroskaBlock(bytes, position);
        if (!BytesEq(readMatroskaVInt(bytes, position), [24, 83, 128, 103])) {
          return;
        }
        readMatroskaVInt(bytes, position);
        while (position[0] < bytes.length) {
          var eid0 = readMatroskaVInt(bytes, position);
          var bytes0 = readMatroskaBlock(bytes, position);
          var pos0 = [0], audioIdx = 0;
          if (!bytes0)
            return;
          if (BytesEq(eid0, [22, 84, 174, 107])) {
            while (pos0[0] < bytes0.length) {
              var eid1 = readMatroskaVInt(bytes0, pos0);
              var bytes1 = readMatroskaBlock(bytes0, pos0);
              var pos1 = [0], track2 = { channels: 0, sampleRate: 0 };
              if (BytesEq(eid1, [174])) {
                while (pos1[0] < bytes1.length) {
                  var eid2 = readMatroskaVInt(bytes1, pos1);
                  var bytes2 = readMatroskaBlock(bytes1, pos1);
                  var pos2 = [0];
                  if (BytesEq(eid2, [215])) {
                    var val = BytesInt(bytes2);
                    track2.number = val;
                    tracks[val] = track2;
                  } else if (BytesEq(eid2, [131])) {
                    var val = BytesInt(bytes2);
                    if (val == 1)
                      track2.type = "video";
                    else if (val == 2) {
                      track2.type = "audio";
                      if (!audioIdx)
                        scope.track0 = track2;
                      track2.idx = audioIdx++;
                    } else
                      track2.type = "Type-" + val;
                  } else if (BytesEq(eid2, [134])) {
                    var str = "";
                    for (var i = 0; i < bytes2.length; i++) {
                      str += String.fromCharCode(bytes2[i]);
                    }
                    track2.codec = str;
                  } else if (BytesEq(eid2, [225])) {
                    while (pos2[0] < bytes2.length) {
                      var eid3 = readMatroskaVInt(bytes2, pos2);
                      var bytes3 = readMatroskaBlock(bytes2, pos2);
                      if (BytesEq(eid3, [181])) {
                        var val = 0, arr = new Uint8Array(bytes3.reverse()).buffer;
                        if (bytes3.length == 4)
                          val = new Float32Array(arr)[0];
                        else if (bytes3.length == 8)
                          val = new Float64Array(arr)[0];
                        else
                          CLog("WebM Track !Float", 1, bytes3);
                        track2[sampleRateTxt] = Math.round(val);
                      } else if (BytesEq(eid3, [98, 100]))
                        track2.bitDepth = BytesInt(bytes3);
                      else if (BytesEq(eid3, [159]))
                        track2.channels = BytesInt(bytes3);
                    }
                  }
                }
              }
            }
            scope._ht = 1;
            CLog("WebM Tracks", tracks);
            endPos();
            break;
          }
        }
      }
      var track0 = scope.track0;
      if (!track0)
        return;
      var trackSR = track0[sampleRateTxt];
      scope.webmSR = trackSR;
      if (track0.bitDepth == 16 && /FLOAT/i.test(track0.codec)) {
        track0.bitDepth = 32;
        CLog("WebM 16->32 bit", 3);
      }
      if (trackSR < 8e3 || track0.bitDepth != 32 || track0.channels < 1 || !/(\b|_)PCM\b/i.test(track0.codec)) {
        scope.bytes = [];
        if (!scope.bad)
          CLog("WebM Track Unexpected", 3, scope);
        scope.bad = 1;
        return -1;
      }
      var datas = [], dataLen = 0;
      while (position[0] < bytes.length) {
        var eid1 = readMatroskaVInt(bytes, position);
        var bytes1 = readMatroskaBlock(bytes, position);
        if (!bytes1)
          break;
        if (BytesEq(eid1, [163])) {
          var trackNo = bytes1[0] & 15;
          var track2 = tracks[trackNo];
          if (!track2) {
            CLog("WebM !Track" + trackNo, 1, tracks);
            return -1;
          } else if (track2.idx === 0) {
            var u8arr = new Uint8Array(bytes1.length - 4);
            for (var i = 4; i < bytes1.length; i++) {
              u8arr[i - 4] = bytes1[i];
            }
            datas.push(u8arr);
            dataLen += u8arr.length;
          }
        }
        endPos();
      }
      if (dataLen) {
        var more = new Uint8Array(bytes.length - scope.pos[0]);
        more.set(bytes.subarray(scope.pos[0]));
        scope.bytes = more;
        scope.pos[0] = 0;
        var u8arr = new Uint8Array(dataLen);
        for (var i = 0, i2 = 0; i < datas.length; i++) {
          u8arr.set(datas[i], i2);
          i2 += datas[i].length;
        }
        var arr = new Float32Array(u8arr.buffer);
        if (track0.channels > 1) {
          var arr2 = [];
          for (var i = 0; i < arr.length; ) {
            arr2.push(arr[i]);
            i += track0.channels;
          }
          arr = new Float32Array(arr2);
        }
        return arr;
      }
    };
    var BytesEq = function(bytes1, bytes2) {
      if (!bytes1 || bytes1.length != bytes2.length)
        return false;
      if (bytes1.length == 1)
        return bytes1[0] == bytes2[0];
      for (var i = 0; i < bytes1.length; i++) {
        if (bytes1[i] != bytes2[i])
          return false;
      }
      return true;
    };
    var BytesInt = function(bytes) {
      var s = "";
      for (var i = 0; i < bytes.length; i++) {
        var n2 = bytes[i];
        s += (n2 < 16 ? "0" : "") + n2.toString(16);
      }
      return parseInt(s, 16) || 0;
    };
    var readMatroskaVInt = function(arr, pos, trim) {
      var i = pos[0];
      if (i >= arr.length)
        return;
      var b0 = arr[i], b2 = ("0000000" + b0.toString(2)).substr(-8);
      var m = /^(0*1)(\d*)$/.exec(b2);
      if (!m)
        return;
      var len = m[1].length, val = [];
      if (i + len > arr.length)
        return;
      for (var i2 = 0; i2 < len; i2++) {
        val[i2] = arr[i];
        i++;
      }
      if (trim)
        val[0] = parseInt(m[2] || "0", 2);
      pos[0] = i;
      return val;
    };
    var readMatroskaBlock = function(arr, pos) {
      var lenVal = readMatroskaVInt(arr, pos, 1);
      if (!lenVal)
        return;
      var len = BytesInt(lenVal);
      var i = pos[0], val = [];
      if (len < 2147483647) {
        if (i + len > arr.length)
          return;
        for (var i2 = 0; i2 < len; i2++) {
          val[i2] = arr[i];
          i++;
        }
      }
      pos[0] = i;
      return val;
    };
    var i18n = Recorder2.i18n = {
      lang: "zh-CN",
      alias: { "zh-CN": "zh", "en-US": "en" },
      locales: {},
      data: {},
      put: function(set2, texts) {
        var tag = RecTxt + ".i18n.put: ";
        var overwrite = set2.overwrite;
        overwrite = overwrite == null || overwrite;
        var lang = set2.lang;
        lang = i18n.alias[lang] || lang;
        if (!lang)
          throw new Error(tag + "set.lang?");
        var locale = i18n.locales[lang];
        if (!locale) {
          locale = {};
          i18n.locales[lang] = locale;
        }
        var exp = /^([\w\-]+):/, m;
        for (var i = 0; i < texts.length; i++) {
          var v = texts[i];
          m = exp.exec(v);
          if (!m) {
            CLog(tag + "'key:'? " + v, 3, set2);
            continue;
          }
          var key = m[1], v = v.substr(key.length + 1);
          if (!overwrite && locale[key])
            continue;
          locale[key] = v;
        }
      },
      get: function() {
        return i18n.v_G.apply(null, arguments);
      },
      v_G: function(key, args, lang) {
        args = args || [];
        lang = lang || i18n.lang;
        lang = i18n.alias[lang] || lang;
        var locale = i18n.locales[lang];
        var val = locale && locale[key] || "";
        if (!val && lang != "zh") {
          if (lang == "en")
            return i18n.v_G(key, args, "zh");
          return i18n.v_G(key, args, "en");
        }
        i18n.lastLang = lang;
        if (val == "=Empty")
          return "";
        return val.replace(/\{(\d+)(\!?)\}/g, function(v, a, b) {
          a = +a || 0;
          v = args[a - 1];
          if (a < 1 || a > args.length) {
            v = "{?}";
            CLog("i18n[" + key + "] no {" + a + "}: " + val, 3);
          }
          return b ? "" : v;
        });
      },
      $T: function() {
        return i18n.v_T.apply(null, arguments);
      },
      v_T: function() {
        var a = arguments, key = "", args = [], isArgs = 0, tag = RecTxt + ".i18n.$T:";
        var exp = /^([\w\-]*):/, m;
        for (var i = 0; i < a.length; i++) {
          var v = a[i];
          if (i == 0) {
            m = exp.exec(v);
            key = m && m[1];
            if (!key)
              throw new Error(tag + "0 'key:'?");
            v = v.substr(key.length + 1);
          }
          if (isArgs === -1)
            args.push(v);
          else if (isArgs)
            throw new Error(tag + " bad args");
          else if (v === 0)
            isArgs = -1;
          else if (IsNum(v)) {
            if (v < 1)
              throw new Error(tag + " bad args");
            isArgs = v;
          } else {
            var lang = i == 1 ? "en" : i ? "" : "zh";
            m = exp.exec(v);
            if (m) {
              lang = m[1] || lang;
              v = v.substr(m[1].length + 1);
            }
            if (!m || !lang)
              throw new Error(tag + i + " 'lang:'?");
            i18n.put({ lang, overwrite: false }, [key + ":" + v]);
          }
        }
        if (!key)
          return "";
        if (isArgs > 0)
          return key;
        return i18n.v_G(key, args);
      }
    };
    var $T = i18n.$T;
    $T.G = i18n.get;
    $T("NonBrowser-1::非浏览器环境，不支持{1}", 1);
    $T("IllegalArgs-1::参数错误：{1}", 1);
    $T("NeedImport-2::调用{1}需要先导入{2}", 2);
    $T("NotSupport-1::不支持：{1}", 1);
    Recorder2.TrafficImgUrl = "//ia.51.la/go1?id=20469973&pvFlag=1";
    var Traffic = Recorder2.Traffic = function(report) {
      if (!isBrowser)
        return;
      report = report ? "/" + RecTxt + "/Report/" + report : "";
      var imgUrl = Recorder2.TrafficImgUrl;
      if (imgUrl) {
        var data = Recorder2.Traffic;
        var m = /^(https?:..[^\/#]*\/?)[^#]*/i.exec(location.href) || [];
        var host2 = m[1] || "http://file/";
        var idf = (m[0] || host2) + report;
        if (imgUrl.indexOf("//") == 0) {
          if (/^https:/i.test(idf)) {
            imgUrl = "https:" + imgUrl;
          } else {
            imgUrl = "http:" + imgUrl;
          }
        }
        if (report) {
          imgUrl = imgUrl + "&cu=" + encodeURIComponent(host2 + report);
        }
        if (!data[idf]) {
          data[idf] = 1;
          var img = new Image();
          img.src = imgUrl;
          CLog("Traffic Analysis Image: " + (report || RecTxt + ".TrafficImgUrl=" + Recorder2.TrafficImgUrl));
        }
      }
    };
    if (WRec2) {
      CLog($T("8HO5::覆盖导入{1}", 0, RecTxt), 1);
      WRec2.Destroy();
    }
    Export[RecTxt] = Recorder2;
  });
})(recorderCore);
var recorderCoreExports = recorderCore.exports;
const Recorder = /* @__PURE__ */ getDefaultExportFromCjs(recorderCoreExports);
var app = { exports: {} };
(function(module2) {
  (function(factory) {
    var browser = typeof window == "object" && !!window.document;
    var win = browser ? window : Object;
    var rec = win.Recorder, ni = rec.i18n;
    factory(win, rec, ni, ni.$T, browser);
    if (module2.exports) {
      module2.exports = win.RecordApp;
    }
  })(function(Export, Recorder2, i18n, $T, isBrowser) {
    var App2 = {
      LM: "2024-04-09 19:22",
      Current: 0,
      Platforms: {}
    };
    var Platforms = App2.Platforms;
    var AppTxt = "RecordApp";
    var ReqTxt = "RequestPermission";
    var RegTxt = "RegisterPlatform";
    var WApp2 = Export[AppTxt];
    if (WApp2 && WApp2.LM == App2.LM) {
      WApp2.CLog($T("uXtA::重复导入{1}", 0, AppTxt), 3);
      return;
    }
    Export[AppTxt] = App2;
    Recorder2[AppTxt] = App2;
    App2.__SID_ = 0;
    var SID = App2.__SID = function() {
      return ++App2.__SID_;
    };
    var Sync = App2.__Sync = function(sid, tag, err) {
      if (App2.__SID_ != sid) {
        if (tag) {
          CLog($T("kIBu::注意：因为并发调用了其他录音相关方法，当前 {1} 的调用结果已被丢弃且不会有回调", 0, tag) + (err ? ", error: " + err : ""), 3);
        }
        return false;
      }
      return true;
    };
    var CLog = function() {
      var v = arguments;
      v[0] = "[" + (CLog.Tag || AppTxt) + "][" + (App2.Current && App2.Current.Key || "?") + "]" + v[0];
      Recorder2.CLog.apply(null, v);
    };
    App2.CLog = CLog;
    App2[RegTxt] = function(key, config) {
      config.Key = key;
      if (Platforms[key]) {
        CLog($T("ha2K::重复注册{1}", 0, key), 3);
      }
      Platforms[key] = config;
    };
    App2.__StopOnlyClearMsg = function() {
      return $T("wpTL::仅清理资源");
    };
    var KeyH5 = "Default-H5", H5OpenSet = ReqTxt + "_H5OpenSet";
    (function() {
      var impl = {
        Support: function(call) {
          call(true);
        },
        CanProcess: function() {
          return true;
        }
      };
      App2[RegTxt](KeyH5, impl);
      impl[ReqTxt] = function(sid, success, fail) {
        var old = App2.__Rec;
        if (old) {
          old.close();
          App2.__Rec = null;
        }
        h5Kill();
        var h5Set = App2[H5OpenSet];
        App2[H5OpenSet] = null;
        var rec = Recorder2(h5Set || {});
        rec.open(function() {
          success();
        }, fail);
      };
      var h5Kill = function() {
        if (Recorder2.IsOpen()) {
          CLog("kill open...");
          var rec = Recorder2();
          rec.open();
          rec.close();
        }
      };
      impl.Start = function(sid, set2, success, fail) {
        var appRec = App2.__Rec;
        if (appRec != null) {
          appRec.stop();
        }
        App2.__Rec = appRec = Recorder2(set2);
        appRec.appSet = set2;
        appRec.dataType = "arraybuffer";
        appRec.open(function() {
          if (Sync(sid)) {
            appRec.start();
          }
          success();
        }, fail);
      };
      impl.Stop = function(sid, success, fail) {
        var appRec = App2.__Rec;
        var clearMsg = success ? "" : App2.__StopOnlyClearMsg();
        if (!appRec) {
          h5Kill();
          fail($T("bpvP::未开始录音") + (clearMsg ? " (" + clearMsg + ")" : ""));
          return;
        }
        var end = function() {
          if (Sync(sid)) {
            appRec.close();
            for (var k in appRec.set) {
              appRec.appSet[k] = appRec.set[k];
            }
          }
        };
        var stopFail = function(msg) {
          end();
          fail(msg);
        };
        if (!success) {
          stopFail(clearMsg);
          return;
        }
        appRec.stop(function(arrBuf, duration, mime) {
          end();
          success(arrBuf, duration, mime);
        }, stopFail);
      };
    })();
    App2.GetCurrentRecOrNull = function() {
      return App2.__Rec || null;
    };
    App2.Pause = function() {
      var cur = App2.Current, key = "Pause";
      if (cur && cur[key]) {
        if (cur[key]() !== false)
          return;
      }
      var rec = App2.__Rec;
      if (rec && canProc(key)) {
        rec.pause();
      }
    };
    App2.Resume = function() {
      var cur = App2.Current, key = "Resume";
      if (cur && cur[key]) {
        if (cur[key]() !== false)
          return;
      }
      var rec = App2.__Rec;
      if (rec && canProc(key)) {
        rec.resume();
      }
    };
    var canProc = function(tag) {
      var cur = App2.Current;
      if (cur && cur.CanProcess())
        return 1;
      CLog($T("fLJD::当前环境不支持实时回调，无法进行{1}", 0, tag), 3);
    };
    App2.Install = function(success, fail) {
      var cur = App2.Current;
      if (cur) {
        success && success();
        return;
      }
      var reqs = App2.__reqs || (App2.__reqs = []);
      reqs.push({ s: success, f: fail });
      success = function() {
        call("s", arguments);
      };
      fail = function() {
        call("f", arguments);
      };
      var call = function(fn, args) {
        var arr = [].concat(reqs);
        reqs.length = 0;
        for (var i = 0; i < arr.length; i++) {
          var f2 = arr[i][fn];
          f2 && f2.apply(null, args);
        }
      };
      if (reqs.length > 1)
        return;
      var keys = [KeyH5], key;
      for (var k in Platforms) {
        if (k != KeyH5)
          keys.push(k);
      }
      keys.reverse();
      var initCur = function(idx) {
        key = keys[idx];
        cur = Platforms[key];
        cur.Support(function(canUse) {
          if (!canUse) {
            return initCur(idx + 1);
          }
          if (cur.Install) {
            cur.Install(initOk, fail);
          } else {
            initOk();
          }
        });
      };
      var initOk = function() {
        App2.Current = cur;
        CLog("Install platform: " + key);
        success();
      };
      initCur(0);
    };
    App2[ReqTxt] = function(success, fail) {
      var sid = SID(), tag = AppTxt + "." + ReqTxt;
      var failCall = function(errMsg, isUserNotAllow) {
        isUserNotAllow = !!isUserNotAllow;
        var msg = errMsg + ", isUserNotAllow:" + isUserNotAllow;
        if (!Sync(sid, tag, msg))
          return;
        CLog($T("YnzX::录音权限请求失败：") + msg, 1);
        fail && fail(errMsg, isUserNotAllow);
      };
      CLog(ReqTxt + "...");
      App2.Install(function() {
        if (!Sync(sid, tag))
          return;
        var checkMsg = CheckH5();
        if (checkMsg) {
          failCall(checkMsg);
          return;
        }
        App2.Current[ReqTxt](sid, function() {
          if (!Sync(sid, tag))
            return;
          CLog(ReqTxt + " Success");
          success && success();
        }, failCall);
      }, failCall);
    };
    var NeedReqMsg = function() {
      return $T("nwKR::需先调用{1}", 0, ReqTxt);
    };
    var CheckH5 = function() {
      var msg = "";
      if (App2.Current.Key == KeyH5 && !isBrowser) {
        msg = $T("citA::当前不是浏览器环境，需引入针对此平台的支持文件（{1}），或调用{2}自行实现接入", 0, "src/app-support/app-xxx-support.js", AppTxt + "." + RegTxt);
      }
      return msg;
    };
    App2.Start = function(set2, success, fail) {
      var sid = SID(), tag = AppTxt + ".Start";
      var failCall = function(msg) {
        if (!Sync(sid, tag, msg))
          return;
        CLog($T("ecp9::开始录音失败：") + msg, 1);
        fail && fail(msg);
      };
      CLog("Start...");
      var cur = App2.Current;
      if (!cur) {
        failCall(NeedReqMsg());
        return;
      }
      set2 || (set2 = {});
      var obj = {
        type: "mp3",
        sampleRate: 16e3,
        bitRate: 16,
        onProcess: function() {
        }
      };
      for (var k in obj) {
        set2[k] || (set2[k] = obj[k]);
      }
      for (var k in Platforms) {
        var pf = Platforms[k];
        if (pf.AllStart_Clean) {
          pf.AllStart_Clean(set2);
        }
      }
      var checkMsg = false;
      if (cur.Start_Check) {
        checkMsg = cur.Start_Check(set2);
      }
      if (checkMsg === false) {
        var checkRec = Recorder2(set2);
        checkMsg = checkRec.envCheck({ envName: cur.Key, canProcess: cur.CanProcess() });
        if (!checkMsg)
          checkMsg = CheckH5();
      }
      if (checkMsg) {
        failCall($T("EKmS::不能录音：") + checkMsg);
        return;
      }
      App2._SRec = 0;
      cur.Start(sid, set2, function() {
        if (!Sync(sid, tag))
          return;
        CLog($T("k7Qo::已开始录音"), set2);
        App2._STime = Date.now();
        success && success();
      }, failCall);
    };
    App2.Stop = function(success, fail) {
      var sid = SID(), tag = AppTxt + ".Stop";
      var failCall = function(msg) {
        if (!Sync(sid, tag, msg))
          return;
        CLog($T("Douz::结束录音失败：") + msg, success ? 1 : 0);
        try {
          fail && fail(msg);
        } finally {
          clear2();
        }
      };
      var clear2 = function() {
        App2._SRec = App2.__Rec;
        App2.__Rec = null;
      };
      CLog("Stop... " + $T("wqSH::和Start时差：{1}ms", 0, App2._STime ? Date.now() - App2._STime : -1) + " Recorder.LM:" + Recorder2.LM + " " + AppTxt + ".LM:" + App2.LM);
      var t1 = Date.now();
      var cur = App2.Current;
      if (!cur) {
        failCall(NeedReqMsg());
        return;
      }
      cur.Stop(sid, !success ? null : function(arrayBuffer, duration, mime) {
        if (!Sync(sid, tag))
          return;
        CLog($T("g3VX::结束录音 耗时{1}ms 音频时长{2}ms 文件大小{3}b {4}", 0, Date.now() - t1, duration, arrayBuffer.byteLength, mime));
        try {
          success(arrayBuffer, duration, mime);
        } finally {
          clear2();
        }
      }, failCall);
    };
  });
})(app);
var appExports = app.exports;
const RecordApp = /* @__PURE__ */ getDefaultExportFromCjs(appExports);
(function(factory) {
  var browser = typeof window == "object" && !!window.document;
  var win = browser ? window : Object;
  var rec = win.Recorder, ni = rec.i18n;
  factory(rec, ni, ni.$T, browser);
})(function(Recorder2, i18n, $T, isBrowser) {
  var IsWx = typeof wx$1 == "object" && !!wx$1.getRecorderManager;
  var App2 = Recorder2.RecordApp;
  var CLog = App2.CLog;
  var platform = {
    Support: function(call) {
      if (IsWx && isBrowser) {
        var win = window, doc = win.document, loc = win.location, body = doc.body;
        if (loc && loc.href && loc.reload && body && body.appendChild) {
          CLog("识别是浏览器但又检测到wx", 3);
          call(false);
          return;
        }
      }
      call(IsWx);
    },
    CanProcess: function() {
      return true;
    }
  };
  App2.RegisterPlatform("miniProgram-wx", platform);
  App2.MiniProgramWx_onShow = function() {
    recOnShow();
  };
  platform.RequestPermission = function(sid, success, fail) {
    requestPermission(success, fail);
  };
  platform.Start = function(sid, set2, success, fail) {
    onRecFn.param = set2;
    var rec = Recorder2(set2);
    rec.set.disableEnvInFix = true;
    rec.dataType = "arraybuffer";
    onRecFn.rec = rec;
    App2.__Rec = rec;
    recStart(success, fail);
  };
  platform.Stop = function(sid, success, fail) {
    clearCurMg();
    var failCall = function(msg) {
      if (App2.__Sync(sid)) {
        onRecFn.rec = null;
      }
      fail(msg);
    };
    var rec = onRecFn.rec;
    onRecFn.rec = null;
    var clearMsg = success ? "" : App2.__StopOnlyClearMsg();
    if (!rec) {
      failCall("未开始录音" + (clearMsg ? " (" + clearMsg + ")" : ""));
      return;
    }
    CLog("rec encode: pcm:" + rec.recSize + " srcSR:" + rec.srcSampleRate + " set:" + JSON.stringify(onRecFn.param));
    var end = function() {
      if (App2.__Sync(sid)) {
        for (var k in rec.set) {
          onRecFn.param[k] = rec.set[k];
        }
      }
    };
    if (!success) {
      end();
      failCall(clearMsg);
      return;
    }
    rec.stop(function(arrBuf, duration, mime) {
      end();
      success(arrBuf, duration, mime);
    }, function(msg) {
      end();
      failCall(msg);
    });
  };
  var onRecFn = function(pcm, sampleRate) {
    var rec = onRecFn.rec;
    if (!rec) {
      CLog("未开始录音，但收到wx PCM数据", 3);
      return;
    }
    if (!rec._appStart) {
      rec.envStart({
        envName: platform.Key,
        canProcess: platform.CanProcess()
      }, sampleRate);
    }
    rec._appStart = 1;
    var sum = 0;
    for (var i = 0; i < pcm.length; i++) {
      sum += Math.abs(pcm[i]);
    }
    rec.envIn(pcm, sum);
  };
  var hasPermission = false;
  var requestPermission = function(success, fail) {
    clearCurMg();
    initSys();
    if (hasPermission) {
      success();
      return;
    }
    var mg = wx$1.getRecorderManager(), next = 1;
    mg.onStart(function() {
      hasPermission = true;
      if (next) {
        next = 0;
        stopMg(mg);
        success();
      }
    });
    mg.onError(function(res) {
      var msg = "请求录音权限出现错误：" + res.errMsg;
      CLog(msg + "。" + UserPermissionMsg, 1, res);
      if (next) {
        next = 0;
        stopMg(mg);
        fail(msg, true);
      }
    });
    newStart("req", mg);
  };
  var UserPermissionMsg = "请自行检查wx.getSetting中的scope.record录音权限，如果用户拒绝了权限，请引导用户到小程序设置中授予录音权限。";
  var curMg, mgStime = 0;
  var clearCurMg = function() {
    var old = curMg;
    curMg = null;
    if (old) {
      stopMg(old);
    }
  };
  var stopMg = function(mg) {
    mgStime = Date.now();
    mg.stop();
  };
  var newStart = function(tag, mg) {
    var obj = {
      duration: 6e5,
      sampleRate: 48e3,
      encodeBitRate: 32e4,
      numberOfChannels: 1,
      format: "PCM",
      frameSize: isDev ? 1 : 4
      //4=48/12
    };
    var set2 = onRecFn.param || {}, aec = (set2.audioTrackSet || {}).echoCancellation;
    if (sys.platform == "android") {
      var source = set2.android_audioSource, asVal = "";
      if (source == null && aec)
        source = 7;
      if (source == null)
        source = App2.Default_Android_AudioSource;
      if (source == 1)
        asVal = "mic";
      if (source == 5)
        asVal = "camcorder";
      if (source == 6)
        asVal = "voice_recognition";
      if (source == 7)
        asVal = "voice_communication";
      if (asVal)
        obj.audioSource = asVal;
    }
    if (aec) {
      CLog("mg注意：iOS下无法配置回声消除，Android无此问题，建议都启用听筒播放避免回声：wx.setInnerAudioOption({speakerOn:false})", 3);
    }
    CLog("[" + tag + "]mg.start obj", obj);
    mg.start(obj);
  };
  var recOnShow = function() {
    if (curMg && curMg.__pause) {
      CLog("mg onShow 录音开始恢复...", 3);
      curMg.resume();
    }
  };
  var recStart = function(success, fail) {
    clearCurMg();
    initSys();
    devWebMInfo = {};
    if (isDev) {
      CLog("RecorderManager.onFrameRecorded 在开发工具中测试返回的是webm格式音频，将会尝试进行解码。开发工具中录音偶尔会非常卡，建议使用真机测试（各种奇奇怪怪的毛病就都正常了）", 3);
    }
    var startIsEnd = false, startCount = 1;
    var startEnd = function(err) {
      if (startIsEnd)
        return;
      startIsEnd = true;
      if (err) {
        clearCurMg();
        fail(err);
      } else {
        success();
      }
    };
    var mg = curMg = wx$1.getRecorderManager();
    mg.onInterruptionEnd(function() {
      if (mg != curMg)
        return;
      CLog("mg onInterruptionEnd 录音开始恢复...", 3);
      mg.resume();
    });
    mg.onPause(function() {
      if (mg != curMg)
        return;
      mg.__pause = Date.now();
      CLog("mg onPause 录音被打断", 3);
    });
    mg.onResume(function() {
      if (mg != curMg)
        return;
      var t2 = mg.__pause ? Date.now() - mg.__pause : 0, t22 = 0;
      mg.__pause = 0;
      if (t2 > 300) {
        t22 = Math.min(1e3, t2);
        onRecFn(new Int16Array(48e3 / 1e3 * t22), 48e3);
      }
      CLog("mg onResume 恢复录音，填充了" + t22 + "ms静默", 3);
    });
    mg.onError(function(res) {
      if (mg != curMg)
        return;
      var msg = res.errMsg, tag = "mg onError 开始录音出错：";
      if (!startIsEnd && !mg._srt && /fail.+is.+recording/i.test(msg)) {
        var st2 = 600 - (Date.now() - mgStime);
        if (st2 > 0) {
          st2 = Math.max(100, st2);
          CLog(tag + "等待" + st2 + "ms重试", 3, res);
          setTimeout(function() {
            if (mg != curMg)
              return;
            mg._srt = 1;
            CLog(tag + "正在重试", 3);
            newStart("retry start", mg);
          }, st2);
          return;
        }
      }
      CLog(startCount > 1 ? tag + "可能无法继续录音[" + startCount + "]。" + msg : tag + msg + "。" + UserPermissionMsg, 1, res);
      startEnd("开始录音出错：" + msg);
    });
    mg.onStart(function() {
      if (mg != curMg)
        return;
      CLog("mg onStart 已开始录音");
      mg._srt = 0;
      mg._st = Date.now();
      startEnd();
    });
    mg.onStop(function(res) {
      CLog("mg onStop 请勿尝试使用此原始结果中的文件路径（此原始文件的格式、采样率等和录音配置不相同）；如需本地文件：可在RecordApp.Stop回调中将得到的ArrayBuffer（二进制音频数据）用RecordApp.MiniProgramWx_WriteLocalFile接口保存到本地，即可得到有效路径。res:", res);
      if (mg != curMg)
        return;
      if (!mg._st || Date.now() - mg._st < 600) {
        CLog("mg onStop但已忽略", 3);
        return;
      }
      CLog("mg onStop 已停止录音，正在重新开始录音...");
      startCount++;
      mg._st = 0;
      newStart("restart", mg);
    });
    var start0 = function() {
      mg.onFrameRecorded(function(res) {
        if (mg != curMg)
          return;
        if (!startIsEnd)
          CLog("mg onStart未触发，但收到了onFrameRecorded", 3);
        startEnd();
        var aBuf = res.frameBuffer;
        if (!aBuf || !aBuf.byteLength) {
          return;
        }
        if (isDev) {
          devWebmDecode(new Uint8Array(aBuf));
        } else {
          onRecFn(new Int16Array(aBuf), 48e3);
        }
      });
      newStart("start", mg);
    };
    var st = 600 - (Date.now() - mgStime);
    if (st > 0) {
      st = Math.max(100, st);
      CLog("mg.start距stop太近需等待" + st + "ms", 3);
      setTimeout(function() {
        if (mg != curMg)
          return;
        start0();
      }, st);
    } else {
      start0();
    }
  };
  App2.MiniProgramWx_WriteLocalFile = function(fileName, buffer2, True, False) {
    var set2 = fileName;
    if (typeof set2 == "string")
      set2 = { fileName };
    fileName = set2.fileName;
    var append = set2.append;
    var seek_ = set2.seekOffset, seek = +seek_ || 0;
    if (!seek_ && seek_ !== 0)
      seek = -1;
    var EnvUsr = wx$1.env.USER_DATA_PATH, savePath = fileName;
    if (fileName.indexOf(EnvUsr) == -1)
      savePath = EnvUsr + "/" + fileName;
    var tasks = writeTasks[savePath] = writeTasks[savePath] || [];
    var tk0 = tasks[0], tk = { a: set2, b: buffer2, c: True, d: False };
    if (tk0 && tk0._r) {
      CLog("wx文件等待写入" + savePath, 3);
      set2._tk = 1;
      tasks.push(tk);
      return;
    }
    if (set2._tk)
      CLog("wx文件继续写入" + savePath);
    tasks.splice(0, 0, tk);
    tk._r = 1;
    var mg = wx$1.getFileSystemManager(), fd = 0;
    var endCall = function() {
      if (fd)
        mg.close({ fd });
      setTimeout(function() {
        tasks.shift();
        var tk2 = tasks.shift();
        if (tk2) {
          App2.MiniProgramWx_WriteLocalFile(tk2.a, tk2.b, tk2.c, tk2.d);
        }
      });
    };
    var okCall = function() {
      endCall();
      True && True(savePath);
    };
    var failCall = function(e2) {
      endCall();
      var msg = e2.errMsg || "-";
      CLog("wx文件" + savePath + "写入出错：" + msg, 1);
      False && False(msg);
    };
    if (seek > -1 || append) {
      mg.open({
        filePath: savePath,
        flag: seek > -1 ? "r+" : "a",
        success: function(res) {
          fd = res.fd;
          var opt = { fd, data: buffer2, success: okCall, fail: failCall };
          if (seek > -1)
            opt.position = seek;
          mg.write(opt);
        },
        fail: failCall
      });
    } else {
      mg.writeFile({
        filePath: savePath,
        encoding: "binary",
        data: buffer2,
        success: okCall,
        fail: failCall
      });
    }
  };
  var writeTasks = {};
  App2.MiniProgramWx_DeleteLocalFile = function(savePath, True, False) {
    wx$1.getFileSystemManager().unlink({
      filePath: savePath,
      success: function() {
        True && True();
      },
      fail: function(e2) {
        False && False(e2.errMsg || "-");
      }
    });
  };
  var isDev, sys;
  var initSys = function() {
    if (sys)
      return;
    sys = wx$1.getSystemInfoSync();
    isDev = sys.platform == "devtools" ? 1 : 0;
    if (isDev) {
      devWebCtx = wx$1.createWebAudioContext();
    }
  };
  var devWebCtx, devWebMInfo;
  var devWebmDecode = function(inBytes) {
    var scope = devWebMInfo;
    if (!scope.pos) {
      scope.pos = [0];
      scope.tracks = {};
      scope.bytes = [];
    }
    var tracks = scope.tracks, position = [scope.pos[0]];
    var endPos = function() {
      scope.pos[0] = position[0];
    };
    var sBL = scope.bytes.length;
    var bytes = new Uint8Array(sBL + inBytes.length);
    bytes.set(scope.bytes);
    bytes.set(inBytes, sBL);
    scope.bytes = bytes;
    var returnPCM = function() {
      scope.bytes = [];
      onRecFn(new Int16Array(bytes), 48e3);
    };
    if (scope.isNotWebM) {
      returnPCM();
      return;
    }
    if (!scope._ht) {
      var headPos0 = 0;
      for (var i = 0; i < bytes.length; i++) {
        if (bytes[i] == 26 && bytes[i + 1] == 69 && bytes[i + 2] == 223 && bytes[i + 3] == 163) {
          headPos0 = i;
          position[0] = i + 4;
          break;
        }
      }
      if (!position[0]) {
        if (bytes.length > 5 * 1024) {
          CLog("未识别到WebM数据，开发工具可能已支持PCM", 3);
          scope.isNotWebM = true;
          returnPCM();
        }
        return;
      }
      readMatroskaBlock(bytes, position);
      if (!BytesEq(readMatroskaVInt(bytes, position), [24, 83, 128, 103])) {
        return;
      }
      readMatroskaVInt(bytes, position);
      while (position[0] < bytes.length) {
        var eid0 = readMatroskaVInt(bytes, position);
        var bytes0 = readMatroskaBlock(bytes, position);
        if (!bytes0)
          return;
        if (BytesEq(eid0, [22, 84, 174, 107])) {
          scope._ht = bytes.slice(headPos0, position[0]);
          CLog("WebM Tracks", tracks);
          endPos();
          break;
        }
      }
    }
    var datas = [], dataLen = 0;
    while (position[0] < bytes.length) {
      var p0 = position[0];
      var eid1 = readMatroskaVInt(bytes, position);
      var bytes1 = readMatroskaBlock(bytes, position);
      if (!bytes1)
        break;
      if (BytesEq(eid1, [163])) {
        var arr = bytes.slice(p0, position[0]);
        dataLen += arr.length;
        datas.push(arr);
      }
      endPos();
    }
    if (!dataLen) {
      return;
    }
    var more = new Uint8Array(bytes.length - scope.pos[0]);
    more.set(bytes.subarray(scope.pos[0]));
    scope.bytes = more;
    scope.pos[0] = 0;
    var add2 = [31, 67, 182, 117, 1, 255, 255, 255, 255, 255, 255, 255];
    add2.push(231, 129, 0);
    dataLen += add2.length;
    datas.splice(0, 0, add2);
    dataLen += scope._ht.length;
    datas.splice(0, 0, scope._ht);
    var u8arr = new Uint8Array(dataLen);
    for (var i = 0, i2 = 0; i < datas.length; i++) {
      u8arr.set(datas[i], i2);
      i2 += datas[i].length;
    }
    devWebCtx.decodeAudioData(u8arr.buffer, function(raw) {
      var src = raw.getChannelData(0);
      var pcm = new Int16Array(src.length);
      for (var i3 = 0; i3 < src.length; i3++) {
        var s = Math.max(-1, Math.min(1, src[i3]));
        s = s < 0 ? s * 32768 : s * 32767;
        pcm[i3] = s;
      }
      onRecFn(pcm, raw.sampleRate);
    }, function() {
      CLog("WebM解码失败", 1);
    });
  };
  var BytesEq = function(bytes1, bytes2) {
    if (!bytes1 || bytes1.length != bytes2.length)
      return false;
    if (bytes1.length == 1)
      return bytes1[0] == bytes2[0];
    for (var i = 0; i < bytes1.length; i++) {
      if (bytes1[i] != bytes2[i])
        return false;
    }
    return true;
  };
  var BytesInt = function(bytes) {
    var s = "";
    for (var i = 0; i < bytes.length; i++) {
      var n2 = bytes[i];
      s += (n2 < 16 ? "0" : "") + n2.toString(16);
    }
    return parseInt(s, 16) || 0;
  };
  var readMatroskaVInt = function(arr, pos, trim) {
    var i = pos[0];
    if (i >= arr.length)
      return;
    var b0 = arr[i], b2 = ("0000000" + b0.toString(2)).substr(-8);
    var m = /^(0*1)(\d*)$/.exec(b2);
    if (!m)
      return;
    var len = m[1].length, val = [];
    if (i + len > arr.length)
      return;
    for (var i2 = 0; i2 < len; i2++) {
      val[i2] = arr[i];
      i++;
    }
    if (trim)
      val[0] = parseInt(m[2] || "0", 2);
    pos[0] = i;
    return val;
  };
  var readMatroskaBlock = function(arr, pos) {
    var lenVal = readMatroskaVInt(arr, pos, 1);
    if (!lenVal)
      return;
    var len = BytesInt(lenVal);
    var i = pos[0], val = [];
    if (len < 2147483647) {
      if (i + len > arr.length)
        return;
      for (var i2 = 0; i2 < len; i2++) {
        val[i2] = arr[i];
        i++;
      }
    }
    pos[0] = i;
    return val;
  };
});
(function(factory) {
  var browser = typeof window == "object" && !!window.document;
  var win = browser ? window : Object;
  var rec = win.Recorder, ni = rec.i18n;
  factory(rec, ni, ni.$T, browser);
})(function(Recorder2, i18n, $T, isBrowser) {
  var SampleS = "48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000";
  var BitS = "8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 192, 224, 256, 320";
  Recorder2.prototype.enc_mp3 = {
    stable: true,
    takeEC: "full",
    getTestMsg: function() {
      return $T("Zm7L::采样率范围：{1}；比特率范围：{2}（不同比特率支持的采样率范围不同，小于32kbps时采样率需小于32000）", 0, SampleS, BitS);
    }
  };
  var NormalizeSet = function(set2) {
    var bS = set2.bitRate, sS = set2.sampleRate, s = sS;
    if ((" " + BitS + ",").indexOf(" " + bS + ",") == -1) {
      Recorder2.CLog($T("eGB9::{1}不在mp3支持的取值范围：{2}", 0, "bitRate=" + bS, BitS), 3);
    }
    if ((" " + SampleS + ",").indexOf(" " + sS + ",") == -1) {
      var arr = SampleS.split(", "), vs = [];
      for (var i = 0; i < arr.length; i++)
        vs.push({ v: +arr[i], s: Math.abs(arr[i] - sS) });
      vs.sort(function(a, b) {
        return a.s - b.s;
      });
      s = vs[0].v;
      set2.sampleRate = s;
      Recorder2.CLog($T("zLTa::sampleRate已更新为{1}，因为{2}不在mp3支持的取值范围：{3}", 0, s, sS, SampleS), 3);
    }
  };
  var ImportEngineErr = function() {
    return $T.G("NeedImport-2", ["mp3.js", "src/engine/mp3-engine.js"]);
  };
  var HasWebWorker = isBrowser && typeof Worker == "function";
  Recorder2.prototype.mp3 = function(res, True, False) {
    var This = this, set2 = This.set, size2 = res.length;
    if (!Recorder2.lamejs) {
      False(ImportEngineErr());
      return;
    }
    if (HasWebWorker) {
      var ctx = This.mp3_start(set2);
      if (ctx) {
        if (ctx.isW) {
          This.mp3_encode(ctx, res);
          This.mp3_complete(ctx, True, False, 1);
          return;
        }
        This.mp3_stop(ctx);
      }
    }
    NormalizeSet(set2);
    var mp3 = new Recorder2.lamejs.Mp3Encoder(1, set2.sampleRate, set2.bitRate);
    var blockSize = 57600;
    var memory = new Int8Array(5e5), mOffset = 0;
    var idx = 0, isFlush = 0;
    var run = function() {
      try {
        if (idx < size2) {
          var buf = mp3.encodeBuffer(res.subarray(idx, idx + blockSize));
        } else {
          isFlush = 1;
          var buf = mp3.flush();
        }
        ;
      } catch (e2) {
        index.__f__("error", "at node_modules/recorder-core/src/engine/mp3.js:87", e2);
        if (!isFlush)
          try {
            mp3.flush();
          } catch (r) {
            index.__f__("error", "at node_modules/recorder-core/src/engine/mp3.js:88", r);
          }
        False("MP3 Encoder: " + e2.message);
        return;
      }
      var bufLen = buf.length;
      if (bufLen > 0) {
        if (mOffset + bufLen > memory.length) {
          var tmp = new Int8Array(memory.length + Math.max(5e5, bufLen));
          tmp.set(memory.subarray(0, mOffset));
          memory = tmp;
        }
        memory.set(buf, mOffset);
        mOffset += bufLen;
      }
      if (idx < size2) {
        idx += blockSize;
        setTimeout(run);
      } else {
        var data = [memory.buffer.slice(0, mOffset)];
        var meta = mp3TrimFix.fn(data, mOffset, size2, set2.sampleRate);
        mp3TrimFixSetMeta(meta, set2);
        True(data[0] || new ArrayBuffer(0), "audio/mp3");
      }
    };
    run();
  };
  var mp3Worker;
  Recorder2.BindDestroy("mp3Worker", function() {
    if (mp3Worker) {
      Recorder2.CLog("mp3Worker Destroy");
      mp3Worker.terminate();
      mp3Worker = null;
    }
  });
  Recorder2.prototype.mp3_envCheck = function(envInfo, set2) {
    var errMsg = "";
    if (set2.takeoffEncodeChunk) {
      if (!newContext()) {
        errMsg = $T("yhUs::当前浏览器版本太低，无法实时处理");
      }
    }
    if (!errMsg && !Recorder2.lamejs) {
      errMsg = ImportEngineErr();
    }
    return errMsg;
  };
  Recorder2.prototype.mp3_start = function(set2) {
    return newContext(set2);
  };
  var openList = { id: 0 };
  var newContext = function(setOrNull, _badW) {
    var run = function(e2) {
      var ed = e2.data;
      var wk_ctxs = scope.wkScope.wk_ctxs;
      var wk_lame = scope.wkScope.wk_lame;
      var wk_mp3TrimFix = scope.wkScope.wk_mp3TrimFix;
      var cur = wk_ctxs[ed.id];
      if (ed.action == "init") {
        wk_ctxs[ed.id] = {
          sampleRate: ed.sampleRate,
          bitRate: ed.bitRate,
          takeoff: ed.takeoff,
          pcmSize: 0,
          memory: new Int8Array(5e5),
          mOffset: 0,
          encObj: new wk_lame.Mp3Encoder(1, ed.sampleRate, ed.bitRate)
        };
      } else if (!cur) {
        return;
      }
      var addBytes = function(buf2) {
        var bufLen = buf2.length;
        if (cur.mOffset + bufLen > cur.memory.length) {
          var tmp = new Int8Array(cur.memory.length + Math.max(5e5, bufLen));
          tmp.set(cur.memory.subarray(0, cur.mOffset));
          cur.memory = tmp;
        }
        cur.memory.set(buf2, cur.mOffset);
        cur.mOffset += bufLen;
      };
      switch (ed.action) {
        case "stop":
          if (!cur.isCp)
            try {
              cur.encObj.flush();
            } catch (e3) {
              index.__f__("error", "at node_modules/recorder-core/src/engine/mp3.js:184", e3);
            }
          cur.encObj = null;
          delete wk_ctxs[ed.id];
          break;
        case "encode":
          if (cur.isCp)
            break;
          cur.pcmSize += ed.pcm.length;
          try {
            var buf = cur.encObj.encodeBuffer(ed.pcm);
          } catch (e3) {
            cur.err = e3;
            index.__f__("error", "at node_modules/recorder-core/src/engine/mp3.js:195", e3);
          }
          if (buf && buf.length > 0) {
            if (cur.takeoff) {
              worker.onmessage({ action: "takeoff", id: ed.id, chunk: buf });
            } else {
              addBytes(buf);
            }
          }
          break;
        case "complete":
          cur.isCp = 1;
          try {
            var buf = cur.encObj.flush();
          } catch (e3) {
            cur.err = e3;
            index.__f__("error", "at node_modules/recorder-core/src/engine/mp3.js:211", e3);
          }
          if (buf && buf.length > 0) {
            if (cur.takeoff) {
              worker.onmessage({ action: "takeoff", id: ed.id, chunk: buf });
            } else {
              addBytes(buf);
            }
          }
          if (cur.err) {
            worker.onmessage({
              action: ed.action,
              id: ed.id,
              err: "MP3 Encoder: " + cur.err.message
            });
            break;
          }
          var data = [cur.memory.buffer.slice(0, cur.mOffset)];
          var meta = wk_mp3TrimFix.fn(data, cur.mOffset, cur.pcmSize, cur.sampleRate);
          worker.onmessage({
            action: ed.action,
            id: ed.id,
            blob: data[0] || new ArrayBuffer(0),
            meta
          });
          break;
      }
    };
    var initOnMsg = function(isW) {
      worker.onmessage = function(e2) {
        var data = e2;
        if (isW)
          data = e2.data;
        var ctx2 = openList[data.id];
        if (ctx2) {
          if (data.action == "takeoff") {
            ctx2.set.takeoffEncodeChunk(new Uint8Array(data.chunk.buffer));
          } else {
            ctx2.call && ctx2.call(data);
            ctx2.call = null;
          }
        }
      };
    };
    var initCtx = function() {
      var ctx2 = { worker, set: setOrNull };
      if (setOrNull) {
        ctx2.id = ++openList.id;
        openList[ctx2.id] = ctx2;
        NormalizeSet(setOrNull);
        worker.postMessage({
          action: "init",
          id: ctx2.id,
          sampleRate: setOrNull.sampleRate,
          bitRate: setOrNull.bitRate,
          takeoff: !!setOrNull.takeoffEncodeChunk,
          x: new Int16Array(5)
          //低版本浏览器不支持序列化TypedArray
        });
      } else {
        worker.postMessage({
          x: new Int16Array(5)
          //低版本浏览器不支持序列化TypedArray
        });
      }
      return ctx2;
    };
    var scope, worker = mp3Worker;
    if (_badW || !HasWebWorker) {
      Recorder2.CLog($T("k9PT::当前环境不支持Web Worker，mp3实时编码器运行在主线程中"), 3);
      worker = { postMessage: function(ed) {
        run({ data: ed });
      } };
      scope = { wkScope: {
        wk_ctxs: {},
        wk_lame: Recorder2.lamejs,
        wk_mp3TrimFix: mp3TrimFix
      } };
      initOnMsg();
      return initCtx();
    }
    try {
      if (!worker) {
        var onmsg = (run + "").replace(/[\w\$]+\.onmessage/g, "self.postMessage");
        onmsg = onmsg.replace(/[\w\$]+\.wkScope/g, "wkScope");
        var jsCode = ");wk_lame();self.onmessage=" + onmsg;
        jsCode += ";var wkScope={ wk_ctxs:{},wk_lame:wk_lame";
        jsCode += ",wk_mp3TrimFix:{rm:" + mp3TrimFix.rm + ",fn:" + mp3TrimFix.fn + "} }";
        var lamejsCode = Recorder2.lamejs.toString();
        var url = (window.URL || webkitURL).createObjectURL(new Blob(["var wk_lame=(", lamejsCode, jsCode], { type: "text/javascript" }));
        worker = new Worker(url);
        setTimeout(function() {
          (window.URL || webkitURL).revokeObjectURL(url);
        }, 1e4);
        initOnMsg(1);
      }
      ;
      var ctx = initCtx();
      ctx.isW = 1;
      mp3Worker = worker;
      return ctx;
    } catch (e2) {
      worker && worker.terminate();
      index.__f__("error", "at node_modules/recorder-core/src/engine/mp3.js:317", e2);
      return newContext(setOrNull, 1);
    }
  };
  Recorder2.prototype.mp3_stop = function(startCtx) {
    if (startCtx && startCtx.worker) {
      startCtx.worker.postMessage({
        action: "stop",
        id: startCtx.id
      });
      startCtx.worker = null;
      delete openList[startCtx.id];
      var opens = -1;
      for (var k in openList) {
        opens++;
      }
      if (opens) {
        Recorder2.CLog($T("fT6M::mp3 worker剩{1}个未stop", 0, opens), 3);
      }
    }
  };
  Recorder2.prototype.mp3_encode = function(startCtx, pcm) {
    if (startCtx && startCtx.worker) {
      startCtx.worker.postMessage({
        action: "encode",
        id: startCtx.id,
        pcm
      });
    }
  };
  Recorder2.prototype.mp3_complete = function(startCtx, True, False, autoStop) {
    var This = this;
    if (startCtx && startCtx.worker) {
      startCtx.call = function(data) {
        if (autoStop) {
          This.mp3_stop(startCtx);
        }
        if (data.err) {
          False(data.err);
        } else {
          mp3TrimFixSetMeta(data.meta, startCtx.set);
          True(data.blob, "audio/mp3");
        }
      };
      startCtx.worker.postMessage({
        action: "complete",
        id: startCtx.id
      });
    } else {
      False($T("mPxH::mp3编码器未start"));
    }
  };
  Recorder2.mp3ReadMeta = function(mp3Buffers, length) {
    var parseInt_ES3 = typeof window != "undefined" && window.parseInt || typeof self != "undefined" && self.parseInt || parseInt;
    var u8arr0 = new Uint8Array(mp3Buffers[0] || []);
    if (u8arr0.length < 4) {
      return null;
    }
    var byteAt = function(idx2, u8) {
      return ("0000000" + ((u8 || u8arr0)[idx2] || 0).toString(2)).substr(-8);
    };
    var b2 = byteAt(0) + byteAt(1);
    var b4 = byteAt(2) + byteAt(3);
    if (!/^1{11}/.test(b2)) {
      return null;
    }
    var version2 = { "00": 2.5, "10": 2, "11": 1 }[b2.substr(11, 2)];
    var layer = { "01": 3 }[b2.substr(13, 2)];
    var sampleRate = {
      //lamejs -> Tables.samplerate_table
      "1": [44100, 48e3, 32e3],
      "2": [22050, 24e3, 16e3],
      "2.5": [11025, 12e3, 8e3]
    }[version2];
    sampleRate && (sampleRate = sampleRate[parseInt_ES3(b4.substr(4, 2), 2)]);
    var bitRate = [
      //lamejs -> Tables.bitrate_table
      [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
      [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
      //MPEG 1
    ][version2 == 1 ? 1 : 0][parseInt_ES3(b4.substr(0, 4), 2)];
    if (!version2 || !layer || !bitRate || !sampleRate) {
      return null;
    }
    var duration = Math.round(length * 8 / bitRate);
    var frame = layer == 1 ? 384 : layer == 2 ? 1152 : version2 == 1 ? 1152 : 576;
    var frameDurationFloat = frame / sampleRate * 1e3;
    var frameSize = Math.floor(frame * bitRate / 8 / sampleRate * 1e3);
    var hasPadding = 0, seek = 0;
    for (var i = 0; i < mp3Buffers.length; i++) {
      var buf = mp3Buffers[i];
      seek += buf.byteLength;
      if (seek >= frameSize + 3) {
        var buf8 = new Uint8Array(buf);
        var idx = buf.byteLength - (seek - (frameSize + 3) + 1);
        var ib4 = byteAt(idx, buf8);
        hasPadding = ib4.charAt(6) == "1";
        break;
      }
    }
    if (hasPadding) {
      frameSize++;
    }
    return {
      version: version2,
      layer,
      sampleRate,
      bitRate,
      duration,
      size: length,
      hasPadding,
      frameSize,
      frameDurationFloat
      //每帧时长，含小数 ms
    };
  };
  var mp3TrimFix = {
    //minfiy keep name
    rm: Recorder2.mp3ReadMeta,
    fn: function(mp3Buffers, length, pcmLength, pcmSampleRate) {
      var meta = this.rm(mp3Buffers, length);
      if (!meta) {
        return { size: length, err: "mp3 unknown format" };
      }
      var pcmDuration = Math.round(pcmLength / pcmSampleRate * 1e3);
      var num = Math.floor((meta.duration - pcmDuration) / meta.frameDurationFloat);
      if (num > 0) {
        var size2 = num * meta.frameSize - (meta.hasPadding ? 1 : 0);
        length -= size2;
        var arr0 = 0, arrs = [];
        for (var i = 0; i < mp3Buffers.length; i++) {
          var arr = mp3Buffers[i];
          if (size2 <= 0) {
            break;
          }
          if (size2 >= arr.byteLength) {
            size2 -= arr.byteLength;
            arrs.push(arr);
            mp3Buffers.splice(i, 1);
            i--;
          } else {
            mp3Buffers[i] = arr.slice(size2);
            arr0 = arr;
            size2 = 0;
          }
        }
        var checkMeta = this.rm(mp3Buffers, length);
        if (!checkMeta) {
          arr0 && (mp3Buffers[0] = arr0);
          for (var i = 0; i < arrs.length; i++) {
            mp3Buffers.splice(i, 0, arrs[i]);
          }
          meta.err = "mp3 fix error: 已还原，错误原因不明";
        }
        var fix = meta.trimFix = {};
        fix.remove = num;
        fix.removeDuration = Math.round(num * meta.frameDurationFloat);
        fix.duration = Math.round(length * 8 / meta.bitRate);
      }
      return meta;
    }
  };
  var mp3TrimFixSetMeta = function(meta, set2) {
    var tag = "MP3 Info: ";
    if (meta.sampleRate && meta.sampleRate != set2.sampleRate || meta.bitRate && meta.bitRate != set2.bitRate) {
      Recorder2.CLog(tag + $T("uY9i::和设置的不匹配{1}，已更新成{2}", 0, "set:" + set2.bitRate + "kbps " + set2.sampleRate + "hz", "set:" + meta.bitRate + "kbps " + meta.sampleRate + "hz"), 3, set2);
      set2.sampleRate = meta.sampleRate;
      set2.bitRate = meta.bitRate;
    }
    var trimFix = meta.trimFix;
    if (trimFix) {
      tag += $T("iMSm::Fix移除{1}帧", 0, trimFix.remove) + " " + trimFix.removeDuration + "ms -> " + trimFix.duration + "ms";
      if (trimFix.remove > 2) {
        meta.err = (meta.err ? meta.err + ", " : "") + $T("b9zm::移除帧数过多");
      }
    } else {
      tag += (meta.duration || "-") + "ms";
    }
    if (meta.err) {
      Recorder2.CLog(tag, meta.size ? 1 : 0, meta.err, meta);
    } else {
      Recorder2.CLog(tag, meta);
    }
  };
});
(function(factory) {
  var browser = typeof window == "object" && !!window.document;
  var win = browser ? window : Object;
  var rec = win.Recorder;
  factory(rec);
})(function(Recorder2) {
  function lamejs() {
    var Math_log10 = function(s) {
      return Math.log(s) / Math.log(10);
    };
    var abort = function(what) {
      throw new Error("abort(" + what + ")");
    };
    function new_byte(count) {
      return new Int8Array(count);
    }
    function new_short(count) {
      return new Int16Array(count);
    }
    function new_int(count) {
      return new Int32Array(count);
    }
    function new_float(count) {
      return new Float32Array(count);
    }
    function new_double(count) {
      return new Float64Array(count);
    }
    function new_float_n(args) {
      if (args.length == 1) {
        return new_float(args[0]);
      }
      var sz = args[0];
      args = args.slice(1);
      var A = [];
      for (var i = 0; i < sz; i++) {
        A.push(new_float_n(args));
      }
      return A;
    }
    function new_int_n(args) {
      if (args.length == 1) {
        return new_int(args[0]);
      }
      var sz = args[0];
      args = args.slice(1);
      var A = [];
      for (var i = 0; i < sz; i++) {
        A.push(new_int_n(args));
      }
      return A;
    }
    function new_short_n(args) {
      if (args.length == 1) {
        return new_short(args[0]);
      }
      var sz = args[0];
      args = args.slice(1);
      var A = [];
      for (var i = 0; i < sz; i++) {
        A.push(new_short_n(args));
      }
      return A;
    }
    function new_array_n(args) {
      if (args.length == 1) {
        return new Array(args[0]);
      }
      var sz = args[0];
      args = args.slice(1);
      var A = [];
      for (var i = 0; i < sz; i++) {
        A.push(new_array_n(args));
      }
      return A;
    }
    var Arrays = {};
    Arrays.fill = function(a, fromIndex, toIndex, val) {
      if (arguments.length == 2) {
        for (var i = 0; i < a.length; i++) {
          a[i] = arguments[1];
        }
      } else {
        for (var i = fromIndex; i < toIndex; i++) {
          a[i] = val;
        }
      }
    };
    var System = {};
    System.arraycopy = function(src, srcPos, dest, destPos, length) {
      var srcEnd = srcPos + length;
      while (srcPos < srcEnd)
        dest[destPos++] = src[srcPos++];
    };
    var Util = {};
    Util.SQRT2 = 1.4142135623730951;
    Util.FAST_LOG10 = function(x) {
      return Math_log10(x);
    };
    Util.FAST_LOG10_X = function(x, y) {
      return Math_log10(x) * y;
    };
    function ShortBlock(ordinal) {
      this.ordinal = ordinal;
    }
    ShortBlock.short_block_allowed = new ShortBlock(0);
    ShortBlock.short_block_coupled = new ShortBlock(1);
    ShortBlock.short_block_dispensed = new ShortBlock(2);
    ShortBlock.short_block_forced = new ShortBlock(3);
    var Float = {};
    Float.MAX_VALUE = 34028235e31;
    function VbrMode(ordinal) {
      this.ordinal = ordinal;
    }
    VbrMode.vbr_off = new VbrMode(0);
    VbrMode.vbr_mt = new VbrMode(1);
    VbrMode.vbr_rh = new VbrMode(2);
    VbrMode.vbr_abr = new VbrMode(3);
    VbrMode.vbr_mtrh = new VbrMode(4);
    VbrMode.vbr_default = VbrMode.vbr_mtrh;
    function MPEGMode(ordinal) {
      var _ordinal = ordinal;
      this.ordinal = function() {
        return _ordinal;
      };
    }
    MPEGMode.STEREO = new MPEGMode(0);
    MPEGMode.JOINT_STEREO = new MPEGMode(1);
    MPEGMode.DUAL_CHANNEL = new MPEGMode(2);
    MPEGMode.MONO = new MPEGMode(3);
    MPEGMode.NOT_SET = new MPEGMode(4);
    function Version() {
      var LAME_MAJOR_VERSION = 3;
      var LAME_MINOR_VERSION = 98;
      var LAME_PATCH_VERSION = 4;
      this.getLameShortVersion = function() {
        return LAME_MAJOR_VERSION + "." + LAME_MINOR_VERSION + "." + LAME_PATCH_VERSION;
      };
    }
    function Takehiro() {
      var qupvt = null;
      this.qupvt = null;
      this.setModules = function(_qupvt) {
        this.qupvt = _qupvt;
        qupvt = _qupvt;
      };
      function Bits(b) {
        this.bits = 0 | b;
      }
      var subdv_table = [
        [0, 0],
        /* 0 bands */
        [0, 0],
        /* 1 bands */
        [0, 0],
        /* 2 bands */
        [0, 0],
        /* 3 bands */
        [0, 0],
        /* 4 bands */
        [0, 1],
        /* 5 bands */
        [1, 1],
        /* 6 bands */
        [1, 1],
        /* 7 bands */
        [1, 2],
        /* 8 bands */
        [2, 2],
        /* 9 bands */
        [2, 3],
        /* 10 bands */
        [2, 3],
        /* 11 bands */
        [3, 4],
        /* 12 bands */
        [3, 4],
        /* 13 bands */
        [3, 4],
        /* 14 bands */
        [4, 5],
        /* 15 bands */
        [4, 5],
        /* 16 bands */
        [4, 6],
        /* 17 bands */
        [5, 6],
        /* 18 bands */
        [5, 6],
        /* 19 bands */
        [5, 7],
        /* 20 bands */
        [6, 7],
        /* 21 bands */
        [6, 7]
        /* 22 bands */
      ];
      function quantize_lines_xrpow_01(l, istep, xr, xrPos, ix, ixPos) {
        var compareval0 = (1 - 0.4054) / istep;
        l = l >> 1;
        while (l-- != 0) {
          ix[ixPos++] = compareval0 > xr[xrPos++] ? 0 : 1;
          ix[ixPos++] = compareval0 > xr[xrPos++] ? 0 : 1;
        }
      }
      function quantize_lines_xrpow(l, istep, xr, xrPos, ix, ixPos) {
        l = l >> 1;
        var remaining = l % 2;
        l = l >> 1;
        while (l-- != 0) {
          var x0, x1, x2, x3;
          var rx0, rx1, rx2, rx3;
          x0 = xr[xrPos++] * istep;
          x1 = xr[xrPos++] * istep;
          rx0 = 0 | x0;
          x2 = xr[xrPos++] * istep;
          rx1 = 0 | x1;
          x3 = xr[xrPos++] * istep;
          rx2 = 0 | x2;
          x0 += qupvt.adj43[rx0];
          rx3 = 0 | x3;
          x1 += qupvt.adj43[rx1];
          ix[ixPos++] = 0 | x0;
          x2 += qupvt.adj43[rx2];
          ix[ixPos++] = 0 | x1;
          x3 += qupvt.adj43[rx3];
          ix[ixPos++] = 0 | x2;
          ix[ixPos++] = 0 | x3;
        }
        if (remaining != 0) {
          var x0, x1;
          var rx0, rx1;
          x0 = xr[xrPos++] * istep;
          x1 = xr[xrPos++] * istep;
          rx0 = 0 | x0;
          rx1 = 0 | x1;
          x0 += qupvt.adj43[rx0];
          x1 += qupvt.adj43[rx1];
          ix[ixPos++] = 0 | x0;
          ix[ixPos++] = 0 | x1;
        }
      }
      function quantize_xrpow(xp, pi, istep, codInfo, prevNoise) {
        var sfb;
        var sfbmax;
        var j = 0;
        var prev_data_use;
        var accumulate = 0;
        var accumulate01 = 0;
        var xpPos = 0;
        var iData = pi;
        var iDataPos = 0;
        var acc_iData = iData;
        var acc_iDataPos = 0;
        var acc_xp = xp;
        var acc_xpPos = 0;
        prev_data_use = prevNoise != null && codInfo.global_gain == prevNoise.global_gain;
        if (codInfo.block_type == Encoder.SHORT_TYPE)
          sfbmax = 38;
        else
          sfbmax = 21;
        for (sfb = 0; sfb <= sfbmax; sfb++) {
          var step = -1;
          if (prev_data_use || codInfo.block_type == Encoder.NORM_TYPE) {
            step = codInfo.global_gain - (codInfo.scalefac[sfb] + (codInfo.preflag != 0 ? qupvt.pretab[sfb] : 0) << codInfo.scalefac_scale + 1) - codInfo.subblock_gain[codInfo.window[sfb]] * 8;
          }
          if (prev_data_use && prevNoise.step[sfb] == step) {
            if (accumulate != 0) {
              quantize_lines_xrpow(
                accumulate,
                istep,
                acc_xp,
                acc_xpPos,
                acc_iData,
                acc_iDataPos
              );
              accumulate = 0;
            }
            if (accumulate01 != 0) {
              abort();
            }
          } else {
            var l = codInfo.width[sfb];
            if (j + codInfo.width[sfb] > codInfo.max_nonzero_coeff) {
              var usefullsize;
              usefullsize = codInfo.max_nonzero_coeff - j + 1;
              Arrays.fill(pi, codInfo.max_nonzero_coeff, 576, 0);
              l = usefullsize;
              if (l < 0) {
                l = 0;
              }
              sfb = sfbmax + 1;
            }
            if (0 == accumulate && 0 == accumulate01) {
              acc_iData = iData;
              acc_iDataPos = iDataPos;
              acc_xp = xp;
              acc_xpPos = xpPos;
            }
            if (prevNoise != null && prevNoise.sfb_count1 > 0 && sfb >= prevNoise.sfb_count1 && prevNoise.step[sfb] > 0 && step >= prevNoise.step[sfb]) {
              if (accumulate != 0) {
                quantize_lines_xrpow(
                  accumulate,
                  istep,
                  acc_xp,
                  acc_xpPos,
                  acc_iData,
                  acc_iDataPos
                );
                accumulate = 0;
                acc_iData = iData;
                acc_iDataPos = iDataPos;
                acc_xp = xp;
                acc_xpPos = xpPos;
              }
              accumulate01 += l;
            } else {
              if (accumulate01 != 0) {
                quantize_lines_xrpow_01(
                  accumulate01,
                  istep,
                  acc_xp,
                  acc_xpPos,
                  acc_iData,
                  acc_iDataPos
                );
                accumulate01 = 0;
                acc_iData = iData;
                acc_iDataPos = iDataPos;
                acc_xp = xp;
                acc_xpPos = xpPos;
              }
              accumulate += l;
            }
            if (l <= 0) {
              if (accumulate01 != 0) {
                abort();
              }
              if (accumulate != 0) {
                abort();
              }
              break;
            }
          }
          if (sfb <= sfbmax) {
            iDataPos += codInfo.width[sfb];
            xpPos += codInfo.width[sfb];
            j += codInfo.width[sfb];
          }
        }
        if (accumulate != 0) {
          quantize_lines_xrpow(
            accumulate,
            istep,
            acc_xp,
            acc_xpPos,
            acc_iData,
            acc_iDataPos
          );
          accumulate = 0;
        }
        if (accumulate01 != 0) {
          abort();
        }
      }
      function ix_max(ix, ixPos, endPos) {
        var max1 = 0, max2 = 0;
        do {
          var x1 = ix[ixPos++];
          var x2 = ix[ixPos++];
          if (max1 < x1)
            max1 = x1;
          if (max2 < x2)
            max2 = x2;
        } while (ixPos < endPos);
        if (max1 < max2)
          max1 = max2;
        return max1;
      }
      function count_bit_ESC(ix, ixPos, end, t1, t2, s) {
        var linbits = Tables.ht[t1].xlen * 65536 + Tables.ht[t2].xlen;
        var sum = 0, sum2;
        do {
          var x = ix[ixPos++];
          var y = ix[ixPos++];
          if (x != 0) {
            if (x > 14) {
              x = 15;
              sum += linbits;
            }
            x *= 16;
          }
          if (y != 0) {
            if (y > 14) {
              y = 15;
              sum += linbits;
            }
            x += y;
          }
          sum += Tables.largetbl[x];
        } while (ixPos < end);
        sum2 = sum & 65535;
        sum >>= 16;
        if (sum > sum2) {
          sum = sum2;
          t1 = t2;
        }
        s.bits += sum;
        return t1;
      }
      function count_bit_noESC(ix, ixPos, end, s) {
        var sum1 = 0;
        var hlen1 = Tables.ht[1].hlen;
        do {
          var x = ix[ixPos + 0] * 2 + ix[ixPos + 1];
          ixPos += 2;
          sum1 += hlen1[x];
        } while (ixPos < end);
        s.bits += sum1;
        return 1;
      }
      function count_bit_noESC_from2(ix, ixPos, end, t1, s) {
        var sum = 0, sum2;
        var xlen = Tables.ht[t1].xlen;
        var hlen;
        if (t1 == 2)
          hlen = Tables.table23;
        else
          hlen = Tables.table56;
        do {
          var x = ix[ixPos + 0] * xlen + ix[ixPos + 1];
          ixPos += 2;
          sum += hlen[x];
        } while (ixPos < end);
        sum2 = sum & 65535;
        sum >>= 16;
        if (sum > sum2) {
          sum = sum2;
          t1++;
        }
        s.bits += sum;
        return t1;
      }
      function count_bit_noESC_from3(ix, ixPos, end, t1, s) {
        var sum1 = 0;
        var sum2 = 0;
        var sum3 = 0;
        var xlen = Tables.ht[t1].xlen;
        var hlen1 = Tables.ht[t1].hlen;
        var hlen2 = Tables.ht[t1 + 1].hlen;
        var hlen3 = Tables.ht[t1 + 2].hlen;
        do {
          var x = ix[ixPos + 0] * xlen + ix[ixPos + 1];
          ixPos += 2;
          sum1 += hlen1[x];
          sum2 += hlen2[x];
          sum3 += hlen3[x];
        } while (ixPos < end);
        var t2 = t1;
        if (sum1 > sum2) {
          sum1 = sum2;
          t2++;
        }
        if (sum1 > sum3) {
          sum1 = sum3;
          t2 = t1 + 2;
        }
        s.bits += sum1;
        return t2;
      }
      var huf_tbl_noESC = [
        1,
        2,
        5,
        7,
        7,
        10,
        10,
        13,
        13,
        13,
        13,
        13,
        13,
        13,
        13
      ];
      function choose_table(ix, ixPos, endPos, s) {
        var max = ix_max(ix, ixPos, endPos);
        switch (max) {
          case 0:
            return max;
          case 1:
            return count_bit_noESC(ix, ixPos, endPos, s);
          case 2:
          case 3:
            return count_bit_noESC_from2(
              ix,
              ixPos,
              endPos,
              huf_tbl_noESC[max - 1],
              s
            );
          case 4:
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
          case 10:
          case 11:
          case 12:
          case 13:
          case 14:
          case 15:
            return count_bit_noESC_from3(
              ix,
              ixPos,
              endPos,
              huf_tbl_noESC[max - 1],
              s
            );
          default:
            if (max > QuantizePVT.IXMAX_VAL) {
              abort();
            }
            max -= 15;
            var choice2;
            for (choice2 = 24; choice2 < 32; choice2++) {
              if (Tables.ht[choice2].linmax >= max) {
                break;
              }
            }
            var choice;
            for (choice = choice2 - 8; choice < 24; choice++) {
              if (Tables.ht[choice].linmax >= max) {
                break;
              }
            }
            return count_bit_ESC(ix, ixPos, endPos, choice, choice2, s);
        }
      }
      this.noquant_count_bits = function(gfc, gi, prev_noise) {
        var ix = gi.l3_enc;
        var i = Math.min(576, gi.max_nonzero_coeff + 2 >> 1 << 1);
        if (prev_noise != null)
          prev_noise.sfb_count1 = 0;
        for (; i > 1; i -= 2)
          if ((ix[i - 1] | ix[i - 2]) != 0)
            break;
        gi.count1 = i;
        var a1 = 0;
        var a2 = 0;
        for (; i > 3; i -= 4) {
          var p;
          if (((ix[i - 1] | ix[i - 2] | ix[i - 3] | ix[i - 4]) & 2147483647) > 1) {
            break;
          }
          p = ((ix[i - 4] * 2 + ix[i - 3]) * 2 + ix[i - 2]) * 2 + ix[i - 1];
          a1 += Tables.t32l[p];
          a2 += Tables.t33l[p];
        }
        var bits = a1;
        gi.count1table_select = 0;
        if (a1 > a2) {
          bits = a2;
          gi.count1table_select = 1;
        }
        gi.count1bits = bits;
        gi.big_values = i;
        if (i == 0)
          return bits;
        if (gi.block_type == Encoder.SHORT_TYPE) {
          a1 = 3 * gfc.scalefac_band.s[3];
          if (a1 > gi.big_values)
            a1 = gi.big_values;
          a2 = gi.big_values;
        } else if (gi.block_type == Encoder.NORM_TYPE) {
          a1 = gi.region0_count = gfc.bv_scf[i - 2];
          a2 = gi.region1_count = gfc.bv_scf[i - 1];
          a2 = gfc.scalefac_band.l[a1 + a2 + 2];
          a1 = gfc.scalefac_band.l[a1 + 1];
          if (a2 < i) {
            var bi = new Bits(bits);
            gi.table_select[2] = choose_table(ix, a2, i, bi);
            bits = bi.bits;
          }
        } else {
          gi.region0_count = 7;
          gi.region1_count = Encoder.SBMAX_l - 1 - 7 - 1;
          a1 = gfc.scalefac_band.l[7 + 1];
          a2 = i;
          if (a1 > a2) {
            a1 = a2;
          }
        }
        a1 = Math.min(a1, i);
        a2 = Math.min(a2, i);
        if (0 < a1) {
          var bi = new Bits(bits);
          gi.table_select[0] = choose_table(ix, 0, a1, bi);
          bits = bi.bits;
        }
        if (a1 < a2) {
          var bi = new Bits(bits);
          gi.table_select[1] = choose_table(ix, a1, a2, bi);
          bits = bi.bits;
        }
        if (gfc.use_best_huffman == 2) {
          abort();
        }
        if (prev_noise != null) {
          if (gi.block_type == Encoder.NORM_TYPE) {
            var sfb = 0;
            while (gfc.scalefac_band.l[sfb] < gi.big_values) {
              sfb++;
            }
            prev_noise.sfb_count1 = sfb;
          }
        }
        return bits;
      };
      this.count_bits = function(gfc, xr, gi, prev_noise) {
        var ix = gi.l3_enc;
        var w = QuantizePVT.IXMAX_VAL / qupvt.IPOW20(gi.global_gain);
        if (gi.xrpow_max > w)
          return QuantizePVT.LARGE_BITS;
        quantize_xrpow(xr, ix, qupvt.IPOW20(gi.global_gain), gi, prev_noise);
        if ((gfc.substep_shaping & 2) != 0) {
          abort();
        }
        return this.noquant_count_bits(gfc, gi, prev_noise);
      };
      function recalc_divide_init(gfc, cod_info, ix, r01_bits, r01_div, r0_tbl, r1_tbl) {
        var bigv = cod_info.big_values;
        for (var r0 = 0; r0 <= 7 + 15; r0++) {
          r01_bits[r0] = QuantizePVT.LARGE_BITS;
        }
        for (var r0 = 0; r0 < 16; r0++) {
          var a1 = gfc.scalefac_band.l[r0 + 1];
          if (a1 >= bigv)
            break;
          var r0bits = 0;
          var bi = new Bits(r0bits);
          var r0t = choose_table(ix, 0, a1, bi);
          r0bits = bi.bits;
          for (var r1 = 0; r1 < 8; r1++) {
            var a2 = gfc.scalefac_band.l[r0 + r1 + 2];
            if (a2 >= bigv)
              break;
            var bits = r0bits;
            bi = new Bits(bits);
            var r1t = choose_table(ix, a1, a2, bi);
            bits = bi.bits;
            if (r01_bits[r0 + r1] > bits) {
              r01_bits[r0 + r1] = bits;
              r01_div[r0 + r1] = r0;
              r0_tbl[r0 + r1] = r0t;
              r1_tbl[r0 + r1] = r1t;
            }
          }
        }
      }
      function recalc_divide_sub(gfc, cod_info2, gi, ix, r01_bits, r01_div, r0_tbl, r1_tbl) {
        var bigv = cod_info2.big_values;
        for (var r2 = 2; r2 < Encoder.SBMAX_l + 1; r2++) {
          var a2 = gfc.scalefac_band.l[r2];
          if (a2 >= bigv)
            break;
          var bits = r01_bits[r2 - 2] + cod_info2.count1bits;
          if (gi.part2_3_length <= bits)
            break;
          var bi = new Bits(bits);
          var r2t = choose_table(ix, a2, bigv, bi);
          bits = bi.bits;
          if (gi.part2_3_length <= bits)
            continue;
          gi.assign(cod_info2);
          gi.part2_3_length = bits;
          gi.region0_count = r01_div[r2 - 2];
          gi.region1_count = r2 - 2 - r01_div[r2 - 2];
          gi.table_select[0] = r0_tbl[r2 - 2];
          gi.table_select[1] = r1_tbl[r2 - 2];
          gi.table_select[2] = r2t;
        }
      }
      this.best_huffman_divide = function(gfc, gi) {
        var cod_info2 = new GrInfo();
        var ix = gi.l3_enc;
        var r01_bits = new_int(7 + 15 + 1);
        var r01_div = new_int(7 + 15 + 1);
        var r0_tbl = new_int(7 + 15 + 1);
        var r1_tbl = new_int(7 + 15 + 1);
        if (gi.block_type == Encoder.SHORT_TYPE && gfc.mode_gr == 1)
          return;
        cod_info2.assign(gi);
        if (gi.block_type == Encoder.NORM_TYPE) {
          recalc_divide_init(gfc, gi, ix, r01_bits, r01_div, r0_tbl, r1_tbl);
          recalc_divide_sub(
            gfc,
            cod_info2,
            gi,
            ix,
            r01_bits,
            r01_div,
            r0_tbl,
            r1_tbl
          );
        }
        var i = cod_info2.big_values;
        if (i == 0 || (ix[i - 2] | ix[i - 1]) > 1)
          return;
        i = gi.count1 + 2;
        if (i > 576)
          return;
        cod_info2.assign(gi);
        cod_info2.count1 = i;
        var a1 = 0;
        var a2 = 0;
        for (; i > cod_info2.big_values; i -= 4) {
          var p = ((ix[i - 4] * 2 + ix[i - 3]) * 2 + ix[i - 2]) * 2 + ix[i - 1];
          a1 += Tables.t32l[p];
          a2 += Tables.t33l[p];
        }
        cod_info2.big_values = i;
        cod_info2.count1table_select = 0;
        if (a1 > a2) {
          a1 = a2;
          cod_info2.count1table_select = 1;
        }
        cod_info2.count1bits = a1;
        if (cod_info2.block_type == Encoder.NORM_TYPE)
          recalc_divide_sub(
            gfc,
            cod_info2,
            gi,
            ix,
            r01_bits,
            r01_div,
            r0_tbl,
            r1_tbl
          );
        else {
          cod_info2.part2_3_length = a1;
          a1 = gfc.scalefac_band.l[7 + 1];
          if (a1 > i) {
            a1 = i;
          }
          if (a1 > 0) {
            var bi = new Bits(cod_info2.part2_3_length);
            cod_info2.table_select[0] = choose_table(ix, 0, a1, bi);
            cod_info2.part2_3_length = bi.bits;
          }
          if (i > a1) {
            var bi = new Bits(cod_info2.part2_3_length);
            cod_info2.table_select[1] = choose_table(ix, a1, i, bi);
            cod_info2.part2_3_length = bi.bits;
          }
          if (gi.part2_3_length > cod_info2.part2_3_length)
            gi.assign(cod_info2);
        }
      };
      var slen1_n = [1, 1, 1, 1, 8, 2, 2, 2, 4, 4, 4, 8, 8, 8, 16, 16];
      var slen2_n = [1, 2, 4, 8, 1, 2, 4, 8, 2, 4, 8, 2, 4, 8, 4, 8];
      var slen1_tab = [0, 0, 0, 0, 3, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4];
      var slen2_tab = [0, 1, 2, 3, 0, 1, 2, 3, 1, 2, 3, 1, 2, 3, 2, 3];
      Takehiro.slen1_tab = slen1_tab;
      Takehiro.slen2_tab = slen2_tab;
      function scfsi_calc(ch, l3_side) {
        var sfb;
        var gi = l3_side.tt[1][ch];
        var g0 = l3_side.tt[0][ch];
        for (var i = 0; i < Tables.scfsi_band.length - 1; i++) {
          for (sfb = Tables.scfsi_band[i]; sfb < Tables.scfsi_band[i + 1]; sfb++) {
            if (g0.scalefac[sfb] != gi.scalefac[sfb] && gi.scalefac[sfb] >= 0)
              break;
          }
          if (sfb == Tables.scfsi_band[i + 1]) {
            for (sfb = Tables.scfsi_band[i]; sfb < Tables.scfsi_band[i + 1]; sfb++) {
              gi.scalefac[sfb] = -1;
            }
            l3_side.scfsi[ch][i] = 1;
          }
        }
        var s1 = 0;
        var c1 = 0;
        for (sfb = 0; sfb < 11; sfb++) {
          if (gi.scalefac[sfb] == -1)
            continue;
          c1++;
          if (s1 < gi.scalefac[sfb])
            s1 = gi.scalefac[sfb];
        }
        var s2 = 0;
        var c2 = 0;
        for (; sfb < Encoder.SBPSY_l; sfb++) {
          if (gi.scalefac[sfb] == -1)
            continue;
          c2++;
          if (s2 < gi.scalefac[sfb])
            s2 = gi.scalefac[sfb];
        }
        for (var i = 0; i < 16; i++) {
          if (s1 < slen1_n[i] && s2 < slen2_n[i]) {
            var c = slen1_tab[i] * c1 + slen2_tab[i] * c2;
            if (gi.part2_length > c) {
              gi.part2_length = c;
              gi.scalefac_compress = i;
            }
          }
        }
      }
      this.best_scalefac_store = function(gfc, gr, ch, l3_side) {
        var gi = l3_side.tt[gr][ch];
        var sfb, i, j, l;
        var recalc = 0;
        j = 0;
        for (sfb = 0; sfb < gi.sfbmax; sfb++) {
          var width = gi.width[sfb];
          j += width;
          for (l = -width; l < 0; l++) {
            if (gi.l3_enc[l + j] != 0)
              break;
          }
          if (l == 0)
            gi.scalefac[sfb] = recalc = -2;
        }
        if (0 == gi.scalefac_scale && 0 == gi.preflag) {
          var s = 0;
          for (sfb = 0; sfb < gi.sfbmax; sfb++)
            if (gi.scalefac[sfb] > 0)
              s |= gi.scalefac[sfb];
          if (0 == (s & 1) && s != 0) {
            for (sfb = 0; sfb < gi.sfbmax; sfb++)
              if (gi.scalefac[sfb] > 0)
                gi.scalefac[sfb] >>= 1;
            gi.scalefac_scale = recalc = 1;
          }
        }
        if (0 == gi.preflag && gi.block_type != Encoder.SHORT_TYPE && gfc.mode_gr == 2) {
          for (sfb = 11; sfb < Encoder.SBPSY_l; sfb++)
            if (gi.scalefac[sfb] < qupvt.pretab[sfb] && gi.scalefac[sfb] != -2)
              break;
          if (sfb == Encoder.SBPSY_l) {
            for (sfb = 11; sfb < Encoder.SBPSY_l; sfb++)
              if (gi.scalefac[sfb] > 0)
                gi.scalefac[sfb] -= qupvt.pretab[sfb];
            gi.preflag = recalc = 1;
          }
        }
        for (i = 0; i < 4; i++)
          l3_side.scfsi[ch][i] = 0;
        if (gfc.mode_gr == 2 && gr == 1 && l3_side.tt[0][ch].block_type != Encoder.SHORT_TYPE && l3_side.tt[1][ch].block_type != Encoder.SHORT_TYPE) {
          scfsi_calc(ch, l3_side);
          recalc = 0;
        }
        for (sfb = 0; sfb < gi.sfbmax; sfb++) {
          if (gi.scalefac[sfb] == -2) {
            gi.scalefac[sfb] = 0;
          }
        }
        if (recalc != 0) {
          if (gfc.mode_gr == 2) {
            this.scale_bitcount(gi);
          } else {
            this.scale_bitcount_lsf(gfc, gi);
          }
        }
      };
      var scale_short = [
        0,
        18,
        36,
        54,
        54,
        36,
        54,
        72,
        54,
        72,
        90,
        72,
        90,
        108,
        108,
        126
      ];
      var scale_mixed = [
        0,
        18,
        36,
        54,
        51,
        35,
        53,
        71,
        52,
        70,
        88,
        69,
        87,
        105,
        104,
        122
      ];
      var scale_long = [
        0,
        10,
        20,
        30,
        33,
        21,
        31,
        41,
        32,
        42,
        52,
        43,
        53,
        63,
        64,
        74
      ];
      this.scale_bitcount = function(cod_info) {
        var k, sfb, max_slen1 = 0, max_slen2 = 0;
        var tab;
        var scalefac = cod_info.scalefac;
        if (cod_info.block_type == Encoder.SHORT_TYPE) {
          tab = scale_short;
          if (cod_info.mixed_block_flag != 0)
            tab = scale_mixed;
        } else {
          tab = scale_long;
          if (0 == cod_info.preflag) {
            for (sfb = 11; sfb < Encoder.SBPSY_l; sfb++)
              if (scalefac[sfb] < qupvt.pretab[sfb])
                break;
            if (sfb == Encoder.SBPSY_l) {
              cod_info.preflag = 1;
              for (sfb = 11; sfb < Encoder.SBPSY_l; sfb++)
                scalefac[sfb] -= qupvt.pretab[sfb];
            }
          }
        }
        for (sfb = 0; sfb < cod_info.sfbdivide; sfb++)
          if (max_slen1 < scalefac[sfb])
            max_slen1 = scalefac[sfb];
        for (; sfb < cod_info.sfbmax; sfb++)
          if (max_slen2 < scalefac[sfb])
            max_slen2 = scalefac[sfb];
        cod_info.part2_length = QuantizePVT.LARGE_BITS;
        for (k = 0; k < 16; k++) {
          if (max_slen1 < slen1_n[k] && max_slen2 < slen2_n[k] && cod_info.part2_length > tab[k]) {
            cod_info.part2_length = tab[k];
            cod_info.scalefac_compress = k;
          }
        }
        return cod_info.part2_length == QuantizePVT.LARGE_BITS;
      };
      var max_range_sfac_tab = [
        [15, 15, 7, 7],
        [15, 15, 7, 0],
        [7, 3, 0, 0],
        [15, 31, 31, 0],
        [7, 7, 7, 0],
        [3, 3, 0, 0]
      ];
      this.scale_bitcount_lsf = function(gfc, cod_info) {
        var table_number, row_in_table, partition, nr_sfb, window2;
        var over;
        var i, sfb;
        var max_sfac = new_int(4);
        var scalefac = cod_info.scalefac;
        if (cod_info.preflag != 0)
          table_number = 2;
        else
          table_number = 0;
        for (i = 0; i < 4; i++)
          max_sfac[i] = 0;
        if (cod_info.block_type == Encoder.SHORT_TYPE) {
          row_in_table = 1;
          var partition_table = qupvt.nr_of_sfb_block[table_number][row_in_table];
          for (sfb = 0, partition = 0; partition < 4; partition++) {
            nr_sfb = partition_table[partition] / 3;
            for (i = 0; i < nr_sfb; i++, sfb++)
              for (window2 = 0; window2 < 3; window2++)
                if (scalefac[sfb * 3 + window2] > max_sfac[partition])
                  max_sfac[partition] = scalefac[sfb * 3 + window2];
          }
        } else {
          row_in_table = 0;
          var partition_table = qupvt.nr_of_sfb_block[table_number][row_in_table];
          for (sfb = 0, partition = 0; partition < 4; partition++) {
            nr_sfb = partition_table[partition];
            for (i = 0; i < nr_sfb; i++, sfb++)
              if (scalefac[sfb] > max_sfac[partition])
                max_sfac[partition] = scalefac[sfb];
          }
        }
        for (over = false, partition = 0; partition < 4; partition++) {
          if (max_sfac[partition] > max_range_sfac_tab[table_number][partition])
            over = true;
        }
        if (!over) {
          var slen1, slen2, slen3, slen4;
          cod_info.sfb_partition_table = qupvt.nr_of_sfb_block[table_number][row_in_table];
          for (partition = 0; partition < 4; partition++)
            cod_info.slen[partition] = log2tab[max_sfac[partition]];
          slen1 = cod_info.slen[0];
          slen2 = cod_info.slen[1];
          slen3 = cod_info.slen[2];
          slen4 = cod_info.slen[3];
          switch (table_number) {
            case 0:
              cod_info.scalefac_compress = (slen1 * 5 + slen2 << 4) + (slen3 << 2) + slen4;
              break;
            case 1:
              cod_info.scalefac_compress = 400 + (slen1 * 5 + slen2 << 2) + slen3;
              break;
            case 2:
              cod_info.scalefac_compress = 500 + slen1 * 3 + slen2;
              break;
          }
        }
        if (!over) {
          cod_info.part2_length = 0;
          for (partition = 0; partition < 4; partition++)
            cod_info.part2_length += cod_info.slen[partition] * cod_info.sfb_partition_table[partition];
        }
        return over;
      };
      var log2tab = [
        0,
        1,
        2,
        2,
        3,
        3,
        3,
        3,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4
      ];
      this.huffman_init = function(gfc) {
        for (var i = 2; i <= 576; i += 2) {
          var scfb_anz = 0, bv_index;
          while (gfc.scalefac_band.l[++scfb_anz] < i)
            ;
          bv_index = subdv_table[scfb_anz][0];
          while (gfc.scalefac_band.l[bv_index + 1] > i)
            bv_index--;
          if (bv_index < 0) {
            bv_index = subdv_table[scfb_anz][0];
          }
          gfc.bv_scf[i - 2] = bv_index;
          bv_index = subdv_table[scfb_anz][1];
          while (gfc.scalefac_band.l[bv_index + gfc.bv_scf[i - 2] + 2] > i)
            bv_index--;
          if (bv_index < 0) {
            bv_index = subdv_table[scfb_anz][1];
          }
          gfc.bv_scf[i - 1] = bv_index;
        }
      };
    }
    GainAnalysis.STEPS_per_dB = 100;
    GainAnalysis.MAX_dB = 120;
    GainAnalysis.GAIN_NOT_ENOUGH_SAMPLES = -24601;
    GainAnalysis.GAIN_ANALYSIS_ERROR = 0;
    GainAnalysis.GAIN_ANALYSIS_OK = 1;
    GainAnalysis.INIT_GAIN_ANALYSIS_ERROR = 0;
    GainAnalysis.INIT_GAIN_ANALYSIS_OK = 1;
    GainAnalysis.YULE_ORDER = 10;
    GainAnalysis.MAX_ORDER = GainAnalysis.YULE_ORDER;
    GainAnalysis.MAX_SAMP_FREQ = 48e3;
    GainAnalysis.RMS_WINDOW_TIME_NUMERATOR = 1;
    GainAnalysis.RMS_WINDOW_TIME_DENOMINATOR = 20;
    GainAnalysis.MAX_SAMPLES_PER_WINDOW = GainAnalysis.MAX_SAMP_FREQ * GainAnalysis.RMS_WINDOW_TIME_NUMERATOR / GainAnalysis.RMS_WINDOW_TIME_DENOMINATOR + 1;
    function GainAnalysis() {
    }
    function Presets() {
      function ABRPresets(kbps, comp, compS, joint, fix, shThreshold, shThresholdS, bass, sc, mask, lower, curve, interCh, sfScale) {
        this.quant_comp = comp;
        this.quant_comp_s = compS;
        this.safejoint = joint;
        this.nsmsfix = fix;
        this.st_lrm = shThreshold;
        this.st_s = shThresholdS;
        this.nsbass = bass;
        this.scale = sc;
        this.masking_adj = mask;
        this.ath_lower = lower;
        this.ath_curve = curve;
        this.interch = interCh;
        this.sfscale = sfScale;
      }
      var lame;
      this.setModules = function(_lame) {
        lame = _lame;
      };
      function apply_vbr_preset(gfp, a, enforce) {
        abort();
      }
      var abr_switch_map = [
        new ABRPresets(8, 9, 9, 0, 0, 6.6, 145, 0, 0.95, 0, -30, 11, 12e-4, 1),
        /*   8, impossible to use in stereo */
        new ABRPresets(16, 9, 9, 0, 0, 6.6, 145, 0, 0.95, 0, -25, 11, 1e-3, 1),
        /*  16 */
        new ABRPresets(24, 9, 9, 0, 0, 6.6, 145, 0, 0.95, 0, -20, 11, 1e-3, 1),
        /*  24 */
        new ABRPresets(32, 9, 9, 0, 0, 6.6, 145, 0, 0.95, 0, -15, 11, 1e-3, 1),
        /*  32 */
        new ABRPresets(40, 9, 9, 0, 0, 6.6, 145, 0, 0.95, 0, -10, 11, 9e-4, 1),
        /*  40 */
        new ABRPresets(48, 9, 9, 0, 0, 6.6, 145, 0, 0.95, 0, -10, 11, 9e-4, 1),
        /*  48 */
        new ABRPresets(56, 9, 9, 0, 0, 6.6, 145, 0, 0.95, 0, -6, 11, 8e-4, 1),
        /*  56 */
        new ABRPresets(64, 9, 9, 0, 0, 6.6, 145, 0, 0.95, 0, -2, 11, 8e-4, 1),
        /*  64 */
        new ABRPresets(80, 9, 9, 0, 0, 6.6, 145, 0, 0.95, 0, 0, 8, 7e-4, 1),
        /*  80 */
        new ABRPresets(96, 9, 9, 0, 2.5, 6.6, 145, 0, 0.95, 0, 1, 5.5, 6e-4, 1),
        /*  96 */
        new ABRPresets(112, 9, 9, 0, 2.25, 6.6, 145, 0, 0.95, 0, 2, 4.5, 5e-4, 1),
        /* 112 */
        new ABRPresets(128, 9, 9, 0, 1.95, 6.4, 140, 0, 0.95, 0, 3, 4, 2e-4, 1),
        /* 128 */
        new ABRPresets(160, 9, 9, 1, 1.79, 6, 135, 0, 0.95, -2, 5, 3.5, 0, 1),
        /* 160 */
        new ABRPresets(192, 9, 9, 1, 1.49, 5.6, 125, 0, 0.97, -4, 7, 3, 0, 0),
        /* 192 */
        new ABRPresets(224, 9, 9, 1, 1.25, 5.2, 125, 0, 0.98, -6, 9, 2, 0, 0),
        /* 224 */
        new ABRPresets(256, 9, 9, 1, 0.97, 5.2, 125, 0, 1, -8, 10, 1, 0, 0),
        /* 256 */
        new ABRPresets(320, 9, 9, 1, 0.9, 5.2, 125, 0, 1, -10, 12, 0, 0, 0)
        /* 320 */
      ];
      function apply_abr_preset(gfp, preset, enforce) {
        var actual_bitrate = preset;
        var r = lame.nearestBitrateFullIndex(preset);
        gfp.VBR = VbrMode.vbr_abr;
        gfp.VBR_mean_bitrate_kbps = actual_bitrate;
        gfp.VBR_mean_bitrate_kbps = Math.min(gfp.VBR_mean_bitrate_kbps, 320);
        gfp.VBR_mean_bitrate_kbps = Math.max(gfp.VBR_mean_bitrate_kbps, 8);
        gfp.brate = gfp.VBR_mean_bitrate_kbps;
        if (gfp.VBR_mean_bitrate_kbps > 320) {
          gfp.disable_reservoir = true;
        }
        if (abr_switch_map[r].safejoint > 0)
          gfp.exp_nspsytune = gfp.exp_nspsytune | 2;
        if (abr_switch_map[r].sfscale > 0) {
          gfp.internal_flags.noise_shaping = 2;
        }
        if (Math.abs(abr_switch_map[r].nsbass) > 0) {
          var k = int(abr_switch_map[r].nsbass * 4);
          if (k < 0)
            k += 64;
          gfp.exp_nspsytune = gfp.exp_nspsytune | k << 2;
        }
        if (enforce != 0)
          gfp.quant_comp = abr_switch_map[r].quant_comp;
        else if (!(Math.abs(gfp.quant_comp - -1) > 0))
          gfp.quant_comp = abr_switch_map[r].quant_comp;
        if (enforce != 0)
          gfp.quant_comp_short = abr_switch_map[r].quant_comp_s;
        else if (!(Math.abs(gfp.quant_comp_short - -1) > 0))
          gfp.quant_comp_short = abr_switch_map[r].quant_comp_s;
        if (enforce != 0)
          gfp.msfix = abr_switch_map[r].nsmsfix;
        else if (!(Math.abs(gfp.msfix - -1) > 0))
          gfp.msfix = abr_switch_map[r].nsmsfix;
        if (enforce != 0)
          gfp.internal_flags.nsPsy.attackthre = abr_switch_map[r].st_lrm;
        else if (!(Math.abs(gfp.internal_flags.nsPsy.attackthre - -1) > 0))
          gfp.internal_flags.nsPsy.attackthre = abr_switch_map[r].st_lrm;
        if (enforce != 0)
          gfp.internal_flags.nsPsy.attackthre_s = abr_switch_map[r].st_s;
        else if (!(Math.abs(gfp.internal_flags.nsPsy.attackthre_s - -1) > 0))
          gfp.internal_flags.nsPsy.attackthre_s = abr_switch_map[r].st_s;
        if (enforce != 0)
          gfp.scale = abr_switch_map[r].scale;
        else if (!(Math.abs(gfp.scale - -1) > 0))
          gfp.scale = abr_switch_map[r].scale;
        if (enforce != 0)
          gfp.maskingadjust = abr_switch_map[r].masking_adj;
        else if (!(Math.abs(gfp.maskingadjust - 0) > 0))
          gfp.maskingadjust = abr_switch_map[r].masking_adj;
        if (abr_switch_map[r].masking_adj > 0) {
          if (enforce != 0)
            gfp.maskingadjust_short = abr_switch_map[r].masking_adj * 0.9;
          else if (!(Math.abs(gfp.maskingadjust_short - 0) > 0))
            gfp.maskingadjust_short = abr_switch_map[r].masking_adj * 0.9;
        } else {
          if (enforce != 0)
            gfp.maskingadjust_short = abr_switch_map[r].masking_adj * 1.1;
          else if (!(Math.abs(gfp.maskingadjust_short - 0) > 0))
            gfp.maskingadjust_short = abr_switch_map[r].masking_adj * 1.1;
        }
        if (enforce != 0)
          gfp.ATHlower = -abr_switch_map[r].ath_lower / 10;
        else if (!(Math.abs(-gfp.ATHlower * 10 - 0) > 0))
          gfp.ATHlower = -abr_switch_map[r].ath_lower / 10;
        if (enforce != 0)
          gfp.ATHcurve = abr_switch_map[r].ath_curve;
        else if (!(Math.abs(gfp.ATHcurve - -1) > 0))
          gfp.ATHcurve = abr_switch_map[r].ath_curve;
        if (enforce != 0)
          gfp.interChRatio = abr_switch_map[r].interch;
        else if (!(Math.abs(gfp.interChRatio - -1) > 0))
          gfp.interChRatio = abr_switch_map[r].interch;
        return preset;
      }
      this.apply_preset = function(gfp, preset, enforce) {
        switch (preset) {
          case Lame.R3MIX: {
            preset = Lame.V3;
            gfp.VBR = VbrMode.vbr_mtrh;
            break;
          }
          case Lame.MEDIUM: {
            preset = Lame.V4;
            gfp.VBR = VbrMode.vbr_rh;
            break;
          }
          case Lame.MEDIUM_FAST: {
            preset = Lame.V4;
            gfp.VBR = VbrMode.vbr_mtrh;
            break;
          }
          case Lame.STANDARD: {
            preset = Lame.V2;
            gfp.VBR = VbrMode.vbr_rh;
            break;
          }
          case Lame.STANDARD_FAST: {
            preset = Lame.V2;
            gfp.VBR = VbrMode.vbr_mtrh;
            break;
          }
          case Lame.EXTREME: {
            preset = Lame.V0;
            gfp.VBR = VbrMode.vbr_rh;
            break;
          }
          case Lame.EXTREME_FAST: {
            preset = Lame.V0;
            gfp.VBR = VbrMode.vbr_mtrh;
            break;
          }
          case Lame.INSANE: {
            preset = 320;
            gfp.preset = preset;
            apply_abr_preset(gfp, preset, enforce);
            gfp.VBR = VbrMode.vbr_off;
            return preset;
          }
        }
        gfp.preset = preset;
        {
          switch (preset) {
            case Lame.V9:
              apply_vbr_preset();
              return preset;
            case Lame.V8:
              apply_vbr_preset();
              return preset;
            case Lame.V7:
              apply_vbr_preset();
              return preset;
            case Lame.V6:
              apply_vbr_preset();
              return preset;
            case Lame.V5:
              apply_vbr_preset();
              return preset;
            case Lame.V4:
              apply_vbr_preset();
              return preset;
            case Lame.V3:
              apply_vbr_preset();
              return preset;
            case Lame.V2:
              apply_vbr_preset();
              return preset;
            case Lame.V1:
              apply_vbr_preset();
              return preset;
            case Lame.V0:
              apply_vbr_preset();
              return preset;
          }
        }
        if (8 <= preset && preset <= 320) {
          return apply_abr_preset(gfp, preset, enforce);
        }
        gfp.preset = 0;
        return preset;
      };
    }
    function Reservoir() {
      var bs;
      this.setModules = function(_bs) {
        bs = _bs;
      };
      this.ResvFrameBegin = function(gfp, mean_bits) {
        var gfc = gfp.internal_flags;
        var maxmp3buf;
        var l3_side = gfc.l3_side;
        var frameLength = bs.getframebits(gfp);
        mean_bits.bits = (frameLength - gfc.sideinfo_len * 8) / gfc.mode_gr;
        var resvLimit = 8 * 256 * gfc.mode_gr - 8;
        if (gfp.brate > 320) {
          abort();
        } else {
          maxmp3buf = 8 * 1440;
          if (gfp.strict_ISO) {
            abort();
          }
        }
        gfc.ResvMax = maxmp3buf - frameLength;
        if (gfc.ResvMax > resvLimit)
          gfc.ResvMax = resvLimit;
        if (gfc.ResvMax < 0 || gfp.disable_reservoir)
          gfc.ResvMax = 0;
        var fullFrameBits = mean_bits.bits * gfc.mode_gr + Math.min(gfc.ResvSize, gfc.ResvMax);
        if (fullFrameBits > maxmp3buf)
          fullFrameBits = maxmp3buf;
        l3_side.resvDrain_pre = 0;
        if (gfc.pinfo != null) {
          abort();
        }
        return fullFrameBits;
      };
      this.ResvMaxBits = function(gfp, mean_bits, targ_bits, cbr) {
        var gfc = gfp.internal_flags;
        var add_bits;
        var ResvSize = gfc.ResvSize, ResvMax = gfc.ResvMax;
        if (cbr != 0)
          ResvSize += mean_bits;
        if ((gfc.substep_shaping & 1) != 0)
          ResvMax *= 0.9;
        targ_bits.bits = mean_bits;
        if (ResvSize * 10 > ResvMax * 9) {
          add_bits = ResvSize - ResvMax * 9 / 10;
          targ_bits.bits += add_bits;
          gfc.substep_shaping |= 128;
        } else {
          add_bits = 0;
          gfc.substep_shaping &= 127;
          if (!gfp.disable_reservoir && 0 == (gfc.substep_shaping & 1))
            targ_bits.bits -= 0.1 * mean_bits;
        }
        var extra_bits = ResvSize < gfc.ResvMax * 6 / 10 ? ResvSize : gfc.ResvMax * 6 / 10;
        extra_bits -= add_bits;
        if (extra_bits < 0)
          extra_bits = 0;
        return extra_bits;
      };
      this.ResvAdjust = function(gfc, gi) {
        gfc.ResvSize -= gi.part2_3_length + gi.part2_length;
      };
      this.ResvFrameEnd = function(gfc, mean_bits) {
        var over_bits;
        var l3_side = gfc.l3_side;
        gfc.ResvSize += mean_bits * gfc.mode_gr;
        var stuffingBits = 0;
        l3_side.resvDrain_post = 0;
        l3_side.resvDrain_pre = 0;
        if ((over_bits = gfc.ResvSize % 8) != 0)
          stuffingBits += over_bits;
        over_bits = gfc.ResvSize - stuffingBits - gfc.ResvMax;
        if (over_bits > 0) {
          stuffingBits += over_bits;
        }
        {
          var mdb_bytes = Math.min(l3_side.main_data_begin * 8, stuffingBits) / 8;
          l3_side.resvDrain_pre += 8 * mdb_bytes;
          stuffingBits -= 8 * mdb_bytes;
          gfc.ResvSize -= 8 * mdb_bytes;
          l3_side.main_data_begin -= mdb_bytes;
        }
        l3_side.resvDrain_post += stuffingBits;
        gfc.ResvSize -= stuffingBits;
      };
    }
    VBRTag.NUMTOCENTRIES = 100;
    VBRTag.MAXFRAMESIZE = 2880;
    function VBRTag() {
      this.setModules = function(_lame, _bs, _v) {
      };
      var crc16Lookup = [
        0,
        49345,
        49537,
        320,
        49921,
        960,
        640,
        49729,
        50689,
        1728,
        1920,
        51009,
        1280,
        50625,
        50305,
        1088,
        52225,
        3264,
        3456,
        52545,
        3840,
        53185,
        52865,
        3648,
        2560,
        51905,
        52097,
        2880,
        51457,
        2496,
        2176,
        51265,
        55297,
        6336,
        6528,
        55617,
        6912,
        56257,
        55937,
        6720,
        7680,
        57025,
        57217,
        8e3,
        56577,
        7616,
        7296,
        56385,
        5120,
        54465,
        54657,
        5440,
        55041,
        6080,
        5760,
        54849,
        53761,
        4800,
        4992,
        54081,
        4352,
        53697,
        53377,
        4160,
        61441,
        12480,
        12672,
        61761,
        13056,
        62401,
        62081,
        12864,
        13824,
        63169,
        63361,
        14144,
        62721,
        13760,
        13440,
        62529,
        15360,
        64705,
        64897,
        15680,
        65281,
        16320,
        16e3,
        65089,
        64001,
        15040,
        15232,
        64321,
        14592,
        63937,
        63617,
        14400,
        10240,
        59585,
        59777,
        10560,
        60161,
        11200,
        10880,
        59969,
        60929,
        11968,
        12160,
        61249,
        11520,
        60865,
        60545,
        11328,
        58369,
        9408,
        9600,
        58689,
        9984,
        59329,
        59009,
        9792,
        8704,
        58049,
        58241,
        9024,
        57601,
        8640,
        8320,
        57409,
        40961,
        24768,
        24960,
        41281,
        25344,
        41921,
        41601,
        25152,
        26112,
        42689,
        42881,
        26432,
        42241,
        26048,
        25728,
        42049,
        27648,
        44225,
        44417,
        27968,
        44801,
        28608,
        28288,
        44609,
        43521,
        27328,
        27520,
        43841,
        26880,
        43457,
        43137,
        26688,
        30720,
        47297,
        47489,
        31040,
        47873,
        31680,
        31360,
        47681,
        48641,
        32448,
        32640,
        48961,
        32e3,
        48577,
        48257,
        31808,
        46081,
        29888,
        30080,
        46401,
        30464,
        47041,
        46721,
        30272,
        29184,
        45761,
        45953,
        29504,
        45313,
        29120,
        28800,
        45121,
        20480,
        37057,
        37249,
        20800,
        37633,
        21440,
        21120,
        37441,
        38401,
        22208,
        22400,
        38721,
        21760,
        38337,
        38017,
        21568,
        39937,
        23744,
        23936,
        40257,
        24320,
        40897,
        40577,
        24128,
        23040,
        39617,
        39809,
        23360,
        39169,
        22976,
        22656,
        38977,
        34817,
        18624,
        18816,
        35137,
        19200,
        35777,
        35457,
        19008,
        19968,
        36545,
        36737,
        20288,
        36097,
        19904,
        19584,
        35905,
        17408,
        33985,
        34177,
        17728,
        34561,
        18368,
        18048,
        34369,
        33281,
        17088,
        17280,
        33601,
        16640,
        33217,
        32897,
        16448
      ];
      function crcUpdateLookup(value, crc) {
        var tmp = crc ^ value;
        crc = crc >> 8 ^ crc16Lookup[tmp & 255];
        return crc;
      }
      this.updateMusicCRC = function(crc, buffer2, bufferPos, size2) {
        for (var i = 0; i < size2; ++i)
          crc[0] = crcUpdateLookup(buffer2[bufferPos + i], crc[0]);
      };
    }
    BitStream.EQ = function(a, b) {
      return Math.abs(a) > Math.abs(b) ? Math.abs(a - b) <= Math.abs(a) * 1e-6 : Math.abs(a - b) <= Math.abs(b) * 1e-6;
    };
    BitStream.NEQ = function(a, b) {
      return !BitStream.EQ(a, b);
    };
    function BitStream() {
      var self2 = this;
      var ver = null;
      var vbr = null;
      this.setModules = function(_ga, _mpg, _ver, _vbr) {
        ver = _ver;
        vbr = _vbr;
      };
      var buf = null;
      var totbit = 0;
      var bufByteIdx = 0;
      var bufBitIdx = 0;
      this.getframebits = function(gfp) {
        var gfc = gfp.internal_flags;
        var bit_rate;
        if (gfc.bitrate_index != 0)
          bit_rate = Tables.bitrate_table[gfp.version][gfc.bitrate_index];
        else
          bit_rate = gfp.brate;
        var bytes = 0 | (gfp.version + 1) * 72e3 * bit_rate / gfp.out_samplerate + gfc.padding;
        return 8 * bytes;
      };
      function putheader_bits(gfc) {
        System.arraycopy(gfc.header[gfc.w_ptr].buf, 0, buf, bufByteIdx, gfc.sideinfo_len);
        bufByteIdx += gfc.sideinfo_len;
        totbit += gfc.sideinfo_len * 8;
        gfc.w_ptr = gfc.w_ptr + 1 & LameInternalFlags.MAX_HEADER_BUF - 1;
      }
      function putbits2(gfc, val, j) {
        while (j > 0) {
          var k;
          if (bufBitIdx == 0) {
            bufBitIdx = 8;
            bufByteIdx++;
            if (gfc.header[gfc.w_ptr].write_timing == totbit) {
              putheader_bits(gfc);
            }
            buf[bufByteIdx] = 0;
          }
          k = Math.min(j, bufBitIdx);
          j -= k;
          bufBitIdx -= k;
          buf[bufByteIdx] |= val >> j << bufBitIdx;
          totbit += k;
        }
      }
      function drain_into_ancillary(gfp, remainingBits) {
        var gfc = gfp.internal_flags;
        var i;
        if (remainingBits >= 8) {
          putbits2(gfc, 76, 8);
          remainingBits -= 8;
        }
        if (remainingBits >= 8) {
          putbits2(gfc, 65, 8);
          remainingBits -= 8;
        }
        if (remainingBits >= 8) {
          putbits2(gfc, 77, 8);
          remainingBits -= 8;
        }
        if (remainingBits >= 8) {
          putbits2(gfc, 69, 8);
          remainingBits -= 8;
        }
        if (remainingBits >= 32) {
          var version2 = ver.getLameShortVersion();
          if (remainingBits >= 32)
            for (i = 0; i < version2.length && remainingBits >= 8; ++i) {
              remainingBits -= 8;
              putbits2(gfc, version2.charCodeAt(i), 8);
            }
        }
        for (; remainingBits >= 1; remainingBits -= 1) {
          putbits2(gfc, gfc.ancillary_flag, 1);
          gfc.ancillary_flag ^= !gfp.disable_reservoir ? 1 : 0;
        }
      }
      function writeheader(gfc, val, j) {
        var ptr = gfc.header[gfc.h_ptr].ptr;
        while (j > 0) {
          var k = Math.min(j, 8 - (ptr & 7));
          j -= k;
          gfc.header[gfc.h_ptr].buf[ptr >> 3] |= val >> j << 8 - (ptr & 7) - k;
          ptr += k;
        }
        gfc.header[gfc.h_ptr].ptr = ptr;
      }
      function encodeSideInfo2(gfp, bitsPerFrame) {
        var gfc = gfp.internal_flags;
        var l3_side;
        var gr, ch;
        l3_side = gfc.l3_side;
        gfc.header[gfc.h_ptr].ptr = 0;
        Arrays.fill(gfc.header[gfc.h_ptr].buf, 0, gfc.sideinfo_len, 0);
        if (gfp.out_samplerate < 16e3)
          writeheader(gfc, 4094, 12);
        else
          writeheader(gfc, 4095, 12);
        writeheader(gfc, gfp.version, 1);
        writeheader(gfc, 4 - 3, 2);
        writeheader(gfc, !gfp.error_protection ? 1 : 0, 1);
        writeheader(gfc, gfc.bitrate_index, 4);
        writeheader(gfc, gfc.samplerate_index, 2);
        writeheader(gfc, gfc.padding, 1);
        writeheader(gfc, gfp.extension, 1);
        writeheader(gfc, gfp.mode.ordinal(), 2);
        writeheader(gfc, gfc.mode_ext, 2);
        writeheader(gfc, gfp.copyright, 1);
        writeheader(gfc, gfp.original, 1);
        writeheader(gfc, gfp.emphasis, 2);
        if (gfp.error_protection) {
          writeheader(gfc, 0, 16);
        }
        if (gfp.version == 1) {
          writeheader(gfc, l3_side.main_data_begin, 9);
          if (gfc.channels_out == 2)
            writeheader(gfc, l3_side.private_bits, 3);
          else
            writeheader(gfc, l3_side.private_bits, 5);
          for (ch = 0; ch < gfc.channels_out; ch++) {
            var band;
            for (band = 0; band < 4; band++) {
              writeheader(gfc, l3_side.scfsi[ch][band], 1);
            }
          }
          for (gr = 0; gr < 2; gr++) {
            for (ch = 0; ch < gfc.channels_out; ch++) {
              var gi = l3_side.tt[gr][ch];
              writeheader(gfc, gi.part2_3_length + gi.part2_length, 12);
              writeheader(gfc, gi.big_values / 2, 9);
              writeheader(gfc, gi.global_gain, 8);
              writeheader(gfc, gi.scalefac_compress, 4);
              if (gi.block_type != Encoder.NORM_TYPE) {
                writeheader(gfc, 1, 1);
                writeheader(gfc, gi.block_type, 2);
                writeheader(gfc, gi.mixed_block_flag, 1);
                if (gi.table_select[0] == 14)
                  gi.table_select[0] = 16;
                writeheader(gfc, gi.table_select[0], 5);
                if (gi.table_select[1] == 14)
                  gi.table_select[1] = 16;
                writeheader(gfc, gi.table_select[1], 5);
                writeheader(gfc, gi.subblock_gain[0], 3);
                writeheader(gfc, gi.subblock_gain[1], 3);
                writeheader(gfc, gi.subblock_gain[2], 3);
              } else {
                writeheader(gfc, 0, 1);
                if (gi.table_select[0] == 14)
                  gi.table_select[0] = 16;
                writeheader(gfc, gi.table_select[0], 5);
                if (gi.table_select[1] == 14)
                  gi.table_select[1] = 16;
                writeheader(gfc, gi.table_select[1], 5);
                if (gi.table_select[2] == 14)
                  gi.table_select[2] = 16;
                writeheader(gfc, gi.table_select[2], 5);
                writeheader(gfc, gi.region0_count, 4);
                writeheader(gfc, gi.region1_count, 3);
              }
              writeheader(gfc, gi.preflag, 1);
              writeheader(gfc, gi.scalefac_scale, 1);
              writeheader(gfc, gi.count1table_select, 1);
            }
          }
        } else {
          writeheader(gfc, l3_side.main_data_begin, 8);
          writeheader(gfc, l3_side.private_bits, gfc.channels_out);
          gr = 0;
          for (ch = 0; ch < gfc.channels_out; ch++) {
            var gi = l3_side.tt[gr][ch];
            writeheader(gfc, gi.part2_3_length + gi.part2_length, 12);
            writeheader(gfc, gi.big_values / 2, 9);
            writeheader(gfc, gi.global_gain, 8);
            writeheader(gfc, gi.scalefac_compress, 9);
            if (gi.block_type != Encoder.NORM_TYPE) {
              writeheader(gfc, 1, 1);
              writeheader(gfc, gi.block_type, 2);
              writeheader(gfc, gi.mixed_block_flag, 1);
              if (gi.table_select[0] == 14)
                gi.table_select[0] = 16;
              writeheader(gfc, gi.table_select[0], 5);
              if (gi.table_select[1] == 14)
                gi.table_select[1] = 16;
              writeheader(gfc, gi.table_select[1], 5);
              writeheader(gfc, gi.subblock_gain[0], 3);
              writeheader(gfc, gi.subblock_gain[1], 3);
              writeheader(gfc, gi.subblock_gain[2], 3);
            } else {
              writeheader(gfc, 0, 1);
              if (gi.table_select[0] == 14)
                gi.table_select[0] = 16;
              writeheader(gfc, gi.table_select[0], 5);
              if (gi.table_select[1] == 14)
                gi.table_select[1] = 16;
              writeheader(gfc, gi.table_select[1], 5);
              if (gi.table_select[2] == 14)
                gi.table_select[2] = 16;
              writeheader(gfc, gi.table_select[2], 5);
              writeheader(gfc, gi.region0_count, 4);
              writeheader(gfc, gi.region1_count, 3);
            }
            writeheader(gfc, gi.scalefac_scale, 1);
            writeheader(gfc, gi.count1table_select, 1);
          }
        }
        if (gfp.error_protection) {
          abort();
        }
        {
          var old = gfc.h_ptr;
          gfc.h_ptr = old + 1 & LameInternalFlags.MAX_HEADER_BUF - 1;
          gfc.header[gfc.h_ptr].write_timing = gfc.header[old].write_timing + bitsPerFrame;
          if (gfc.h_ptr == gfc.w_ptr)
            ;
        }
      }
      function huffman_coder_count1(gfc, gi) {
        var h = Tables.ht[gi.count1table_select + 32];
        var i, bits = 0;
        var ix = gi.big_values;
        var xr = gi.big_values;
        for (i = (gi.count1 - gi.big_values) / 4; i > 0; --i) {
          var huffbits = 0;
          var p = 0, v;
          v = gi.l3_enc[ix + 0];
          if (v != 0) {
            p += 8;
            if (gi.xr[xr + 0] < 0)
              huffbits++;
          }
          v = gi.l3_enc[ix + 1];
          if (v != 0) {
            p += 4;
            huffbits *= 2;
            if (gi.xr[xr + 1] < 0)
              huffbits++;
          }
          v = gi.l3_enc[ix + 2];
          if (v != 0) {
            p += 2;
            huffbits *= 2;
            if (gi.xr[xr + 2] < 0)
              huffbits++;
          }
          v = gi.l3_enc[ix + 3];
          if (v != 0) {
            p++;
            huffbits *= 2;
            if (gi.xr[xr + 3] < 0)
              huffbits++;
          }
          ix += 4;
          xr += 4;
          putbits2(gfc, huffbits + h.table[p], h.hlen[p]);
          bits += h.hlen[p];
        }
        return bits;
      }
      function Huffmancode(gfc, tableindex, start, end, gi) {
        var h = Tables.ht[tableindex];
        var bits = 0;
        if (0 == tableindex)
          return bits;
        for (var i = start; i < end; i += 2) {
          var cbits = 0;
          var xbits = 0;
          var linbits = h.xlen;
          var xlen = h.xlen;
          var ext = 0;
          var x1 = gi.l3_enc[i];
          var x2 = gi.l3_enc[i + 1];
          if (x1 != 0) {
            if (gi.xr[i] < 0)
              ext++;
            cbits--;
          }
          if (tableindex > 15) {
            if (x1 > 14) {
              var linbits_x1 = x1 - 15;
              ext |= linbits_x1 << 1;
              xbits = linbits;
              x1 = 15;
            }
            if (x2 > 14) {
              var linbits_x2 = x2 - 15;
              ext <<= linbits;
              ext |= linbits_x2;
              xbits += linbits;
              x2 = 15;
            }
            xlen = 16;
          }
          if (x2 != 0) {
            ext <<= 1;
            if (gi.xr[i + 1] < 0)
              ext++;
            cbits--;
          }
          x1 = x1 * xlen + x2;
          xbits -= cbits;
          cbits += h.hlen[x1];
          putbits2(gfc, h.table[x1], cbits);
          putbits2(gfc, ext, xbits);
          bits += cbits + xbits;
        }
        return bits;
      }
      function ShortHuffmancodebits(gfc, gi) {
        var region1Start = 3 * gfc.scalefac_band.s[3];
        if (region1Start > gi.big_values)
          region1Start = gi.big_values;
        var bits = Huffmancode(gfc, gi.table_select[0], 0, region1Start, gi);
        bits += Huffmancode(
          gfc,
          gi.table_select[1],
          region1Start,
          gi.big_values,
          gi
        );
        return bits;
      }
      function LongHuffmancodebits(gfc, gi) {
        var bigvalues, bits;
        var region1Start, region2Start;
        bigvalues = gi.big_values;
        var i = gi.region0_count + 1;
        region1Start = gfc.scalefac_band.l[i];
        i += gi.region1_count + 1;
        region2Start = gfc.scalefac_band.l[i];
        if (region1Start > bigvalues)
          region1Start = bigvalues;
        if (region2Start > bigvalues)
          region2Start = bigvalues;
        bits = Huffmancode(gfc, gi.table_select[0], 0, region1Start, gi);
        bits += Huffmancode(
          gfc,
          gi.table_select[1],
          region1Start,
          region2Start,
          gi
        );
        bits += Huffmancode(
          gfc,
          gi.table_select[2],
          region2Start,
          bigvalues,
          gi
        );
        return bits;
      }
      function writeMainData(gfp) {
        var gr, ch, sfb, data_bits, tot_bits = 0;
        var gfc = gfp.internal_flags;
        var l3_side = gfc.l3_side;
        if (gfp.version == 1) {
          for (gr = 0; gr < 2; gr++) {
            for (ch = 0; ch < gfc.channels_out; ch++) {
              var gi = l3_side.tt[gr][ch];
              var slen1 = Takehiro.slen1_tab[gi.scalefac_compress];
              var slen2 = Takehiro.slen2_tab[gi.scalefac_compress];
              data_bits = 0;
              for (sfb = 0; sfb < gi.sfbdivide; sfb++) {
                if (gi.scalefac[sfb] == -1)
                  continue;
                putbits2(gfc, gi.scalefac[sfb], slen1);
                data_bits += slen1;
              }
              for (; sfb < gi.sfbmax; sfb++) {
                if (gi.scalefac[sfb] == -1)
                  continue;
                putbits2(gfc, gi.scalefac[sfb], slen2);
                data_bits += slen2;
              }
              if (gi.block_type == Encoder.SHORT_TYPE) {
                data_bits += ShortHuffmancodebits(gfc, gi);
              } else {
                data_bits += LongHuffmancodebits(gfc, gi);
              }
              data_bits += huffman_coder_count1(gfc, gi);
              tot_bits += data_bits;
            }
          }
        } else {
          gr = 0;
          for (ch = 0; ch < gfc.channels_out; ch++) {
            var gi = l3_side.tt[gr][ch];
            var i, sfb_partition, scale_bits = 0;
            data_bits = 0;
            sfb = 0;
            sfb_partition = 0;
            if (gi.block_type == Encoder.SHORT_TYPE) {
              for (; sfb_partition < 4; sfb_partition++) {
                var sfbs = gi.sfb_partition_table[sfb_partition] / 3;
                var slen = gi.slen[sfb_partition];
                for (i = 0; i < sfbs; i++, sfb++) {
                  putbits2(
                    gfc,
                    Math.max(gi.scalefac[sfb * 3 + 0], 0),
                    slen
                  );
                  putbits2(
                    gfc,
                    Math.max(gi.scalefac[sfb * 3 + 1], 0),
                    slen
                  );
                  putbits2(
                    gfc,
                    Math.max(gi.scalefac[sfb * 3 + 2], 0),
                    slen
                  );
                  scale_bits += 3 * slen;
                }
              }
              data_bits += ShortHuffmancodebits(gfc, gi);
            } else {
              for (; sfb_partition < 4; sfb_partition++) {
                var sfbs = gi.sfb_partition_table[sfb_partition];
                var slen = gi.slen[sfb_partition];
                for (i = 0; i < sfbs; i++, sfb++) {
                  putbits2(gfc, Math.max(gi.scalefac[sfb], 0), slen);
                  scale_bits += slen;
                }
              }
              data_bits += LongHuffmancodebits(gfc, gi);
            }
            data_bits += huffman_coder_count1(gfc, gi);
            tot_bits += scale_bits + data_bits;
          }
        }
        return tot_bits;
      }
      function TotalBytes() {
        this.total = 0;
      }
      function compute_flushbits(gfp, total_bytes_output) {
        var gfc = gfp.internal_flags;
        var flushbits;
        var bitsPerFrame;
        var last_ptr;
        gfc.w_ptr;
        last_ptr = gfc.h_ptr - 1;
        if (last_ptr == -1)
          last_ptr = LameInternalFlags.MAX_HEADER_BUF - 1;
        flushbits = gfc.header[last_ptr].write_timing - totbit;
        total_bytes_output.total = flushbits;
        if (flushbits >= 0) {
          abort();
        }
        bitsPerFrame = self2.getframebits(gfp);
        flushbits += bitsPerFrame;
        total_bytes_output.total += bitsPerFrame;
        if (total_bytes_output.total % 8 != 0)
          total_bytes_output.total = 1 + total_bytes_output.total / 8;
        else
          total_bytes_output.total = total_bytes_output.total / 8;
        total_bytes_output.total += bufByteIdx + 1;
        return flushbits;
      }
      this.flush_bitstream = function(gfp) {
        var gfc = gfp.internal_flags;
        var l3_side;
        var flushbits;
        gfc.h_ptr - 1;
        l3_side = gfc.l3_side;
        if ((flushbits = compute_flushbits(gfp, new TotalBytes())) < 0)
          return;
        drain_into_ancillary(gfp, flushbits);
        gfc.ResvSize = 0;
        l3_side.main_data_begin = 0;
        if (gfc.findReplayGain) {
          abort();
        }
        if (gfc.findPeakSample) {
          abort();
        }
      };
      this.format_bitstream = function(gfp) {
        var gfc = gfp.internal_flags;
        var l3_side;
        l3_side = gfc.l3_side;
        var bitsPerFrame = this.getframebits(gfp);
        drain_into_ancillary(gfp, l3_side.resvDrain_pre);
        encodeSideInfo2(gfp, bitsPerFrame);
        var bits = 8 * gfc.sideinfo_len;
        bits += writeMainData(gfp);
        drain_into_ancillary(gfp, l3_side.resvDrain_post);
        bits += l3_side.resvDrain_post;
        l3_side.main_data_begin += (bitsPerFrame - bits) / 8;
        if (compute_flushbits(gfp, new TotalBytes()) != gfc.ResvSize)
          ;
        if (l3_side.main_data_begin * 8 != gfc.ResvSize) {
          gfc.ResvSize = l3_side.main_data_begin * 8;
        }
        if (totbit > 1e9) {
          var i;
          for (i = 0; i < LameInternalFlags.MAX_HEADER_BUF; ++i)
            gfc.header[i].write_timing -= totbit;
          totbit = 0;
        }
        return 0;
      };
      this.copy_buffer = function(gfc, buffer2, bufferPos, size2, mp3data) {
        var minimum = bufByteIdx + 1;
        if (minimum <= 0)
          return 0;
        if (size2 != 0 && minimum > size2) {
          return -1;
        }
        System.arraycopy(buf, 0, buffer2, bufferPos, minimum);
        bufByteIdx = -1;
        bufBitIdx = 0;
        if (mp3data != 0) {
          var crc = new_int(1);
          crc[0] = gfc.nMusicCRC;
          vbr.updateMusicCRC(crc, buffer2, bufferPos, minimum);
          gfc.nMusicCRC = crc[0];
          if (minimum > 0) {
            gfc.VBR_seek_table.nBytesWritten += minimum;
          }
          if (gfc.decode_on_the_fly) {
            abort();
          }
        }
        return minimum;
      };
      this.init_bit_stream_w = function(gfc) {
        buf = new_byte(Lame.LAME_MAXMP3BUFFER);
        gfc.h_ptr = gfc.w_ptr = 0;
        gfc.header[gfc.h_ptr].write_timing = 0;
        bufByteIdx = -1;
        bufBitIdx = 0;
        totbit = 0;
      };
    }
    function HuffCodeTab(len, max, tab, hl) {
      this.xlen = len;
      this.linmax = max;
      this.table = tab;
      this.hlen = hl;
    }
    var Tables = {};
    Tables.t1HB = [
      1,
      1,
      1,
      0
    ];
    Tables.t2HB = [
      1,
      2,
      1,
      3,
      1,
      1,
      3,
      2,
      0
    ];
    Tables.t3HB = [
      3,
      2,
      1,
      1,
      1,
      1,
      3,
      2,
      0
    ];
    Tables.t5HB = [
      1,
      2,
      6,
      5,
      3,
      1,
      4,
      4,
      7,
      5,
      7,
      1,
      6,
      1,
      1,
      0
    ];
    Tables.t6HB = [
      7,
      3,
      5,
      1,
      6,
      2,
      3,
      2,
      5,
      4,
      4,
      1,
      3,
      3,
      2,
      0
    ];
    Tables.t7HB = [
      1,
      2,
      10,
      19,
      16,
      10,
      3,
      3,
      7,
      10,
      5,
      3,
      11,
      4,
      13,
      17,
      8,
      4,
      12,
      11,
      18,
      15,
      11,
      2,
      7,
      6,
      9,
      14,
      3,
      1,
      6,
      4,
      5,
      3,
      2,
      0
    ];
    Tables.t8HB = [
      3,
      4,
      6,
      18,
      12,
      5,
      5,
      1,
      2,
      16,
      9,
      3,
      7,
      3,
      5,
      14,
      7,
      3,
      19,
      17,
      15,
      13,
      10,
      4,
      13,
      5,
      8,
      11,
      5,
      1,
      12,
      4,
      4,
      1,
      1,
      0
    ];
    Tables.t9HB = [
      7,
      5,
      9,
      14,
      15,
      7,
      6,
      4,
      5,
      5,
      6,
      7,
      7,
      6,
      8,
      8,
      8,
      5,
      15,
      6,
      9,
      10,
      5,
      1,
      11,
      7,
      9,
      6,
      4,
      1,
      14,
      4,
      6,
      2,
      6,
      0
    ];
    Tables.t10HB = [
      1,
      2,
      10,
      23,
      35,
      30,
      12,
      17,
      3,
      3,
      8,
      12,
      18,
      21,
      12,
      7,
      11,
      9,
      15,
      21,
      32,
      40,
      19,
      6,
      14,
      13,
      22,
      34,
      46,
      23,
      18,
      7,
      20,
      19,
      33,
      47,
      27,
      22,
      9,
      3,
      31,
      22,
      41,
      26,
      21,
      20,
      5,
      3,
      14,
      13,
      10,
      11,
      16,
      6,
      5,
      1,
      9,
      8,
      7,
      8,
      4,
      4,
      2,
      0
    ];
    Tables.t11HB = [
      3,
      4,
      10,
      24,
      34,
      33,
      21,
      15,
      5,
      3,
      4,
      10,
      32,
      17,
      11,
      10,
      11,
      7,
      13,
      18,
      30,
      31,
      20,
      5,
      25,
      11,
      19,
      59,
      27,
      18,
      12,
      5,
      35,
      33,
      31,
      58,
      30,
      16,
      7,
      5,
      28,
      26,
      32,
      19,
      17,
      15,
      8,
      14,
      14,
      12,
      9,
      13,
      14,
      9,
      4,
      1,
      11,
      4,
      6,
      6,
      6,
      3,
      2,
      0
    ];
    Tables.t12HB = [
      9,
      6,
      16,
      33,
      41,
      39,
      38,
      26,
      7,
      5,
      6,
      9,
      23,
      16,
      26,
      11,
      17,
      7,
      11,
      14,
      21,
      30,
      10,
      7,
      17,
      10,
      15,
      12,
      18,
      28,
      14,
      5,
      32,
      13,
      22,
      19,
      18,
      16,
      9,
      5,
      40,
      17,
      31,
      29,
      17,
      13,
      4,
      2,
      27,
      12,
      11,
      15,
      10,
      7,
      4,
      1,
      27,
      12,
      8,
      12,
      6,
      3,
      1,
      0
    ];
    Tables.t13HB = [
      1,
      5,
      14,
      21,
      34,
      51,
      46,
      71,
      42,
      52,
      68,
      52,
      67,
      44,
      43,
      19,
      3,
      4,
      12,
      19,
      31,
      26,
      44,
      33,
      31,
      24,
      32,
      24,
      31,
      35,
      22,
      14,
      15,
      13,
      23,
      36,
      59,
      49,
      77,
      65,
      29,
      40,
      30,
      40,
      27,
      33,
      42,
      16,
      22,
      20,
      37,
      61,
      56,
      79,
      73,
      64,
      43,
      76,
      56,
      37,
      26,
      31,
      25,
      14,
      35,
      16,
      60,
      57,
      97,
      75,
      114,
      91,
      54,
      73,
      55,
      41,
      48,
      53,
      23,
      24,
      58,
      27,
      50,
      96,
      76,
      70,
      93,
      84,
      77,
      58,
      79,
      29,
      74,
      49,
      41,
      17,
      47,
      45,
      78,
      74,
      115,
      94,
      90,
      79,
      69,
      83,
      71,
      50,
      59,
      38,
      36,
      15,
      72,
      34,
      56,
      95,
      92,
      85,
      91,
      90,
      86,
      73,
      77,
      65,
      51,
      44,
      43,
      42,
      43,
      20,
      30,
      44,
      55,
      78,
      72,
      87,
      78,
      61,
      46,
      54,
      37,
      30,
      20,
      16,
      53,
      25,
      41,
      37,
      44,
      59,
      54,
      81,
      66,
      76,
      57,
      54,
      37,
      18,
      39,
      11,
      35,
      33,
      31,
      57,
      42,
      82,
      72,
      80,
      47,
      58,
      55,
      21,
      22,
      26,
      38,
      22,
      53,
      25,
      23,
      38,
      70,
      60,
      51,
      36,
      55,
      26,
      34,
      23,
      27,
      14,
      9,
      7,
      34,
      32,
      28,
      39,
      49,
      75,
      30,
      52,
      48,
      40,
      52,
      28,
      18,
      17,
      9,
      5,
      45,
      21,
      34,
      64,
      56,
      50,
      49,
      45,
      31,
      19,
      12,
      15,
      10,
      7,
      6,
      3,
      48,
      23,
      20,
      39,
      36,
      35,
      53,
      21,
      16,
      23,
      13,
      10,
      6,
      1,
      4,
      2,
      16,
      15,
      17,
      27,
      25,
      20,
      29,
      11,
      17,
      12,
      16,
      8,
      1,
      1,
      0,
      1
    ];
    Tables.t15HB = [
      7,
      12,
      18,
      53,
      47,
      76,
      124,
      108,
      89,
      123,
      108,
      119,
      107,
      81,
      122,
      63,
      13,
      5,
      16,
      27,
      46,
      36,
      61,
      51,
      42,
      70,
      52,
      83,
      65,
      41,
      59,
      36,
      19,
      17,
      15,
      24,
      41,
      34,
      59,
      48,
      40,
      64,
      50,
      78,
      62,
      80,
      56,
      33,
      29,
      28,
      25,
      43,
      39,
      63,
      55,
      93,
      76,
      59,
      93,
      72,
      54,
      75,
      50,
      29,
      52,
      22,
      42,
      40,
      67,
      57,
      95,
      79,
      72,
      57,
      89,
      69,
      49,
      66,
      46,
      27,
      77,
      37,
      35,
      66,
      58,
      52,
      91,
      74,
      62,
      48,
      79,
      63,
      90,
      62,
      40,
      38,
      125,
      32,
      60,
      56,
      50,
      92,
      78,
      65,
      55,
      87,
      71,
      51,
      73,
      51,
      70,
      30,
      109,
      53,
      49,
      94,
      88,
      75,
      66,
      122,
      91,
      73,
      56,
      42,
      64,
      44,
      21,
      25,
      90,
      43,
      41,
      77,
      73,
      63,
      56,
      92,
      77,
      66,
      47,
      67,
      48,
      53,
      36,
      20,
      71,
      34,
      67,
      60,
      58,
      49,
      88,
      76,
      67,
      106,
      71,
      54,
      38,
      39,
      23,
      15,
      109,
      53,
      51,
      47,
      90,
      82,
      58,
      57,
      48,
      72,
      57,
      41,
      23,
      27,
      62,
      9,
      86,
      42,
      40,
      37,
      70,
      64,
      52,
      43,
      70,
      55,
      42,
      25,
      29,
      18,
      11,
      11,
      118,
      68,
      30,
      55,
      50,
      46,
      74,
      65,
      49,
      39,
      24,
      16,
      22,
      13,
      14,
      7,
      91,
      44,
      39,
      38,
      34,
      63,
      52,
      45,
      31,
      52,
      28,
      19,
      14,
      8,
      9,
      3,
      123,
      60,
      58,
      53,
      47,
      43,
      32,
      22,
      37,
      24,
      17,
      12,
      15,
      10,
      2,
      1,
      71,
      37,
      34,
      30,
      28,
      20,
      17,
      26,
      21,
      16,
      10,
      6,
      8,
      6,
      2,
      0
    ];
    Tables.t16HB = [
      1,
      5,
      14,
      44,
      74,
      63,
      110,
      93,
      172,
      149,
      138,
      242,
      225,
      195,
      376,
      17,
      3,
      4,
      12,
      20,
      35,
      62,
      53,
      47,
      83,
      75,
      68,
      119,
      201,
      107,
      207,
      9,
      15,
      13,
      23,
      38,
      67,
      58,
      103,
      90,
      161,
      72,
      127,
      117,
      110,
      209,
      206,
      16,
      45,
      21,
      39,
      69,
      64,
      114,
      99,
      87,
      158,
      140,
      252,
      212,
      199,
      387,
      365,
      26,
      75,
      36,
      68,
      65,
      115,
      101,
      179,
      164,
      155,
      264,
      246,
      226,
      395,
      382,
      362,
      9,
      66,
      30,
      59,
      56,
      102,
      185,
      173,
      265,
      142,
      253,
      232,
      400,
      388,
      378,
      445,
      16,
      111,
      54,
      52,
      100,
      184,
      178,
      160,
      133,
      257,
      244,
      228,
      217,
      385,
      366,
      715,
      10,
      98,
      48,
      91,
      88,
      165,
      157,
      148,
      261,
      248,
      407,
      397,
      372,
      380,
      889,
      884,
      8,
      85,
      84,
      81,
      159,
      156,
      143,
      260,
      249,
      427,
      401,
      392,
      383,
      727,
      713,
      708,
      7,
      154,
      76,
      73,
      141,
      131,
      256,
      245,
      426,
      406,
      394,
      384,
      735,
      359,
      710,
      352,
      11,
      139,
      129,
      67,
      125,
      247,
      233,
      229,
      219,
      393,
      743,
      737,
      720,
      885,
      882,
      439,
      4,
      243,
      120,
      118,
      115,
      227,
      223,
      396,
      746,
      742,
      736,
      721,
      712,
      706,
      223,
      436,
      6,
      202,
      224,
      222,
      218,
      216,
      389,
      386,
      381,
      364,
      888,
      443,
      707,
      440,
      437,
      1728,
      4,
      747,
      211,
      210,
      208,
      370,
      379,
      734,
      723,
      714,
      1735,
      883,
      877,
      876,
      3459,
      865,
      2,
      377,
      369,
      102,
      187,
      726,
      722,
      358,
      711,
      709,
      866,
      1734,
      871,
      3458,
      870,
      434,
      0,
      12,
      10,
      7,
      11,
      10,
      17,
      11,
      9,
      13,
      12,
      10,
      7,
      5,
      3,
      1,
      3
    ];
    Tables.t24HB = [
      15,
      13,
      46,
      80,
      146,
      262,
      248,
      434,
      426,
      669,
      653,
      649,
      621,
      517,
      1032,
      88,
      14,
      12,
      21,
      38,
      71,
      130,
      122,
      216,
      209,
      198,
      327,
      345,
      319,
      297,
      279,
      42,
      47,
      22,
      41,
      74,
      68,
      128,
      120,
      221,
      207,
      194,
      182,
      340,
      315,
      295,
      541,
      18,
      81,
      39,
      75,
      70,
      134,
      125,
      116,
      220,
      204,
      190,
      178,
      325,
      311,
      293,
      271,
      16,
      147,
      72,
      69,
      135,
      127,
      118,
      112,
      210,
      200,
      188,
      352,
      323,
      306,
      285,
      540,
      14,
      263,
      66,
      129,
      126,
      119,
      114,
      214,
      202,
      192,
      180,
      341,
      317,
      301,
      281,
      262,
      12,
      249,
      123,
      121,
      117,
      113,
      215,
      206,
      195,
      185,
      347,
      330,
      308,
      291,
      272,
      520,
      10,
      435,
      115,
      111,
      109,
      211,
      203,
      196,
      187,
      353,
      332,
      313,
      298,
      283,
      531,
      381,
      17,
      427,
      212,
      208,
      205,
      201,
      193,
      186,
      177,
      169,
      320,
      303,
      286,
      268,
      514,
      377,
      16,
      335,
      199,
      197,
      191,
      189,
      181,
      174,
      333,
      321,
      305,
      289,
      275,
      521,
      379,
      371,
      11,
      668,
      184,
      183,
      179,
      175,
      344,
      331,
      314,
      304,
      290,
      277,
      530,
      383,
      373,
      366,
      10,
      652,
      346,
      171,
      168,
      164,
      318,
      309,
      299,
      287,
      276,
      263,
      513,
      375,
      368,
      362,
      6,
      648,
      322,
      316,
      312,
      307,
      302,
      292,
      284,
      269,
      261,
      512,
      376,
      370,
      364,
      359,
      4,
      620,
      300,
      296,
      294,
      288,
      282,
      273,
      266,
      515,
      380,
      374,
      369,
      365,
      361,
      357,
      2,
      1033,
      280,
      278,
      274,
      267,
      264,
      259,
      382,
      378,
      372,
      367,
      363,
      360,
      358,
      356,
      0,
      43,
      20,
      19,
      17,
      15,
      13,
      11,
      9,
      7,
      6,
      4,
      7,
      5,
      3,
      1,
      3
    ];
    Tables.t32HB = [
      1 << 0,
      5 << 1,
      4 << 1,
      5 << 2,
      6 << 1,
      5 << 2,
      4 << 2,
      4 << 3,
      7 << 1,
      3 << 2,
      6 << 2,
      0 << 3,
      7 << 2,
      2 << 3,
      3 << 3,
      1 << 4
    ];
    Tables.t33HB = [
      15 << 0,
      14 << 1,
      13 << 1,
      12 << 2,
      11 << 1,
      10 << 2,
      9 << 2,
      8 << 3,
      7 << 1,
      6 << 2,
      5 << 2,
      4 << 3,
      3 << 2,
      2 << 3,
      1 << 3,
      0 << 4
    ];
    Tables.t1l = [
      1,
      4,
      3,
      5
    ];
    Tables.t2l = [
      1,
      4,
      7,
      4,
      5,
      7,
      6,
      7,
      8
    ];
    Tables.t3l = [
      2,
      3,
      7,
      4,
      4,
      7,
      6,
      7,
      8
    ];
    Tables.t5l = [
      1,
      4,
      7,
      8,
      4,
      5,
      8,
      9,
      7,
      8,
      9,
      10,
      8,
      8,
      9,
      10
    ];
    Tables.t6l = [
      3,
      4,
      6,
      8,
      4,
      4,
      6,
      7,
      5,
      6,
      7,
      8,
      7,
      7,
      8,
      9
    ];
    Tables.t7l = [
      1,
      4,
      7,
      9,
      9,
      10,
      4,
      6,
      8,
      9,
      9,
      10,
      7,
      7,
      9,
      10,
      10,
      11,
      8,
      9,
      10,
      11,
      11,
      11,
      8,
      9,
      10,
      11,
      11,
      12,
      9,
      10,
      11,
      12,
      12,
      12
    ];
    Tables.t8l = [
      2,
      4,
      7,
      9,
      9,
      10,
      4,
      4,
      6,
      10,
      10,
      10,
      7,
      6,
      8,
      10,
      10,
      11,
      9,
      10,
      10,
      11,
      11,
      12,
      9,
      9,
      10,
      11,
      12,
      12,
      10,
      10,
      11,
      11,
      13,
      13
    ];
    Tables.t9l = [
      3,
      4,
      6,
      7,
      9,
      10,
      4,
      5,
      6,
      7,
      8,
      10,
      5,
      6,
      7,
      8,
      9,
      10,
      7,
      7,
      8,
      9,
      9,
      10,
      8,
      8,
      9,
      9,
      10,
      11,
      9,
      9,
      10,
      10,
      11,
      11
    ];
    Tables.t10l = [
      1,
      4,
      7,
      9,
      10,
      10,
      10,
      11,
      4,
      6,
      8,
      9,
      10,
      11,
      10,
      10,
      7,
      8,
      9,
      10,
      11,
      12,
      11,
      11,
      8,
      9,
      10,
      11,
      12,
      12,
      11,
      12,
      9,
      10,
      11,
      12,
      12,
      12,
      12,
      12,
      10,
      11,
      12,
      12,
      13,
      13,
      12,
      13,
      9,
      10,
      11,
      12,
      12,
      12,
      13,
      13,
      10,
      10,
      11,
      12,
      12,
      13,
      13,
      13
    ];
    Tables.t11l = [
      2,
      4,
      6,
      8,
      9,
      10,
      9,
      10,
      4,
      5,
      6,
      8,
      10,
      10,
      9,
      10,
      6,
      7,
      8,
      9,
      10,
      11,
      10,
      10,
      8,
      8,
      9,
      11,
      10,
      12,
      10,
      11,
      9,
      10,
      10,
      11,
      11,
      12,
      11,
      12,
      9,
      10,
      11,
      12,
      12,
      13,
      12,
      13,
      9,
      9,
      9,
      10,
      11,
      12,
      12,
      12,
      9,
      9,
      10,
      11,
      12,
      12,
      12,
      12
    ];
    Tables.t12l = [
      4,
      4,
      6,
      8,
      9,
      10,
      10,
      10,
      4,
      5,
      6,
      7,
      9,
      9,
      10,
      10,
      6,
      6,
      7,
      8,
      9,
      10,
      9,
      10,
      7,
      7,
      8,
      8,
      9,
      10,
      10,
      10,
      8,
      8,
      9,
      9,
      10,
      10,
      10,
      11,
      9,
      9,
      10,
      10,
      10,
      11,
      10,
      11,
      9,
      9,
      9,
      10,
      10,
      11,
      11,
      12,
      10,
      10,
      10,
      11,
      11,
      11,
      11,
      12
    ];
    Tables.t13l = [
      1,
      5,
      7,
      8,
      9,
      10,
      10,
      11,
      10,
      11,
      12,
      12,
      13,
      13,
      14,
      14,
      4,
      6,
      8,
      9,
      10,
      10,
      11,
      11,
      11,
      11,
      12,
      12,
      13,
      14,
      14,
      14,
      7,
      8,
      9,
      10,
      11,
      11,
      12,
      12,
      11,
      12,
      12,
      13,
      13,
      14,
      15,
      15,
      8,
      9,
      10,
      11,
      11,
      12,
      12,
      12,
      12,
      13,
      13,
      13,
      13,
      14,
      15,
      15,
      9,
      9,
      11,
      11,
      12,
      12,
      13,
      13,
      12,
      13,
      13,
      14,
      14,
      15,
      15,
      16,
      10,
      10,
      11,
      12,
      12,
      12,
      13,
      13,
      13,
      13,
      14,
      13,
      15,
      15,
      16,
      16,
      10,
      11,
      12,
      12,
      13,
      13,
      13,
      13,
      13,
      14,
      14,
      14,
      15,
      15,
      16,
      16,
      11,
      11,
      12,
      13,
      13,
      13,
      14,
      14,
      14,
      14,
      15,
      15,
      15,
      16,
      18,
      18,
      10,
      10,
      11,
      12,
      12,
      13,
      13,
      14,
      14,
      14,
      14,
      15,
      15,
      16,
      17,
      17,
      11,
      11,
      12,
      12,
      13,
      13,
      13,
      15,
      14,
      15,
      15,
      16,
      16,
      16,
      18,
      17,
      11,
      12,
      12,
      13,
      13,
      14,
      14,
      15,
      14,
      15,
      16,
      15,
      16,
      17,
      18,
      19,
      12,
      12,
      12,
      13,
      14,
      14,
      14,
      14,
      15,
      15,
      15,
      16,
      17,
      17,
      17,
      18,
      12,
      13,
      13,
      14,
      14,
      15,
      14,
      15,
      16,
      16,
      17,
      17,
      17,
      18,
      18,
      18,
      13,
      13,
      14,
      15,
      15,
      15,
      16,
      16,
      16,
      16,
      16,
      17,
      18,
      17,
      18,
      18,
      14,
      14,
      14,
      15,
      15,
      15,
      17,
      16,
      16,
      19,
      17,
      17,
      17,
      19,
      18,
      18,
      13,
      14,
      15,
      16,
      16,
      16,
      17,
      16,
      17,
      17,
      18,
      18,
      21,
      20,
      21,
      18
    ];
    Tables.t15l = [
      3,
      5,
      6,
      8,
      8,
      9,
      10,
      10,
      10,
      11,
      11,
      12,
      12,
      12,
      13,
      14,
      5,
      5,
      7,
      8,
      9,
      9,
      10,
      10,
      10,
      11,
      11,
      12,
      12,
      12,
      13,
      13,
      6,
      7,
      7,
      8,
      9,
      9,
      10,
      10,
      10,
      11,
      11,
      12,
      12,
      13,
      13,
      13,
      7,
      8,
      8,
      9,
      9,
      10,
      10,
      11,
      11,
      11,
      12,
      12,
      12,
      13,
      13,
      13,
      8,
      8,
      9,
      9,
      10,
      10,
      11,
      11,
      11,
      11,
      12,
      12,
      12,
      13,
      13,
      13,
      9,
      9,
      9,
      10,
      10,
      10,
      11,
      11,
      11,
      11,
      12,
      12,
      13,
      13,
      13,
      14,
      10,
      9,
      10,
      10,
      10,
      11,
      11,
      11,
      11,
      12,
      12,
      12,
      13,
      13,
      14,
      14,
      10,
      10,
      10,
      11,
      11,
      11,
      11,
      12,
      12,
      12,
      12,
      12,
      13,
      13,
      13,
      14,
      10,
      10,
      10,
      11,
      11,
      11,
      11,
      12,
      12,
      12,
      12,
      13,
      13,
      14,
      14,
      14,
      10,
      10,
      11,
      11,
      11,
      11,
      12,
      12,
      12,
      13,
      13,
      13,
      13,
      14,
      14,
      14,
      11,
      11,
      11,
      11,
      12,
      12,
      12,
      12,
      12,
      13,
      13,
      13,
      13,
      14,
      15,
      14,
      11,
      11,
      11,
      11,
      12,
      12,
      12,
      12,
      13,
      13,
      13,
      13,
      14,
      14,
      14,
      15,
      12,
      12,
      11,
      12,
      12,
      12,
      13,
      13,
      13,
      13,
      13,
      13,
      14,
      14,
      15,
      15,
      12,
      12,
      12,
      12,
      12,
      13,
      13,
      13,
      13,
      14,
      14,
      14,
      14,
      14,
      15,
      15,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      14,
      14,
      14,
      14,
      15,
      15,
      14,
      15,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      14,
      14,
      14,
      14,
      14,
      15,
      15,
      15,
      15
    ];
    Tables.t16_5l = [
      1,
      5,
      7,
      9,
      10,
      10,
      11,
      11,
      12,
      12,
      12,
      13,
      13,
      13,
      14,
      11,
      4,
      6,
      8,
      9,
      10,
      11,
      11,
      11,
      12,
      12,
      12,
      13,
      14,
      13,
      14,
      11,
      7,
      8,
      9,
      10,
      11,
      11,
      12,
      12,
      13,
      12,
      13,
      13,
      13,
      14,
      14,
      12,
      9,
      9,
      10,
      11,
      11,
      12,
      12,
      12,
      13,
      13,
      14,
      14,
      14,
      15,
      15,
      13,
      10,
      10,
      11,
      11,
      12,
      12,
      13,
      13,
      13,
      14,
      14,
      14,
      15,
      15,
      15,
      12,
      10,
      10,
      11,
      11,
      12,
      13,
      13,
      14,
      13,
      14,
      14,
      15,
      15,
      15,
      16,
      13,
      11,
      11,
      11,
      12,
      13,
      13,
      13,
      13,
      14,
      14,
      14,
      14,
      15,
      15,
      16,
      13,
      11,
      11,
      12,
      12,
      13,
      13,
      13,
      14,
      14,
      15,
      15,
      15,
      15,
      17,
      17,
      13,
      11,
      12,
      12,
      13,
      13,
      13,
      14,
      14,
      15,
      15,
      15,
      15,
      16,
      16,
      16,
      13,
      12,
      12,
      12,
      13,
      13,
      14,
      14,
      15,
      15,
      15,
      15,
      16,
      15,
      16,
      15,
      14,
      12,
      13,
      12,
      13,
      14,
      14,
      14,
      14,
      15,
      16,
      16,
      16,
      17,
      17,
      16,
      13,
      13,
      13,
      13,
      13,
      14,
      14,
      15,
      16,
      16,
      16,
      16,
      16,
      16,
      15,
      16,
      14,
      13,
      14,
      14,
      14,
      14,
      15,
      15,
      15,
      15,
      17,
      16,
      16,
      16,
      16,
      18,
      14,
      15,
      14,
      14,
      14,
      15,
      15,
      16,
      16,
      16,
      18,
      17,
      17,
      17,
      19,
      17,
      14,
      14,
      15,
      13,
      14,
      16,
      16,
      15,
      16,
      16,
      17,
      18,
      17,
      19,
      17,
      16,
      14,
      11,
      11,
      11,
      12,
      12,
      13,
      13,
      13,
      14,
      14,
      14,
      14,
      14,
      14,
      14,
      12
    ];
    Tables.t16l = [
      1,
      5,
      7,
      9,
      10,
      10,
      11,
      11,
      12,
      12,
      12,
      13,
      13,
      13,
      14,
      10,
      4,
      6,
      8,
      9,
      10,
      11,
      11,
      11,
      12,
      12,
      12,
      13,
      14,
      13,
      14,
      10,
      7,
      8,
      9,
      10,
      11,
      11,
      12,
      12,
      13,
      12,
      13,
      13,
      13,
      14,
      14,
      11,
      9,
      9,
      10,
      11,
      11,
      12,
      12,
      12,
      13,
      13,
      14,
      14,
      14,
      15,
      15,
      12,
      10,
      10,
      11,
      11,
      12,
      12,
      13,
      13,
      13,
      14,
      14,
      14,
      15,
      15,
      15,
      11,
      10,
      10,
      11,
      11,
      12,
      13,
      13,
      14,
      13,
      14,
      14,
      15,
      15,
      15,
      16,
      12,
      11,
      11,
      11,
      12,
      13,
      13,
      13,
      13,
      14,
      14,
      14,
      14,
      15,
      15,
      16,
      12,
      11,
      11,
      12,
      12,
      13,
      13,
      13,
      14,
      14,
      15,
      15,
      15,
      15,
      17,
      17,
      12,
      11,
      12,
      12,
      13,
      13,
      13,
      14,
      14,
      15,
      15,
      15,
      15,
      16,
      16,
      16,
      12,
      12,
      12,
      12,
      13,
      13,
      14,
      14,
      15,
      15,
      15,
      15,
      16,
      15,
      16,
      15,
      13,
      12,
      13,
      12,
      13,
      14,
      14,
      14,
      14,
      15,
      16,
      16,
      16,
      17,
      17,
      16,
      12,
      13,
      13,
      13,
      13,
      14,
      14,
      15,
      16,
      16,
      16,
      16,
      16,
      16,
      15,
      16,
      13,
      13,
      14,
      14,
      14,
      14,
      15,
      15,
      15,
      15,
      17,
      16,
      16,
      16,
      16,
      18,
      13,
      15,
      14,
      14,
      14,
      15,
      15,
      16,
      16,
      16,
      18,
      17,
      17,
      17,
      19,
      17,
      13,
      14,
      15,
      13,
      14,
      16,
      16,
      15,
      16,
      16,
      17,
      18,
      17,
      19,
      17,
      16,
      13,
      10,
      10,
      10,
      11,
      11,
      12,
      12,
      12,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      10
    ];
    Tables.t24l = [
      4,
      5,
      7,
      8,
      9,
      10,
      10,
      11,
      11,
      12,
      12,
      12,
      12,
      12,
      13,
      10,
      5,
      6,
      7,
      8,
      9,
      10,
      10,
      11,
      11,
      11,
      12,
      12,
      12,
      12,
      12,
      10,
      7,
      7,
      8,
      9,
      9,
      10,
      10,
      11,
      11,
      11,
      11,
      12,
      12,
      12,
      13,
      9,
      8,
      8,
      9,
      9,
      10,
      10,
      10,
      11,
      11,
      11,
      11,
      12,
      12,
      12,
      12,
      9,
      9,
      9,
      9,
      10,
      10,
      10,
      10,
      11,
      11,
      11,
      12,
      12,
      12,
      12,
      13,
      9,
      10,
      9,
      10,
      10,
      10,
      10,
      11,
      11,
      11,
      11,
      12,
      12,
      12,
      12,
      12,
      9,
      10,
      10,
      10,
      10,
      10,
      11,
      11,
      11,
      11,
      12,
      12,
      12,
      12,
      12,
      13,
      9,
      11,
      10,
      10,
      10,
      11,
      11,
      11,
      11,
      12,
      12,
      12,
      12,
      12,
      13,
      13,
      10,
      11,
      11,
      11,
      11,
      11,
      11,
      11,
      11,
      11,
      12,
      12,
      12,
      12,
      13,
      13,
      10,
      11,
      11,
      11,
      11,
      11,
      11,
      11,
      12,
      12,
      12,
      12,
      12,
      13,
      13,
      13,
      10,
      12,
      11,
      11,
      11,
      11,
      12,
      12,
      12,
      12,
      12,
      12,
      13,
      13,
      13,
      13,
      10,
      12,
      12,
      11,
      11,
      11,
      12,
      12,
      12,
      12,
      12,
      12,
      13,
      13,
      13,
      13,
      10,
      12,
      12,
      12,
      12,
      12,
      12,
      12,
      12,
      12,
      12,
      13,
      13,
      13,
      13,
      13,
      10,
      12,
      12,
      12,
      12,
      12,
      12,
      12,
      12,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      10,
      13,
      12,
      12,
      12,
      12,
      12,
      12,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      13,
      10,
      9,
      9,
      9,
      9,
      9,
      9,
      9,
      9,
      9,
      9,
      9,
      10,
      10,
      10,
      10,
      6
    ];
    Tables.t32l = [
      1 + 0,
      4 + 1,
      4 + 1,
      5 + 2,
      4 + 1,
      6 + 2,
      5 + 2,
      6 + 3,
      4 + 1,
      5 + 2,
      5 + 2,
      6 + 3,
      5 + 2,
      6 + 3,
      6 + 3,
      6 + 4
    ];
    Tables.t33l = [
      4 + 0,
      4 + 1,
      4 + 1,
      4 + 2,
      4 + 1,
      4 + 2,
      4 + 2,
      4 + 3,
      4 + 1,
      4 + 2,
      4 + 2,
      4 + 3,
      4 + 2,
      4 + 3,
      4 + 3,
      4 + 4
    ];
    Tables.ht = [
      /* xlen, linmax, table, hlen */
      new HuffCodeTab(0, 0, null, null),
      new HuffCodeTab(2, 0, Tables.t1HB, Tables.t1l),
      new HuffCodeTab(3, 0, Tables.t2HB, Tables.t2l),
      new HuffCodeTab(3, 0, Tables.t3HB, Tables.t3l),
      new HuffCodeTab(0, 0, null, null),
      /* Apparently not used */
      new HuffCodeTab(4, 0, Tables.t5HB, Tables.t5l),
      new HuffCodeTab(4, 0, Tables.t6HB, Tables.t6l),
      new HuffCodeTab(6, 0, Tables.t7HB, Tables.t7l),
      new HuffCodeTab(6, 0, Tables.t8HB, Tables.t8l),
      new HuffCodeTab(6, 0, Tables.t9HB, Tables.t9l),
      new HuffCodeTab(8, 0, Tables.t10HB, Tables.t10l),
      new HuffCodeTab(8, 0, Tables.t11HB, Tables.t11l),
      new HuffCodeTab(8, 0, Tables.t12HB, Tables.t12l),
      new HuffCodeTab(16, 0, Tables.t13HB, Tables.t13l),
      new HuffCodeTab(0, 0, null, Tables.t16_5l),
      /* Apparently not used */
      new HuffCodeTab(16, 0, Tables.t15HB, Tables.t15l),
      new HuffCodeTab(1, 1, Tables.t16HB, Tables.t16l),
      new HuffCodeTab(2, 3, Tables.t16HB, Tables.t16l),
      new HuffCodeTab(3, 7, Tables.t16HB, Tables.t16l),
      new HuffCodeTab(4, 15, Tables.t16HB, Tables.t16l),
      new HuffCodeTab(6, 63, Tables.t16HB, Tables.t16l),
      new HuffCodeTab(8, 255, Tables.t16HB, Tables.t16l),
      new HuffCodeTab(10, 1023, Tables.t16HB, Tables.t16l),
      new HuffCodeTab(13, 8191, Tables.t16HB, Tables.t16l),
      new HuffCodeTab(4, 15, Tables.t24HB, Tables.t24l),
      new HuffCodeTab(5, 31, Tables.t24HB, Tables.t24l),
      new HuffCodeTab(6, 63, Tables.t24HB, Tables.t24l),
      new HuffCodeTab(7, 127, Tables.t24HB, Tables.t24l),
      new HuffCodeTab(8, 255, Tables.t24HB, Tables.t24l),
      new HuffCodeTab(9, 511, Tables.t24HB, Tables.t24l),
      new HuffCodeTab(11, 2047, Tables.t24HB, Tables.t24l),
      new HuffCodeTab(13, 8191, Tables.t24HB, Tables.t24l),
      new HuffCodeTab(0, 0, Tables.t32HB, Tables.t32l),
      new HuffCodeTab(0, 0, Tables.t33HB, Tables.t33l)
    ];
    Tables.largetbl = [
      65540,
      327685,
      458759,
      589832,
      655369,
      655370,
      720906,
      720907,
      786443,
      786444,
      786444,
      851980,
      851980,
      851980,
      917517,
      655370,
      262149,
      393222,
      524295,
      589832,
      655369,
      720906,
      720906,
      720907,
      786443,
      786443,
      786444,
      851980,
      917516,
      851980,
      917516,
      655370,
      458759,
      524295,
      589832,
      655369,
      720905,
      720906,
      786442,
      786443,
      851979,
      786443,
      851979,
      851980,
      851980,
      917516,
      917517,
      720905,
      589832,
      589832,
      655369,
      720905,
      720906,
      786442,
      786442,
      786443,
      851979,
      851979,
      917515,
      917516,
      917516,
      983052,
      983052,
      786441,
      655369,
      655369,
      720905,
      720906,
      786442,
      786442,
      851978,
      851979,
      851979,
      917515,
      917516,
      917516,
      983052,
      983052,
      983053,
      720905,
      655370,
      655369,
      720906,
      720906,
      786442,
      851978,
      851979,
      917515,
      851979,
      917515,
      917516,
      983052,
      983052,
      983052,
      1048588,
      786441,
      720906,
      720906,
      720906,
      786442,
      851978,
      851979,
      851979,
      851979,
      917515,
      917516,
      917516,
      917516,
      983052,
      983052,
      1048589,
      786441,
      720907,
      720906,
      786442,
      786442,
      851979,
      851979,
      851979,
      917515,
      917516,
      983052,
      983052,
      983052,
      983052,
      1114125,
      1114125,
      786442,
      720907,
      786443,
      786443,
      851979,
      851979,
      851979,
      917515,
      917515,
      983051,
      983052,
      983052,
      983052,
      1048588,
      1048589,
      1048589,
      786442,
      786443,
      786443,
      786443,
      851979,
      851979,
      917515,
      917515,
      983052,
      983052,
      983052,
      983052,
      1048588,
      983053,
      1048589,
      983053,
      851978,
      786444,
      851979,
      786443,
      851979,
      917515,
      917516,
      917516,
      917516,
      983052,
      1048588,
      1048588,
      1048589,
      1114125,
      1114125,
      1048589,
      786442,
      851980,
      851980,
      851979,
      851979,
      917515,
      917516,
      983052,
      1048588,
      1048588,
      1048588,
      1048588,
      1048589,
      1048589,
      983053,
      1048589,
      851978,
      851980,
      917516,
      917516,
      917516,
      917516,
      983052,
      983052,
      983052,
      983052,
      1114124,
      1048589,
      1048589,
      1048589,
      1048589,
      1179661,
      851978,
      983052,
      917516,
      917516,
      917516,
      983052,
      983052,
      1048588,
      1048588,
      1048589,
      1179661,
      1114125,
      1114125,
      1114125,
      1245197,
      1114125,
      851978,
      917517,
      983052,
      851980,
      917516,
      1048588,
      1048588,
      983052,
      1048589,
      1048589,
      1114125,
      1179661,
      1114125,
      1245197,
      1114125,
      1048589,
      851978,
      655369,
      655369,
      655369,
      720905,
      720905,
      786441,
      786441,
      786441,
      851977,
      851977,
      851977,
      851978,
      851978,
      851978,
      851978,
      655366
    ];
    Tables.table23 = [
      65538,
      262147,
      458759,
      262148,
      327684,
      458759,
      393222,
      458759,
      524296
    ];
    Tables.table56 = [
      65539,
      262148,
      458758,
      524296,
      262148,
      327684,
      524294,
      589831,
      458757,
      524294,
      589831,
      655368,
      524295,
      524295,
      589832,
      655369
    ];
    Tables.bitrate_table = [
      [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, -1],
      /* MPEG 2 */
      [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, -1],
      /* MPEG 1 */
      [0, 8, 16, 24, 32, 40, 48, 56, 64, -1, -1, -1, -1, -1, -1, -1]
      /* MPEG 2.5 */
    ];
    Tables.samplerate_table = [
      [22050, 24e3, 16e3, -1],
      [44100, 48e3, 32e3, -1],
      [11025, 12e3, 8e3, -1]
    ];
    Tables.scfsi_band = [0, 6, 11, 16, 21];
    function MeanBits(meanBits) {
      this.bits = meanBits;
    }
    function CalcNoiseResult() {
      this.over_noise = 0;
      this.tot_noise = 0;
      this.max_noise = 0;
      this.over_count = 0;
      this.over_SSD = 0;
      this.bits = 0;
    }
    function VBRQuantize() {
      this.setModules = function(_qupvt, _tk) {
      };
    }
    function ATH() {
      this.useAdjust = 0;
      this.aaSensitivityP = 0;
      this.adjust = 0;
      this.adjustLimit = 0;
      this.decay = 0;
      this.floor = 0;
      this.l = new_float(Encoder.SBMAX_l);
      this.s = new_float(Encoder.SBMAX_s);
      this.psfb21 = new_float(Encoder.PSFB21);
      this.psfb12 = new_float(Encoder.PSFB12);
      this.cb_l = new_float(Encoder.CBANDS);
      this.cb_s = new_float(Encoder.CBANDS);
      this.eql_w = new_float(Encoder.BLKSIZE / 2);
    }
    function LameGlobalFlags() {
      this.class_id = 0;
      this.num_samples = 0;
      this.num_channels = 0;
      this.in_samplerate = 0;
      this.out_samplerate = 0;
      this.scale = 0;
      this.scale_left = 0;
      this.scale_right = 0;
      this.analysis = false;
      this.bWriteVbrTag = false;
      this.decode_only = false;
      this.quality = 0;
      this.mode = MPEGMode.STEREO;
      this.force_ms = false;
      this.free_format = false;
      this.findReplayGain = false;
      this.decode_on_the_fly = false;
      this.write_id3tag_automatic = false;
      this.brate = 0;
      this.compression_ratio = 0;
      this.copyright = 0;
      this.original = 0;
      this.extension = 0;
      this.emphasis = 0;
      this.error_protection = 0;
      this.strict_ISO = false;
      this.disable_reservoir = false;
      this.quant_comp = 0;
      this.quant_comp_short = 0;
      this.experimentalY = false;
      this.experimentalZ = 0;
      this.exp_nspsytune = 0;
      this.preset = 0;
      this.VBR = null;
      this.VBR_q_frac = 0;
      this.VBR_q = 0;
      this.VBR_mean_bitrate_kbps = 0;
      this.VBR_min_bitrate_kbps = 0;
      this.VBR_max_bitrate_kbps = 0;
      this.VBR_hard_min = 0;
      this.lowpassfreq = 0;
      this.highpassfreq = 0;
      this.lowpasswidth = 0;
      this.highpasswidth = 0;
      this.maskingadjust = 0;
      this.maskingadjust_short = 0;
      this.ATHonly = false;
      this.ATHshort = false;
      this.noATH = false;
      this.ATHtype = 0;
      this.ATHcurve = 0;
      this.ATHlower = 0;
      this.athaa_type = 0;
      this.athaa_loudapprox = 0;
      this.athaa_sensitivity = 0;
      this.short_blocks = null;
      this.useTemporal = false;
      this.interChRatio = 0;
      this.msfix = 0;
      this.tune = false;
      this.tune_value_a = 0;
      this.version = 0;
      this.encoder_delay = 0;
      this.encoder_padding = 0;
      this.framesize = 0;
      this.frameNum = 0;
      this.lame_allocated_gfp = 0;
      this.internal_flags = null;
    }
    function CBRNewIterationLoop(_quantize) {
      var quantize = _quantize;
      this.quantize = quantize;
      this.iteration_loop = function(gfp, pe, ms_ener_ratio, ratio) {
        var gfc = gfp.internal_flags;
        var l3_xmin = new_float(L3Side.SFBMAX);
        var xrpow = new_float(576);
        var targ_bits = new_int(2);
        var mean_bits = 0;
        var l3_side = gfc.l3_side;
        var mb = new MeanBits(mean_bits);
        this.quantize.rv.ResvFrameBegin(gfp, mb);
        mean_bits = mb.bits;
        for (var gr = 0; gr < gfc.mode_gr; gr++) {
          this.quantize.qupvt.on_pe(
            gfp,
            pe,
            targ_bits,
            mean_bits,
            gr,
            gr
          );
          if (gfc.mode_ext == Encoder.MPG_MD_MS_LR) {
            abort();
          }
          for (var ch = 0; ch < gfc.channels_out; ch++) {
            var adjust, masking_lower_db;
            var cod_info = l3_side.tt[gr][ch];
            if (cod_info.block_type != Encoder.SHORT_TYPE) {
              adjust = 0;
              masking_lower_db = gfc.PSY.mask_adjust - adjust;
            } else {
              adjust = 0;
              masking_lower_db = gfc.PSY.mask_adjust_short - adjust;
            }
            gfc.masking_lower = Math.pow(
              10,
              masking_lower_db * 0.1
            );
            this.quantize.init_outer_loop(gfc, cod_info);
            if (this.quantize.init_xrpow(gfc, cod_info, xrpow)) {
              this.quantize.qupvt.calc_xmin(
                gfp,
                ratio[gr][ch],
                cod_info,
                l3_xmin
              );
              this.quantize.outer_loop(
                gfp,
                cod_info,
                l3_xmin,
                xrpow,
                ch,
                targ_bits[ch]
              );
            }
            this.quantize.iteration_finish_one(gfc, gr, ch);
          }
        }
        this.quantize.rv.ResvFrameEnd(gfc, mean_bits);
      };
    }
    function ReplayGain() {
    }
    function ScaleFac(arrL, arrS, arr21, arr12) {
      this.l = new_int(1 + Encoder.SBMAX_l);
      this.s = new_int(1 + Encoder.SBMAX_s);
      this.psfb21 = new_int(1 + Encoder.PSFB21);
      this.psfb12 = new_int(1 + Encoder.PSFB12);
      var l = this.l;
      var s = this.s;
      if (arguments.length == 4) {
        this.arrL = arguments[0];
        this.arrS = arguments[1];
        this.arr21 = arguments[2];
        this.arr12 = arguments[3];
        System.arraycopy(this.arrL, 0, l, 0, Math.min(this.arrL.length, this.l.length));
        System.arraycopy(this.arrS, 0, s, 0, Math.min(this.arrS.length, this.s.length));
        System.arraycopy(this.arr21, 0, this.psfb21, 0, Math.min(this.arr21.length, this.psfb21.length));
        System.arraycopy(this.arr12, 0, this.psfb12, 0, Math.min(this.arr12.length, this.psfb12.length));
      }
    }
    QuantizePVT.Q_MAX = 256 + 1;
    QuantizePVT.Q_MAX2 = 116;
    QuantizePVT.LARGE_BITS = 1e5;
    QuantizePVT.IXMAX_VAL = 8206;
    function QuantizePVT() {
      var tak = null;
      var rv = null;
      var psy = null;
      this.setModules = function(_tk, _rv, _psy) {
        tak = _tk;
        rv = _rv;
        psy = _psy;
      };
      function POW20(x) {
        return pow20[x + QuantizePVT.Q_MAX2];
      }
      this.IPOW20 = function(x) {
        return ipow20[x];
      };
      var DBL_EPSILON = 2220446049250313e-31;
      var IXMAX_VAL = QuantizePVT.IXMAX_VAL;
      var PRECALC_SIZE = IXMAX_VAL + 2;
      var Q_MAX = QuantizePVT.Q_MAX;
      var Q_MAX2 = QuantizePVT.Q_MAX2;
      var NSATHSCALE = 100;
      this.nr_of_sfb_block = [
        [[6, 5, 5, 5], [9, 9, 9, 9], [6, 9, 9, 9]],
        [[6, 5, 7, 3], [9, 9, 12, 6], [6, 9, 12, 6]],
        [[11, 10, 0, 0], [18, 18, 0, 0], [15, 18, 0, 0]],
        [[7, 7, 7, 0], [12, 12, 12, 0], [6, 15, 12, 0]],
        [[6, 6, 6, 3], [12, 9, 9, 6], [6, 12, 9, 6]],
        [[8, 8, 5, 0], [15, 12, 9, 0], [6, 18, 9, 0]]
      ];
      var pretab = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        2,
        2,
        3,
        3,
        3,
        2,
        0
      ];
      this.pretab = pretab;
      this.sfBandIndex = [
        // Table B.2.b: 22.05 kHz
        new ScaleFac(
          [
            0,
            6,
            12,
            18,
            24,
            30,
            36,
            44,
            54,
            66,
            80,
            96,
            116,
            140,
            168,
            200,
            238,
            284,
            336,
            396,
            464,
            522,
            576
          ],
          [0, 4, 8, 12, 18, 24, 32, 42, 56, 74, 100, 132, 174, 192],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0]
          //  sfb12 pseudo sub bands
        ),
        /* Table B.2.c: 24 kHz */
        /* docs: 332. mpg123(broken): 330 */
        new ScaleFac(
          [
            0,
            6,
            12,
            18,
            24,
            30,
            36,
            44,
            54,
            66,
            80,
            96,
            114,
            136,
            162,
            194,
            232,
            278,
            332,
            394,
            464,
            540,
            576
          ],
          [0, 4, 8, 12, 18, 26, 36, 48, 62, 80, 104, 136, 180, 192],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0]
          /*  sfb12 pseudo sub bands */
        ),
        /* Table B.2.a: 16 kHz */
        new ScaleFac(
          [
            0,
            6,
            12,
            18,
            24,
            30,
            36,
            44,
            54,
            66,
            80,
            96,
            116,
            140,
            168,
            200,
            238,
            284,
            336,
            396,
            464,
            522,
            576
          ],
          [0, 4, 8, 12, 18, 26, 36, 48, 62, 80, 104, 134, 174, 192],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0]
          /*  sfb12 pseudo sub bands */
        ),
        /* Table B.8.b: 44.1 kHz */
        new ScaleFac(
          [
            0,
            4,
            8,
            12,
            16,
            20,
            24,
            30,
            36,
            44,
            52,
            62,
            74,
            90,
            110,
            134,
            162,
            196,
            238,
            288,
            342,
            418,
            576
          ],
          [0, 4, 8, 12, 16, 22, 30, 40, 52, 66, 84, 106, 136, 192],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0]
          /*  sfb12 pseudo sub bands */
        ),
        /* Table B.8.c: 48 kHz */
        new ScaleFac(
          [
            0,
            4,
            8,
            12,
            16,
            20,
            24,
            30,
            36,
            42,
            50,
            60,
            72,
            88,
            106,
            128,
            156,
            190,
            230,
            276,
            330,
            384,
            576
          ],
          [0, 4, 8, 12, 16, 22, 28, 38, 50, 64, 80, 100, 126, 192],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0]
          /*  sfb12 pseudo sub bands */
        ),
        /* Table B.8.a: 32 kHz */
        new ScaleFac(
          [
            0,
            4,
            8,
            12,
            16,
            20,
            24,
            30,
            36,
            44,
            54,
            66,
            82,
            102,
            126,
            156,
            194,
            240,
            296,
            364,
            448,
            550,
            576
          ],
          [0, 4, 8, 12, 16, 22, 30, 42, 58, 78, 104, 138, 180, 192],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0]
          /*  sfb12 pseudo sub bands */
        ),
        /* MPEG-2.5 11.025 kHz */
        new ScaleFac(
          [
            0,
            6,
            12,
            18,
            24,
            30,
            36,
            44,
            54,
            66,
            80,
            96,
            116,
            140,
            168,
            200,
            238,
            284,
            336,
            396,
            464,
            522,
            576
          ],
          [
            0 / 3,
            12 / 3,
            24 / 3,
            36 / 3,
            54 / 3,
            78 / 3,
            108 / 3,
            144 / 3,
            186 / 3,
            240 / 3,
            312 / 3,
            402 / 3,
            522 / 3,
            576 / 3
          ],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0]
          /*  sfb12 pseudo sub bands */
        ),
        /* MPEG-2.5 12 kHz */
        new ScaleFac(
          [
            0,
            6,
            12,
            18,
            24,
            30,
            36,
            44,
            54,
            66,
            80,
            96,
            116,
            140,
            168,
            200,
            238,
            284,
            336,
            396,
            464,
            522,
            576
          ],
          [
            0 / 3,
            12 / 3,
            24 / 3,
            36 / 3,
            54 / 3,
            78 / 3,
            108 / 3,
            144 / 3,
            186 / 3,
            240 / 3,
            312 / 3,
            402 / 3,
            522 / 3,
            576 / 3
          ],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0]
          /*  sfb12 pseudo sub bands */
        ),
        /* MPEG-2.5 8 kHz */
        new ScaleFac(
          [
            0,
            12,
            24,
            36,
            48,
            60,
            72,
            88,
            108,
            132,
            160,
            192,
            232,
            280,
            336,
            400,
            476,
            566,
            568,
            570,
            572,
            574,
            576
          ],
          [
            0 / 3,
            24 / 3,
            48 / 3,
            72 / 3,
            108 / 3,
            156 / 3,
            216 / 3,
            288 / 3,
            372 / 3,
            480 / 3,
            486 / 3,
            492 / 3,
            498 / 3,
            576 / 3
          ],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0]
          /*  sfb12 pseudo sub bands */
        )
      ];
      var pow20 = new_float(Q_MAX + Q_MAX2 + 1);
      var ipow20 = new_float(Q_MAX);
      var pow43 = new_float(PRECALC_SIZE);
      var adj43 = new_float(PRECALC_SIZE);
      this.adj43 = adj43;
      function ATHmdct(gfp, f2) {
        var ath = psy.ATHformula(f2, gfp);
        ath -= NSATHSCALE;
        ath = Math.pow(10, ath / 10 + gfp.ATHlower);
        return ath;
      }
      function compute_ath(gfp) {
        var ATH_l = gfp.internal_flags.ATH.l;
        var ATH_psfb21 = gfp.internal_flags.ATH.psfb21;
        var ATH_s = gfp.internal_flags.ATH.s;
        var ATH_psfb12 = gfp.internal_flags.ATH.psfb12;
        var gfc = gfp.internal_flags;
        var samp_freq = gfp.out_samplerate;
        for (var sfb = 0; sfb < Encoder.SBMAX_l; sfb++) {
          var start = gfc.scalefac_band.l[sfb];
          var end = gfc.scalefac_band.l[sfb + 1];
          ATH_l[sfb] = Float.MAX_VALUE;
          for (var i = start; i < end; i++) {
            var freq = i * samp_freq / (2 * 576);
            var ATH_f = ATHmdct(gfp, freq);
            ATH_l[sfb] = Math.min(ATH_l[sfb], ATH_f);
          }
        }
        for (var sfb = 0; sfb < Encoder.PSFB21; sfb++) {
          var start = gfc.scalefac_band.psfb21[sfb];
          var end = gfc.scalefac_band.psfb21[sfb + 1];
          ATH_psfb21[sfb] = Float.MAX_VALUE;
          for (var i = start; i < end; i++) {
            var freq = i * samp_freq / (2 * 576);
            var ATH_f = ATHmdct(gfp, freq);
            ATH_psfb21[sfb] = Math.min(ATH_psfb21[sfb], ATH_f);
          }
        }
        for (var sfb = 0; sfb < Encoder.SBMAX_s; sfb++) {
          var start = gfc.scalefac_band.s[sfb];
          var end = gfc.scalefac_band.s[sfb + 1];
          ATH_s[sfb] = Float.MAX_VALUE;
          for (var i = start; i < end; i++) {
            var freq = i * samp_freq / (2 * 192);
            var ATH_f = ATHmdct(gfp, freq);
            ATH_s[sfb] = Math.min(ATH_s[sfb], ATH_f);
          }
          ATH_s[sfb] *= gfc.scalefac_band.s[sfb + 1] - gfc.scalefac_band.s[sfb];
        }
        for (var sfb = 0; sfb < Encoder.PSFB12; sfb++) {
          var start = gfc.scalefac_band.psfb12[sfb];
          var end = gfc.scalefac_band.psfb12[sfb + 1];
          ATH_psfb12[sfb] = Float.MAX_VALUE;
          for (var i = start; i < end; i++) {
            var freq = i * samp_freq / (2 * 192);
            var ATH_f = ATHmdct(gfp, freq);
            ATH_psfb12[sfb] = Math.min(ATH_psfb12[sfb], ATH_f);
          }
          ATH_psfb12[sfb] *= gfc.scalefac_band.s[13] - gfc.scalefac_band.s[12];
        }
        if (gfp.noATH) {
          abort();
        }
        gfc.ATH.floor = 10 * Math_log10(ATHmdct(gfp, -1));
      }
      this.iteration_init = function(gfp) {
        var gfc = gfp.internal_flags;
        var l3_side = gfc.l3_side;
        var i;
        if (gfc.iteration_init_init == 0) {
          gfc.iteration_init_init = 1;
          l3_side.main_data_begin = 0;
          compute_ath(gfp);
          pow43[0] = 0;
          for (i = 1; i < PRECALC_SIZE; i++)
            pow43[i] = Math.pow(i, 4 / 3);
          for (i = 0; i < PRECALC_SIZE - 1; i++)
            adj43[i] = i + 1 - Math.pow(
              0.5 * (pow43[i] + pow43[i + 1]),
              0.75
            );
          adj43[i] = 0.5;
          for (i = 0; i < Q_MAX; i++)
            ipow20[i] = Math.pow(2, (i - 210) * -0.1875);
          for (i = 0; i <= Q_MAX + Q_MAX2; i++)
            pow20[i] = Math.pow(2, (i - 210 - Q_MAX2) * 0.25);
          tak.huffman_init(gfc);
          {
            var bass, alto, treble, sfb21;
            i = gfp.exp_nspsytune >> 2 & 63;
            if (i >= 32)
              i -= 64;
            bass = Math.pow(10, i / 4 / 10);
            i = gfp.exp_nspsytune >> 8 & 63;
            if (i >= 32)
              i -= 64;
            alto = Math.pow(10, i / 4 / 10);
            i = gfp.exp_nspsytune >> 14 & 63;
            if (i >= 32)
              i -= 64;
            treble = Math.pow(10, i / 4 / 10);
            i = gfp.exp_nspsytune >> 20 & 63;
            if (i >= 32)
              i -= 64;
            sfb21 = treble * Math.pow(10, i / 4 / 10);
            for (i = 0; i < Encoder.SBMAX_l; i++) {
              var f2;
              if (i <= 6)
                f2 = bass;
              else if (i <= 13)
                f2 = alto;
              else if (i <= 20)
                f2 = treble;
              else
                f2 = sfb21;
              gfc.nsPsy.longfact[i] = f2;
            }
            for (i = 0; i < Encoder.SBMAX_s; i++) {
              var f2;
              if (i <= 5)
                f2 = bass;
              else if (i <= 10)
                f2 = alto;
              else if (i <= 11)
                f2 = treble;
              else
                f2 = sfb21;
              gfc.nsPsy.shortfact[i] = f2;
            }
          }
        }
      };
      this.on_pe = function(gfp, pe, targ_bits, mean_bits, gr, cbr) {
        var gfc = gfp.internal_flags;
        var tbits = 0, bits;
        var add_bits = new_int(2);
        var ch;
        var mb = new MeanBits(tbits);
        var extra_bits = rv.ResvMaxBits(gfp, mean_bits, mb, cbr);
        tbits = mb.bits;
        var max_bits = tbits + extra_bits;
        if (max_bits > LameInternalFlags.MAX_BITS_PER_GRANULE) {
          max_bits = LameInternalFlags.MAX_BITS_PER_GRANULE;
        }
        for (bits = 0, ch = 0; ch < gfc.channels_out; ++ch) {
          targ_bits[ch] = Math.min(
            LameInternalFlags.MAX_BITS_PER_CHANNEL,
            tbits / gfc.channels_out
          );
          add_bits[ch] = 0 | targ_bits[ch] * pe[gr][ch] / 700 - targ_bits[ch];
          if (add_bits[ch] > mean_bits * 3 / 4)
            add_bits[ch] = mean_bits * 3 / 4;
          if (add_bits[ch] < 0)
            add_bits[ch] = 0;
          if (add_bits[ch] + targ_bits[ch] > LameInternalFlags.MAX_BITS_PER_CHANNEL)
            add_bits[ch] = Math.max(
              0,
              LameInternalFlags.MAX_BITS_PER_CHANNEL - targ_bits[ch]
            );
          bits += add_bits[ch];
        }
        if (bits > extra_bits) {
          for (ch = 0; ch < gfc.channels_out; ++ch) {
            add_bits[ch] = extra_bits * add_bits[ch] / bits;
          }
        }
        for (ch = 0; ch < gfc.channels_out; ++ch) {
          targ_bits[ch] += add_bits[ch];
          extra_bits -= add_bits[ch];
        }
        for (bits = 0, ch = 0; ch < gfc.channels_out; ++ch) {
          bits += targ_bits[ch];
        }
        if (bits > LameInternalFlags.MAX_BITS_PER_GRANULE) {
          abort();
        }
        return max_bits;
      };
      this.athAdjust = function(a, x, athFloor) {
        var o2 = 90.30873362;
        var p = 94.82444863;
        var u = Util.FAST_LOG10_X(x, 10);
        var v = a * a;
        var w = 0;
        u -= athFloor;
        if (v > 1e-20)
          w = 1 + Util.FAST_LOG10_X(v, 10 / o2);
        if (w < 0)
          w = 0;
        u *= w;
        u += athFloor + o2 - p;
        return Math.pow(10, 0.1 * u);
      };
      this.calc_xmin = function(gfp, ratio, cod_info, pxmin) {
        var pxminPos = 0;
        var gfc = gfp.internal_flags;
        var gsfb, j = 0, ath_over = 0;
        var ATH2 = gfc.ATH;
        var xr = cod_info.xr;
        var enable_athaa_fix = gfp.VBR == VbrMode.vbr_mtrh ? 1 : 0;
        var masking_lower = gfc.masking_lower;
        if (gfp.VBR == VbrMode.vbr_mtrh || gfp.VBR == VbrMode.vbr_mt) {
          masking_lower = 1;
        }
        for (gsfb = 0; gsfb < cod_info.psy_lmax; gsfb++) {
          var en0, xmin;
          var rh1, rh2;
          var width, l;
          if (gfp.VBR == VbrMode.vbr_rh || gfp.VBR == VbrMode.vbr_mtrh)
            xmin = athAdjust(ATH2.adjust, ATH2.l[gsfb], ATH2.floor);
          else
            xmin = ATH2.adjust * ATH2.l[gsfb];
          width = cod_info.width[gsfb];
          rh1 = xmin / width;
          rh2 = DBL_EPSILON;
          l = width >> 1;
          en0 = 0;
          do {
            var xa, xb;
            xa = xr[j] * xr[j];
            en0 += xa;
            rh2 += xa < rh1 ? xa : rh1;
            j++;
            xb = xr[j] * xr[j];
            en0 += xb;
            rh2 += xb < rh1 ? xb : rh1;
            j++;
          } while (--l > 0);
          if (en0 > xmin)
            ath_over++;
          if (gsfb == Encoder.SBPSY_l) {
            abort();
          }
          if (enable_athaa_fix != 0) {
            xmin = rh2;
          }
          if (!gfp.ATHonly) {
            var e2 = ratio.en.l[gsfb];
            if (e2 > 0) {
              var x;
              x = en0 * ratio.thm.l[gsfb] * masking_lower / e2;
              if (enable_athaa_fix != 0)
                x *= gfc.nsPsy.longfact[gsfb];
              if (xmin < x)
                xmin = x;
            }
          }
          if (enable_athaa_fix != 0)
            pxmin[pxminPos++] = xmin;
          else
            pxmin[pxminPos++] = xmin * gfc.nsPsy.longfact[gsfb];
        }
        var max_nonzero = 575;
        if (cod_info.block_type != Encoder.SHORT_TYPE) {
          var k = 576;
          while (k-- != 0 && BitStream.EQ(xr[k], 0)) {
            max_nonzero = k;
          }
        }
        cod_info.max_nonzero_coeff = max_nonzero;
        for (var sfb = cod_info.sfb_smin; gsfb < cod_info.psymax; sfb++, gsfb += 3) {
          var width, b;
          var tmpATH;
          if (gfp.VBR == VbrMode.vbr_rh || gfp.VBR == VbrMode.vbr_mtrh)
            tmpATH = athAdjust(ATH2.adjust, ATH2.s[sfb], ATH2.floor);
          else
            tmpATH = ATH2.adjust * ATH2.s[sfb];
          width = cod_info.width[gsfb];
          for (b = 0; b < 3; b++) {
            var en0 = 0, xmin;
            var rh1, rh2;
            var l = width >> 1;
            rh1 = tmpATH / width;
            rh2 = DBL_EPSILON;
            do {
              var xa, xb;
              xa = xr[j] * xr[j];
              en0 += xa;
              rh2 += xa < rh1 ? xa : rh1;
              j++;
              xb = xr[j] * xr[j];
              en0 += xb;
              rh2 += xb < rh1 ? xb : rh1;
              j++;
            } while (--l > 0);
            if (en0 > tmpATH)
              ath_over++;
            if (sfb == Encoder.SBPSY_s) {
              abort();
            }
            if (enable_athaa_fix != 0)
              xmin = rh2;
            else
              xmin = tmpATH;
            if (!gfp.ATHonly && !gfp.ATHshort) {
              var e2 = ratio.en.s[sfb][b];
              if (e2 > 0) {
                var x;
                x = en0 * ratio.thm.s[sfb][b] * masking_lower / e2;
                if (enable_athaa_fix != 0)
                  x *= gfc.nsPsy.shortfact[sfb];
                if (xmin < x)
                  xmin = x;
              }
            }
            if (enable_athaa_fix != 0)
              pxmin[pxminPos++] = xmin;
            else
              pxmin[pxminPos++] = xmin * gfc.nsPsy.shortfact[sfb];
          }
          if (gfp.useTemporal) {
            if (pxmin[pxminPos - 3] > pxmin[pxminPos - 3 + 1])
              pxmin[pxminPos - 3 + 1] += (pxmin[pxminPos - 3] - pxmin[pxminPos - 3 + 1]) * gfc.decay;
            if (pxmin[pxminPos - 3 + 1] > pxmin[pxminPos - 3 + 2])
              pxmin[pxminPos - 3 + 2] += (pxmin[pxminPos - 3 + 1] - pxmin[pxminPos - 3 + 2]) * gfc.decay;
          }
        }
        return ath_over;
      };
      function StartLine(j) {
        this.s = j;
      }
      this.calc_noise_core = function(cod_info, startline, l, step) {
        var noise = 0;
        var j = startline.s;
        var ix = cod_info.l3_enc;
        if (j > cod_info.count1) {
          while (l-- != 0) {
            var temp;
            temp = cod_info.xr[j];
            j++;
            noise += temp * temp;
            temp = cod_info.xr[j];
            j++;
            noise += temp * temp;
          }
        } else if (j > cod_info.big_values) {
          var ix01 = new_float(2);
          ix01[0] = 0;
          ix01[1] = step;
          while (l-- != 0) {
            var temp;
            temp = Math.abs(cod_info.xr[j]) - ix01[ix[j]];
            j++;
            noise += temp * temp;
            temp = Math.abs(cod_info.xr[j]) - ix01[ix[j]];
            j++;
            noise += temp * temp;
          }
        } else {
          while (l-- != 0) {
            var temp;
            temp = Math.abs(cod_info.xr[j]) - pow43[ix[j]] * step;
            j++;
            noise += temp * temp;
            temp = Math.abs(cod_info.xr[j]) - pow43[ix[j]] * step;
            j++;
            noise += temp * temp;
          }
        }
        startline.s = j;
        return noise;
      };
      this.calc_noise = function(cod_info, l3_xmin, distort, res, prev_noise) {
        var distortPos = 0;
        var l3_xminPos = 0;
        var sfb, l, over = 0;
        var over_noise_db = 0;
        var tot_noise_db = 0;
        var max_noise = -20;
        var j = 0;
        var scalefac = cod_info.scalefac;
        var scalefacPos = 0;
        res.over_SSD = 0;
        for (sfb = 0; sfb < cod_info.psymax; sfb++) {
          var s = cod_info.global_gain - (scalefac[scalefacPos++] + (cod_info.preflag != 0 ? pretab[sfb] : 0) << cod_info.scalefac_scale + 1) - cod_info.subblock_gain[cod_info.window[sfb]] * 8;
          var noise = 0;
          if (prev_noise != null && prev_noise.step[sfb] == s) {
            noise = prev_noise.noise[sfb];
            j += cod_info.width[sfb];
            distort[distortPos++] = noise / l3_xmin[l3_xminPos++];
            noise = prev_noise.noise_log[sfb];
          } else {
            var step = POW20(s);
            l = cod_info.width[sfb] >> 1;
            if (j + cod_info.width[sfb] > cod_info.max_nonzero_coeff) {
              var usefullsize;
              usefullsize = cod_info.max_nonzero_coeff - j + 1;
              if (usefullsize > 0)
                l = usefullsize >> 1;
              else
                l = 0;
            }
            var sl = new StartLine(j);
            noise = this.calc_noise_core(cod_info, sl, l, step);
            j = sl.s;
            if (prev_noise != null) {
              prev_noise.step[sfb] = s;
              prev_noise.noise[sfb] = noise;
            }
            noise = distort[distortPos++] = noise / l3_xmin[l3_xminPos++];
            noise = Util.FAST_LOG10(Math.max(noise, 1e-20));
            if (prev_noise != null) {
              prev_noise.noise_log[sfb] = noise;
            }
          }
          if (prev_noise != null) {
            prev_noise.global_gain = cod_info.global_gain;
          }
          tot_noise_db += noise;
          if (noise > 0) {
            var tmp;
            tmp = Math.max(0 | noise * 10 + 0.5, 1);
            res.over_SSD += tmp * tmp;
            over++;
            over_noise_db += noise;
          }
          max_noise = Math.max(max_noise, noise);
        }
        res.over_count = over;
        res.tot_noise = tot_noise_db;
        res.over_noise = over_noise_db;
        res.max_noise = max_noise;
        return over;
      };
    }
    function CalcNoiseData() {
      this.global_gain = 0;
      this.sfb_count1 = 0;
      this.step = new_int(39);
      this.noise = new_float(39);
      this.noise_log = new_float(39);
    }
    function GrInfo() {
      this.xr = new_float(576);
      this.l3_enc = new_int(576);
      this.scalefac = new_int(L3Side.SFBMAX);
      this.xrpow_max = 0;
      this.part2_3_length = 0;
      this.big_values = 0;
      this.count1 = 0;
      this.global_gain = 0;
      this.scalefac_compress = 0;
      this.block_type = 0;
      this.mixed_block_flag = 0;
      this.table_select = new_int(3);
      this.subblock_gain = new_int(3 + 1);
      this.region0_count = 0;
      this.region1_count = 0;
      this.preflag = 0;
      this.scalefac_scale = 0;
      this.count1table_select = 0;
      this.part2_length = 0;
      this.sfb_lmax = 0;
      this.sfb_smin = 0;
      this.psy_lmax = 0;
      this.sfbmax = 0;
      this.psymax = 0;
      this.sfbdivide = 0;
      this.width = new_int(L3Side.SFBMAX);
      this.window = new_int(L3Side.SFBMAX);
      this.count1bits = 0;
      this.sfb_partition_table = null;
      this.slen = new_int(4);
      this.max_nonzero_coeff = 0;
      var self2 = this;
      function clone_int(array) {
        return new Int32Array(array);
      }
      function clone_float(array) {
        return new Float32Array(array);
      }
      this.assign = function(other) {
        self2.xr = clone_float(other.xr);
        self2.l3_enc = clone_int(other.l3_enc);
        self2.scalefac = clone_int(other.scalefac);
        self2.xrpow_max = other.xrpow_max;
        self2.part2_3_length = other.part2_3_length;
        self2.big_values = other.big_values;
        self2.count1 = other.count1;
        self2.global_gain = other.global_gain;
        self2.scalefac_compress = other.scalefac_compress;
        self2.block_type = other.block_type;
        self2.mixed_block_flag = other.mixed_block_flag;
        self2.table_select = clone_int(other.table_select);
        self2.subblock_gain = clone_int(other.subblock_gain);
        self2.region0_count = other.region0_count;
        self2.region1_count = other.region1_count;
        self2.preflag = other.preflag;
        self2.scalefac_scale = other.scalefac_scale;
        self2.count1table_select = other.count1table_select;
        self2.part2_length = other.part2_length;
        self2.sfb_lmax = other.sfb_lmax;
        self2.sfb_smin = other.sfb_smin;
        self2.psy_lmax = other.psy_lmax;
        self2.sfbmax = other.sfbmax;
        self2.psymax = other.psymax;
        self2.sfbdivide = other.sfbdivide;
        self2.width = clone_int(other.width);
        self2.window = clone_int(other.window);
        self2.count1bits = other.count1bits;
        self2.sfb_partition_table = other.sfb_partition_table.slice(0);
        self2.slen = clone_int(other.slen);
        self2.max_nonzero_coeff = other.max_nonzero_coeff;
      };
    }
    var L3Side = {};
    L3Side.SFBMAX = Encoder.SBMAX_s * 3;
    function Quantize() {
      this.rv = null;
      var rv;
      this.qupvt = null;
      var qupvt;
      var vbr = new VBRQuantize();
      var tk;
      this.setModules = function(_bs, _rv, _qupvt, _tk) {
        rv = _rv;
        this.rv = _rv;
        qupvt = _qupvt;
        this.qupvt = _qupvt;
        tk = _tk;
        vbr.setModules(qupvt, tk);
      };
      function init_xrpow_core(cod_info, xrpow, upper, sum) {
        sum = 0;
        for (var i = 0; i <= upper; ++i) {
          var tmp = Math.abs(cod_info.xr[i]);
          sum += tmp;
          xrpow[i] = Math.sqrt(tmp * Math.sqrt(tmp));
          if (xrpow[i] > cod_info.xrpow_max)
            cod_info.xrpow_max = xrpow[i];
        }
        return sum;
      }
      this.init_xrpow = function(gfc, cod_info, xrpow) {
        var sum = 0;
        var upper = 0 | cod_info.max_nonzero_coeff;
        cod_info.xrpow_max = 0;
        Arrays.fill(xrpow, upper, 576, 0);
        sum = init_xrpow_core(cod_info, xrpow, upper, sum);
        if (sum > 1e-20) {
          var j = 0;
          if ((gfc.substep_shaping & 2) != 0)
            j = 1;
          for (var i = 0; i < cod_info.psymax; i++)
            gfc.pseudohalf[i] = j;
          return true;
        }
        Arrays.fill(cod_info.l3_enc, 0, 576, 0);
        return false;
      };
      function psfb21_analogsilence(gfc, cod_info) {
        var ath = gfc.ATH;
        var xr = cod_info.xr;
        if (cod_info.block_type != Encoder.SHORT_TYPE) {
          var stop = false;
          for (var gsfb = Encoder.PSFB21 - 1; gsfb >= 0 && !stop; gsfb--) {
            var start = gfc.scalefac_band.psfb21[gsfb];
            var end = gfc.scalefac_band.psfb21[gsfb + 1];
            var ath21 = qupvt.athAdjust(
              ath.adjust,
              ath.psfb21[gsfb],
              ath.floor
            );
            if (gfc.nsPsy.longfact[21] > 1e-12)
              ath21 *= gfc.nsPsy.longfact[21];
            for (var j = end - 1; j >= start; j--) {
              if (Math.abs(xr[j]) < ath21)
                xr[j] = 0;
              else {
                stop = true;
                break;
              }
            }
          }
        } else {
          for (var block = 0; block < 3; block++) {
            var stop = false;
            for (var gsfb = Encoder.PSFB12 - 1; gsfb >= 0 && !stop; gsfb--) {
              var start = gfc.scalefac_band.s[12] * 3 + (gfc.scalefac_band.s[13] - gfc.scalefac_band.s[12]) * block + (gfc.scalefac_band.psfb12[gsfb] - gfc.scalefac_band.psfb12[0]);
              var end = start + (gfc.scalefac_band.psfb12[gsfb + 1] - gfc.scalefac_band.psfb12[gsfb]);
              var ath12 = qupvt.athAdjust(
                ath.adjust,
                ath.psfb12[gsfb],
                ath.floor
              );
              if (gfc.nsPsy.shortfact[12] > 1e-12)
                ath12 *= gfc.nsPsy.shortfact[12];
              for (var j = end - 1; j >= start; j--) {
                if (Math.abs(xr[j]) < ath12)
                  xr[j] = 0;
                else {
                  stop = true;
                  break;
                }
              }
            }
          }
        }
      }
      this.init_outer_loop = function(gfc, cod_info) {
        cod_info.part2_3_length = 0;
        cod_info.big_values = 0;
        cod_info.count1 = 0;
        cod_info.global_gain = 210;
        cod_info.scalefac_compress = 0;
        cod_info.table_select[0] = 0;
        cod_info.table_select[1] = 0;
        cod_info.table_select[2] = 0;
        cod_info.subblock_gain[0] = 0;
        cod_info.subblock_gain[1] = 0;
        cod_info.subblock_gain[2] = 0;
        cod_info.subblock_gain[3] = 0;
        cod_info.region0_count = 0;
        cod_info.region1_count = 0;
        cod_info.preflag = 0;
        cod_info.scalefac_scale = 0;
        cod_info.count1table_select = 0;
        cod_info.part2_length = 0;
        cod_info.sfb_lmax = Encoder.SBPSY_l;
        cod_info.sfb_smin = Encoder.SBPSY_s;
        cod_info.psy_lmax = gfc.sfb21_extra ? Encoder.SBMAX_l : Encoder.SBPSY_l;
        cod_info.psymax = cod_info.psy_lmax;
        cod_info.sfbmax = cod_info.sfb_lmax;
        cod_info.sfbdivide = 11;
        for (var sfb = 0; sfb < Encoder.SBMAX_l; sfb++) {
          cod_info.width[sfb] = gfc.scalefac_band.l[sfb + 1] - gfc.scalefac_band.l[sfb];
          cod_info.window[sfb] = 3;
        }
        if (cod_info.block_type == Encoder.SHORT_TYPE) {
          var ixwork = new_float(576);
          cod_info.sfb_smin = 0;
          cod_info.sfb_lmax = 0;
          if (cod_info.mixed_block_flag != 0) {
            abort();
          }
          cod_info.psymax = cod_info.sfb_lmax + 3 * ((gfc.sfb21_extra ? Encoder.SBMAX_s : Encoder.SBPSY_s) - cod_info.sfb_smin);
          cod_info.sfbmax = cod_info.sfb_lmax + 3 * (Encoder.SBPSY_s - cod_info.sfb_smin);
          cod_info.sfbdivide = cod_info.sfbmax - 18;
          cod_info.psy_lmax = cod_info.sfb_lmax;
          var ix = gfc.scalefac_band.l[cod_info.sfb_lmax];
          System.arraycopy(cod_info.xr, 0, ixwork, 0, 576);
          for (var sfb = cod_info.sfb_smin; sfb < Encoder.SBMAX_s; sfb++) {
            var start = gfc.scalefac_band.s[sfb];
            var end = gfc.scalefac_band.s[sfb + 1];
            for (var window2 = 0; window2 < 3; window2++) {
              for (var l = start; l < end; l++) {
                cod_info.xr[ix++] = ixwork[3 * l + window2];
              }
            }
          }
          var j = cod_info.sfb_lmax;
          for (var sfb = cod_info.sfb_smin; sfb < Encoder.SBMAX_s; sfb++) {
            cod_info.width[j] = cod_info.width[j + 1] = cod_info.width[j + 2] = gfc.scalefac_band.s[sfb + 1] - gfc.scalefac_band.s[sfb];
            cod_info.window[j] = 0;
            cod_info.window[j + 1] = 1;
            cod_info.window[j + 2] = 2;
            j += 3;
          }
        }
        cod_info.count1bits = 0;
        cod_info.sfb_partition_table = qupvt.nr_of_sfb_block[0][0];
        cod_info.slen[0] = 0;
        cod_info.slen[1] = 0;
        cod_info.slen[2] = 0;
        cod_info.slen[3] = 0;
        cod_info.max_nonzero_coeff = 575;
        Arrays.fill(cod_info.scalefac, 0);
        psfb21_analogsilence(gfc, cod_info);
      };
      function BinSearchDirection(ordinal) {
        this.ordinal = ordinal;
      }
      BinSearchDirection.BINSEARCH_NONE = new BinSearchDirection(0);
      BinSearchDirection.BINSEARCH_UP = new BinSearchDirection(1);
      BinSearchDirection.BINSEARCH_DOWN = new BinSearchDirection(2);
      function bin_search_StepSize(gfc, cod_info, desired_rate, ch, xrpow) {
        var nBits;
        var CurrentStep = gfc.CurrentStep[ch];
        var flagGoneOver = false;
        var start = gfc.OldValue[ch];
        var Direction = BinSearchDirection.BINSEARCH_NONE;
        cod_info.global_gain = start;
        desired_rate -= cod_info.part2_length;
        for (; ; ) {
          var step;
          nBits = tk.count_bits(gfc, xrpow, cod_info, null);
          if (CurrentStep == 1 || nBits == desired_rate)
            break;
          if (nBits > desired_rate) {
            if (Direction == BinSearchDirection.BINSEARCH_DOWN)
              flagGoneOver = true;
            if (flagGoneOver)
              CurrentStep /= 2;
            Direction = BinSearchDirection.BINSEARCH_UP;
            step = CurrentStep;
          } else {
            if (Direction == BinSearchDirection.BINSEARCH_UP)
              flagGoneOver = true;
            if (flagGoneOver)
              CurrentStep /= 2;
            Direction = BinSearchDirection.BINSEARCH_DOWN;
            step = -CurrentStep;
          }
          cod_info.global_gain += step;
          if (cod_info.global_gain < 0) {
            abort();
          }
          if (cod_info.global_gain > 255) {
            abort();
          }
        }
        while (nBits > desired_rate && cod_info.global_gain < 255) {
          cod_info.global_gain++;
          nBits = tk.count_bits(gfc, xrpow, cod_info, null);
        }
        gfc.CurrentStep[ch] = start - cod_info.global_gain >= 4 ? 4 : 2;
        gfc.OldValue[ch] = cod_info.global_gain;
        cod_info.part2_3_length = nBits;
        return nBits;
      }
      function loop_break(cod_info) {
        for (var sfb = 0; sfb < cod_info.sfbmax; sfb++)
          if (cod_info.scalefac[sfb] + cod_info.subblock_gain[cod_info.window[sfb]] == 0)
            return false;
        return true;
      }
      function quant_compare(quant_comp, best, calc, gi, distort) {
        var better;
        switch (quant_comp) {
          default:
          case 9: {
            if (best.over_count > 0) {
              better = calc.over_SSD <= best.over_SSD;
              if (calc.over_SSD == best.over_SSD)
                better = calc.bits < best.bits;
            } else {
              better = calc.max_noise < 0 && calc.max_noise * 10 + calc.bits <= best.max_noise * 10 + best.bits;
            }
            break;
          }
          case 0:
            better = calc.over_count < best.over_count || calc.over_count == best.over_count && calc.over_noise < best.over_noise || calc.over_count == best.over_count && BitStream.EQ(calc.over_noise, best.over_noise) && calc.tot_noise < best.tot_noise;
            break;
          case 8:
            abort();
          case 1:
            better = calc.max_noise < best.max_noise;
            break;
          case 2:
            better = calc.tot_noise < best.tot_noise;
            break;
          case 3:
            better = calc.tot_noise < best.tot_noise && calc.max_noise < best.max_noise;
            break;
          case 4:
            better = calc.max_noise <= 0 && best.max_noise > 0.2 || calc.max_noise <= 0 && best.max_noise < 0 && best.max_noise > calc.max_noise - 0.2 && calc.tot_noise < best.tot_noise || calc.max_noise <= 0 && best.max_noise > 0 && best.max_noise > calc.max_noise - 0.2 && calc.tot_noise < best.tot_noise + best.over_noise || calc.max_noise > 0 && best.max_noise > -0.05 && best.max_noise > calc.max_noise - 0.1 && calc.tot_noise + calc.over_noise < best.tot_noise + best.over_noise || calc.max_noise > 0 && best.max_noise > -0.1 && best.max_noise > calc.max_noise - 0.15 && calc.tot_noise + calc.over_noise + calc.over_noise < best.tot_noise + best.over_noise + best.over_noise;
            break;
          case 5:
            better = calc.over_noise < best.over_noise || BitStream.EQ(calc.over_noise, best.over_noise) && calc.tot_noise < best.tot_noise;
            break;
          case 6:
            better = calc.over_noise < best.over_noise || BitStream.EQ(calc.over_noise, best.over_noise) && (calc.max_noise < best.max_noise || BitStream.EQ(calc.max_noise, best.max_noise) && calc.tot_noise <= best.tot_noise);
            break;
          case 7:
            better = calc.over_count < best.over_count || calc.over_noise < best.over_noise;
            break;
        }
        if (best.over_count == 0) {
          better = better && calc.bits < best.bits;
        }
        return better;
      }
      function amp_scalefac_bands(gfp, cod_info, distort, xrpow, bRefine) {
        var gfc = gfp.internal_flags;
        var ifqstep34;
        if (cod_info.scalefac_scale == 0) {
          ifqstep34 = 1.2968395546510096;
        } else {
          ifqstep34 = 1.6817928305074292;
        }
        var trigger2 = 0;
        for (var sfb = 0; sfb < cod_info.sfbmax; sfb++) {
          if (trigger2 < distort[sfb])
            trigger2 = distort[sfb];
        }
        var noise_shaping_amp = gfc.noise_shaping_amp;
        if (noise_shaping_amp == 3) {
          abort();
        }
        switch (noise_shaping_amp) {
          case 2:
            break;
          case 1:
            if (trigger2 > 1)
              trigger2 = Math.pow(trigger2, 0.5);
            else
              trigger2 *= 0.95;
            break;
          case 0:
          default:
            if (trigger2 > 1)
              trigger2 = 1;
            else
              trigger2 *= 0.95;
            break;
        }
        var j = 0;
        for (var sfb = 0; sfb < cod_info.sfbmax; sfb++) {
          var width = cod_info.width[sfb];
          var l;
          j += width;
          if (distort[sfb] < trigger2)
            continue;
          if ((gfc.substep_shaping & 2) != 0) {
            abort();
          }
          cod_info.scalefac[sfb]++;
          for (l = -width; l < 0; l++) {
            xrpow[j + l] *= ifqstep34;
            if (xrpow[j + l] > cod_info.xrpow_max)
              cod_info.xrpow_max = xrpow[j + l];
          }
          if (gfc.noise_shaping_amp == 2)
            return;
        }
      }
      function inc_scalefac_scale(cod_info, xrpow) {
        var ifqstep34 = 1.2968395546510096;
        var j = 0;
        for (var sfb = 0; sfb < cod_info.sfbmax; sfb++) {
          var width = cod_info.width[sfb];
          var s = cod_info.scalefac[sfb];
          if (cod_info.preflag != 0)
            s += qupvt.pretab[sfb];
          j += width;
          if ((s & 1) != 0) {
            s++;
            for (var l = -width; l < 0; l++) {
              xrpow[j + l] *= ifqstep34;
              if (xrpow[j + l] > cod_info.xrpow_max)
                cod_info.xrpow_max = xrpow[j + l];
            }
          }
          cod_info.scalefac[sfb] = s >> 1;
        }
        cod_info.preflag = 0;
        cod_info.scalefac_scale = 1;
      }
      function inc_subblock_gain(gfc, cod_info, xrpow) {
        var sfb;
        var scalefac = cod_info.scalefac;
        for (sfb = 0; sfb < cod_info.sfb_lmax; sfb++) {
          if (scalefac[sfb] >= 16)
            return true;
        }
        for (var window2 = 0; window2 < 3; window2++) {
          var s1 = 0;
          var s2 = 0;
          for (sfb = cod_info.sfb_lmax + window2; sfb < cod_info.sfbdivide; sfb += 3) {
            if (s1 < scalefac[sfb])
              s1 = scalefac[sfb];
          }
          for (; sfb < cod_info.sfbmax; sfb += 3) {
            if (s2 < scalefac[sfb])
              s2 = scalefac[sfb];
          }
          if (s1 < 16 && s2 < 8)
            continue;
          if (cod_info.subblock_gain[window2] >= 7)
            return true;
          cod_info.subblock_gain[window2]++;
          var j = gfc.scalefac_band.l[cod_info.sfb_lmax];
          for (sfb = cod_info.sfb_lmax + window2; sfb < cod_info.sfbmax; sfb += 3) {
            var amp;
            var width = cod_info.width[sfb];
            var s = scalefac[sfb];
            s = s - (4 >> cod_info.scalefac_scale);
            if (s >= 0) {
              scalefac[sfb] = s;
              j += width * 3;
              continue;
            }
            scalefac[sfb] = 0;
            {
              var gain = 210 + (s << cod_info.scalefac_scale + 1);
              amp = qupvt.IPOW20(gain);
            }
            j += width * (window2 + 1);
            for (var l = -width; l < 0; l++) {
              xrpow[j + l] *= amp;
              if (xrpow[j + l] > cod_info.xrpow_max)
                cod_info.xrpow_max = xrpow[j + l];
            }
            j += width * (3 - window2 - 1);
          }
          {
            var amp = qupvt.IPOW20(202);
            j += cod_info.width[sfb] * (window2 + 1);
            for (var l = -cod_info.width[sfb]; l < 0; l++) {
              xrpow[j + l] *= amp;
              if (xrpow[j + l] > cod_info.xrpow_max)
                cod_info.xrpow_max = xrpow[j + l];
            }
          }
        }
        return false;
      }
      function balance_noise(gfp, cod_info, distort, xrpow, bRefine) {
        var gfc = gfp.internal_flags;
        amp_scalefac_bands(gfp, cod_info, distort, xrpow);
        var status = loop_break(cod_info);
        if (status)
          return false;
        if (gfc.mode_gr == 2)
          status = tk.scale_bitcount(cod_info);
        else
          status = tk.scale_bitcount_lsf(gfc, cod_info);
        if (!status)
          return true;
        if (gfc.noise_shaping > 1) {
          Arrays.fill(gfc.pseudohalf, 0);
          if (0 == cod_info.scalefac_scale) {
            inc_scalefac_scale(cod_info, xrpow);
            status = false;
          } else {
            if (cod_info.block_type == Encoder.SHORT_TYPE && gfc.subblock_gain > 0) {
              status = inc_subblock_gain(gfc, cod_info, xrpow) || loop_break(cod_info);
            }
          }
        }
        if (!status) {
          if (gfc.mode_gr == 2)
            status = tk.scale_bitcount(cod_info);
          else
            status = tk.scale_bitcount_lsf(gfc, cod_info);
        }
        return !status;
      }
      this.outer_loop = function(gfp, cod_info, l3_xmin, xrpow, ch, targ_bits) {
        var gfc = gfp.internal_flags;
        var cod_info_w = new GrInfo();
        var save_xrpow = new_float(576);
        var distort = new_float(L3Side.SFBMAX);
        var best_noise_info = new CalcNoiseResult();
        var better;
        var prev_noise = new CalcNoiseData();
        var best_part2_3_length = 9999999;
        var bEndOfSearch = false;
        var bRefine = false;
        var best_ggain_pass1 = 0;
        bin_search_StepSize(gfc, cod_info, targ_bits, ch, xrpow);
        if (0 == gfc.noise_shaping)
          return 100;
        qupvt.calc_noise(
          cod_info,
          l3_xmin,
          distort,
          best_noise_info,
          prev_noise
        );
        best_noise_info.bits = cod_info.part2_3_length;
        cod_info_w.assign(cod_info);
        var age = 0;
        System.arraycopy(xrpow, 0, save_xrpow, 0, 576);
        while (!bEndOfSearch) {
          do {
            var noise_info = new CalcNoiseResult();
            var search_limit;
            var maxggain = 255;
            if ((gfc.substep_shaping & 2) != 0) {
              search_limit = 20;
            } else {
              search_limit = 3;
            }
            if (gfc.sfb21_extra) {
              abort();
            }
            if (!balance_noise(gfp, cod_info_w, distort, xrpow))
              break;
            if (cod_info_w.scalefac_scale != 0)
              maxggain = 254;
            var huff_bits = targ_bits - cod_info_w.part2_length;
            if (huff_bits <= 0)
              break;
            while ((cod_info_w.part2_3_length = tk.count_bits(
              gfc,
              xrpow,
              cod_info_w,
              prev_noise
            )) > huff_bits && cod_info_w.global_gain <= maxggain)
              cod_info_w.global_gain++;
            if (cod_info_w.global_gain > maxggain)
              break;
            if (best_noise_info.over_count == 0) {
              while ((cod_info_w.part2_3_length = tk.count_bits(
                gfc,
                xrpow,
                cod_info_w,
                prev_noise
              )) > best_part2_3_length && cod_info_w.global_gain <= maxggain)
                cod_info_w.global_gain++;
              if (cod_info_w.global_gain > maxggain)
                break;
            }
            qupvt.calc_noise(
              cod_info_w,
              l3_xmin,
              distort,
              noise_info,
              prev_noise
            );
            noise_info.bits = cod_info_w.part2_3_length;
            if (cod_info.block_type != Encoder.SHORT_TYPE) {
              better = gfp.quant_comp;
            } else
              better = gfp.quant_comp_short;
            better = quant_compare(better, best_noise_info, noise_info) ? 1 : 0;
            if (better != 0) {
              best_part2_3_length = cod_info.part2_3_length;
              best_noise_info = noise_info;
              cod_info.assign(cod_info_w);
              age = 0;
              System.arraycopy(xrpow, 0, save_xrpow, 0, 576);
            } else {
              if (gfc.full_outer_loop == 0) {
                if (++age > search_limit && best_noise_info.over_count == 0)
                  break;
                if (gfc.noise_shaping_amp == 3 && bRefine && age > 30)
                  break;
                if (gfc.noise_shaping_amp == 3 && bRefine && cod_info_w.global_gain - best_ggain_pass1 > 15)
                  break;
              }
            }
          } while (cod_info_w.global_gain + cod_info_w.scalefac_scale < 255);
          if (gfc.noise_shaping_amp == 3) {
            abort();
          } else {
            bEndOfSearch = true;
          }
        }
        if (gfp.VBR == VbrMode.vbr_rh || gfp.VBR == VbrMode.vbr_mtrh)
          System.arraycopy(save_xrpow, 0, xrpow, 0, 576);
        else if ((gfc.substep_shaping & 1) != 0)
          abort();
        return best_noise_info.over_count;
      };
      this.iteration_finish_one = function(gfc, gr, ch) {
        var l3_side = gfc.l3_side;
        var cod_info = l3_side.tt[gr][ch];
        tk.best_scalefac_store(gfc, gr, ch, l3_side);
        if (gfc.use_best_huffman == 1)
          tk.best_huffman_divide(gfc, cod_info);
        rv.ResvAdjust(gfc, cod_info);
      };
    }
    function NewMDCT() {
      var enwindow = [
        -477e-9 * 0.740951125354959 / 2384e-9,
        103951e-9 * 0.740951125354959 / 2384e-9,
        953674e-9 * 0.740951125354959 / 2384e-9,
        2841473e-9 * 0.740951125354959 / 2384e-9,
        0.035758972 * 0.740951125354959 / 2384e-9,
        3401756e-9 * 0.740951125354959 / 2384e-9,
        983715e-9 * 0.740951125354959 / 2384e-9,
        99182e-9 * 0.740951125354959 / 2384e-9,
        /* 15 */
        12398e-9 * 0.740951125354959 / 2384e-9,
        191212e-9 * 0.740951125354959 / 2384e-9,
        2283096e-9 * 0.740951125354959 / 2384e-9,
        0.016994476 * 0.740951125354959 / 2384e-9,
        -0.018756866 * 0.740951125354959 / 2384e-9,
        -2630711e-9 * 0.740951125354959 / 2384e-9,
        -247478e-9 * 0.740951125354959 / 2384e-9,
        -14782e-9 * 0.740951125354959 / 2384e-9,
        0.9063471690191471,
        0.1960342806591213,
        -477e-9 * 0.773010453362737 / 2384e-9,
        105858e-9 * 0.773010453362737 / 2384e-9,
        930786e-9 * 0.773010453362737 / 2384e-9,
        2521515e-9 * 0.773010453362737 / 2384e-9,
        0.035694122 * 0.773010453362737 / 2384e-9,
        3643036e-9 * 0.773010453362737 / 2384e-9,
        991821e-9 * 0.773010453362737 / 2384e-9,
        96321e-9 * 0.773010453362737 / 2384e-9,
        /* 14 */
        11444e-9 * 0.773010453362737 / 2384e-9,
        165462e-9 * 0.773010453362737 / 2384e-9,
        2110004e-9 * 0.773010453362737 / 2384e-9,
        0.016112804 * 0.773010453362737 / 2384e-9,
        -0.019634247 * 0.773010453362737 / 2384e-9,
        -2803326e-9 * 0.773010453362737 / 2384e-9,
        -277042e-9 * 0.773010453362737 / 2384e-9,
        -16689e-9 * 0.773010453362737 / 2384e-9,
        0.8206787908286602,
        0.3901806440322567,
        -477e-9 * 0.803207531480645 / 2384e-9,
        107288e-9 * 0.803207531480645 / 2384e-9,
        902653e-9 * 0.803207531480645 / 2384e-9,
        2174854e-9 * 0.803207531480645 / 2384e-9,
        0.035586357 * 0.803207531480645 / 2384e-9,
        3858566e-9 * 0.803207531480645 / 2384e-9,
        995159e-9 * 0.803207531480645 / 2384e-9,
        9346e-8 * 0.803207531480645 / 2384e-9,
        /* 13 */
        10014e-9 * 0.803207531480645 / 2384e-9,
        14019e-8 * 0.803207531480645 / 2384e-9,
        1937389e-9 * 0.803207531480645 / 2384e-9,
        0.015233517 * 0.803207531480645 / 2384e-9,
        -0.020506859 * 0.803207531480645 / 2384e-9,
        -2974033e-9 * 0.803207531480645 / 2384e-9,
        -30756e-8 * 0.803207531480645 / 2384e-9,
        -1812e-8 * 0.803207531480645 / 2384e-9,
        0.7416505462720353,
        0.5805693545089249,
        -477e-9 * 0.831469612302545 / 2384e-9,
        108242e-9 * 0.831469612302545 / 2384e-9,
        868797e-9 * 0.831469612302545 / 2384e-9,
        1800537e-9 * 0.831469612302545 / 2384e-9,
        0.0354352 * 0.831469612302545 / 2384e-9,
        4049301e-9 * 0.831469612302545 / 2384e-9,
        994205e-9 * 0.831469612302545 / 2384e-9,
        90599e-9 * 0.831469612302545 / 2384e-9,
        /* 12 */
        906e-8 * 0.831469612302545 / 2384e-9,
        116348e-9 * 0.831469612302545 / 2384e-9,
        1766682e-9 * 0.831469612302545 / 2384e-9,
        0.014358521 * 0.831469612302545 / 2384e-9,
        -0.021372318 * 0.831469612302545 / 2384e-9,
        -314188e-8 * 0.831469612302545 / 2384e-9,
        -339031e-9 * 0.831469612302545 / 2384e-9,
        -1955e-8 * 0.831469612302545 / 2384e-9,
        0.6681786379192989,
        0.7653668647301797,
        -477e-9 * 0.857728610000272 / 2384e-9,
        108719e-9 * 0.857728610000272 / 2384e-9,
        82922e-8 * 0.857728610000272 / 2384e-9,
        1399517e-9 * 0.857728610000272 / 2384e-9,
        0.035242081 * 0.857728610000272 / 2384e-9,
        421524e-8 * 0.857728610000272 / 2384e-9,
        989437e-9 * 0.857728610000272 / 2384e-9,
        87261e-9 * 0.857728610000272 / 2384e-9,
        /* 11 */
        8106e-9 * 0.857728610000272 / 2384e-9,
        93937e-9 * 0.857728610000272 / 2384e-9,
        1597881e-9 * 0.857728610000272 / 2384e-9,
        0.013489246 * 0.857728610000272 / 2384e-9,
        -0.022228718 * 0.857728610000272 / 2384e-9,
        -3306866e-9 * 0.857728610000272 / 2384e-9,
        -371456e-9 * 0.857728610000272 / 2384e-9,
        -21458e-9 * 0.857728610000272 / 2384e-9,
        0.5993769336819237,
        0.9427934736519954,
        -477e-9 * 0.881921264348355 / 2384e-9,
        108719e-9 * 0.881921264348355 / 2384e-9,
        78392e-8 * 0.881921264348355 / 2384e-9,
        971317e-9 * 0.881921264348355 / 2384e-9,
        0.035007 * 0.881921264348355 / 2384e-9,
        4357815e-9 * 0.881921264348355 / 2384e-9,
        980854e-9 * 0.881921264348355 / 2384e-9,
        83923e-9 * 0.881921264348355 / 2384e-9,
        /* 10 */
        7629e-9 * 0.881921264348355 / 2384e-9,
        72956e-9 * 0.881921264348355 / 2384e-9,
        1432419e-9 * 0.881921264348355 / 2384e-9,
        0.012627602 * 0.881921264348355 / 2384e-9,
        -0.02307415 * 0.881921264348355 / 2384e-9,
        -3467083e-9 * 0.881921264348355 / 2384e-9,
        -404358e-9 * 0.881921264348355 / 2384e-9,
        -23365e-9 * 0.881921264348355 / 2384e-9,
        0.5345111359507916,
        1.111140466039205,
        -954e-9 * 0.903989293123443 / 2384e-9,
        108242e-9 * 0.903989293123443 / 2384e-9,
        731945e-9 * 0.903989293123443 / 2384e-9,
        515938e-9 * 0.903989293123443 / 2384e-9,
        0.034730434 * 0.903989293123443 / 2384e-9,
        4477024e-9 * 0.903989293123443 / 2384e-9,
        968933e-9 * 0.903989293123443 / 2384e-9,
        80585e-9 * 0.903989293123443 / 2384e-9,
        /* 9 */
        6676e-9 * 0.903989293123443 / 2384e-9,
        52929e-9 * 0.903989293123443 / 2384e-9,
        1269817e-9 * 0.903989293123443 / 2384e-9,
        0.011775017 * 0.903989293123443 / 2384e-9,
        -0.023907185 * 0.903989293123443 / 2384e-9,
        -3622532e-9 * 0.903989293123443 / 2384e-9,
        -438213e-9 * 0.903989293123443 / 2384e-9,
        -25272e-9 * 0.903989293123443 / 2384e-9,
        0.4729647758913199,
        1.268786568327291,
        -954e-9 * 0.9238795325112867 / 2384e-9,
        106812e-9 * 0.9238795325112867 / 2384e-9,
        674248e-9 * 0.9238795325112867 / 2384e-9,
        33379e-9 * 0.9238795325112867 / 2384e-9,
        0.034412861 * 0.9238795325112867 / 2384e-9,
        4573822e-9 * 0.9238795325112867 / 2384e-9,
        954151e-9 * 0.9238795325112867 / 2384e-9,
        76771e-9 * 0.9238795325112867 / 2384e-9,
        6199e-9 * 0.9238795325112867 / 2384e-9,
        34332e-9 * 0.9238795325112867 / 2384e-9,
        1111031e-9 * 0.9238795325112867 / 2384e-9,
        0.010933399 * 0.9238795325112867 / 2384e-9,
        -0.024725437 * 0.9238795325112867 / 2384e-9,
        -3771782e-9 * 0.9238795325112867 / 2384e-9,
        -472546e-9 * 0.9238795325112867 / 2384e-9,
        -27657e-9 * 0.9238795325112867 / 2384e-9,
        0.41421356237309503,
        /* tan(PI/8) */
        1.414213562373095,
        -954e-9 * 0.941544065183021 / 2384e-9,
        105381e-9 * 0.941544065183021 / 2384e-9,
        610352e-9 * 0.941544065183021 / 2384e-9,
        -475883e-9 * 0.941544065183021 / 2384e-9,
        0.03405571 * 0.941544065183021 / 2384e-9,
        4649162e-9 * 0.941544065183021 / 2384e-9,
        935555e-9 * 0.941544065183021 / 2384e-9,
        73433e-9 * 0.941544065183021 / 2384e-9,
        /* 7 */
        5245e-9 * 0.941544065183021 / 2384e-9,
        17166e-9 * 0.941544065183021 / 2384e-9,
        956535e-9 * 0.941544065183021 / 2384e-9,
        0.010103703 * 0.941544065183021 / 2384e-9,
        -0.025527 * 0.941544065183021 / 2384e-9,
        -3914356e-9 * 0.941544065183021 / 2384e-9,
        -507355e-9 * 0.941544065183021 / 2384e-9,
        -30041e-9 * 0.941544065183021 / 2384e-9,
        0.3578057213145241,
        1.546020906725474,
        -954e-9 * 0.956940335732209 / 2384e-9,
        10252e-8 * 0.956940335732209 / 2384e-9,
        539303e-9 * 0.956940335732209 / 2384e-9,
        -1011848e-9 * 0.956940335732209 / 2384e-9,
        0.033659935 * 0.956940335732209 / 2384e-9,
        4703045e-9 * 0.956940335732209 / 2384e-9,
        915051e-9 * 0.956940335732209 / 2384e-9,
        70095e-9 * 0.956940335732209 / 2384e-9,
        /* 6 */
        4768e-9 * 0.956940335732209 / 2384e-9,
        954e-9 * 0.956940335732209 / 2384e-9,
        806808e-9 * 0.956940335732209 / 2384e-9,
        9287834e-9 * 0.956940335732209 / 2384e-9,
        -0.026310921 * 0.956940335732209 / 2384e-9,
        -4048824e-9 * 0.956940335732209 / 2384e-9,
        -542164e-9 * 0.956940335732209 / 2384e-9,
        -32425e-9 * 0.956940335732209 / 2384e-9,
        0.3033466836073424,
        1.66293922460509,
        -1431e-9 * 0.970031253194544 / 2384e-9,
        99182e-9 * 0.970031253194544 / 2384e-9,
        462532e-9 * 0.970031253194544 / 2384e-9,
        -1573563e-9 * 0.970031253194544 / 2384e-9,
        0.033225536 * 0.970031253194544 / 2384e-9,
        4737377e-9 * 0.970031253194544 / 2384e-9,
        891685e-9 * 0.970031253194544 / 2384e-9,
        6628e-8 * 0.970031253194544 / 2384e-9,
        /* 5 */
        4292e-9 * 0.970031253194544 / 2384e-9,
        -13828e-9 * 0.970031253194544 / 2384e-9,
        66185e-8 * 0.970031253194544 / 2384e-9,
        8487225e-9 * 0.970031253194544 / 2384e-9,
        -0.02707386 * 0.970031253194544 / 2384e-9,
        -4174709e-9 * 0.970031253194544 / 2384e-9,
        -576973e-9 * 0.970031253194544 / 2384e-9,
        -34809e-9 * 0.970031253194544 / 2384e-9,
        0.2504869601913055,
        1.76384252869671,
        -1431e-9 * 0.98078528040323 / 2384e-9,
        95367e-9 * 0.98078528040323 / 2384e-9,
        378609e-9 * 0.98078528040323 / 2384e-9,
        -2161503e-9 * 0.98078528040323 / 2384e-9,
        0.032754898 * 0.98078528040323 / 2384e-9,
        4752159e-9 * 0.98078528040323 / 2384e-9,
        866413e-9 * 0.98078528040323 / 2384e-9,
        62943e-9 * 0.98078528040323 / 2384e-9,
        /* 4 */
        3815e-9 * 0.98078528040323 / 2384e-9,
        -2718e-8 * 0.98078528040323 / 2384e-9,
        522137e-9 * 0.98078528040323 / 2384e-9,
        7703304e-9 * 0.98078528040323 / 2384e-9,
        -0.027815342 * 0.98078528040323 / 2384e-9,
        -4290581e-9 * 0.98078528040323 / 2384e-9,
        -611782e-9 * 0.98078528040323 / 2384e-9,
        -3767e-8 * 0.98078528040323 / 2384e-9,
        0.198912367379658,
        1.847759065022573,
        -1907e-9 * 0.989176509964781 / 2384e-9,
        90122e-9 * 0.989176509964781 / 2384e-9,
        288486e-9 * 0.989176509964781 / 2384e-9,
        -2774239e-9 * 0.989176509964781 / 2384e-9,
        0.03224802 * 0.989176509964781 / 2384e-9,
        4748821e-9 * 0.989176509964781 / 2384e-9,
        838757e-9 * 0.989176509964781 / 2384e-9,
        59605e-9 * 0.989176509964781 / 2384e-9,
        /* 3 */
        3338e-9 * 0.989176509964781 / 2384e-9,
        -39577e-9 * 0.989176509964781 / 2384e-9,
        388145e-9 * 0.989176509964781 / 2384e-9,
        6937027e-9 * 0.989176509964781 / 2384e-9,
        -0.028532982 * 0.989176509964781 / 2384e-9,
        -4395962e-9 * 0.989176509964781 / 2384e-9,
        -646591e-9 * 0.989176509964781 / 2384e-9,
        -40531e-9 * 0.989176509964781 / 2384e-9,
        0.1483359875383474,
        1.913880671464418,
        -1907e-9 * 0.995184726672197 / 2384e-9,
        844e-7 * 0.995184726672197 / 2384e-9,
        191689e-9 * 0.995184726672197 / 2384e-9,
        -3411293e-9 * 0.995184726672197 / 2384e-9,
        0.03170681 * 0.995184726672197 / 2384e-9,
        4728317e-9 * 0.995184726672197 / 2384e-9,
        809669e-9 * 0.995184726672197 / 2384e-9,
        5579e-8 * 0.995184726672197 / 2384e-9,
        3338e-9 * 0.995184726672197 / 2384e-9,
        -50545e-9 * 0.995184726672197 / 2384e-9,
        259876e-9 * 0.995184726672197 / 2384e-9,
        6189346e-9 * 0.995184726672197 / 2384e-9,
        -0.029224873 * 0.995184726672197 / 2384e-9,
        -4489899e-9 * 0.995184726672197 / 2384e-9,
        -680923e-9 * 0.995184726672197 / 2384e-9,
        -43392e-9 * 0.995184726672197 / 2384e-9,
        0.09849140335716425,
        1.961570560806461,
        -2384e-9 * 0.998795456205172 / 2384e-9,
        77724e-9 * 0.998795456205172 / 2384e-9,
        88215e-9 * 0.998795456205172 / 2384e-9,
        -4072189e-9 * 0.998795456205172 / 2384e-9,
        0.031132698 * 0.998795456205172 / 2384e-9,
        4691124e-9 * 0.998795456205172 / 2384e-9,
        779152e-9 * 0.998795456205172 / 2384e-9,
        52929e-9 * 0.998795456205172 / 2384e-9,
        2861e-9 * 0.998795456205172 / 2384e-9,
        -60558e-9 * 0.998795456205172 / 2384e-9,
        137329e-9 * 0.998795456205172 / 2384e-9,
        546217e-8 * 0.998795456205172 / 2384e-9,
        -0.02989006 * 0.998795456205172 / 2384e-9,
        -4570484e-9 * 0.998795456205172 / 2384e-9,
        -714302e-9 * 0.998795456205172 / 2384e-9,
        -46253e-9 * 0.998795456205172 / 2384e-9,
        0.04912684976946725,
        1.990369453344394,
        0.035780907 * Util.SQRT2 * 0.5 / 2384e-9,
        0.017876148 * Util.SQRT2 * 0.5 / 2384e-9,
        3134727e-9 * Util.SQRT2 * 0.5 / 2384e-9,
        2457142e-9 * Util.SQRT2 * 0.5 / 2384e-9,
        971317e-9 * Util.SQRT2 * 0.5 / 2384e-9,
        218868e-9 * Util.SQRT2 * 0.5 / 2384e-9,
        101566e-9 * Util.SQRT2 * 0.5 / 2384e-9,
        13828e-9 * Util.SQRT2 * 0.5 / 2384e-9,
        0.030526638 / 2384e-9,
        4638195e-9 / 2384e-9,
        747204e-9 / 2384e-9,
        49591e-9 / 2384e-9,
        4756451e-9 / 2384e-9,
        21458e-9 / 2384e-9,
        -69618e-9 / 2384e-9
        /* 2.384e-06/2.384e-06 */
      ];
      var NS = 12;
      var NL = 36;
      var win = [
        [
          2382191739347913e-28,
          6423305872147834e-28,
          9400849094049688e-28,
          1122435026096556e-27,
          1183840321267481e-27,
          1122435026096556e-27,
          940084909404969e-27,
          6423305872147839e-28,
          2382191739347918e-28,
          5456116108943412e-27,
          4878985199565852e-27,
          4240448995017367e-27,
          3559909094758252e-27,
          2858043359288075e-27,
          2156177623817898e-27,
          1475637723558783e-27,
          8371015190102974e-28,
          2599706096327376e-28,
          -5456116108943412e-27,
          -4878985199565852e-27,
          -4240448995017367e-27,
          -3559909094758252e-27,
          -2858043359288076e-27,
          -2156177623817898e-27,
          -1475637723558783e-27,
          -8371015190102975e-28,
          -2599706096327376e-28,
          -2382191739347923e-28,
          -6423305872147843e-28,
          -9400849094049696e-28,
          -1122435026096556e-27,
          -1183840321267481e-27,
          -1122435026096556e-27,
          -9400849094049694e-28,
          -642330587214784e-27,
          -2382191739347918e-28
        ],
        [
          2382191739347913e-28,
          6423305872147834e-28,
          9400849094049688e-28,
          1122435026096556e-27,
          1183840321267481e-27,
          1122435026096556e-27,
          9400849094049688e-28,
          6423305872147841e-28,
          2382191739347918e-28,
          5456116108943413e-27,
          4878985199565852e-27,
          4240448995017367e-27,
          3559909094758253e-27,
          2858043359288075e-27,
          2156177623817898e-27,
          1475637723558782e-27,
          8371015190102975e-28,
          2599706096327376e-28,
          -5461314069809755e-27,
          -4921085770524055e-27,
          -4343405037091838e-27,
          -3732668368707687e-27,
          -3093523840190885e-27,
          -2430835727329465e-27,
          -1734679010007751e-27,
          -974825365660928e-27,
          -2797435120168326e-28,
          0,
          0,
          0,
          0,
          0,
          0,
          -2283748241799531e-28,
          -4037858874020686e-28,
          -2146547464825323e-28
        ],
        [
          0.1316524975873958,
          /* win[SHORT_TYPE] */
          0.414213562373095,
          0.7673269879789602,
          1.091308501069271,
          /* tantab_l */
          1.303225372841206,
          1.56968557711749,
          1.920982126971166,
          2.414213562373094,
          3.171594802363212,
          4.510708503662055,
          7.595754112725146,
          22.90376554843115,
          0.984807753012208,
          /* cx */
          0.6427876096865394,
          0.3420201433256688,
          0.9396926207859084,
          -0.1736481776669303,
          -0.7660444431189779,
          0.8660254037844387,
          0.5,
          -0.5144957554275265,
          /* ca */
          -0.4717319685649723,
          -0.3133774542039019,
          -0.1819131996109812,
          -0.09457419252642064,
          -0.04096558288530405,
          -0.01419856857247115,
          -0.003699974673760037,
          0.8574929257125442,
          /* cs */
          0.8817419973177052,
          0.9496286491027329,
          0.9833145924917901,
          0.9955178160675857,
          0.9991605581781475,
          0.999899195244447,
          0.9999931550702802
        ],
        [
          0,
          0,
          0,
          0,
          0,
          0,
          2283748241799531e-28,
          4037858874020686e-28,
          2146547464825323e-28,
          5461314069809755e-27,
          4921085770524055e-27,
          4343405037091838e-27,
          3732668368707687e-27,
          3093523840190885e-27,
          2430835727329466e-27,
          1734679010007751e-27,
          974825365660928e-27,
          2797435120168326e-28,
          -5456116108943413e-27,
          -4878985199565852e-27,
          -4240448995017367e-27,
          -3559909094758253e-27,
          -2858043359288075e-27,
          -2156177623817898e-27,
          -1475637723558782e-27,
          -8371015190102975e-28,
          -2599706096327376e-28,
          -2382191739347913e-28,
          -6423305872147834e-28,
          -9400849094049688e-28,
          -1122435026096556e-27,
          -1183840321267481e-27,
          -1122435026096556e-27,
          -9400849094049688e-28,
          -6423305872147841e-28,
          -2382191739347918e-28
        ]
      ];
      var tantab_l = win[Encoder.SHORT_TYPE];
      var cx = win[Encoder.SHORT_TYPE];
      var ca = win[Encoder.SHORT_TYPE];
      var cs = win[Encoder.SHORT_TYPE];
      var order = [
        0,
        1,
        16,
        17,
        8,
        9,
        24,
        25,
        4,
        5,
        20,
        21,
        12,
        13,
        28,
        29,
        2,
        3,
        18,
        19,
        10,
        11,
        26,
        27,
        6,
        7,
        22,
        23,
        14,
        15,
        30,
        31
      ];
      function window_subband(x1, x1Pos, a) {
        var wp = 10;
        var x2 = x1Pos + 238 - 14 - 286;
        for (var i = -15; i < 0; i++) {
          var w, s, t2;
          w = enwindow[wp + -10];
          s = x1[x2 + -224] * w;
          t2 = x1[x1Pos + 224] * w;
          w = enwindow[wp + -9];
          s += x1[x2 + -160] * w;
          t2 += x1[x1Pos + 160] * w;
          w = enwindow[wp + -8];
          s += x1[x2 + -96] * w;
          t2 += x1[x1Pos + 96] * w;
          w = enwindow[wp + -7];
          s += x1[x2 + -32] * w;
          t2 += x1[x1Pos + 32] * w;
          w = enwindow[wp + -6];
          s += x1[x2 + 32] * w;
          t2 += x1[x1Pos + -32] * w;
          w = enwindow[wp + -5];
          s += x1[x2 + 96] * w;
          t2 += x1[x1Pos + -96] * w;
          w = enwindow[wp + -4];
          s += x1[x2 + 160] * w;
          t2 += x1[x1Pos + -160] * w;
          w = enwindow[wp + -3];
          s += x1[x2 + 224] * w;
          t2 += x1[x1Pos + -224] * w;
          w = enwindow[wp + -2];
          s += x1[x1Pos + -256] * w;
          t2 -= x1[x2 + 256] * w;
          w = enwindow[wp + -1];
          s += x1[x1Pos + -192] * w;
          t2 -= x1[x2 + 192] * w;
          w = enwindow[wp + 0];
          s += x1[x1Pos + -128] * w;
          t2 -= x1[x2 + 128] * w;
          w = enwindow[wp + 1];
          s += x1[x1Pos + -64] * w;
          t2 -= x1[x2 + 64] * w;
          w = enwindow[wp + 2];
          s += x1[x1Pos + 0] * w;
          t2 -= x1[x2 + 0] * w;
          w = enwindow[wp + 3];
          s += x1[x1Pos + 64] * w;
          t2 -= x1[x2 + -64] * w;
          w = enwindow[wp + 4];
          s += x1[x1Pos + 128] * w;
          t2 -= x1[x2 + -128] * w;
          w = enwindow[wp + 5];
          s += x1[x1Pos + 192] * w;
          t2 -= x1[x2 + -192] * w;
          s *= enwindow[wp + 6];
          w = t2 - s;
          a[30 + i * 2] = t2 + s;
          a[31 + i * 2] = enwindow[wp + 7] * w;
          wp += 18;
          x1Pos--;
          x2++;
        }
        {
          var s, t2, u, v;
          t2 = x1[x1Pos + -16] * enwindow[wp + -10];
          s = x1[x1Pos + -32] * enwindow[wp + -2];
          t2 += (x1[x1Pos + -48] - x1[x1Pos + 16]) * enwindow[wp + -9];
          s += x1[x1Pos + -96] * enwindow[wp + -1];
          t2 += (x1[x1Pos + -80] + x1[x1Pos + 48]) * enwindow[wp + -8];
          s += x1[x1Pos + -160] * enwindow[wp + 0];
          t2 += (x1[x1Pos + -112] - x1[x1Pos + 80]) * enwindow[wp + -7];
          s += x1[x1Pos + -224] * enwindow[wp + 1];
          t2 += (x1[x1Pos + -144] + x1[x1Pos + 112]) * enwindow[wp + -6];
          s -= x1[x1Pos + 32] * enwindow[wp + 2];
          t2 += (x1[x1Pos + -176] - x1[x1Pos + 144]) * enwindow[wp + -5];
          s -= x1[x1Pos + 96] * enwindow[wp + 3];
          t2 += (x1[x1Pos + -208] + x1[x1Pos + 176]) * enwindow[wp + -4];
          s -= x1[x1Pos + 160] * enwindow[wp + 4];
          t2 += (x1[x1Pos + -240] - x1[x1Pos + 208]) * enwindow[wp + -3];
          s -= x1[x1Pos + 224];
          u = s - t2;
          v = s + t2;
          t2 = a[14];
          s = a[15] - t2;
          a[31] = v + t2;
          a[30] = u + s;
          a[15] = u - s;
          a[14] = v - t2;
        }
        {
          var xr;
          xr = a[28] - a[0];
          a[0] += a[28];
          a[28] = xr * enwindow[wp + -2 * 18 + 7];
          xr = a[29] - a[1];
          a[1] += a[29];
          a[29] = xr * enwindow[wp + -2 * 18 + 7];
          xr = a[26] - a[2];
          a[2] += a[26];
          a[26] = xr * enwindow[wp + -4 * 18 + 7];
          xr = a[27] - a[3];
          a[3] += a[27];
          a[27] = xr * enwindow[wp + -4 * 18 + 7];
          xr = a[24] - a[4];
          a[4] += a[24];
          a[24] = xr * enwindow[wp + -6 * 18 + 7];
          xr = a[25] - a[5];
          a[5] += a[25];
          a[25] = xr * enwindow[wp + -6 * 18 + 7];
          xr = a[22] - a[6];
          a[6] += a[22];
          a[22] = xr * Util.SQRT2;
          xr = a[23] - a[7];
          a[7] += a[23];
          a[23] = xr * Util.SQRT2 - a[7];
          a[7] -= a[6];
          a[22] -= a[7];
          a[23] -= a[22];
          xr = a[6];
          a[6] = a[31] - xr;
          a[31] = a[31] + xr;
          xr = a[7];
          a[7] = a[30] - xr;
          a[30] = a[30] + xr;
          xr = a[22];
          a[22] = a[15] - xr;
          a[15] = a[15] + xr;
          xr = a[23];
          a[23] = a[14] - xr;
          a[14] = a[14] + xr;
          xr = a[20] - a[8];
          a[8] += a[20];
          a[20] = xr * enwindow[wp + -10 * 18 + 7];
          xr = a[21] - a[9];
          a[9] += a[21];
          a[21] = xr * enwindow[wp + -10 * 18 + 7];
          xr = a[18] - a[10];
          a[10] += a[18];
          a[18] = xr * enwindow[wp + -12 * 18 + 7];
          xr = a[19] - a[11];
          a[11] += a[19];
          a[19] = xr * enwindow[wp + -12 * 18 + 7];
          xr = a[16] - a[12];
          a[12] += a[16];
          a[16] = xr * enwindow[wp + -14 * 18 + 7];
          xr = a[17] - a[13];
          a[13] += a[17];
          a[17] = xr * enwindow[wp + -14 * 18 + 7];
          xr = -a[20] + a[24];
          a[20] += a[24];
          a[24] = xr * enwindow[wp + -12 * 18 + 7];
          xr = -a[21] + a[25];
          a[21] += a[25];
          a[25] = xr * enwindow[wp + -12 * 18 + 7];
          xr = a[4] - a[8];
          a[4] += a[8];
          a[8] = xr * enwindow[wp + -12 * 18 + 7];
          xr = a[5] - a[9];
          a[5] += a[9];
          a[9] = xr * enwindow[wp + -12 * 18 + 7];
          xr = a[0] - a[12];
          a[0] += a[12];
          a[12] = xr * enwindow[wp + -4 * 18 + 7];
          xr = a[1] - a[13];
          a[1] += a[13];
          a[13] = xr * enwindow[wp + -4 * 18 + 7];
          xr = a[16] - a[28];
          a[16] += a[28];
          a[28] = xr * enwindow[wp + -4 * 18 + 7];
          xr = -a[17] + a[29];
          a[17] += a[29];
          a[29] = xr * enwindow[wp + -4 * 18 + 7];
          xr = Util.SQRT2 * (a[2] - a[10]);
          a[2] += a[10];
          a[10] = xr;
          xr = Util.SQRT2 * (a[3] - a[11]);
          a[3] += a[11];
          a[11] = xr;
          xr = Util.SQRT2 * (-a[18] + a[26]);
          a[18] += a[26];
          a[26] = xr - a[18];
          xr = Util.SQRT2 * (-a[19] + a[27]);
          a[19] += a[27];
          a[27] = xr - a[19];
          xr = a[2];
          a[19] -= a[3];
          a[3] -= xr;
          a[2] = a[31] - xr;
          a[31] += xr;
          xr = a[3];
          a[11] -= a[19];
          a[18] -= xr;
          a[3] = a[30] - xr;
          a[30] += xr;
          xr = a[18];
          a[27] -= a[11];
          a[19] -= xr;
          a[18] = a[15] - xr;
          a[15] += xr;
          xr = a[19];
          a[10] -= xr;
          a[19] = a[14] - xr;
          a[14] += xr;
          xr = a[10];
          a[11] -= xr;
          a[10] = a[23] - xr;
          a[23] += xr;
          xr = a[11];
          a[26] -= xr;
          a[11] = a[22] - xr;
          a[22] += xr;
          xr = a[26];
          a[27] -= xr;
          a[26] = a[7] - xr;
          a[7] += xr;
          xr = a[27];
          a[27] = a[6] - xr;
          a[6] += xr;
          xr = Util.SQRT2 * (a[0] - a[4]);
          a[0] += a[4];
          a[4] = xr;
          xr = Util.SQRT2 * (a[1] - a[5]);
          a[1] += a[5];
          a[5] = xr;
          xr = Util.SQRT2 * (a[16] - a[20]);
          a[16] += a[20];
          a[20] = xr;
          xr = Util.SQRT2 * (a[17] - a[21]);
          a[17] += a[21];
          a[21] = xr;
          xr = -Util.SQRT2 * (a[8] - a[12]);
          a[8] += a[12];
          a[12] = xr - a[8];
          xr = -Util.SQRT2 * (a[9] - a[13]);
          a[9] += a[13];
          a[13] = xr - a[9];
          xr = -Util.SQRT2 * (a[25] - a[29]);
          a[25] += a[29];
          a[29] = xr - a[25];
          xr = -Util.SQRT2 * (a[24] + a[28]);
          a[24] -= a[28];
          a[28] = xr - a[24];
          xr = a[24] - a[16];
          a[24] = xr;
          xr = a[20] - xr;
          a[20] = xr;
          xr = a[28] - xr;
          a[28] = xr;
          xr = a[25] - a[17];
          a[25] = xr;
          xr = a[21] - xr;
          a[21] = xr;
          xr = a[29] - xr;
          a[29] = xr;
          xr = a[17] - a[1];
          a[17] = xr;
          xr = a[9] - xr;
          a[9] = xr;
          xr = a[25] - xr;
          a[25] = xr;
          xr = a[5] - xr;
          a[5] = xr;
          xr = a[21] - xr;
          a[21] = xr;
          xr = a[13] - xr;
          a[13] = xr;
          xr = a[29] - xr;
          a[29] = xr;
          xr = a[1] - a[0];
          a[1] = xr;
          xr = a[16] - xr;
          a[16] = xr;
          xr = a[17] - xr;
          a[17] = xr;
          xr = a[8] - xr;
          a[8] = xr;
          xr = a[9] - xr;
          a[9] = xr;
          xr = a[24] - xr;
          a[24] = xr;
          xr = a[25] - xr;
          a[25] = xr;
          xr = a[4] - xr;
          a[4] = xr;
          xr = a[5] - xr;
          a[5] = xr;
          xr = a[20] - xr;
          a[20] = xr;
          xr = a[21] - xr;
          a[21] = xr;
          xr = a[12] - xr;
          a[12] = xr;
          xr = a[13] - xr;
          a[13] = xr;
          xr = a[28] - xr;
          a[28] = xr;
          xr = a[29] - xr;
          a[29] = xr;
          xr = a[0];
          a[0] += a[31];
          a[31] -= xr;
          xr = a[1];
          a[1] += a[30];
          a[30] -= xr;
          xr = a[16];
          a[16] += a[15];
          a[15] -= xr;
          xr = a[17];
          a[17] += a[14];
          a[14] -= xr;
          xr = a[8];
          a[8] += a[23];
          a[23] -= xr;
          xr = a[9];
          a[9] += a[22];
          a[22] -= xr;
          xr = a[24];
          a[24] += a[7];
          a[7] -= xr;
          xr = a[25];
          a[25] += a[6];
          a[6] -= xr;
          xr = a[4];
          a[4] += a[27];
          a[27] -= xr;
          xr = a[5];
          a[5] += a[26];
          a[26] -= xr;
          xr = a[20];
          a[20] += a[11];
          a[11] -= xr;
          xr = a[21];
          a[21] += a[10];
          a[10] -= xr;
          xr = a[12];
          a[12] += a[19];
          a[19] -= xr;
          xr = a[13];
          a[13] += a[18];
          a[18] -= xr;
          xr = a[28];
          a[28] += a[3];
          a[3] -= xr;
          xr = a[29];
          a[29] += a[2];
          a[2] -= xr;
        }
      }
      function mdct_short(inout, inoutPos) {
        for (var l = 0; l < 3; l++) {
          var tc0, tc1, tc2, ts0, ts1, ts2;
          ts0 = inout[inoutPos + 2 * 3] * win[Encoder.SHORT_TYPE][0] - inout[inoutPos + 5 * 3];
          tc0 = inout[inoutPos + 0 * 3] * win[Encoder.SHORT_TYPE][2] - inout[inoutPos + 3 * 3];
          tc1 = ts0 + tc0;
          tc2 = ts0 - tc0;
          ts0 = inout[inoutPos + 5 * 3] * win[Encoder.SHORT_TYPE][0] + inout[inoutPos + 2 * 3];
          tc0 = inout[inoutPos + 3 * 3] * win[Encoder.SHORT_TYPE][2] + inout[inoutPos + 0 * 3];
          ts1 = ts0 + tc0;
          ts2 = -ts0 + tc0;
          tc0 = (inout[inoutPos + 1 * 3] * win[Encoder.SHORT_TYPE][1] - inout[inoutPos + 4 * 3]) * 2069978111953089e-26;
          ts0 = (inout[inoutPos + 4 * 3] * win[Encoder.SHORT_TYPE][1] + inout[inoutPos + 1 * 3]) * 2069978111953089e-26;
          inout[inoutPos + 3 * 0] = tc1 * 190752519173728e-25 + tc0;
          inout[inoutPos + 3 * 5] = -ts1 * 190752519173728e-25 + ts0;
          tc2 = tc2 * 0.8660254037844387 * 1907525191737281e-26;
          ts1 = ts1 * 0.5 * 1907525191737281e-26 + ts0;
          inout[inoutPos + 3 * 1] = tc2 - ts1;
          inout[inoutPos + 3 * 2] = tc2 + ts1;
          tc1 = tc1 * 0.5 * 1907525191737281e-26 - tc0;
          ts2 = ts2 * 0.8660254037844387 * 1907525191737281e-26;
          inout[inoutPos + 3 * 3] = tc1 + ts2;
          inout[inoutPos + 3 * 4] = tc1 - ts2;
          inoutPos++;
        }
      }
      function mdct_long(out, outPos, _in) {
        var ct, st;
        {
          var tc1, tc2, tc3, tc4, ts5, ts6, ts7, ts8;
          tc1 = _in[17] - _in[9];
          tc3 = _in[15] - _in[11];
          tc4 = _in[14] - _in[12];
          ts5 = _in[0] + _in[8];
          ts6 = _in[1] + _in[7];
          ts7 = _in[2] + _in[6];
          ts8 = _in[3] + _in[5];
          out[outPos + 17] = ts5 + ts7 - ts8 - (ts6 - _in[4]);
          st = (ts5 + ts7 - ts8) * cx[12 + 7] + (ts6 - _in[4]);
          ct = (tc1 - tc3 - tc4) * cx[12 + 6];
          out[outPos + 5] = ct + st;
          out[outPos + 6] = ct - st;
          tc2 = (_in[16] - _in[10]) * cx[12 + 6];
          ts6 = ts6 * cx[12 + 7] + _in[4];
          ct = tc1 * cx[12 + 0] + tc2 + tc3 * cx[12 + 1] + tc4 * cx[12 + 2];
          st = -ts5 * cx[12 + 4] + ts6 - ts7 * cx[12 + 5] + ts8 * cx[12 + 3];
          out[outPos + 1] = ct + st;
          out[outPos + 2] = ct - st;
          ct = tc1 * cx[12 + 1] - tc2 - tc3 * cx[12 + 2] + tc4 * cx[12 + 0];
          st = -ts5 * cx[12 + 5] + ts6 - ts7 * cx[12 + 3] + ts8 * cx[12 + 4];
          out[outPos + 9] = ct + st;
          out[outPos + 10] = ct - st;
          ct = tc1 * cx[12 + 2] - tc2 + tc3 * cx[12 + 0] - tc4 * cx[12 + 1];
          st = ts5 * cx[12 + 3] - ts6 + ts7 * cx[12 + 4] - ts8 * cx[12 + 5];
          out[outPos + 13] = ct + st;
          out[outPos + 14] = ct - st;
        }
        {
          var ts1, ts2, ts3, ts4, tc5, tc6, tc7, tc8;
          ts1 = _in[8] - _in[0];
          ts3 = _in[6] - _in[2];
          ts4 = _in[5] - _in[3];
          tc5 = _in[17] + _in[9];
          tc6 = _in[16] + _in[10];
          tc7 = _in[15] + _in[11];
          tc8 = _in[14] + _in[12];
          out[outPos + 0] = tc5 + tc7 + tc8 + (tc6 + _in[13]);
          ct = (tc5 + tc7 + tc8) * cx[12 + 7] - (tc6 + _in[13]);
          st = (ts1 - ts3 + ts4) * cx[12 + 6];
          out[outPos + 11] = ct + st;
          out[outPos + 12] = ct - st;
          ts2 = (_in[7] - _in[1]) * cx[12 + 6];
          tc6 = _in[13] - tc6 * cx[12 + 7];
          ct = tc5 * cx[12 + 3] - tc6 + tc7 * cx[12 + 4] + tc8 * cx[12 + 5];
          st = ts1 * cx[12 + 2] + ts2 + ts3 * cx[12 + 0] + ts4 * cx[12 + 1];
          out[outPos + 3] = ct + st;
          out[outPos + 4] = ct - st;
          ct = -tc5 * cx[12 + 5] + tc6 - tc7 * cx[12 + 3] - tc8 * cx[12 + 4];
          st = ts1 * cx[12 + 1] + ts2 - ts3 * cx[12 + 2] - ts4 * cx[12 + 0];
          out[outPos + 7] = ct + st;
          out[outPos + 8] = ct - st;
          ct = -tc5 * cx[12 + 4] + tc6 - tc7 * cx[12 + 5] - tc8 * cx[12 + 3];
          st = ts1 * cx[12 + 0] - ts2 + ts3 * cx[12 + 1] - ts4 * cx[12 + 2];
          out[outPos + 15] = ct + st;
          out[outPos + 16] = ct - st;
        }
      }
      this.mdct_sub48 = function(gfc, w0, w1) {
        var wk = w0;
        var wkPos = 286;
        for (var ch = 0; ch < gfc.channels_out; ch++) {
          for (var gr = 0; gr < gfc.mode_gr; gr++) {
            var band;
            var gi = gfc.l3_side.tt[gr][ch];
            var mdct_enc = gi.xr;
            var mdct_encPos = 0;
            var samp = gfc.sb_sample[ch][1 - gr];
            var sampPos = 0;
            for (var k = 0; k < 18 / 2; k++) {
              window_subband(wk, wkPos, samp[sampPos]);
              window_subband(wk, wkPos + 32, samp[sampPos + 1]);
              sampPos += 2;
              wkPos += 64;
              for (band = 1; band < 32; band += 2) {
                samp[sampPos - 1][band] *= -1;
              }
            }
            for (band = 0; band < 32; band++, mdct_encPos += 18) {
              var type = gi.block_type;
              var band0 = gfc.sb_sample[ch][gr];
              var band1 = gfc.sb_sample[ch][1 - gr];
              if (gi.mixed_block_flag != 0 && band < 2)
                type = 0;
              if (gfc.amp_filter[band] < 1e-12) {
                Arrays.fill(
                  mdct_enc,
                  mdct_encPos + 0,
                  mdct_encPos + 18,
                  0
                );
              } else {
                if (gfc.amp_filter[band] < 1) {
                  abort();
                }
                if (type == Encoder.SHORT_TYPE) {
                  for (var k = -NS / 4; k < 0; k++) {
                    var w = win[Encoder.SHORT_TYPE][k + 3];
                    mdct_enc[mdct_encPos + k * 3 + 9] = band0[9 + k][order[band]] * w - band0[8 - k][order[band]];
                    mdct_enc[mdct_encPos + k * 3 + 18] = band0[14 - k][order[band]] * w + band0[15 + k][order[band]];
                    mdct_enc[mdct_encPos + k * 3 + 10] = band0[15 + k][order[band]] * w - band0[14 - k][order[band]];
                    mdct_enc[mdct_encPos + k * 3 + 19] = band1[2 - k][order[band]] * w + band1[3 + k][order[band]];
                    mdct_enc[mdct_encPos + k * 3 + 11] = band1[3 + k][order[band]] * w - band1[2 - k][order[band]];
                    mdct_enc[mdct_encPos + k * 3 + 20] = band1[8 - k][order[band]] * w + band1[9 + k][order[band]];
                  }
                  mdct_short(mdct_enc, mdct_encPos);
                } else {
                  var work = new_float(18);
                  for (var k = -NL / 4; k < 0; k++) {
                    var a, b;
                    a = win[type][k + 27] * band1[k + 9][order[band]] + win[type][k + 36] * band1[8 - k][order[band]];
                    b = win[type][k + 9] * band0[k + 9][order[band]] - win[type][k + 18] * band0[8 - k][order[band]];
                    work[k + 9] = a - b * tantab_l[3 + k + 9];
                    work[k + 18] = a * tantab_l[3 + k + 9] + b;
                  }
                  mdct_long(mdct_enc, mdct_encPos, work);
                }
              }
              if (type != Encoder.SHORT_TYPE && band != 0) {
                for (var k = 7; k >= 0; --k) {
                  var bu, bd;
                  bu = mdct_enc[mdct_encPos + k] * ca[20 + k] + mdct_enc[mdct_encPos + -1 - k] * cs[28 + k];
                  bd = mdct_enc[mdct_encPos + k] * cs[28 + k] - mdct_enc[mdct_encPos + -1 - k] * ca[20 + k];
                  mdct_enc[mdct_encPos + -1 - k] = bu;
                  mdct_enc[mdct_encPos + k] = bd;
                }
              }
            }
          }
          wk = w1;
          wkPos = 286;
          if (gfc.mode_gr == 1) {
            for (var i = 0; i < 18; i++) {
              System.arraycopy(
                gfc.sb_sample[ch][1][i],
                0,
                gfc.sb_sample[ch][0][i],
                0,
                32
              );
            }
          }
        }
      };
    }
    function III_psy_ratio() {
      this.thm = new III_psy_xmin();
      this.en = new III_psy_xmin();
    }
    Encoder.ENCDELAY = 576;
    Encoder.POSTDELAY = 1152;
    Encoder.MDCTDELAY = 48;
    Encoder.FFTOFFSET = 224 + Encoder.MDCTDELAY;
    Encoder.DECDELAY = 528;
    Encoder.SBLIMIT = 32;
    Encoder.CBANDS = 64;
    Encoder.SBPSY_l = 21;
    Encoder.SBPSY_s = 12;
    Encoder.SBMAX_l = 22;
    Encoder.SBMAX_s = 13;
    Encoder.PSFB21 = 6;
    Encoder.PSFB12 = 6;
    Encoder.BLKSIZE = 1024;
    Encoder.HBLKSIZE = Encoder.BLKSIZE / 2 + 1;
    Encoder.BLKSIZE_s = 256;
    Encoder.HBLKSIZE_s = Encoder.BLKSIZE_s / 2 + 1;
    Encoder.NORM_TYPE = 0;
    Encoder.START_TYPE = 1;
    Encoder.SHORT_TYPE = 2;
    Encoder.STOP_TYPE = 3;
    Encoder.MPG_MD_LR_LR = 0;
    Encoder.MPG_MD_LR_I = 1;
    Encoder.MPG_MD_MS_LR = 2;
    Encoder.MPG_MD_MS_I = 3;
    Encoder.fircoef = [
      -0.0207887 * 5,
      -0.0378413 * 5,
      -0.0432472 * 5,
      -0.031183 * 5,
      779609e-23 * 5,
      0.0467745 * 5,
      0.10091 * 5,
      0.151365 * 5,
      0.187098 * 5
    ];
    function Encoder() {
      var MPG_MD_MS_LR = Encoder.MPG_MD_MS_LR;
      var bs = null;
      this.psy = null;
      var psy = null;
      var vbr = null;
      this.setModules = function(_bs, _psy, _qupvt, _vbr) {
        bs = _bs;
        this.psy = _psy;
        psy = _psy;
        vbr = _vbr;
      };
      var newMDCT = new NewMDCT();
      function adjust_ATH(gfc) {
        var gr2_max, max_pow;
        if (gfc.ATH.useAdjust == 0) {
          gfc.ATH.adjust = 1;
          return;
        }
        max_pow = gfc.loudness_sq[0][0];
        gr2_max = gfc.loudness_sq[1][0];
        if (gfc.channels_out == 2) {
          abort();
        } else {
          max_pow += max_pow;
          gr2_max += gr2_max;
        }
        if (gfc.mode_gr == 2) {
          max_pow = Math.max(max_pow, gr2_max);
        }
        max_pow *= 0.5;
        max_pow *= gfc.ATH.aaSensitivityP;
        if (max_pow > 0.03125) {
          if (gfc.ATH.adjust >= 1) {
            gfc.ATH.adjust = 1;
          } else {
            if (gfc.ATH.adjust < gfc.ATH.adjustLimit) {
              gfc.ATH.adjust = gfc.ATH.adjustLimit;
            }
          }
          gfc.ATH.adjustLimit = 1;
        } else {
          var adj_lim_new = 31.98 * max_pow + 625e-6;
          if (gfc.ATH.adjust >= adj_lim_new) {
            gfc.ATH.adjust *= adj_lim_new * 0.075 + 0.925;
            if (gfc.ATH.adjust < adj_lim_new) {
              gfc.ATH.adjust = adj_lim_new;
            }
          } else {
            if (gfc.ATH.adjustLimit >= adj_lim_new) {
              gfc.ATH.adjust = adj_lim_new;
            } else {
              if (gfc.ATH.adjust < gfc.ATH.adjustLimit) {
                gfc.ATH.adjust = gfc.ATH.adjustLimit;
              }
            }
          }
          gfc.ATH.adjustLimit = adj_lim_new;
        }
      }
      function updateStats(gfc) {
        var gr, ch;
        gfc.bitrate_stereoMode_Hist[gfc.bitrate_index][4]++;
        gfc.bitrate_stereoMode_Hist[15][4]++;
        if (gfc.channels_out == 2) {
          abort();
        }
        for (gr = 0; gr < gfc.mode_gr; ++gr) {
          for (ch = 0; ch < gfc.channels_out; ++ch) {
            var bt = gfc.l3_side.tt[gr][ch].block_type | 0;
            if (gfc.l3_side.tt[gr][ch].mixed_block_flag != 0)
              bt = 4;
            gfc.bitrate_blockType_Hist[gfc.bitrate_index][bt]++;
            gfc.bitrate_blockType_Hist[gfc.bitrate_index][5]++;
            gfc.bitrate_blockType_Hist[15][bt]++;
            gfc.bitrate_blockType_Hist[15][5]++;
          }
        }
      }
      function lame_encode_frame_init(gfp, inbuf) {
        var gfc = gfp.internal_flags;
        var ch, gr;
        if (gfc.lame_encode_frame_init == 0) {
          var i, j;
          var primebuff0 = new_float(286 + 1152 + 576);
          var primebuff1 = new_float(286 + 1152 + 576);
          gfc.lame_encode_frame_init = 1;
          for (i = 0, j = 0; i < 286 + 576 * (1 + gfc.mode_gr); ++i) {
            if (i < 576 * gfc.mode_gr) {
              primebuff0[i] = 0;
              if (gfc.channels_out == 2)
                primebuff1[i] = 0;
            } else {
              primebuff0[i] = inbuf[0][j];
              if (gfc.channels_out == 2)
                primebuff1[i] = inbuf[1][j];
              ++j;
            }
          }
          for (gr = 0; gr < gfc.mode_gr; gr++) {
            for (ch = 0; ch < gfc.channels_out; ch++) {
              gfc.l3_side.tt[gr][ch].block_type = Encoder.SHORT_TYPE;
            }
          }
          newMDCT.mdct_sub48(gfc, primebuff0, primebuff1);
        }
      }
      this.lame_encode_mp3_frame = function(gfp, inbuf_l, inbuf_r, mp3buf, mp3bufPos, mp3buf_size) {
        var mp3count;
        var masking_LR = new_array_n([2, 2]);
        masking_LR[0][0] = new III_psy_ratio();
        masking_LR[0][1] = new III_psy_ratio();
        masking_LR[1][0] = new III_psy_ratio();
        masking_LR[1][1] = new III_psy_ratio();
        var masking_MS = new_array_n([2, 2]);
        masking_MS[0][0] = new III_psy_ratio();
        masking_MS[0][1] = new III_psy_ratio();
        masking_MS[1][0] = new III_psy_ratio();
        masking_MS[1][1] = new III_psy_ratio();
        var masking;
        var inbuf = [null, null];
        var gfc = gfp.internal_flags;
        var tot_ener = new_float_n([2, 4]);
        var ms_ener_ratio = [0.5, 0.5];
        var pe = [[0, 0], [0, 0]];
        var pe_MS = [[0, 0], [0, 0]];
        var pe_use;
        var ch, gr;
        inbuf[0] = inbuf_l;
        inbuf[1] = inbuf_r;
        if (gfc.lame_encode_frame_init == 0) {
          lame_encode_frame_init(gfp, inbuf);
        }
        gfc.padding = 0;
        if ((gfc.slot_lag -= gfc.frac_SpF) < 0) {
          gfc.slot_lag += gfp.out_samplerate;
          gfc.padding = 1;
        }
        if (gfc.psymodel != 0) {
          var ret;
          var bufp = [null, null];
          var bufpPos = 0;
          var blocktype = new_int(2);
          for (gr = 0; gr < gfc.mode_gr; gr++) {
            for (ch = 0; ch < gfc.channels_out; ch++) {
              bufp[ch] = inbuf[ch];
              bufpPos = 576 + gr * 576 - Encoder.FFTOFFSET;
            }
            if (gfp.VBR == VbrMode.vbr_mtrh || gfp.VBR == VbrMode.vbr_mt) {
              abort();
            } else {
              ret = psy.L3psycho_anal_ns(
                gfp,
                bufp,
                bufpPos,
                gr,
                masking_LR,
                masking_MS,
                pe[gr],
                pe_MS[gr],
                tot_ener[gr],
                blocktype
              );
            }
            if (ret != 0)
              return -4;
            if (gfp.mode == MPEGMode.JOINT_STEREO) {
              abort();
            }
            for (ch = 0; ch < gfc.channels_out; ch++) {
              var cod_info = gfc.l3_side.tt[gr][ch];
              cod_info.block_type = blocktype[ch];
              cod_info.mixed_block_flag = 0;
            }
          }
        } else {
          abort();
        }
        adjust_ATH(gfc);
        newMDCT.mdct_sub48(gfc, inbuf[0], inbuf[1]);
        gfc.mode_ext = Encoder.MPG_MD_LR_LR;
        if (gfp.force_ms) {
          gfc.mode_ext = Encoder.MPG_MD_MS_LR;
        } else if (gfp.mode == MPEGMode.JOINT_STEREO) {
          abort();
        }
        if (gfc.mode_ext == MPG_MD_MS_LR) {
          masking = masking_MS;
          pe_use = pe_MS;
        } else {
          masking = masking_LR;
          pe_use = pe;
        }
        if (gfp.analysis && gfc.pinfo != null) {
          abort();
        }
        if (gfp.VBR == VbrMode.vbr_off || gfp.VBR == VbrMode.vbr_abr) {
          var i;
          var f2;
          for (i = 0; i < 18; i++)
            gfc.nsPsy.pefirbuf[i] = gfc.nsPsy.pefirbuf[i + 1];
          f2 = 0;
          for (gr = 0; gr < gfc.mode_gr; gr++)
            for (ch = 0; ch < gfc.channels_out; ch++)
              f2 += pe_use[gr][ch];
          gfc.nsPsy.pefirbuf[18] = f2;
          f2 = gfc.nsPsy.pefirbuf[9];
          for (i = 0; i < 9; i++)
            f2 += (gfc.nsPsy.pefirbuf[i] + gfc.nsPsy.pefirbuf[18 - i]) * Encoder.fircoef[i];
          f2 = 670 * 5 * gfc.mode_gr * gfc.channels_out / f2;
          for (gr = 0; gr < gfc.mode_gr; gr++) {
            for (ch = 0; ch < gfc.channels_out; ch++) {
              pe_use[gr][ch] *= f2;
            }
          }
        }
        gfc.iteration_loop.iteration_loop(gfp, pe_use, ms_ener_ratio, masking);
        bs.format_bitstream(gfp);
        mp3count = bs.copy_buffer(gfc, mp3buf, mp3bufPos, mp3buf_size, 1);
        if (gfp.bWriteVbrTag)
          vbr.addVbrFrame(gfp);
        if (gfp.analysis && gfc.pinfo != null) {
          abort();
        }
        updateStats(gfc);
        return mp3count;
      };
    }
    function VBRSeekInfo() {
      this.sum = 0;
      this.seen = 0;
      this.want = 0;
      this.pos = 0;
      this.size = 0;
      this.bag = null;
      this.nVbrNumFrames = 0;
      this.nBytesWritten = 0;
      this.TotalFrameSize = 0;
    }
    function IIISideInfo() {
      this.tt = [[null, null], [null, null]];
      this.main_data_begin = 0;
      this.private_bits = 0;
      this.resvDrain_pre = 0;
      this.resvDrain_post = 0;
      this.scfsi = [new_int(4), new_int(4)];
      for (var gr = 0; gr < 2; gr++) {
        for (var ch = 0; ch < 2; ch++) {
          this.tt[gr][ch] = new GrInfo();
        }
      }
    }
    function III_psy_xmin() {
      this.l = new_float(Encoder.SBMAX_l);
      this.s = new_float_n([Encoder.SBMAX_s, 3]);
      var self2 = this;
      this.assign = function(iii_psy_xmin) {
        System.arraycopy(iii_psy_xmin.l, 0, self2.l, 0, Encoder.SBMAX_l);
        for (var i = 0; i < Encoder.SBMAX_s; i++) {
          for (var j = 0; j < 3; j++) {
            self2.s[i][j] = iii_psy_xmin.s[i][j];
          }
        }
      };
    }
    function NsPsy() {
      this.last_en_subshort = new_float_n([4, 9]);
      this.lastAttacks = new_int(4);
      this.pefirbuf = new_float(19);
      this.longfact = new_float(Encoder.SBMAX_l);
      this.shortfact = new_float(Encoder.SBMAX_s);
      this.attackthre = 0;
      this.attackthre_s = 0;
    }
    LameInternalFlags.MFSIZE = 3 * 1152 + Encoder.ENCDELAY - Encoder.MDCTDELAY;
    LameInternalFlags.MAX_HEADER_BUF = 256;
    LameInternalFlags.MAX_BITS_PER_CHANNEL = 4095;
    LameInternalFlags.MAX_BITS_PER_GRANULE = 7680;
    LameInternalFlags.BPC = 320;
    function LameInternalFlags() {
      var MAX_HEADER_LEN = 40;
      this.Class_ID = 0;
      this.lame_encode_frame_init = 0;
      this.iteration_init_init = 0;
      this.fill_buffer_resample_init = 0;
      this.mfbuf = new_float_n([2, LameInternalFlags.MFSIZE]);
      this.mode_gr = 0;
      this.channels_in = 0;
      this.channels_out = 0;
      this.resample_ratio = 0;
      this.mf_samples_to_encode = 0;
      this.mf_size = 0;
      this.VBR_min_bitrate = 0;
      this.VBR_max_bitrate = 0;
      this.bitrate_index = 0;
      this.samplerate_index = 0;
      this.mode_ext = 0;
      this.lowpass1 = 0;
      this.lowpass2 = 0;
      this.highpass1 = 0;
      this.highpass2 = 0;
      this.noise_shaping = 0;
      this.noise_shaping_amp = 0;
      this.substep_shaping = 0;
      this.psymodel = 0;
      this.noise_shaping_stop = 0;
      this.subblock_gain = 0;
      this.use_best_huffman = 0;
      this.full_outer_loop = 0;
      this.l3_side = new IIISideInfo();
      this.ms_ratio = new_float(2);
      this.padding = 0;
      this.frac_SpF = 0;
      this.slot_lag = 0;
      this.tag_spec = null;
      this.nMusicCRC = 0;
      this.OldValue = new_int(2);
      this.CurrentStep = new_int(2);
      this.masking_lower = 0;
      this.bv_scf = new_int(576);
      this.pseudohalf = new_int(L3Side.SFBMAX);
      this.sfb21_extra = false;
      this.inbuf_old = new Array(2);
      this.blackfilt = new Array(2 * LameInternalFlags.BPC + 1);
      this.itime = new_double(2);
      this.sideinfo_len = 0;
      this.sb_sample = new_float_n([2, 2, 18, Encoder.SBLIMIT]);
      this.amp_filter = new_float(32);
      function Header() {
        this.write_timing = 0;
        this.ptr = 0;
        this.buf = new_byte(MAX_HEADER_LEN);
      }
      this.header = new Array(LameInternalFlags.MAX_HEADER_BUF);
      this.h_ptr = 0;
      this.w_ptr = 0;
      this.ancillary_flag = 0;
      this.ResvSize = 0;
      this.ResvMax = 0;
      this.scalefac_band = new ScaleFac();
      this.minval_l = new_float(Encoder.CBANDS);
      this.minval_s = new_float(Encoder.CBANDS);
      this.nb_1 = new_float_n([4, Encoder.CBANDS]);
      this.nb_2 = new_float_n([4, Encoder.CBANDS]);
      this.nb_s1 = new_float_n([4, Encoder.CBANDS]);
      this.nb_s2 = new_float_n([4, Encoder.CBANDS]);
      this.s3_ss = null;
      this.s3_ll = null;
      this.decay = 0;
      this.thm = new Array(4);
      this.en = new Array(4);
      this.tot_ener = new_float(4);
      this.loudness_sq = new_float_n([2, 2]);
      this.loudness_sq_save = new_float(2);
      this.mld_l = new_float(Encoder.SBMAX_l);
      this.mld_s = new_float(Encoder.SBMAX_s);
      this.bm_l = new_int(Encoder.SBMAX_l);
      this.bo_l = new_int(Encoder.SBMAX_l);
      this.bm_s = new_int(Encoder.SBMAX_s);
      this.bo_s = new_int(Encoder.SBMAX_s);
      this.npart_l = 0;
      this.npart_s = 0;
      this.s3ind = new_int_n([Encoder.CBANDS, 2]);
      this.s3ind_s = new_int_n([Encoder.CBANDS, 2]);
      this.numlines_s = new_int(Encoder.CBANDS);
      this.numlines_l = new_int(Encoder.CBANDS);
      this.rnumlines_l = new_float(Encoder.CBANDS);
      this.mld_cb_l = new_float(Encoder.CBANDS);
      this.mld_cb_s = new_float(Encoder.CBANDS);
      this.numlines_s_num1 = 0;
      this.numlines_l_num1 = 0;
      this.pe = new_float(4);
      this.ms_ratio_s_old = 0;
      this.ms_ratio_l_old = 0;
      this.ms_ener_ratio_old = 0;
      this.blocktype_old = new_int(2);
      this.nsPsy = new NsPsy();
      this.VBR_seek_table = new VBRSeekInfo();
      this.ATH = null;
      this.PSY = null;
      this.nogap_total = 0;
      this.nogap_current = 0;
      this.decode_on_the_fly = true;
      this.findReplayGain = true;
      this.findPeakSample = true;
      this.PeakSample = 0;
      this.RadioGain = 0;
      this.AudiophileGain = 0;
      this.rgdata = null;
      this.noclipGainChange = 0;
      this.noclipScale = 0;
      this.bitrate_stereoMode_Hist = new_int_n([16, 4 + 1]);
      this.bitrate_blockType_Hist = new_int_n([16, 4 + 1 + 1]);
      this.pinfo = null;
      this.hip = null;
      this.in_buffer_nsamples = 0;
      this.in_buffer_0 = null;
      this.in_buffer_1 = null;
      this.iteration_loop = null;
      for (var i = 0; i < this.en.length; i++) {
        this.en[i] = new III_psy_xmin();
      }
      for (var i = 0; i < this.thm.length; i++) {
        this.thm[i] = new III_psy_xmin();
      }
      for (var i = 0; i < this.header.length; i++) {
        this.header[i] = new Header();
      }
    }
    function FFT() {
      var window2 = new_float(Encoder.BLKSIZE);
      var window_s = new_float(Encoder.BLKSIZE_s / 2);
      var costab = [
        0.9238795325112867,
        0.3826834323650898,
        0.9951847266721969,
        0.0980171403295606,
        0.9996988186962042,
        0.02454122852291229,
        0.9999811752826011,
        0.006135884649154475
      ];
      function fht(fz, fzPos, n2) {
        var tri = 0;
        var k4;
        var fi;
        var gi;
        n2 <<= 1;
        var fn = fzPos + n2;
        k4 = 4;
        do {
          var s1, c1;
          var i, k1, k2, k3, kx;
          kx = k4 >> 1;
          k1 = k4;
          k2 = k4 << 1;
          k3 = k2 + k1;
          k4 = k2 << 1;
          fi = fzPos;
          gi = fi + kx;
          do {
            var f0, f1, f2, f3;
            f1 = fz[fi + 0] - fz[fi + k1];
            f0 = fz[fi + 0] + fz[fi + k1];
            f3 = fz[fi + k2] - fz[fi + k3];
            f2 = fz[fi + k2] + fz[fi + k3];
            fz[fi + k2] = f0 - f2;
            fz[fi + 0] = f0 + f2;
            fz[fi + k3] = f1 - f3;
            fz[fi + k1] = f1 + f3;
            f1 = fz[gi + 0] - fz[gi + k1];
            f0 = fz[gi + 0] + fz[gi + k1];
            f3 = Util.SQRT2 * fz[gi + k3];
            f2 = Util.SQRT2 * fz[gi + k2];
            fz[gi + k2] = f0 - f2;
            fz[gi + 0] = f0 + f2;
            fz[gi + k3] = f1 - f3;
            fz[gi + k1] = f1 + f3;
            gi += k4;
            fi += k4;
          } while (fi < fn);
          c1 = costab[tri + 0];
          s1 = costab[tri + 1];
          for (i = 1; i < kx; i++) {
            var c2, s2;
            c2 = 1 - 2 * s1 * s1;
            s2 = 2 * s1 * c1;
            fi = fzPos + i;
            gi = fzPos + k1 - i;
            do {
              var a, b, g0, f0, f1, g1, f2, g2, f3, g3;
              b = s2 * fz[fi + k1] - c2 * fz[gi + k1];
              a = c2 * fz[fi + k1] + s2 * fz[gi + k1];
              f1 = fz[fi + 0] - a;
              f0 = fz[fi + 0] + a;
              g1 = fz[gi + 0] - b;
              g0 = fz[gi + 0] + b;
              b = s2 * fz[fi + k3] - c2 * fz[gi + k3];
              a = c2 * fz[fi + k3] + s2 * fz[gi + k3];
              f3 = fz[fi + k2] - a;
              f2 = fz[fi + k2] + a;
              g3 = fz[gi + k2] - b;
              g2 = fz[gi + k2] + b;
              b = s1 * f2 - c1 * g3;
              a = c1 * f2 + s1 * g3;
              fz[fi + k2] = f0 - a;
              fz[fi + 0] = f0 + a;
              fz[gi + k3] = g1 - b;
              fz[gi + k1] = g1 + b;
              b = c1 * g2 - s1 * f3;
              a = s1 * g2 + c1 * f3;
              fz[gi + k2] = g0 - a;
              fz[gi + 0] = g0 + a;
              fz[fi + k3] = f1 - b;
              fz[fi + k1] = f1 + b;
              gi += k4;
              fi += k4;
            } while (fi < fn);
            c2 = c1;
            c1 = c2 * costab[tri + 0] - s1 * costab[tri + 1];
            s1 = c2 * costab[tri + 1] + s1 * costab[tri + 0];
          }
          tri += 2;
        } while (k4 < n2);
      }
      var rv_tbl = [
        0,
        128,
        64,
        192,
        32,
        160,
        96,
        224,
        16,
        144,
        80,
        208,
        48,
        176,
        112,
        240,
        8,
        136,
        72,
        200,
        40,
        168,
        104,
        232,
        24,
        152,
        88,
        216,
        56,
        184,
        120,
        248,
        4,
        132,
        68,
        196,
        36,
        164,
        100,
        228,
        20,
        148,
        84,
        212,
        52,
        180,
        116,
        244,
        12,
        140,
        76,
        204,
        44,
        172,
        108,
        236,
        28,
        156,
        92,
        220,
        60,
        188,
        124,
        252,
        2,
        130,
        66,
        194,
        34,
        162,
        98,
        226,
        18,
        146,
        82,
        210,
        50,
        178,
        114,
        242,
        10,
        138,
        74,
        202,
        42,
        170,
        106,
        234,
        26,
        154,
        90,
        218,
        58,
        186,
        122,
        250,
        6,
        134,
        70,
        198,
        38,
        166,
        102,
        230,
        22,
        150,
        86,
        214,
        54,
        182,
        118,
        246,
        14,
        142,
        78,
        206,
        46,
        174,
        110,
        238,
        30,
        158,
        94,
        222,
        62,
        190,
        126,
        254
      ];
      this.fft_short = function(gfc, x_real, chn, buffer2, bufPos) {
        for (var b = 0; b < 3; b++) {
          var x = Encoder.BLKSIZE_s / 2;
          var k = 65535 & 576 / 3 * (b + 1);
          var j = Encoder.BLKSIZE_s / 8 - 1;
          do {
            var f0, f1, f2, f3, w;
            var i = rv_tbl[j << 2] & 255;
            f0 = window_s[i] * buffer2[chn][bufPos + i + k];
            w = window_s[127 - i] * buffer2[chn][bufPos + i + k + 128];
            f1 = f0 - w;
            f0 = f0 + w;
            f2 = window_s[i + 64] * buffer2[chn][bufPos + i + k + 64];
            w = window_s[63 - i] * buffer2[chn][bufPos + i + k + 192];
            f3 = f2 - w;
            f2 = f2 + w;
            x -= 4;
            x_real[b][x + 0] = f0 + f2;
            x_real[b][x + 2] = f0 - f2;
            x_real[b][x + 1] = f1 + f3;
            x_real[b][x + 3] = f1 - f3;
            f0 = window_s[i + 1] * buffer2[chn][bufPos + i + k + 1];
            w = window_s[126 - i] * buffer2[chn][bufPos + i + k + 129];
            f1 = f0 - w;
            f0 = f0 + w;
            f2 = window_s[i + 65] * buffer2[chn][bufPos + i + k + 65];
            w = window_s[62 - i] * buffer2[chn][bufPos + i + k + 193];
            f3 = f2 - w;
            f2 = f2 + w;
            x_real[b][x + Encoder.BLKSIZE_s / 2 + 0] = f0 + f2;
            x_real[b][x + Encoder.BLKSIZE_s / 2 + 2] = f0 - f2;
            x_real[b][x + Encoder.BLKSIZE_s / 2 + 1] = f1 + f3;
            x_real[b][x + Encoder.BLKSIZE_s / 2 + 3] = f1 - f3;
          } while (--j >= 0);
          fht(x_real[b], x, Encoder.BLKSIZE_s / 2);
        }
      };
      this.fft_long = function(gfc, y, chn, buffer2, bufPos) {
        var jj = Encoder.BLKSIZE / 8 - 1;
        var x = Encoder.BLKSIZE / 2;
        do {
          var f0, f1, f2, f3, w;
          var i = rv_tbl[jj] & 255;
          f0 = window2[i] * buffer2[chn][bufPos + i];
          w = window2[i + 512] * buffer2[chn][bufPos + i + 512];
          f1 = f0 - w;
          f0 = f0 + w;
          f2 = window2[i + 256] * buffer2[chn][bufPos + i + 256];
          w = window2[i + 768] * buffer2[chn][bufPos + i + 768];
          f3 = f2 - w;
          f2 = f2 + w;
          x -= 4;
          y[x + 0] = f0 + f2;
          y[x + 2] = f0 - f2;
          y[x + 1] = f1 + f3;
          y[x + 3] = f1 - f3;
          f0 = window2[i + 1] * buffer2[chn][bufPos + i + 1];
          w = window2[i + 513] * buffer2[chn][bufPos + i + 513];
          f1 = f0 - w;
          f0 = f0 + w;
          f2 = window2[i + 257] * buffer2[chn][bufPos + i + 257];
          w = window2[i + 769] * buffer2[chn][bufPos + i + 769];
          f3 = f2 - w;
          f2 = f2 + w;
          y[x + Encoder.BLKSIZE / 2 + 0] = f0 + f2;
          y[x + Encoder.BLKSIZE / 2 + 2] = f0 - f2;
          y[x + Encoder.BLKSIZE / 2 + 1] = f1 + f3;
          y[x + Encoder.BLKSIZE / 2 + 3] = f1 - f3;
        } while (--jj >= 0);
        fht(y, x, Encoder.BLKSIZE / 2);
      };
      this.init_fft = function(gfc) {
        for (var i = 0; i < Encoder.BLKSIZE; i++)
          window2[i] = 0.42 - 0.5 * Math.cos(2 * Math.PI * (i + 0.5) / Encoder.BLKSIZE) + 0.08 * Math.cos(4 * Math.PI * (i + 0.5) / Encoder.BLKSIZE);
        for (var i = 0; i < Encoder.BLKSIZE_s / 2; i++)
          window_s[i] = 0.5 * (1 - Math.cos(2 * Math.PI * (i + 0.5) / Encoder.BLKSIZE_s));
      };
    }
    function PsyModel() {
      var fft = new FFT();
      var LOG10 = 2.302585092994046;
      var rpelev = 2;
      var rpelev2 = 16;
      var rpelev_s = 2;
      var rpelev2_s = 16;
      var DELBARK = 0.34;
      var VO_SCALE = 1 / (14752 * 14752) / (Encoder.BLKSIZE / 2);
      var temporalmask_sustain_sec = 0.01;
      var NS_PREECHO_ATT0 = 0.8;
      var NS_PREECHO_ATT1 = 0.6;
      var NS_PREECHO_ATT2 = 0.3;
      var NS_MSFIX = 3.5;
      var NSFIRLEN = 21;
      var LN_TO_LOG10 = 0.2302585093;
      function psycho_loudness_approx(energy, gfc) {
        var loudness_power = 0;
        for (var i = 0; i < Encoder.BLKSIZE / 2; ++i)
          loudness_power += energy[i] * gfc.ATH.eql_w[i];
        loudness_power *= VO_SCALE;
        return loudness_power;
      }
      function compute_ffts(gfp, fftenergy, fftenergy_s, wsamp_l, wsamp_lPos, wsamp_s, wsamp_sPos, gr_out, chn, buffer2, bufPos) {
        var gfc = gfp.internal_flags;
        if (chn < 2) {
          fft.fft_long(gfc, wsamp_l[wsamp_lPos], chn, buffer2, bufPos);
          fft.fft_short(gfc, wsamp_s[wsamp_sPos], chn, buffer2, bufPos);
        } else if (chn == 2) {
          abort();
        }
        fftenergy[0] = /*fix NON_LINEAR_SCALE_ENERGY*/
        wsamp_l[wsamp_lPos + 0][0];
        fftenergy[0] *= fftenergy[0];
        for (var j = Encoder.BLKSIZE / 2 - 1; j >= 0; --j) {
          var re = wsamp_l[wsamp_lPos + 0][Encoder.BLKSIZE / 2 - j];
          var im = wsamp_l[wsamp_lPos + 0][Encoder.BLKSIZE / 2 + j];
          fftenergy[Encoder.BLKSIZE / 2 - j] = /*fix NON_LINEAR_SCALE_ENERGY*/
          (re * re + im * im) * 0.5;
        }
        for (var b = 2; b >= 0; --b) {
          fftenergy_s[b][0] = wsamp_s[wsamp_sPos + 0][b][0];
          fftenergy_s[b][0] *= fftenergy_s[b][0];
          for (var j = Encoder.BLKSIZE_s / 2 - 1; j >= 0; --j) {
            var re = wsamp_s[wsamp_sPos + 0][b][Encoder.BLKSIZE_s / 2 - j];
            var im = wsamp_s[wsamp_sPos + 0][b][Encoder.BLKSIZE_s / 2 + j];
            fftenergy_s[b][Encoder.BLKSIZE_s / 2 - j] = /*fix NON_LINEAR_SCALE_ENERGY*/
            (re * re + im * im) * 0.5;
          }
        }
        {
          var totalenergy = 0;
          for (var j = 11; j < Encoder.HBLKSIZE; j++)
            totalenergy += fftenergy[j];
          gfc.tot_ener[chn] = totalenergy;
        }
        if (gfp.analysis) {
          abort();
        }
        if (gfp.athaa_loudapprox == 2 && chn < 2) {
          gfc.loudness_sq[gr_out][chn] = gfc.loudness_sq_save[chn];
          gfc.loudness_sq_save[chn] = psycho_loudness_approx(fftenergy, gfc);
        }
      }
      var I1LIMIT = 8;
      var I2LIMIT = 23;
      var MLIMIT = 15;
      var ma_max_i1;
      var ma_max_i2;
      var ma_max_m;
      var tab = [
        1,
        0.79433,
        0.63096,
        0.63096,
        0.63096,
        0.63096,
        0.63096,
        0.25119,
        0.11749
      ];
      function init_mask_add_max_values() {
        ma_max_i1 = Math.pow(10, (I1LIMIT + 1) / 16);
        ma_max_i2 = Math.pow(10, (I2LIMIT + 1) / 16);
        ma_max_m = Math.pow(10, MLIMIT / 10);
      }
      var table1 = [
        3.3246 * 3.3246,
        3.23837 * 3.23837,
        3.15437 * 3.15437,
        3.00412 * 3.00412,
        2.86103 * 2.86103,
        2.65407 * 2.65407,
        2.46209 * 2.46209,
        2.284 * 2.284,
        2.11879 * 2.11879,
        1.96552 * 1.96552,
        1.82335 * 1.82335,
        1.69146 * 1.69146,
        1.56911 * 1.56911,
        1.46658 * 1.46658,
        1.37074 * 1.37074,
        1.31036 * 1.31036,
        1.25264 * 1.25264,
        1.20648 * 1.20648,
        1.16203 * 1.16203,
        1.12765 * 1.12765,
        1.09428 * 1.09428,
        1.0659 * 1.0659,
        1.03826 * 1.03826,
        1.01895 * 1.01895,
        1
      ];
      var table2 = [
        1.33352 * 1.33352,
        1.35879 * 1.35879,
        1.38454 * 1.38454,
        1.39497 * 1.39497,
        1.40548 * 1.40548,
        1.3537 * 1.3537,
        1.30382 * 1.30382,
        1.22321 * 1.22321,
        1.14758 * 1.14758,
        1
      ];
      var table3 = [
        2.35364 * 2.35364,
        2.29259 * 2.29259,
        2.23313 * 2.23313,
        2.12675 * 2.12675,
        2.02545 * 2.02545,
        1.87894 * 1.87894,
        1.74303 * 1.74303,
        1.61695 * 1.61695,
        1.49999 * 1.49999,
        1.39148 * 1.39148,
        1.29083 * 1.29083,
        1.19746 * 1.19746,
        1.11084 * 1.11084,
        1.03826 * 1.03826
      ];
      function mask_add(m1, m2, kk, b, gfc, shortblock) {
        var ratio;
        if (m2 > m1) {
          if (m2 < m1 * ma_max_i2)
            ratio = m2 / m1;
          else
            return m1 + m2;
        } else {
          if (m1 >= m2 * ma_max_i2)
            return m1 + m2;
          ratio = m1 / m2;
        }
        m1 += m2;
        if (b + 3 <= 3 + 3) {
          if (ratio >= ma_max_i1) {
            return m1;
          }
          var i = 0 | Util.FAST_LOG10_X(ratio, 16);
          return m1 * table2[i];
        }
        var i = 0 | Util.FAST_LOG10_X(ratio, 16);
        if (shortblock != 0) {
          m2 = gfc.ATH.cb_s[kk] * gfc.ATH.adjust;
        } else {
          m2 = gfc.ATH.cb_l[kk] * gfc.ATH.adjust;
        }
        if (m1 < ma_max_m * m2) {
          if (m1 > m2) {
            var f2, r;
            f2 = 1;
            if (i <= 13)
              f2 = table3[i];
            r = Util.FAST_LOG10_X(m1 / m2, 10 / 15);
            return m1 * ((table1[i] - f2) * r + f2);
          }
          if (i > 13)
            return m1;
          return m1 * table3[i];
        }
        return m1 * table1[i];
      }
      function convert_partition2scalefac_s(gfc, eb, thr, chn, sblock) {
        var sb, b;
        var enn = 0;
        var thmm = 0;
        for (sb = b = 0; sb < Encoder.SBMAX_s; ++b, ++sb) {
          var bo_s_sb = gfc.bo_s[sb];
          var npart_s = gfc.npart_s;
          var b_lim = bo_s_sb < npart_s ? bo_s_sb : npart_s;
          while (b < b_lim) {
            enn += eb[b];
            thmm += thr[b];
            b++;
          }
          gfc.en[chn].s[sb][sblock] = enn;
          gfc.thm[chn].s[sb][sblock] = thmm;
          if (b >= npart_s) {
            ++sb;
            break;
          }
          {
            var w_curr = gfc.PSY.bo_s_weight[sb];
            var w_next = 1 - w_curr;
            enn = w_curr * eb[b];
            thmm = w_curr * thr[b];
            gfc.en[chn].s[sb][sblock] += enn;
            gfc.thm[chn].s[sb][sblock] += thmm;
            enn = w_next * eb[b];
            thmm = w_next * thr[b];
          }
        }
        for (; sb < Encoder.SBMAX_s; ++sb) {
          gfc.en[chn].s[sb][sblock] = 0;
          gfc.thm[chn].s[sb][sblock] = 0;
        }
      }
      function convert_partition2scalefac_l(gfc, eb, thr, chn) {
        var sb, b;
        var enn = 0;
        var thmm = 0;
        for (sb = b = 0; sb < Encoder.SBMAX_l; ++b, ++sb) {
          var bo_l_sb = gfc.bo_l[sb];
          var npart_l = gfc.npart_l;
          var b_lim = bo_l_sb < npart_l ? bo_l_sb : npart_l;
          while (b < b_lim) {
            enn += eb[b];
            thmm += thr[b];
            b++;
          }
          gfc.en[chn].l[sb] = enn;
          gfc.thm[chn].l[sb] = thmm;
          if (b >= npart_l) {
            ++sb;
            break;
          }
          {
            var w_curr = gfc.PSY.bo_l_weight[sb];
            var w_next = 1 - w_curr;
            enn = w_curr * eb[b];
            thmm = w_curr * thr[b];
            gfc.en[chn].l[sb] += enn;
            gfc.thm[chn].l[sb] += thmm;
            enn = w_next * eb[b];
            thmm = w_next * thr[b];
          }
        }
        for (; sb < Encoder.SBMAX_l; ++sb) {
          gfc.en[chn].l[sb] = 0;
          gfc.thm[chn].l[sb] = 0;
        }
      }
      function compute_masking_s(gfp, fftenergy_s, eb, thr, chn, sblock) {
        var gfc = gfp.internal_flags;
        var j, b;
        for (b = j = 0; b < gfc.npart_s; ++b) {
          var ebb = 0;
          var n2 = gfc.numlines_s[b];
          for (var i = 0; i < n2; ++i, ++j) {
            var el = fftenergy_s[sblock][j];
            ebb += el;
          }
          eb[b] = ebb;
        }
        for (j = b = 0; b < gfc.npart_s; b++) {
          var kk = gfc.s3ind_s[b][0];
          var ecb = gfc.s3_ss[j++] * eb[kk];
          ++kk;
          while (kk <= gfc.s3ind_s[b][1]) {
            ecb += gfc.s3_ss[j] * eb[kk];
            ++j;
            ++kk;
          }
          {
            var x = rpelev_s * gfc.nb_s1[chn][b];
            thr[b] = Math.min(ecb, x);
          }
          if (gfc.blocktype_old[chn & 1] == Encoder.SHORT_TYPE) {
            var x = rpelev2_s * gfc.nb_s2[chn][b];
            var y = thr[b];
            thr[b] = Math.min(x, y);
          }
          gfc.nb_s2[chn][b] = gfc.nb_s1[chn][b];
          gfc.nb_s1[chn][b] = ecb;
        }
        for (; b <= Encoder.CBANDS; ++b) {
          eb[b] = 0;
          thr[b] = 0;
        }
      }
      function block_type_set(gfp, uselongblock, blocktype_d, blocktype) {
        var gfc = gfp.internal_flags;
        if (gfp.short_blocks == ShortBlock.short_block_coupled && !(uselongblock[0] != 0 && uselongblock[1] != 0))
          uselongblock[0] = uselongblock[1] = 0;
        for (var chn = 0; chn < gfc.channels_out; chn++) {
          blocktype[chn] = Encoder.NORM_TYPE;
          if (gfp.short_blocks == ShortBlock.short_block_dispensed)
            uselongblock[chn] = 1;
          if (gfp.short_blocks == ShortBlock.short_block_forced)
            uselongblock[chn] = 0;
          if (uselongblock[chn] != 0) {
            if (gfc.blocktype_old[chn] == Encoder.SHORT_TYPE)
              blocktype[chn] = Encoder.STOP_TYPE;
          } else {
            blocktype[chn] = Encoder.SHORT_TYPE;
            if (gfc.blocktype_old[chn] == Encoder.NORM_TYPE) {
              gfc.blocktype_old[chn] = Encoder.START_TYPE;
            }
            if (gfc.blocktype_old[chn] == Encoder.STOP_TYPE)
              gfc.blocktype_old[chn] = Encoder.SHORT_TYPE;
          }
          blocktype_d[chn] = gfc.blocktype_old[chn];
          gfc.blocktype_old[chn] = blocktype[chn];
        }
      }
      function NS_INTERP(x, y, r) {
        if (r >= 1) {
          return x;
        }
        if (r <= 0)
          return y;
        if (y > 0) {
          return Math.pow(x / y, r) * y;
        }
        return 0;
      }
      var regcoef_s = [
        11.8,
        13.6,
        17.2,
        32,
        46.5,
        51.3,
        57.5,
        67.1,
        71.5,
        84.6,
        97.6,
        130
        /* 255.8 */
      ];
      function pecalc_s(mr, masking_lower) {
        var pe_s = 1236.28 / 4;
        for (var sb = 0; sb < Encoder.SBMAX_s - 1; sb++) {
          for (var sblock = 0; sblock < 3; sblock++) {
            var thm = mr.thm.s[sb][sblock];
            if (thm > 0) {
              var x = thm * masking_lower;
              var en = mr.en.s[sb][sblock];
              if (en > x) {
                if (en > x * 1e10) {
                  pe_s += regcoef_s[sb] * (10 * LOG10);
                } else {
                  pe_s += regcoef_s[sb] * Util.FAST_LOG10(en / x);
                }
              }
            }
          }
        }
        return pe_s;
      }
      var regcoef_l = [
        6.8,
        5.8,
        5.8,
        6.4,
        6.5,
        9.9,
        12.1,
        14.4,
        15,
        18.9,
        21.6,
        26.9,
        34.2,
        40.2,
        46.8,
        56.5,
        60.7,
        73.9,
        85.7,
        93.4,
        126.1
        /* 241.3 */
      ];
      function pecalc_l(mr, masking_lower) {
        var pe_l = 1124.23 / 4;
        for (var sb = 0; sb < Encoder.SBMAX_l - 1; sb++) {
          var thm = mr.thm.l[sb];
          if (thm > 0) {
            var x = thm * masking_lower;
            var en = mr.en.l[sb];
            if (en > x) {
              if (en > x * 1e10) {
                pe_l += regcoef_l[sb] * (10 * LOG10);
              } else {
                pe_l += regcoef_l[sb] * Util.FAST_LOG10(en / x);
              }
            }
          }
        }
        return pe_l;
      }
      function calc_energy(gfc, fftenergy, eb, max, avg) {
        var b, j;
        for (b = j = 0; b < gfc.npart_l; ++b) {
          var ebb = 0, m = 0;
          var i;
          for (i = 0; i < gfc.numlines_l[b]; ++i, ++j) {
            var el = fftenergy[j];
            ebb += el;
            if (m < el)
              m = el;
          }
          eb[b] = ebb;
          max[b] = m;
          avg[b] = ebb * gfc.rnumlines_l[b];
        }
      }
      function calc_mask_index_l(gfc, max, avg, mask_idx) {
        var last_tab_entry = tab.length - 1;
        var b = 0;
        var a = avg[b] + avg[b + 1];
        if (a > 0) {
          var m = max[b];
          if (m < max[b + 1])
            m = max[b + 1];
          a = 20 * (m * 2 - a) / (a * (gfc.numlines_l[b] + gfc.numlines_l[b + 1] - 1));
          var k = 0 | a;
          if (k > last_tab_entry)
            k = last_tab_entry;
          mask_idx[b] = k;
        } else {
          mask_idx[b] = 0;
        }
        for (b = 1; b < gfc.npart_l - 1; b++) {
          a = avg[b - 1] + avg[b] + avg[b + 1];
          if (a > 0) {
            var m = max[b - 1];
            if (m < max[b])
              m = max[b];
            if (m < max[b + 1])
              m = max[b + 1];
            a = 20 * (m * 3 - a) / (a * (gfc.numlines_l[b - 1] + gfc.numlines_l[b] + gfc.numlines_l[b + 1] - 1));
            var k = 0 | a;
            if (k > last_tab_entry)
              k = last_tab_entry;
            mask_idx[b] = k;
          } else {
            mask_idx[b] = 0;
          }
        }
        a = avg[b - 1] + avg[b];
        if (a > 0) {
          var m = max[b - 1];
          if (m < max[b])
            m = max[b];
          a = 20 * (m * 2 - a) / (a * (gfc.numlines_l[b - 1] + gfc.numlines_l[b] - 1));
          var k = 0 | a;
          if (k > last_tab_entry)
            k = last_tab_entry;
          mask_idx[b] = k;
        } else {
          mask_idx[b] = 0;
        }
      }
      var fircoef = [
        -865163e-23 * 2,
        -851586e-8 * 2,
        -674764e-23 * 2,
        0.0209036 * 2,
        -336639e-22 * 2,
        -0.0438162 * 2,
        -154175e-22 * 2,
        0.0931738 * 2,
        -552212e-22 * 2,
        -0.313819 * 2
      ];
      this.L3psycho_anal_ns = function(gfp, buffer2, bufPos, gr_out, masking_ratio, masking_MS_ratio, percep_entropy, percep_MS_entropy, energy, blocktype_d) {
        var gfc = gfp.internal_flags;
        var wsamp_L = new_float_n([2, Encoder.BLKSIZE]);
        var wsamp_S = new_float_n([2, 3, Encoder.BLKSIZE_s]);
        var eb_l = new_float(Encoder.CBANDS + 1);
        var eb_s = new_float(Encoder.CBANDS + 1);
        var thr = new_float(Encoder.CBANDS + 2);
        var blocktype = new_int(2), uselongblock = new_int(2);
        var numchn, chn;
        var b, i, j, k;
        var sb, sblock;
        var ns_hpfsmpl = new_float_n([2, 576]);
        var pcfact;
        var mask_idx_l = new_int(Encoder.CBANDS + 2), mask_idx_s = new_int(Encoder.CBANDS + 2);
        Arrays.fill(mask_idx_s, 0);
        numchn = gfc.channels_out;
        if (gfp.mode == MPEGMode.JOINT_STEREO)
          numchn = 4;
        if (gfp.VBR == VbrMode.vbr_off)
          pcfact = gfc.ResvMax == 0 ? 0 : gfc.ResvSize / gfc.ResvMax * 0.5;
        else if (gfp.VBR == VbrMode.vbr_rh || gfp.VBR == VbrMode.vbr_mtrh || gfp.VBR == VbrMode.vbr_mt) {
          pcfact = 0.6;
        } else
          pcfact = 1;
        for (chn = 0; chn < gfc.channels_out; chn++) {
          var firbuf = buffer2[chn];
          var firbufPos = bufPos + 576 - 350 - NSFIRLEN + 192;
          for (i = 0; i < 576; i++) {
            var sum1, sum2;
            sum1 = firbuf[firbufPos + i + 10];
            sum2 = 0;
            for (j = 0; j < (NSFIRLEN - 1) / 2 - 1; j += 2) {
              sum1 += fircoef[j] * (firbuf[firbufPos + i + j] + firbuf[firbufPos + i + NSFIRLEN - j]);
              sum2 += fircoef[j + 1] * (firbuf[firbufPos + i + j + 1] + firbuf[firbufPos + i + NSFIRLEN - j - 1]);
            }
            ns_hpfsmpl[chn][i] = sum1 + sum2;
          }
          masking_ratio[gr_out][chn].en.assign(gfc.en[chn]);
          masking_ratio[gr_out][chn].thm.assign(gfc.thm[chn]);
          if (numchn > 2) {
            abort();
          }
        }
        for (chn = 0; chn < numchn; chn++) {
          var wsamp_l;
          var wsamp_s;
          var en_subshort = new_float(12);
          var en_short = [0, 0, 0, 0];
          var attack_intensity = new_float(12);
          var ns_uselongblock = 1;
          var attackThreshold;
          var max = new_float(Encoder.CBANDS), avg = new_float(Encoder.CBANDS);
          var ns_attacks = [0, 0, 0, 0];
          var fftenergy = new_float(Encoder.HBLKSIZE);
          var fftenergy_s = new_float_n([3, Encoder.HBLKSIZE_s]);
          for (i = 0; i < 3; i++) {
            en_subshort[i] = gfc.nsPsy.last_en_subshort[chn][i + 6];
            attack_intensity[i] = en_subshort[i] / gfc.nsPsy.last_en_subshort[chn][i + 4];
            en_short[0] += en_subshort[i];
          }
          if (chn == 2) {
            abort();
          }
          {
            var pf = ns_hpfsmpl[chn & 1];
            var pfPos = 0;
            for (i = 0; i < 9; i++) {
              var pfe = pfPos + 576 / 9;
              var p = 1;
              for (; pfPos < pfe; pfPos++)
                if (p < Math.abs(pf[pfPos]))
                  p = Math.abs(pf[pfPos]);
              gfc.nsPsy.last_en_subshort[chn][i] = en_subshort[i + 3] = p;
              en_short[1 + i / 3] += p;
              if (p > en_subshort[i + 3 - 2]) {
                p = p / en_subshort[i + 3 - 2];
              } else if (en_subshort[i + 3 - 2] > p * 10) {
                p = en_subshort[i + 3 - 2] / (p * 10);
              } else
                p = 0;
              attack_intensity[i + 3] = p;
            }
          }
          if (gfp.analysis) {
            abort();
          }
          attackThreshold = chn == 3 ? gfc.nsPsy.attackthre_s : gfc.nsPsy.attackthre;
          for (i = 0; i < 12; i++)
            if (0 == ns_attacks[i / 3] && attack_intensity[i] > attackThreshold)
              ns_attacks[i / 3] = i % 3 + 1;
          for (i = 1; i < 4; i++) {
            var ratio;
            if (en_short[i - 1] > en_short[i]) {
              ratio = en_short[i - 1] / en_short[i];
            } else {
              ratio = en_short[i] / en_short[i - 1];
            }
            if (ratio < 1.7) {
              ns_attacks[i] = 0;
              if (i == 1)
                ns_attacks[0] = 0;
            }
          }
          if (ns_attacks[0] != 0 && gfc.nsPsy.lastAttacks[chn] != 0)
            ns_attacks[0] = 0;
          if (gfc.nsPsy.lastAttacks[chn] == 3 || ns_attacks[0] + ns_attacks[1] + ns_attacks[2] + ns_attacks[3] != 0) {
            ns_uselongblock = 0;
            if (ns_attacks[1] != 0 && ns_attacks[0] != 0)
              ns_attacks[1] = 0;
            if (ns_attacks[2] != 0 && ns_attacks[1] != 0)
              ns_attacks[2] = 0;
            if (ns_attacks[3] != 0 && ns_attacks[2] != 0)
              ns_attacks[3] = 0;
          }
          if (chn < 2) {
            uselongblock[chn] = ns_uselongblock;
          } else {
            abort();
          }
          energy[chn] = gfc.tot_ener[chn];
          wsamp_s = wsamp_S;
          wsamp_l = wsamp_L;
          compute_ffts(
            gfp,
            fftenergy,
            fftenergy_s,
            wsamp_l,
            chn & 1,
            wsamp_s,
            chn & 1,
            gr_out,
            chn,
            buffer2,
            bufPos
          );
          calc_energy(gfc, fftenergy, eb_l, max, avg);
          calc_mask_index_l(gfc, max, avg, mask_idx_l);
          for (sblock = 0; sblock < 3; sblock++) {
            var enn, thmm;
            compute_masking_s(gfp, fftenergy_s, eb_s, thr, chn, sblock);
            convert_partition2scalefac_s(gfc, eb_s, thr, chn, sblock);
            for (sb = 0; sb < Encoder.SBMAX_s; sb++) {
              thmm = gfc.thm[chn].s[sb][sblock];
              thmm *= NS_PREECHO_ATT0;
              if (ns_attacks[sblock] >= 2 || ns_attacks[sblock + 1] == 1) {
                var idx = sblock != 0 ? sblock - 1 : 2;
                var p = NS_INTERP(
                  gfc.thm[chn].s[sb][idx],
                  thmm,
                  NS_PREECHO_ATT1 * pcfact
                );
                thmm = Math.min(thmm, p);
              }
              if (ns_attacks[sblock] == 1) {
                var idx = sblock != 0 ? sblock - 1 : 2;
                var p = NS_INTERP(
                  gfc.thm[chn].s[sb][idx],
                  thmm,
                  NS_PREECHO_ATT2 * pcfact
                );
                thmm = Math.min(thmm, p);
              } else if (sblock != 0 && ns_attacks[sblock - 1] == 3 || sblock == 0 && gfc.nsPsy.lastAttacks[chn] == 3) {
                var idx = sblock != 2 ? sblock + 1 : 0;
                var p = NS_INTERP(
                  gfc.thm[chn].s[sb][idx],
                  thmm,
                  NS_PREECHO_ATT2 * pcfact
                );
                thmm = Math.min(thmm, p);
              }
              enn = en_subshort[sblock * 3 + 3] + en_subshort[sblock * 3 + 4] + en_subshort[sblock * 3 + 5];
              if (en_subshort[sblock * 3 + 5] * 6 < enn) {
                thmm *= 0.5;
                if (en_subshort[sblock * 3 + 4] * 6 < enn)
                  thmm *= 0.5;
              }
              gfc.thm[chn].s[sb][sblock] = thmm;
            }
          }
          gfc.nsPsy.lastAttacks[chn] = ns_attacks[2];
          k = 0;
          {
            for (b = 0; b < gfc.npart_l; b++) {
              var kk = gfc.s3ind[b][0];
              var eb2 = eb_l[kk] * tab[mask_idx_l[kk]];
              var ecb = gfc.s3_ll[k++] * eb2;
              while (++kk <= gfc.s3ind[b][1]) {
                eb2 = eb_l[kk] * tab[mask_idx_l[kk]];
                ecb = mask_add(
                  ecb,
                  gfc.s3_ll[k++] * eb2,
                  kk,
                  kk - b,
                  gfc,
                  0
                );
              }
              ecb *= 0.158489319246111;
              if (gfc.blocktype_old[chn & 1] == Encoder.SHORT_TYPE)
                thr[b] = ecb;
              else
                thr[b] = NS_INTERP(
                  Math.min(ecb, Math.min(rpelev * gfc.nb_1[chn][b], rpelev2 * gfc.nb_2[chn][b])),
                  ecb,
                  pcfact
                );
              gfc.nb_2[chn][b] = gfc.nb_1[chn][b];
              gfc.nb_1[chn][b] = ecb;
            }
          }
          for (; b <= Encoder.CBANDS; ++b) {
            eb_l[b] = 0;
            thr[b] = 0;
          }
          convert_partition2scalefac_l(gfc, eb_l, thr, chn);
        }
        if (gfp.mode == MPEGMode.STEREO || gfp.mode == MPEGMode.JOINT_STEREO) {
          abort();
        }
        if (gfp.mode == MPEGMode.JOINT_STEREO) {
          abort();
        }
        block_type_set(gfp, uselongblock, blocktype_d, blocktype);
        for (chn = 0; chn < numchn; chn++) {
          var ppe;
          var ppePos = 0;
          var type;
          var mr;
          if (chn > 1) {
            abort();
          } else {
            ppe = percep_entropy;
            ppePos = 0;
            type = blocktype_d[chn];
            mr = masking_ratio[gr_out][chn];
          }
          if (type == Encoder.SHORT_TYPE)
            ppe[ppePos + chn] = pecalc_s(mr, gfc.masking_lower);
          else
            ppe[ppePos + chn] = pecalc_l(mr, gfc.masking_lower);
          if (gfp.analysis)
            gfc.pinfo.pe[gr_out][chn] = ppe[ppePos + chn];
        }
        return 0;
      };
      function s3_func(bark) {
        var tempx, x, tempy, temp;
        tempx = bark;
        if (tempx >= 0)
          tempx *= 3;
        else
          tempx *= 1.5;
        if (tempx >= 0.5 && tempx <= 2.5) {
          temp = tempx - 0.5;
          x = 8 * (temp * temp - 2 * temp);
        } else
          x = 0;
        tempx += 0.474;
        tempy = 15.811389 + 7.5 * tempx - 17.5 * Math.sqrt(1 + tempx * tempx);
        if (tempy <= -60)
          return 0;
        tempx = Math.exp((x + tempy) * LN_TO_LOG10);
        tempx /= 0.6609193;
        return tempx;
      }
      function freq2bark(freq) {
        if (freq < 0)
          freq = 0;
        freq = freq * 1e-3;
        return 13 * Math.atan(0.76 * freq) + 3.5 * Math.atan(freq * freq / (7.5 * 7.5));
      }
      function init_numline(numlines, bo, bm, bval, bval_width, mld, bo_w, sfreq, blksize, scalepos, deltafreq, sbmax) {
        var b_frq = new_float(Encoder.CBANDS + 1);
        var sample_freq_frac = sfreq / (sbmax > 15 ? 2 * 576 : 2 * 192);
        var partition = new_int(Encoder.HBLKSIZE);
        var i;
        sfreq /= blksize;
        var j = 0;
        var ni = 0;
        for (i = 0; i < Encoder.CBANDS; i++) {
          var bark1;
          var j2;
          bark1 = freq2bark(sfreq * j);
          b_frq[i] = sfreq * j;
          for (j2 = j; freq2bark(sfreq * j2) - bark1 < DELBARK && j2 <= blksize / 2; j2++)
            ;
          numlines[i] = j2 - j;
          ni = i + 1;
          while (j < j2) {
            partition[j++] = i;
          }
          if (j > blksize / 2) {
            j = blksize / 2;
            ++i;
            break;
          }
        }
        b_frq[i] = sfreq * j;
        for (var sfb = 0; sfb < sbmax; sfb++) {
          var i1, i2, start, end;
          var arg;
          start = scalepos[sfb];
          end = scalepos[sfb + 1];
          i1 = 0 | Math.floor(0.5 + deltafreq * (start - 0.5));
          if (i1 < 0)
            i1 = 0;
          i2 = 0 | Math.floor(0.5 + deltafreq * (end - 0.5));
          if (i2 > blksize / 2)
            i2 = blksize / 2;
          bm[sfb] = (partition[i1] + partition[i2]) / 2;
          bo[sfb] = partition[i2];
          var f_tmp = sample_freq_frac * end;
          bo_w[sfb] = (f_tmp - b_frq[bo[sfb]]) / (b_frq[bo[sfb] + 1] - b_frq[bo[sfb]]);
          if (bo_w[sfb] < 0) {
            bo_w[sfb] = 0;
          } else {
            if (bo_w[sfb] > 1) {
              bo_w[sfb] = 1;
            }
          }
          arg = freq2bark(sfreq * scalepos[sfb] * deltafreq);
          arg = Math.min(arg, 15.5) / 15.5;
          mld[sfb] = Math.pow(
            10,
            1.25 * (1 - Math.cos(Math.PI * arg)) - 2.5
          );
        }
        j = 0;
        for (var k = 0; k < ni; k++) {
          var w = numlines[k];
          var bark1, bark2;
          bark1 = freq2bark(sfreq * j);
          bark2 = freq2bark(sfreq * (j + w - 1));
          bval[k] = 0.5 * (bark1 + bark2);
          bark1 = freq2bark(sfreq * (j - 0.5));
          bark2 = freq2bark(sfreq * (j + w - 0.5));
          bval_width[k] = bark2 - bark1;
          j += w;
        }
        return ni;
      }
      function init_s3_values(s3ind, npart, bval, bval_width, norm, use_old_s3) {
        var s3 = new_float_n([Encoder.CBANDS, Encoder.CBANDS]);
        var j;
        var numberOfNoneZero = 0;
        if (use_old_s3) {
          for (var i = 0; i < npart; i++) {
            for (j = 0; j < npart; j++) {
              var v = s3_func(bval[i] - bval[j]) * bval_width[j];
              s3[i][j] = v * norm[i];
            }
          }
        } else {
          abort();
        }
        for (var i = 0; i < npart; i++) {
          for (j = 0; j < npart; j++) {
            if (s3[i][j] > 0)
              break;
          }
          s3ind[i][0] = j;
          for (j = npart - 1; j > 0; j--) {
            if (s3[i][j] > 0)
              break;
          }
          s3ind[i][1] = j;
          numberOfNoneZero += s3ind[i][1] - s3ind[i][0] + 1;
        }
        var p = new_float(numberOfNoneZero);
        var k = 0;
        for (var i = 0; i < npart; i++)
          for (j = s3ind[i][0]; j <= s3ind[i][1]; j++)
            p[k++] = s3[i][j];
        return p;
      }
      function stereo_demask(f2) {
        var arg = freq2bark(f2);
        arg = Math.min(arg, 15.5) / 15.5;
        return Math.pow(
          10,
          1.25 * (1 - Math.cos(Math.PI * arg)) - 2.5
        );
      }
      this.psymodel_init = function(gfp) {
        var gfc = gfp.internal_flags;
        var i;
        var useOldS3 = true;
        var bvl_a = 13, bvl_b = 24;
        var snr_l_a = 0, snr_l_b = 0;
        var snr_s_a = -8.25, snr_s_b = -4.5;
        var bval = new_float(Encoder.CBANDS);
        var bval_width = new_float(Encoder.CBANDS);
        var norm = new_float(Encoder.CBANDS);
        var sfreq = gfp.out_samplerate;
        switch (gfp.experimentalZ) {
          default:
          case 0:
            useOldS3 = true;
            break;
          case 1:
            useOldS3 = gfp.VBR == VbrMode.vbr_mtrh || gfp.VBR == VbrMode.vbr_mt ? false : true;
            break;
          case 2:
            useOldS3 = false;
            break;
          case 3:
            bvl_a = 8;
            snr_l_a = -1.75;
            snr_l_b = -0.0125;
            snr_s_a = -8.25;
            snr_s_b = -2.25;
            break;
        }
        gfc.ms_ener_ratio_old = 0.25;
        gfc.blocktype_old[0] = gfc.blocktype_old[1] = Encoder.NORM_TYPE;
        for (i = 0; i < 4; ++i) {
          for (var j = 0; j < Encoder.CBANDS; ++j) {
            gfc.nb_1[i][j] = 1e20;
            gfc.nb_2[i][j] = 1e20;
            gfc.nb_s1[i][j] = gfc.nb_s2[i][j] = 1;
          }
          for (var sb = 0; sb < Encoder.SBMAX_l; sb++) {
            gfc.en[i].l[sb] = 1e20;
            gfc.thm[i].l[sb] = 1e20;
          }
          for (var j = 0; j < 3; ++j) {
            for (var sb = 0; sb < Encoder.SBMAX_s; sb++) {
              gfc.en[i].s[sb][j] = 1e20;
              gfc.thm[i].s[sb][j] = 1e20;
            }
            gfc.nsPsy.lastAttacks[i] = 0;
          }
          for (var j = 0; j < 9; j++)
            gfc.nsPsy.last_en_subshort[i][j] = 10;
        }
        gfc.loudness_sq_save[0] = gfc.loudness_sq_save[1] = 0;
        gfc.npart_l = init_numline(
          gfc.numlines_l,
          gfc.bo_l,
          gfc.bm_l,
          bval,
          bval_width,
          gfc.mld_l,
          gfc.PSY.bo_l_weight,
          sfreq,
          Encoder.BLKSIZE,
          gfc.scalefac_band.l,
          Encoder.BLKSIZE / (2 * 576),
          Encoder.SBMAX_l
        );
        for (i = 0; i < gfc.npart_l; i++) {
          var snr = snr_l_a;
          if (bval[i] >= bvl_a) {
            snr = snr_l_b * (bval[i] - bvl_a) / (bvl_b - bvl_a) + snr_l_a * (bvl_b - bval[i]) / (bvl_b - bvl_a);
          }
          norm[i] = Math.pow(10, snr / 10);
          if (gfc.numlines_l[i] > 0) {
            gfc.rnumlines_l[i] = 1 / gfc.numlines_l[i];
          } else {
            gfc.rnumlines_l[i] = 0;
          }
        }
        gfc.s3_ll = init_s3_values(
          gfc.s3ind,
          gfc.npart_l,
          bval,
          bval_width,
          norm,
          useOldS3
        );
        var j = 0;
        for (i = 0; i < gfc.npart_l; i++) {
          var x;
          x = Float.MAX_VALUE;
          for (var k = 0; k < gfc.numlines_l[i]; k++, j++) {
            var freq = sfreq * j / (1e3 * Encoder.BLKSIZE);
            var level;
            level = this.ATHformula(freq * 1e3, gfp) - 20;
            level = Math.pow(10, 0.1 * level);
            level *= gfc.numlines_l[i];
            if (x > level)
              x = level;
          }
          gfc.ATH.cb_l[i] = x;
          x = -20 + bval[i] * 20 / 10;
          if (x > 6) {
            x = 100;
          }
          if (x < -15) {
            x = -15;
          }
          x -= 8;
          gfc.minval_l[i] = Math.pow(10, x / 10) * gfc.numlines_l[i];
        }
        gfc.npart_s = init_numline(
          gfc.numlines_s,
          gfc.bo_s,
          gfc.bm_s,
          bval,
          bval_width,
          gfc.mld_s,
          gfc.PSY.bo_s_weight,
          sfreq,
          Encoder.BLKSIZE_s,
          gfc.scalefac_band.s,
          Encoder.BLKSIZE_s / (2 * 192),
          Encoder.SBMAX_s
        );
        j = 0;
        for (i = 0; i < gfc.npart_s; i++) {
          var x;
          var snr = snr_s_a;
          if (bval[i] >= bvl_a) {
            snr = snr_s_b * (bval[i] - bvl_a) / (bvl_b - bvl_a) + snr_s_a * (bvl_b - bval[i]) / (bvl_b - bvl_a);
          }
          norm[i] = Math.pow(10, snr / 10);
          x = Float.MAX_VALUE;
          for (var k = 0; k < gfc.numlines_s[i]; k++, j++) {
            var freq = sfreq * j / (1e3 * Encoder.BLKSIZE_s);
            var level;
            level = this.ATHformula(freq * 1e3, gfp) - 20;
            level = Math.pow(10, 0.1 * level);
            level *= gfc.numlines_s[i];
            if (x > level)
              x = level;
          }
          gfc.ATH.cb_s[i] = x;
          x = -7 + bval[i] * 7 / 12;
          if (bval[i] > 12) {
            x *= 1 + Math.log(1 + x) * 3.1;
          }
          if (bval[i] < 12) {
            x *= 1 + Math.log(1 - x) * 2.3;
          }
          if (x < -15) {
            x = -15;
          }
          x -= 8;
          gfc.minval_s[i] = Math.pow(10, x / 10) * gfc.numlines_s[i];
        }
        gfc.s3_ss = init_s3_values(
          gfc.s3ind_s,
          gfc.npart_s,
          bval,
          bval_width,
          norm,
          useOldS3
        );
        init_mask_add_max_values();
        fft.init_fft(gfc);
        gfc.decay = Math.exp(-1 * LOG10 / (temporalmask_sustain_sec * sfreq / 192));
        {
          var msfix;
          msfix = NS_MSFIX;
          if ((gfp.exp_nspsytune & 2) != 0)
            msfix = 1;
          if (Math.abs(gfp.msfix) > 0)
            msfix = gfp.msfix;
          gfp.msfix = msfix;
          for (var b = 0; b < gfc.npart_l; b++)
            if (gfc.s3ind[b][1] > gfc.npart_l - 1)
              gfc.s3ind[b][1] = gfc.npart_l - 1;
        }
        var frame_duration = 576 * gfc.mode_gr / sfreq;
        gfc.ATH.decay = Math.pow(10, -12 / 10 * frame_duration);
        gfc.ATH.adjust = 0.01;
        gfc.ATH.adjustLimit = 1;
        if (gfp.ATHtype != -1) {
          var freq;
          var freq_inc = gfp.out_samplerate / Encoder.BLKSIZE;
          var eql_balance = 0;
          freq = 0;
          for (i = 0; i < Encoder.BLKSIZE / 2; ++i) {
            freq += freq_inc;
            gfc.ATH.eql_w[i] = 1 / Math.pow(10, this.ATHformula(freq, gfp) / 10);
            eql_balance += gfc.ATH.eql_w[i];
          }
          eql_balance = 1 / eql_balance;
          for (i = Encoder.BLKSIZE / 2; --i >= 0; ) {
            gfc.ATH.eql_w[i] *= eql_balance;
          }
        }
        {
          for (var b = j = 0; b < gfc.npart_s; ++b) {
            for (i = 0; i < gfc.numlines_s[b]; ++i) {
              ++j;
            }
          }
          for (var b = j = 0; b < gfc.npart_l; ++b) {
            for (i = 0; i < gfc.numlines_l[b]; ++i) {
              ++j;
            }
          }
        }
        j = 0;
        for (i = 0; i < gfc.npart_l; i++) {
          var freq = sfreq * (j + gfc.numlines_l[i] / 2) / (1 * Encoder.BLKSIZE);
          gfc.mld_cb_l[i] = stereo_demask(freq);
          j += gfc.numlines_l[i];
        }
        for (; i < Encoder.CBANDS; ++i) {
          gfc.mld_cb_l[i] = 1;
        }
        j = 0;
        for (i = 0; i < gfc.npart_s; i++) {
          var freq = sfreq * (j + gfc.numlines_s[i] / 2) / (1 * Encoder.BLKSIZE_s);
          gfc.mld_cb_s[i] = stereo_demask(freq);
          j += gfc.numlines_s[i];
        }
        for (; i < Encoder.CBANDS; ++i) {
          gfc.mld_cb_s[i] = 1;
        }
        return 0;
      };
      function ATHformula_GB(f2, value) {
        if (f2 < -0.3)
          f2 = 3410;
        f2 /= 1e3;
        f2 = Math.max(0.1, f2);
        var ath = 3.64 * Math.pow(f2, -0.8) - 6.8 * Math.exp(-0.6 * Math.pow(f2 - 3.4, 2)) + 6 * Math.exp(-0.15 * Math.pow(f2 - 8.7, 2)) + (0.6 + 0.04 * value) * 1e-3 * Math.pow(f2, 4);
        return ath;
      }
      this.ATHformula = function(f2, gfp) {
        var ath;
        switch (gfp.ATHtype) {
          case 0:
            ath = ATHformula_GB(f2, 9);
            break;
          case 1:
            ath = ATHformula_GB(f2, -1);
            break;
          case 2:
            ath = ATHformula_GB(f2, 0);
            break;
          case 3:
            ath = ATHformula_GB(f2, 1) + 6;
            break;
          case 4:
            ath = ATHformula_GB(f2, gfp.ATHcurve);
            break;
          default:
            ath = ATHformula_GB(f2, 0);
            break;
        }
        return ath;
      };
    }
    function Lame() {
      var self2 = this;
      var LAME_MAXALBUMART = 128 * 1024;
      Lame.V9 = 410;
      Lame.V8 = 420;
      Lame.V7 = 430;
      Lame.V6 = 440;
      Lame.V5 = 450;
      Lame.V4 = 460;
      Lame.V3 = 470;
      Lame.V2 = 480;
      Lame.V1 = 490;
      Lame.V0 = 500;
      Lame.R3MIX = 1e3;
      Lame.STANDARD = 1001;
      Lame.EXTREME = 1002;
      Lame.INSANE = 1003;
      Lame.STANDARD_FAST = 1004;
      Lame.EXTREME_FAST = 1005;
      Lame.MEDIUM = 1006;
      Lame.MEDIUM_FAST = 1007;
      var LAME_MAXMP3BUFFER = 16384 + LAME_MAXALBUMART;
      Lame.LAME_MAXMP3BUFFER = LAME_MAXMP3BUFFER;
      var ga;
      var bs;
      var p;
      var qupvt;
      var qu;
      var psy = new PsyModel();
      var vbr;
      var id3;
      this.enc = new Encoder();
      this.setModules = function(_ga, _bs, _p, _qupvt, _qu, _vbr, _ver, _id3, _mpglib) {
        ga = _ga;
        bs = _bs;
        p = _p;
        qupvt = _qupvt;
        qu = _qu;
        vbr = _vbr;
        id3 = _id3;
        this.enc.setModules(bs, psy, qupvt, vbr);
      };
      function PSY() {
        this.mask_adjust = 0;
        this.mask_adjust_short = 0;
        this.bo_l_weight = new_float(Encoder.SBMAX_l);
        this.bo_s_weight = new_float(Encoder.SBMAX_s);
      }
      function LowPassHighPass() {
        this.lowerlimit = 0;
      }
      function BandPass(bitrate, lPass) {
        this.lowpass = lPass;
      }
      var LAME_ID = 4294479419;
      function lame_init_old(gfp) {
        var gfc;
        gfp.class_id = LAME_ID;
        gfc = gfp.internal_flags = new LameInternalFlags();
        gfp.mode = MPEGMode.NOT_SET;
        gfp.original = 1;
        gfp.in_samplerate = 44100;
        gfp.num_channels = 2;
        gfp.num_samples = -1;
        gfp.bWriteVbrTag = true;
        gfp.quality = -1;
        gfp.short_blocks = null;
        gfc.subblock_gain = -1;
        gfp.lowpassfreq = 0;
        gfp.highpassfreq = 0;
        gfp.lowpasswidth = -1;
        gfp.highpasswidth = -1;
        gfp.VBR = VbrMode.vbr_off;
        gfp.VBR_q = 4;
        gfp.ATHcurve = -1;
        gfp.VBR_mean_bitrate_kbps = 128;
        gfp.VBR_min_bitrate_kbps = 0;
        gfp.VBR_max_bitrate_kbps = 0;
        gfp.VBR_hard_min = 0;
        gfc.VBR_min_bitrate = 1;
        gfc.VBR_max_bitrate = 13;
        gfp.quant_comp = -1;
        gfp.quant_comp_short = -1;
        gfp.msfix = -1;
        gfc.resample_ratio = 1;
        gfc.OldValue[0] = 180;
        gfc.OldValue[1] = 180;
        gfc.CurrentStep[0] = 4;
        gfc.CurrentStep[1] = 4;
        gfc.masking_lower = 1;
        gfc.nsPsy.attackthre = -1;
        gfc.nsPsy.attackthre_s = -1;
        gfp.scale = -1;
        gfp.athaa_type = -1;
        gfp.ATHtype = -1;
        gfp.athaa_loudapprox = -1;
        gfp.athaa_sensitivity = 0;
        gfp.useTemporal = null;
        gfp.interChRatio = -1;
        gfc.mf_samples_to_encode = Encoder.ENCDELAY + Encoder.POSTDELAY;
        gfp.encoder_padding = 0;
        gfc.mf_size = Encoder.ENCDELAY - Encoder.MDCTDELAY;
        gfp.findReplayGain = false;
        gfp.decode_on_the_fly = false;
        gfc.decode_on_the_fly = false;
        gfc.findReplayGain = false;
        gfc.findPeakSample = false;
        gfc.RadioGain = 0;
        gfc.AudiophileGain = 0;
        gfc.noclipGainChange = 0;
        gfc.noclipScale = -1;
        gfp.preset = 0;
        gfp.write_id3tag_automatic = true;
        return 0;
      }
      this.lame_init = function() {
        var gfp = new LameGlobalFlags();
        lame_init_old(gfp);
        gfp.lame_allocated_gfp = 1;
        return gfp;
      };
      function filter_coef(x) {
        if (x > 1)
          return 0;
        if (x <= 0)
          return 1;
        return Math.cos(Math.PI / 2 * x);
      }
      this.nearestBitrateFullIndex = function(bitrate) {
        var full_bitrate_table = [
          8,
          16,
          24,
          32,
          40,
          48,
          56,
          64,
          80,
          96,
          112,
          128,
          160,
          192,
          224,
          256,
          320
        ];
        var lower_range = 0, lower_range_kbps = 0, upper_range = 0, upper_range_kbps = 0;
        upper_range_kbps = full_bitrate_table[16];
        upper_range = 16;
        lower_range_kbps = full_bitrate_table[16];
        lower_range = 16;
        for (var b = 0; b < 16; b++) {
          if (Math.max(bitrate, full_bitrate_table[b + 1]) != bitrate) {
            upper_range_kbps = full_bitrate_table[b + 1];
            upper_range = b + 1;
            lower_range_kbps = full_bitrate_table[b];
            lower_range = b;
            break;
          }
        }
        if (upper_range_kbps - bitrate > bitrate - lower_range_kbps) {
          return lower_range;
        }
        return upper_range;
      };
      function SmpFrqIndex(sample_freq, gpf) {
        switch (sample_freq) {
          case 44100:
            gpf.version = 1;
            return 0;
          case 48e3:
            gpf.version = 1;
            return 1;
          case 32e3:
            gpf.version = 1;
            return 2;
          case 22050:
            gpf.version = 0;
            return 0;
          case 24e3:
            gpf.version = 0;
            return 1;
          case 16e3:
            gpf.version = 0;
            return 2;
          case 11025:
            gpf.version = 0;
            return 0;
          case 12e3:
            gpf.version = 0;
            return 1;
          case 8e3:
            gpf.version = 0;
            return 2;
          default:
            gpf.version = 0;
            return -1;
        }
      }
      function FindNearestBitrate(bRate, version2, samplerate) {
        if (samplerate < 16e3)
          version2 = 2;
        var bitrate = Tables.bitrate_table[version2][1];
        for (var i = 2; i <= 14; i++) {
          if (Tables.bitrate_table[version2][i] > 0) {
            if (Math.abs(Tables.bitrate_table[version2][i] - bRate) < Math.abs(bitrate - bRate))
              bitrate = Tables.bitrate_table[version2][i];
          }
        }
        return bitrate;
      }
      function BitrateIndex(bRate, version2, samplerate) {
        if (samplerate < 16e3)
          version2 = 2;
        for (var i = 0; i <= 14; i++) {
          if (Tables.bitrate_table[version2][i] > 0) {
            if (Tables.bitrate_table[version2][i] == bRate) {
              return i;
            }
          }
        }
        return -1;
      }
      function optimum_bandwidth(lh, bitrate) {
        var freq_map = [
          new BandPass(8, 2e3),
          new BandPass(16, 3700),
          new BandPass(24, 3900),
          new BandPass(32, 5500),
          new BandPass(40, 7e3),
          new BandPass(48, 7500),
          new BandPass(56, 1e4),
          new BandPass(64, 11e3),
          new BandPass(80, 13500),
          new BandPass(96, 15100),
          new BandPass(112, 15600),
          new BandPass(128, 17e3),
          new BandPass(160, 17500),
          new BandPass(192, 18600),
          new BandPass(224, 19400),
          new BandPass(256, 19700),
          new BandPass(320, 20500)
        ];
        var table_index = self2.nearestBitrateFullIndex(bitrate);
        lh.lowerlimit = freq_map[table_index].lowpass;
      }
      function lame_init_params_ppflt(gfp) {
        var gfc = gfp.internal_flags;
        var lowpass_band = 32;
        if (gfc.lowpass1 > 0) {
          var minband = 999;
          for (var band = 0; band <= 31; band++) {
            var freq = band / 31;
            if (freq >= gfc.lowpass2) {
              lowpass_band = Math.min(lowpass_band, band);
            }
            if (gfc.lowpass1 < freq && freq < gfc.lowpass2) {
              minband = Math.min(minband, band);
            }
          }
          if (minband == 999) {
            gfc.lowpass1 = (lowpass_band - 0.75) / 31;
          } else {
            gfc.lowpass1 = (minband - 0.75) / 31;
          }
          gfc.lowpass2 = lowpass_band / 31;
        }
        if (gfc.highpass2 > 0) {
          abort();
        }
        if (gfc.highpass2 > 0) {
          abort();
        }
        for (var band = 0; band < 32; band++) {
          var fc1, fc2;
          var freq = band / 31;
          if (gfc.highpass2 > gfc.highpass1) {
            abort();
          } else {
            fc1 = 1;
          }
          if (gfc.lowpass2 > gfc.lowpass1) {
            fc2 = filter_coef((freq - gfc.lowpass1) / (gfc.lowpass2 - gfc.lowpass1 + 1e-20));
          } else {
            fc2 = 1;
          }
          gfc.amp_filter[band] = fc1 * fc2;
        }
      }
      function lame_init_qval(gfp) {
        var gfc = gfp.internal_flags;
        switch (gfp.quality) {
          default:
          case 9:
            gfc.psymodel = 0;
            gfc.noise_shaping = 0;
            gfc.noise_shaping_amp = 0;
            gfc.noise_shaping_stop = 0;
            gfc.use_best_huffman = 0;
            gfc.full_outer_loop = 0;
            break;
          case 8:
            gfp.quality = 7;
          case 7:
            gfc.psymodel = 1;
            gfc.noise_shaping = 0;
            gfc.noise_shaping_amp = 0;
            gfc.noise_shaping_stop = 0;
            gfc.use_best_huffman = 0;
            gfc.full_outer_loop = 0;
            break;
          case 6:
            gfc.psymodel = 1;
            if (gfc.noise_shaping == 0)
              gfc.noise_shaping = 1;
            gfc.noise_shaping_amp = 0;
            gfc.noise_shaping_stop = 0;
            if (gfc.subblock_gain == -1)
              gfc.subblock_gain = 1;
            gfc.use_best_huffman = 0;
            gfc.full_outer_loop = 0;
            break;
          case 5:
            gfc.psymodel = 1;
            if (gfc.noise_shaping == 0)
              gfc.noise_shaping = 1;
            gfc.noise_shaping_amp = 0;
            gfc.noise_shaping_stop = 0;
            if (gfc.subblock_gain == -1)
              gfc.subblock_gain = 1;
            gfc.use_best_huffman = 0;
            gfc.full_outer_loop = 0;
            break;
          case 4:
            gfc.psymodel = 1;
            if (gfc.noise_shaping == 0)
              gfc.noise_shaping = 1;
            gfc.noise_shaping_amp = 0;
            gfc.noise_shaping_stop = 0;
            if (gfc.subblock_gain == -1)
              gfc.subblock_gain = 1;
            gfc.use_best_huffman = 1;
            gfc.full_outer_loop = 0;
            break;
          case 3:
            gfc.psymodel = 1;
            if (gfc.noise_shaping == 0)
              gfc.noise_shaping = 1;
            gfc.noise_shaping_amp = 1;
            gfc.noise_shaping_stop = 1;
            if (gfc.subblock_gain == -1)
              gfc.subblock_gain = 1;
            gfc.use_best_huffman = 1;
            gfc.full_outer_loop = 0;
            break;
          case 2:
            gfc.psymodel = 1;
            if (gfc.noise_shaping == 0)
              gfc.noise_shaping = 1;
            if (gfc.substep_shaping == 0)
              gfc.substep_shaping = 2;
            gfc.noise_shaping_amp = 1;
            gfc.noise_shaping_stop = 1;
            if (gfc.subblock_gain == -1)
              gfc.subblock_gain = 1;
            gfc.use_best_huffman = 1;
            gfc.full_outer_loop = 0;
            break;
          case 1:
            gfc.psymodel = 1;
            if (gfc.noise_shaping == 0)
              gfc.noise_shaping = 1;
            if (gfc.substep_shaping == 0)
              gfc.substep_shaping = 2;
            gfc.noise_shaping_amp = 2;
            gfc.noise_shaping_stop = 1;
            if (gfc.subblock_gain == -1)
              gfc.subblock_gain = 1;
            gfc.use_best_huffman = 1;
            gfc.full_outer_loop = 0;
            break;
          case 0:
            gfc.psymodel = 1;
            if (gfc.noise_shaping == 0)
              gfc.noise_shaping = 1;
            if (gfc.substep_shaping == 0)
              gfc.substep_shaping = 2;
            gfc.noise_shaping_amp = 2;
            gfc.noise_shaping_stop = 1;
            if (gfc.subblock_gain == -1)
              gfc.subblock_gain = 1;
            gfc.use_best_huffman = 1;
            gfc.full_outer_loop = 0;
            break;
        }
      }
      function lame_init_bitstream(gfp) {
        var gfc = gfp.internal_flags;
        gfp.frameNum = 0;
        if (gfp.write_id3tag_automatic) {
          id3.id3tag_write_v2(gfp);
        }
        gfc.bitrate_stereoMode_Hist = new_int_n([16, 4 + 1]);
        gfc.bitrate_blockType_Hist = new_int_n([16, 4 + 1 + 1]);
        gfc.PeakSample = 0;
        if (gfp.bWriteVbrTag)
          vbr.InitVbrTag(gfp);
      }
      this.lame_init_params = function(gfp) {
        var gfc = gfp.internal_flags;
        gfc.Class_ID = 0;
        if (gfc.ATH == null)
          gfc.ATH = new ATH();
        if (gfc.PSY == null)
          gfc.PSY = new PSY();
        if (gfc.rgdata == null)
          gfc.rgdata = new ReplayGain();
        gfc.channels_in = gfp.num_channels;
        if (gfc.channels_in == 1)
          gfp.mode = MPEGMode.MONO;
        gfc.channels_out = gfp.mode == MPEGMode.MONO ? 1 : 2;
        gfc.mode_ext = Encoder.MPG_MD_MS_LR;
        if (gfp.mode == MPEGMode.MONO)
          gfp.force_ms = false;
        if (gfp.VBR == VbrMode.vbr_off && gfp.VBR_mean_bitrate_kbps != 128 && gfp.brate == 0)
          gfp.brate = gfp.VBR_mean_bitrate_kbps;
        if (gfp.VBR == VbrMode.vbr_off || gfp.VBR == VbrMode.vbr_mtrh || gfp.VBR == VbrMode.vbr_mt)
          ;
        else {
          gfp.free_format = false;
        }
        if (gfp.VBR == VbrMode.vbr_off && gfp.brate == 0) {
          abort();
        }
        if (gfp.VBR == VbrMode.vbr_off && gfp.compression_ratio > 0) {
          abort();
        }
        if (gfp.out_samplerate != 0) {
          if (gfp.out_samplerate < 16e3) {
            gfp.VBR_mean_bitrate_kbps = Math.max(
              gfp.VBR_mean_bitrate_kbps,
              8
            );
            gfp.VBR_mean_bitrate_kbps = Math.min(
              gfp.VBR_mean_bitrate_kbps,
              64
            );
          } else if (gfp.out_samplerate < 32e3) {
            gfp.VBR_mean_bitrate_kbps = Math.max(
              gfp.VBR_mean_bitrate_kbps,
              8
            );
            gfp.VBR_mean_bitrate_kbps = Math.min(
              gfp.VBR_mean_bitrate_kbps,
              160
            );
          } else {
            gfp.VBR_mean_bitrate_kbps = Math.max(
              gfp.VBR_mean_bitrate_kbps,
              32
            );
            gfp.VBR_mean_bitrate_kbps = Math.min(
              gfp.VBR_mean_bitrate_kbps,
              320
            );
          }
        }
        if (gfp.lowpassfreq == 0) {
          var lowpass = 16e3;
          switch (gfp.VBR) {
            case VbrMode.vbr_off: {
              var lh = new LowPassHighPass();
              optimum_bandwidth(lh, gfp.brate);
              lowpass = lh.lowerlimit;
              break;
            }
            case VbrMode.vbr_abr: {
              var lh = new LowPassHighPass();
              optimum_bandwidth(lh, gfp.VBR_mean_bitrate_kbps);
              lowpass = lh.lowerlimit;
              break;
            }
            case VbrMode.vbr_rh: {
              abort();
            }
            default: {
              abort();
            }
          }
          if (gfp.mode == MPEGMode.MONO && (gfp.VBR == VbrMode.vbr_off || gfp.VBR == VbrMode.vbr_abr))
            lowpass *= 1.5;
          gfp.lowpassfreq = lowpass | 0;
        }
        if (gfp.out_samplerate == 0) {
          abort();
        }
        gfp.lowpassfreq = Math.min(20500, gfp.lowpassfreq);
        gfp.lowpassfreq = Math.min(gfp.out_samplerate / 2, gfp.lowpassfreq);
        if (gfp.VBR == VbrMode.vbr_off) {
          gfp.compression_ratio = gfp.out_samplerate * 16 * gfc.channels_out / (1e3 * gfp.brate);
        }
        if (gfp.VBR == VbrMode.vbr_abr) {
          abort();
        }
        if (!gfp.bWriteVbrTag) {
          gfp.findReplayGain = false;
          gfp.decode_on_the_fly = false;
          gfc.findPeakSample = false;
        }
        gfc.findReplayGain = gfp.findReplayGain;
        gfc.decode_on_the_fly = gfp.decode_on_the_fly;
        if (gfc.decode_on_the_fly)
          gfc.findPeakSample = true;
        if (gfc.findReplayGain) {
          abort();
        }
        if (gfc.decode_on_the_fly && !gfp.decode_only) {
          abort();
        }
        gfc.mode_gr = gfp.out_samplerate <= 24e3 ? 1 : 2;
        gfp.framesize = 576 * gfc.mode_gr;
        gfp.encoder_delay = Encoder.ENCDELAY;
        gfc.resample_ratio = gfp.in_samplerate / gfp.out_samplerate;
        switch (gfp.VBR) {
          case VbrMode.vbr_mt:
          case VbrMode.vbr_rh:
          case VbrMode.vbr_mtrh:
            {
              var cmp = [
                5.7,
                6.5,
                7.3,
                8.2,
                10,
                11.9,
                13,
                14,
                15,
                16.5
              ];
              gfp.compression_ratio = cmp[gfp.VBR_q];
            }
            break;
          case VbrMode.vbr_abr:
            gfp.compression_ratio = gfp.out_samplerate * 16 * gfc.channels_out / (1e3 * gfp.VBR_mean_bitrate_kbps);
            break;
          default:
            gfp.compression_ratio = gfp.out_samplerate * 16 * gfc.channels_out / (1e3 * gfp.brate);
            break;
        }
        if (gfp.mode == MPEGMode.NOT_SET) {
          gfp.mode = MPEGMode.JOINT_STEREO;
        }
        if (gfp.highpassfreq > 0) {
          abort();
        } else {
          gfc.highpass1 = 0;
          gfc.highpass2 = 0;
        }
        if (gfp.lowpassfreq > 0) {
          gfc.lowpass2 = 2 * gfp.lowpassfreq;
          if (gfp.lowpasswidth >= 0) {
            abort();
          } else {
            gfc.lowpass1 = (1 - 0) * 2 * gfp.lowpassfreq;
          }
          gfc.lowpass1 /= gfp.out_samplerate;
          gfc.lowpass2 /= gfp.out_samplerate;
        } else {
          abort();
        }
        lame_init_params_ppflt(gfp);
        gfc.samplerate_index = SmpFrqIndex(gfp.out_samplerate, gfp);
        if (gfc.samplerate_index < 0) {
          abort();
        }
        if (gfp.VBR == VbrMode.vbr_off) {
          if (gfp.free_format) {
            gfc.bitrate_index = 0;
          } else {
            gfp.brate = FindNearestBitrate(
              gfp.brate,
              gfp.version,
              gfp.out_samplerate
            );
            gfc.bitrate_index = BitrateIndex(
              gfp.brate,
              gfp.version,
              gfp.out_samplerate
            );
            if (gfc.bitrate_index <= 0) {
              abort();
            }
          }
        } else {
          gfc.bitrate_index = 1;
        }
        if (gfp.analysis)
          gfp.bWriteVbrTag = false;
        if (gfc.pinfo != null)
          gfp.bWriteVbrTag = false;
        bs.init_bit_stream_w(gfc);
        var j = gfc.samplerate_index + 3 * gfp.version + 6 * (gfp.out_samplerate < 16e3 ? 1 : 0);
        for (var i = 0; i < Encoder.SBMAX_l + 1; i++)
          gfc.scalefac_band.l[i] = qupvt.sfBandIndex[j].l[i];
        for (var i = 0; i < Encoder.PSFB21 + 1; i++) {
          var size2 = (gfc.scalefac_band.l[22] - gfc.scalefac_band.l[21]) / Encoder.PSFB21;
          var start = gfc.scalefac_band.l[21] + i * size2;
          gfc.scalefac_band.psfb21[i] = start;
        }
        gfc.scalefac_band.psfb21[Encoder.PSFB21] = 576;
        for (var i = 0; i < Encoder.SBMAX_s + 1; i++)
          gfc.scalefac_band.s[i] = qupvt.sfBandIndex[j].s[i];
        for (var i = 0; i < Encoder.PSFB12 + 1; i++) {
          var size2 = (gfc.scalefac_band.s[13] - gfc.scalefac_band.s[12]) / Encoder.PSFB12;
          var start = gfc.scalefac_band.s[12] + i * size2;
          gfc.scalefac_band.psfb12[i] = start;
        }
        gfc.scalefac_band.psfb12[Encoder.PSFB12] = 192;
        if (gfp.version == 1)
          gfc.sideinfo_len = gfc.channels_out == 1 ? 4 + 17 : 4 + 32;
        else
          gfc.sideinfo_len = gfc.channels_out == 1 ? 4 + 9 : 4 + 17;
        if (gfp.error_protection)
          gfc.sideinfo_len += 2;
        lame_init_bitstream(gfp);
        gfc.Class_ID = LAME_ID;
        {
          var k;
          for (k = 0; k < 19; k++)
            gfc.nsPsy.pefirbuf[k] = 700 * gfc.mode_gr * gfc.channels_out;
          if (gfp.ATHtype == -1)
            gfp.ATHtype = 4;
        }
        switch (gfp.VBR) {
          case VbrMode.vbr_mt:
            gfp.VBR = VbrMode.vbr_mtrh;
          case VbrMode.vbr_mtrh: {
            if (gfp.useTemporal == null) {
              gfp.useTemporal = false;
            }
            p.apply_preset(gfp, 500 - gfp.VBR_q * 10, 0);
            if (gfp.quality < 0)
              gfp.quality = LAME_DEFAULT_QUALITY;
            if (gfp.quality < 5)
              gfp.quality = 0;
            if (gfp.quality > 5)
              gfp.quality = 5;
            gfc.PSY.mask_adjust = gfp.maskingadjust;
            gfc.PSY.mask_adjust_short = gfp.maskingadjust_short;
            if (gfp.experimentalY)
              gfc.sfb21_extra = false;
            else
              gfc.sfb21_extra = gfp.out_samplerate > 44e3;
            gfc.iteration_loop = new VBRNewIterationLoop(qu);
            break;
          }
          case VbrMode.vbr_rh: {
            p.apply_preset(gfp, 500 - gfp.VBR_q * 10, 0);
            gfc.PSY.mask_adjust = gfp.maskingadjust;
            gfc.PSY.mask_adjust_short = gfp.maskingadjust_short;
            if (gfp.experimentalY)
              gfc.sfb21_extra = false;
            else
              gfc.sfb21_extra = gfp.out_samplerate > 44e3;
            if (gfp.quality > 6)
              gfp.quality = 6;
            if (gfp.quality < 0)
              gfp.quality = LAME_DEFAULT_QUALITY;
            gfc.iteration_loop = new VBROldIterationLoop(qu);
            break;
          }
          default: {
            var vbrmode;
            gfc.sfb21_extra = false;
            if (gfp.quality < 0)
              gfp.quality = LAME_DEFAULT_QUALITY;
            vbrmode = gfp.VBR;
            if (vbrmode == VbrMode.vbr_off)
              gfp.VBR_mean_bitrate_kbps = gfp.brate;
            p.apply_preset(gfp, gfp.VBR_mean_bitrate_kbps, 0);
            gfp.VBR = vbrmode;
            gfc.PSY.mask_adjust = gfp.maskingadjust;
            gfc.PSY.mask_adjust_short = gfp.maskingadjust_short;
            if (vbrmode == VbrMode.vbr_off) {
              gfc.iteration_loop = new CBRNewIterationLoop(qu);
            } else {
              abort();
            }
            break;
          }
        }
        if (gfp.VBR != VbrMode.vbr_off) {
          abort();
        }
        if (gfp.tune) {
          abort();
        }
        lame_init_qval(gfp);
        if (gfp.athaa_type < 0)
          gfc.ATH.useAdjust = 3;
        else
          gfc.ATH.useAdjust = gfp.athaa_type;
        gfc.ATH.aaSensitivityP = Math.pow(10, gfp.athaa_sensitivity / -10);
        if (gfp.short_blocks == null) {
          gfp.short_blocks = ShortBlock.short_block_allowed;
        }
        if (gfp.short_blocks == ShortBlock.short_block_allowed && (gfp.mode == MPEGMode.JOINT_STEREO || gfp.mode == MPEGMode.STEREO)) {
          gfp.short_blocks = ShortBlock.short_block_coupled;
        }
        if (gfp.quant_comp < 0)
          gfp.quant_comp = 1;
        if (gfp.quant_comp_short < 0)
          gfp.quant_comp_short = 0;
        if (gfp.msfix < 0)
          gfp.msfix = 0;
        gfp.exp_nspsytune = gfp.exp_nspsytune | 1;
        if (gfp.internal_flags.nsPsy.attackthre < 0)
          gfp.internal_flags.nsPsy.attackthre = PsyModel.NSATTACKTHRE;
        if (gfp.internal_flags.nsPsy.attackthre_s < 0)
          gfp.internal_flags.nsPsy.attackthre_s = PsyModel.NSATTACKTHRE_S;
        if (gfp.scale < 0)
          gfp.scale = 1;
        if (gfp.ATHtype < 0)
          gfp.ATHtype = 4;
        if (gfp.ATHcurve < 0)
          gfp.ATHcurve = 4;
        if (gfp.athaa_loudapprox < 0)
          gfp.athaa_loudapprox = 2;
        if (gfp.interChRatio < 0)
          gfp.interChRatio = 0;
        if (gfp.useTemporal == null)
          gfp.useTemporal = true;
        gfc.slot_lag = gfc.frac_SpF = 0;
        if (gfp.VBR == VbrMode.vbr_off)
          gfc.slot_lag = gfc.frac_SpF = (gfp.version + 1) * 72e3 * gfp.brate % gfp.out_samplerate | 0;
        qupvt.iteration_init(gfp);
        psy.psymodel_init(gfp);
        return 0;
      };
      function update_inbuffer_size(gfc, nsamples) {
        if (gfc.in_buffer_0 == null || gfc.in_buffer_nsamples < nsamples) {
          gfc.in_buffer_0 = new_float(nsamples);
          gfc.in_buffer_1 = new_float(nsamples);
          gfc.in_buffer_nsamples = nsamples;
        }
      }
      this.lame_encode_flush = function(gfp, mp3buffer, mp3bufferPos, mp3buffer_size) {
        var gfc = gfp.internal_flags;
        var buffer2 = new_short_n([2, 1152]);
        var imp3 = 0, mp3count, mp3buffer_size_remaining;
        var end_padding;
        var frames_left;
        var samples_to_encode = gfc.mf_samples_to_encode - Encoder.POSTDELAY;
        var mf_needed = calcNeeded(gfp);
        if (gfc.mf_samples_to_encode < 1) {
          return 0;
        }
        mp3count = 0;
        if (gfp.in_samplerate != gfp.out_samplerate) {
          abort();
        }
        end_padding = gfp.framesize - samples_to_encode % gfp.framesize;
        if (end_padding < 576)
          end_padding += gfp.framesize;
        gfp.encoder_padding = end_padding;
        frames_left = (samples_to_encode + end_padding) / gfp.framesize;
        while (frames_left > 0 && imp3 >= 0) {
          var bunch = mf_needed - gfc.mf_size;
          var frame_num = gfp.frameNum;
          bunch *= gfp.in_samplerate;
          bunch /= gfp.out_samplerate;
          if (bunch > 1152)
            bunch = 1152;
          if (bunch < 1)
            bunch = 1;
          mp3buffer_size_remaining = mp3buffer_size - mp3count;
          if (mp3buffer_size == 0)
            mp3buffer_size_remaining = 0;
          imp3 = this.lame_encode_buffer(
            gfp,
            buffer2[0],
            buffer2[1],
            bunch,
            mp3buffer,
            mp3bufferPos,
            mp3buffer_size_remaining
          );
          mp3bufferPos += imp3;
          mp3count += imp3;
          frames_left -= frame_num != gfp.frameNum ? 1 : 0;
        }
        gfc.mf_samples_to_encode = 0;
        if (imp3 < 0) {
          return imp3;
        }
        mp3buffer_size_remaining = mp3buffer_size - mp3count;
        if (mp3buffer_size == 0)
          mp3buffer_size_remaining = 0;
        bs.flush_bitstream(gfp);
        imp3 = bs.copy_buffer(
          gfc,
          mp3buffer,
          mp3bufferPos,
          mp3buffer_size_remaining,
          1
        );
        if (imp3 < 0) {
          return imp3;
        }
        mp3bufferPos += imp3;
        mp3count += imp3;
        mp3buffer_size_remaining = mp3buffer_size - mp3count;
        if (mp3buffer_size == 0)
          mp3buffer_size_remaining = 0;
        if (gfp.write_id3tag_automatic) {
          abort();
        }
        return mp3count;
      };
      this.lame_encode_buffer = function(gfp, buffer_l, buffer_r, nsamples, mp3buf, mp3bufPos, mp3buf_size) {
        var gfc = gfp.internal_flags;
        var in_buffer = [null, null];
        if (gfc.Class_ID != LAME_ID)
          return -3;
        if (nsamples == 0)
          return 0;
        update_inbuffer_size(gfc, nsamples);
        in_buffer[0] = gfc.in_buffer_0;
        in_buffer[1] = gfc.in_buffer_1;
        for (var i = 0; i < nsamples; i++) {
          in_buffer[0][i] = buffer_l[i];
          if (gfc.channels_in > 1)
            in_buffer[1][i] = buffer_r[i];
        }
        return lame_encode_buffer_sample(
          gfp,
          in_buffer[0],
          in_buffer[1],
          nsamples,
          mp3buf,
          mp3bufPos,
          mp3buf_size
        );
      };
      function calcNeeded(gfp) {
        var mf_needed = Encoder.BLKSIZE + gfp.framesize - Encoder.FFTOFFSET;
        mf_needed = Math.max(mf_needed, 512 + gfp.framesize - 32);
        return mf_needed;
      }
      function lame_encode_buffer_sample(gfp, buffer_l, buffer_r, nsamples, mp3buf, mp3bufPos, mp3buf_size) {
        var gfc = gfp.internal_flags;
        var mp3size = 0, ret, i, ch, mf_needed;
        var mp3out;
        var mfbuf = [null, null];
        var in_buffer = [null, null];
        if (gfc.Class_ID != LAME_ID)
          return -3;
        if (nsamples == 0)
          return 0;
        mp3out = bs.copy_buffer(gfc, mp3buf, mp3bufPos, mp3buf_size, 0);
        if (mp3out < 0)
          return mp3out;
        mp3bufPos += mp3out;
        mp3size += mp3out;
        in_buffer[0] = buffer_l;
        in_buffer[1] = buffer_r;
        if (BitStream.NEQ(gfp.scale, 0) && BitStream.NEQ(gfp.scale, 1)) {
          for (i = 0; i < nsamples; ++i) {
            in_buffer[0][i] *= gfp.scale;
            if (gfc.channels_out == 2)
              in_buffer[1][i] *= gfp.scale;
          }
        }
        if (BitStream.NEQ(gfp.scale_left, 0) && BitStream.NEQ(gfp.scale_left, 1)) {
          for (i = 0; i < nsamples; ++i) {
            in_buffer[0][i] *= gfp.scale_left;
          }
        }
        if (BitStream.NEQ(gfp.scale_right, 0) && BitStream.NEQ(gfp.scale_right, 1)) {
          for (i = 0; i < nsamples; ++i) {
            in_buffer[1][i] *= gfp.scale_right;
          }
        }
        if (gfp.num_channels == 2 && gfc.channels_out == 1) {
          abort();
        }
        mf_needed = calcNeeded(gfp);
        mfbuf[0] = gfc.mfbuf[0];
        mfbuf[1] = gfc.mfbuf[1];
        var in_bufferPos = 0;
        while (nsamples > 0) {
          var in_buffer_ptr = [null, null];
          var n_in = 0;
          var n_out = 0;
          in_buffer_ptr[0] = in_buffer[0];
          in_buffer_ptr[1] = in_buffer[1];
          var inOut = new InOut();
          fill_buffer(
            gfp,
            mfbuf,
            in_buffer_ptr,
            in_bufferPos,
            nsamples,
            inOut
          );
          n_in = inOut.n_in;
          n_out = inOut.n_out;
          if (gfc.findReplayGain && !gfc.decode_on_the_fly) {
            if (ga.AnalyzeSamples(
              gfc.rgdata,
              mfbuf[0],
              gfc.mf_size,
              mfbuf[1],
              gfc.mf_size,
              n_out,
              gfc.channels_out
            ) == GainAnalysis.GAIN_ANALYSIS_ERROR)
              return -6;
          }
          nsamples -= n_in;
          in_bufferPos += n_in;
          if (gfc.channels_out == 2)
            ;
          gfc.mf_size += n_out;
          if (gfc.mf_samples_to_encode < 1) {
            abort();
          }
          gfc.mf_samples_to_encode += n_out;
          if (gfc.mf_size >= mf_needed) {
            var buf_size = mp3buf_size - mp3size;
            if (mp3buf_size == 0)
              buf_size = 0;
            ret = lame_encode_frame(
              gfp,
              mfbuf[0],
              mfbuf[1],
              mp3buf,
              mp3bufPos,
              buf_size
            );
            if (ret < 0)
              return ret;
            mp3bufPos += ret;
            mp3size += ret;
            gfc.mf_size -= gfp.framesize;
            gfc.mf_samples_to_encode -= gfp.framesize;
            for (ch = 0; ch < gfc.channels_out; ch++)
              for (i = 0; i < gfc.mf_size; i++)
                mfbuf[ch][i] = mfbuf[ch][i + gfp.framesize];
          }
        }
        return mp3size;
      }
      function lame_encode_frame(gfp, inbuf_l, inbuf_r, mp3buf, mp3bufPos, mp3buf_size) {
        var ret = self2.enc.lame_encode_mp3_frame(
          gfp,
          inbuf_l,
          inbuf_r,
          mp3buf,
          mp3bufPos,
          mp3buf_size
        );
        gfp.frameNum++;
        return ret;
      }
      function InOut() {
        this.n_in = 0;
        this.n_out = 0;
      }
      function fill_buffer(gfp, mfbuf, in_buffer, in_bufferPos, nsamples, io) {
        var gfc = gfp.internal_flags;
        if (gfc.resample_ratio < 0.9999 || gfc.resample_ratio > 1.0001) {
          abort();
        } else {
          io.n_out = Math.min(gfp.framesize, nsamples);
          io.n_in = io.n_out;
          for (var i = 0; i < io.n_out; ++i) {
            mfbuf[0][gfc.mf_size + i] = in_buffer[0][in_bufferPos + i];
            if (gfc.channels_out == 2)
              mfbuf[1][gfc.mf_size + i] = in_buffer[1][in_bufferPos + i];
          }
        }
      }
    }
    function GetAudio() {
      this.setModules = function(parse2, mpg2) {
      };
    }
    function Parse() {
      this.setModules = function(ver2, id32, pre2) {
      };
    }
    function MPGLib() {
    }
    function ID3Tag() {
      this.setModules = function(_bits, _ver) {
      };
    }
    function Mp3Encoder(channels, samplerate, kbps) {
      if (channels != 1) {
        abort("fix cc: only supports mono");
      }
      var lame = new Lame();
      var gaud = new GetAudio();
      var ga = new GainAnalysis();
      var bs = new BitStream();
      var p = new Presets();
      var qupvt = new QuantizePVT();
      var qu = new Quantize();
      var vbr = new VBRTag();
      var ver = new Version();
      var id3 = new ID3Tag();
      var rv = new Reservoir();
      var tak = new Takehiro();
      var parse = new Parse();
      var mpg = new MPGLib();
      lame.setModules(ga, bs, p, qupvt, qu, vbr, ver, id3, mpg);
      bs.setModules(ga, mpg, ver, vbr);
      id3.setModules(bs, ver);
      p.setModules(lame);
      qu.setModules(bs, rv, qupvt, tak);
      qupvt.setModules(tak, rv, lame.enc.psy);
      rv.setModules(bs);
      tak.setModules(qupvt);
      vbr.setModules(lame, bs, ver);
      gaud.setModules(parse, mpg);
      parse.setModules(ver, id3, p);
      var gfp = lame.lame_init();
      gfp.num_channels = channels;
      gfp.in_samplerate = samplerate;
      gfp.out_samplerate = samplerate;
      gfp.brate = kbps;
      gfp.mode = MPEGMode.STEREO;
      gfp.quality = 3;
      gfp.bWriteVbrTag = false;
      gfp.disable_reservoir = true;
      gfp.write_id3tag_automatic = false;
      lame.lame_init_params(gfp);
      var maxSamples = 1152;
      var mp3buf_size = 0 | 1.25 * maxSamples + 7200;
      var mp3buf = new_byte(mp3buf_size);
      this.encodeBuffer = function(left, right) {
        if (channels == 1) {
          right = left;
        }
        if (left.length > maxSamples) {
          maxSamples = left.length;
          mp3buf_size = 0 | 1.25 * maxSamples + 7200;
          mp3buf = new_byte(mp3buf_size);
        }
        var _sz = lame.lame_encode_buffer(gfp, left, right, left.length, mp3buf, 0, mp3buf_size);
        return new Int8Array(mp3buf.subarray(0, _sz));
      };
      this.flush = function() {
        var _sz = lame.lame_encode_flush(gfp, mp3buf, 0, mp3buf_size);
        return new Int8Array(mp3buf.subarray(0, _sz));
      };
    }
    L3Side.SFBMAX = Encoder.SBMAX_s * 3;
    lamejs.Mp3Encoder = Mp3Encoder;
  }
  lamejs();
  Recorder2.lamejs = lamejs;
});
(function(factory) {
  var browser = typeof window == "object" && !!window.document;
  var win = browser ? window : Object;
  var rec = win.Recorder, ni = rec.i18n;
  factory(rec, ni, ni.$T, browser);
})(function(Recorder2, i18n, $T, isBrowser) {
  var WaveView = function(set2) {
    return new fn(set2);
  };
  var ViewTxt = "WaveView";
  var fn = function(set2) {
    var This = this;
    var o2 = {
      /*
      		elem:"css selector" //自动显示到dom，并以此dom大小为显示大小
      			//或者配置显示大小，手动把waveviewObj.elem显示到别的地方
      		,width:0 //显示宽度
      		,height:0 //显示高度
      		
      H5环境以上配置二选一
      		
      		compatibleCanvas: CanvasObject //提供一个兼容H5的canvas对象，需支持getContext("2d")，支持设置width、height，支持drawImage(canvas,...)
      		,width:0 //canvas显示宽度
      		,height:0 //canvas显示高度
      非H5环境使用以上配置
      		*/
      scale: 2,
      speed: 9,
      phase: 21.8,
      fps: 20,
      keep: true,
      lineWidth: 3,
      linear1: [0, "rgba(150,96,238,1)", 0.2, "rgba(170,79,249,1)", 1, "rgba(53,199,253,1)"],
      linear2: [0, "rgba(209,130,255,0.6)", 1, "rgba(53,199,255,0.6)"],
      linearBg: [0, "rgba(255,255,255,0.2)", 1, "rgba(54,197,252,0.2)"]
      //背景渐变色，从上到下
    };
    for (var k in set2) {
      o2[k] = set2[k];
    }
    This.set = set2 = o2;
    var cCanvas = "compatibleCanvas";
    if (set2[cCanvas]) {
      var canvas = This.canvas = set2[cCanvas];
    } else {
      if (!isBrowser)
        throw new Error($T.G("NonBrowser-1", [ViewTxt]));
      var elem = set2.elem;
      if (elem) {
        if (typeof elem == "string") {
          elem = document.querySelector(elem);
        } else if (elem.length) {
          elem = elem[0];
        }
      }
      if (elem) {
        set2.width = elem.offsetWidth;
        set2.height = elem.offsetHeight;
      }
      var thisElem = This.elem = document.createElement("div");
      thisElem.style.fontSize = 0;
      thisElem.innerHTML = '<canvas style="width:100%;height:100%;"/>';
      var canvas = This.canvas = thisElem.querySelector("canvas");
      if (elem) {
        elem.innerHTML = "";
        elem.appendChild(thisElem);
      }
    }
    var scale = set2.scale;
    var width = set2.width * scale;
    var height = set2.height * scale;
    if (!width || !height) {
      throw new Error($T.G("IllegalArgs-1", [ViewTxt + " width=0 height=0"]));
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = This.ctx = canvas.getContext("2d");
    This.linear1 = This.genLinear(ctx, width, set2.linear1);
    This.linear2 = This.genLinear(ctx, width, set2.linear2);
    This.linearBg = This.genLinear(ctx, height, set2.linearBg, true);
    This._phase = 0;
  };
  fn.prototype = WaveView.prototype = {
    genLinear: function(ctx, size2, colors, top) {
      var rtv = ctx.createLinearGradient(0, 0, top ? 0 : size2, top ? size2 : 0);
      for (var i = 0; i < colors.length; ) {
        rtv.addColorStop(colors[i++], colors[i++]);
      }
      return rtv;
    },
    genPath: function(frequency, amplitude, phase) {
      var rtv = [];
      var This = this, set2 = This.set;
      var scale = set2.scale;
      var width = set2.width * scale;
      var maxAmplitude = set2.height * scale / 2;
      for (var x = 0; x <= width; x += scale) {
        var scaling = (1 + Math.cos(Math.PI + x / width * 2 * Math.PI)) / 2;
        var y = scaling * maxAmplitude * amplitude * Math.sin(2 * Math.PI * (x / width) * frequency + phase) + maxAmplitude;
        rtv.push(y);
      }
      return rtv;
    },
    input: function(pcmData, powerLevel, sampleRate) {
      var This = this;
      This.sampleRate = sampleRate;
      This.pcmData = pcmData;
      This.pcmPos = 0;
      This.inputTime = Date.now();
      This.schedule();
    },
    schedule: function() {
      var This = this, set2 = This.set;
      var interval = Math.floor(1e3 / set2.fps);
      if (!This.timer) {
        This.timer = setInterval(function() {
          This.schedule();
        }, interval);
      }
      var now = Date.now();
      var drawTime = This.drawTime || 0;
      if (now - drawTime < interval) {
        return;
      }
      This.drawTime = now;
      var bufferSize = This.sampleRate / set2.fps;
      var pcm = This.pcmData;
      var pos = This.pcmPos;
      var len = Math.max(0, Math.min(bufferSize, pcm.length - pos));
      var sum = 0;
      for (var i = 0; i < len; i++, pos++) {
        sum += Math.abs(pcm[pos]);
      }
      This.pcmPos = pos;
      if (len || !set2.keep) {
        This.draw(Recorder2.PowerLevel(sum, len));
      }
      if (!len && now - This.inputTime > 1300) {
        clearInterval(This.timer);
        This.timer = 0;
      }
    },
    draw: function(powerLevel) {
      var This = this, set2 = This.set;
      var ctx = This.ctx;
      var scale = set2.scale;
      var width = set2.width * scale;
      var height = set2.height * scale;
      var speedx = set2.speed / set2.fps;
      var phase = This._phase -= speedx;
      var phase2 = phase + speedx * set2.phase;
      var amplitude = powerLevel / 100;
      var path1 = This.genPath(2, amplitude, phase);
      var path2 = This.genPath(1.8, amplitude, phase2);
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      for (var i = 0, x = 0; x <= width; i++, x += scale) {
        if (x == 0) {
          ctx.moveTo(x, path1[i]);
        } else {
          ctx.lineTo(x, path1[i]);
        }
      }
      i--;
      for (var x = width - 1; x >= 0; i--, x -= scale) {
        ctx.lineTo(x, path2[i]);
      }
      ctx.closePath();
      ctx.fillStyle = This.linearBg;
      ctx.fill();
      This.drawPath(path2, This.linear2);
      This.drawPath(path1, This.linear1);
    },
    drawPath: function(path, linear) {
      var This = this, set2 = This.set;
      var ctx = This.ctx;
      var scale = set2.scale;
      var width = set2.width * scale;
      ctx.beginPath();
      for (var i = 0, x = 0; x <= width; i++, x += scale) {
        if (x == 0) {
          ctx.moveTo(x, path[i]);
        } else {
          ctx.lineTo(x, path[i]);
        }
      }
      ctx.lineWidth = set2.lineWidth * scale;
      ctx.strokeStyle = linear;
      ctx.stroke();
    }
  };
  Recorder2[ViewTxt] = WaveView;
});
var ffmpeg_min = { exports: {} };
(function(module2, exports2) {
  !function(e2, t2) {
    module2.exports = t2();
  }(self, function() {
    return (() => {
      var e2 = { 725: (e3, t3, r2) => {
        e3.exports = r2.p + "046d0074eee1d99a674a.js";
      }, 497: (e3, t3, r2) => {
        var n2 = r2(306).devDependencies, o2 = "https://unpkg.com/@ffmpeg/core@".concat(n2["@ffmpeg/core"].substring(1), "/dist/ffmpeg-core.js");
        e3.exports = { corePath: o2 };
      }, 663: (e3, t3, r2) => {
        function n2(e4, t4, r3, n3, o3, a2, i) {
          try {
            var c = e4[a2](i), s = c.value;
          } catch (e5) {
            return void r3(e5);
          }
          c.done ? t4(s) : Promise.resolve(s).then(n3, o3);
        }
        r2.r(t3), r2.d(t3, { fetchFile: () => a });
        var o2 = function(e4) {
          return new Promise(function(t4, r3) {
            var n3 = new FileReader();
            n3.onload = function() {
              t4(n3.result);
            }, n3.onerror = function(e5) {
              var t5 = e5.target.error.code;
              r3(Error("File could not be read! Code=".concat(t5)));
            }, n3.readAsArrayBuffer(e4);
          });
        }, a = function() {
          var e4, t4 = (e4 = regeneratorRuntime.mark(function e5(t5) {
            var r3, n3;
            return regeneratorRuntime.wrap(function(e6) {
              for (; ; )
                switch (e6.prev = e6.next) {
                  case 0:
                    if (r3 = t5, void 0 !== t5) {
                      e6.next = 3;
                      break;
                    }
                    return e6.abrupt("return", new Uint8Array());
                  case 3:
                    if ("string" != typeof t5) {
                      e6.next = 16;
                      break;
                    }
                    if (!/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(t5)) {
                      e6.next = 8;
                      break;
                    }
                    r3 = atob(t5.split(",")[1]).split("").map(function(e7) {
                      return e7.charCodeAt(0);
                    }), e6.next = 14;
                    break;
                  case 8:
                    return e6.next = 10, fetch(new URL(t5, "file:///home/jeromewu/repos/ffmpeg.wasm/src/browser/fetchFile.js").href);
                  case 10:
                    return n3 = e6.sent, e6.next = 13, n3.arrayBuffer();
                  case 13:
                    r3 = e6.sent;
                  case 14:
                    e6.next = 20;
                    break;
                  case 16:
                    if (!(t5 instanceof File || t5 instanceof Blob)) {
                      e6.next = 20;
                      break;
                    }
                    return e6.next = 19, o2(t5);
                  case 19:
                    r3 = e6.sent;
                  case 20:
                    return e6.abrupt("return", new Uint8Array(r3));
                  case 21:
                  case "end":
                    return e6.stop();
                }
            }, e5);
          }), function() {
            var t5 = this, r3 = arguments;
            return new Promise(function(o3, a2) {
              var i = e4.apply(t5, r3);
              function c(e5) {
                n2(i, o3, a2, c, s, "next", e5);
              }
              function s(e5) {
                n2(i, o3, a2, c, s, "throw", e5);
              }
              c(void 0);
            });
          });
          return function(e5) {
            return t4.apply(this, arguments);
          };
        }();
      }, 452: (e3, t3, r2) => {
        function n2(e4, t4, r3, n3, o3, a2, i2) {
          try {
            var c2 = e4[a2](i2), s2 = c2.value;
          } catch (e5) {
            return void r3(e5);
          }
          c2.done ? t4(s2) : Promise.resolve(s2).then(n3, o3);
        }
        function o2(e4) {
          return function() {
            var t4 = this, r3 = arguments;
            return new Promise(function(o3, a2) {
              var i2 = e4.apply(t4, r3);
              function c2(e5) {
                n2(i2, o3, a2, c2, s2, "next", e5);
              }
              function s2(e5) {
                n2(i2, o3, a2, c2, s2, "throw", e5);
              }
              c2(void 0);
            });
          };
        }
        r2.r(t3), r2.d(t3, { getCreateFFmpegCore: () => s });
        var a = r2(185).log, i = r2(835).CREATE_FFMPEG_CORE_IS_NOT_DEFINED, c = function() {
          var e4 = o2(regeneratorRuntime.mark(function e5(t4, r3) {
            var n3, o3, i2;
            return regeneratorRuntime.wrap(function(e6) {
              for (; ; )
                switch (e6.prev = e6.next) {
                  case 0:
                    return a("info", "fetch ".concat(t4)), e6.next = 3, fetch(t4);
                  case 3:
                    return e6.next = 5, e6.sent.arrayBuffer();
                  case 5:
                    return n3 = e6.sent, a("info", "".concat(t4, " file size = ").concat(n3.byteLength, " bytes")), o3 = new Blob([n3], { type: r3 }), i2 = URL.createObjectURL(o3), a("info", "".concat(t4, " blob URL = ").concat(i2)), e6.abrupt("return", i2);
                  case 11:
                  case "end":
                    return e6.stop();
                }
            }, e5);
          }));
          return function(t4, r3) {
            return e4.apply(this, arguments);
          };
        }(), s = function() {
          var e4 = o2(regeneratorRuntime.mark(function e5(t4) {
            var r3, n3, o3, s2, f2, u, l, p, h, m, g;
            return regeneratorRuntime.wrap(function(e6) {
              for (; ; )
                switch (e6.prev = e6.next) {
                  case 0:
                    if (r3 = t4.corePath, n3 = t4.workerPath, o3 = t4.wasmPath, !("undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope)) {
                      e6.next = 18;
                      break;
                    }
                    if ("string" == typeof r3) {
                      e6.next = 4;
                      break;
                    }
                    throw Error("corePath should be a string!");
                  case 4:
                    return s2 = new URL(r3, "file:///home/jeromewu/repos/ffmpeg.wasm/src/browser/getCreateFFmpegCore.js").href, e6.next = 7, c(s2, "application/javascript");
                  case 7:
                    return f2 = e6.sent, e6.next = 10, c(void 0 !== o3 ? o3 : s2.replace("ffmpeg-core.js", "ffmpeg-core.wasm"), "application/wasm");
                  case 10:
                    return u = e6.sent, e6.next = 13, c(void 0 !== n3 ? n3 : s2.replace("ffmpeg-core.js", "ffmpeg-core.worker.js"), "application/javascript");
                  case 13:
                    if (l = e6.sent, "undefined" != typeof createFFmpegCore) {
                      e6.next = 16;
                      break;
                    }
                    return e6.abrupt("return", new Promise(function(e7) {
                      if (globalThis.importScripts(f2), "undefined" == typeof createFFmpegCore)
                        throw Error(i(s2));
                      a("info", "ffmpeg-core.js script loaded"), e7({ createFFmpegCore, corePath: f2, wasmPath: u, workerPath: l });
                    }));
                  case 16:
                    return a("info", "ffmpeg-core.js script is loaded already"), e6.abrupt("return", Promise.resolve({ createFFmpegCore, corePath: f2, wasmPath: u, workerPath: l }));
                  case 18:
                    if ("string" == typeof r3) {
                      e6.next = 20;
                      break;
                    }
                    throw Error("corePath should be a string!");
                  case 20:
                    return p = new URL(r3, "file:///home/jeromewu/repos/ffmpeg.wasm/src/browser/getCreateFFmpegCore.js").href, e6.next = 23, c(p, "application/javascript");
                  case 23:
                    return h = e6.sent, e6.next = 26, c(p.replace("ffmpeg-core.js", "ffmpeg-core.wasm"), "application/wasm");
                  case 26:
                    return m = e6.sent, e6.next = 29, c(p.replace("ffmpeg-core.js", "ffmpeg-core.worker.js"), "application/javascript");
                  case 29:
                    if (g = e6.sent, "undefined" != typeof createFFmpegCore) {
                      e6.next = 32;
                      break;
                    }
                    return e6.abrupt("return", new Promise(function(e7) {
                      var t5 = document.createElement("script");
                      t5.src = h, t5.type = "text/javascript", t5.addEventListener("load", function r4() {
                        if (t5.removeEventListener("load", r4), "undefined" == typeof createFFmpegCore)
                          throw Error(i(p));
                        a("info", "ffmpeg-core.js script loaded"), e7({ createFFmpegCore, corePath: h, wasmPath: m, workerPath: g });
                      }), document.getElementsByTagName("head")[0].appendChild(t5);
                    }));
                  case 32:
                    return a("info", "ffmpeg-core.js script is loaded already"), e6.abrupt("return", Promise.resolve({ createFFmpegCore, corePath: h, wasmPath: m, workerPath: g }));
                  case 34:
                  case "end":
                    return e6.stop();
                }
            }, e5);
          }));
          return function(t4) {
            return e4.apply(this, arguments);
          };
        }();
      }, 698: (e3, t3, r2) => {
        r2.r(t3), r2.d(t3, { defaultOptions: () => n2, getCreateFFmpegCore: () => o2, fetchFile: () => a });
        var n2 = r2(497), o2 = r2(452).getCreateFFmpegCore, a = r2(663).fetchFile;
      }, 500: (e3) => {
        e3.exports = { defaultArgs: ["./ffmpeg", "-nostdin", "-y"], baseOptions: { log: false, logger: function() {
        }, progress: function() {
        }, corePath: "" } };
      }, 906: (e3, t3, r2) => {
        function n2(e4) {
          return function(e5) {
            if (Array.isArray(e5))
              return s(e5);
          }(e4) || function(e5) {
            if ("undefined" != typeof Symbol && Symbol.iterator in Object(e5))
              return Array.from(e5);
          }(e4) || c(e4) || function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          }();
        }
        function o2(e4, t4, r3, n3, o3, a2, i2) {
          try {
            var c2 = e4[a2](i2), s2 = c2.value;
          } catch (e5) {
            return void r3(e5);
          }
          c2.done ? t4(s2) : Promise.resolve(s2).then(n3, o3);
        }
        function a(e4) {
          return function() {
            var t4 = this, r3 = arguments;
            return new Promise(function(n3, a2) {
              var i2 = e4.apply(t4, r3);
              function c2(e5) {
                o2(i2, n3, a2, c2, s2, "next", e5);
              }
              function s2(e5) {
                o2(i2, n3, a2, c2, s2, "throw", e5);
              }
              c2(void 0);
            });
          };
        }
        function i(e4, t4) {
          return function(e5) {
            if (Array.isArray(e5))
              return e5;
          }(e4) || function(e5, t5) {
            if ("undefined" != typeof Symbol && Symbol.iterator in Object(e5)) {
              var r3 = [], n3 = true, o3 = false, a2 = void 0;
              try {
                for (var i2, c2 = e5[Symbol.iterator](); !(n3 = (i2 = c2.next()).done) && (r3.push(i2.value), !t5 || r3.length !== t5); n3 = true)
                  ;
              } catch (e6) {
                o3 = true, a2 = e6;
              } finally {
                try {
                  n3 || null == c2.return || c2.return();
                } finally {
                  if (o3)
                    throw a2;
                }
              }
              return r3;
            }
          }(e4, t4) || c(e4, t4) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          }();
        }
        function c(e4, t4) {
          if (e4) {
            if ("string" == typeof e4)
              return s(e4, t4);
            var r3 = Object.prototype.toString.call(e4).slice(8, -1);
            return "Object" === r3 && e4.constructor && (r3 = e4.constructor.name), "Map" === r3 || "Set" === r3 ? Array.from(e4) : "Arguments" === r3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r3) ? s(e4, t4) : void 0;
          }
        }
        function s(e4, t4) {
          (null == t4 || t4 > e4.length) && (t4 = e4.length);
          for (var r3 = 0, n3 = new Array(t4); r3 < t4; r3++)
            n3[r3] = e4[r3];
          return n3;
        }
        function f2(e4, t4) {
          var r3 = Object.keys(e4);
          if (Object.getOwnPropertySymbols) {
            var n3 = Object.getOwnPropertySymbols(e4);
            t4 && (n3 = n3.filter(function(t5) {
              return Object.getOwnPropertyDescriptor(e4, t5).enumerable;
            })), r3.push.apply(r3, n3);
          }
          return r3;
        }
        function u(e4) {
          for (var t4 = 1; t4 < arguments.length; t4++) {
            var r3 = null != arguments[t4] ? arguments[t4] : {};
            t4 % 2 ? f2(Object(r3), true).forEach(function(t5) {
              l(e4, t5, r3[t5]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(r3)) : f2(Object(r3)).forEach(function(t5) {
              Object.defineProperty(e4, t5, Object.getOwnPropertyDescriptor(r3, t5));
            });
          }
          return e4;
        }
        function l(e4, t4, r3) {
          return t4 in e4 ? Object.defineProperty(e4, t4, { value: r3, enumerable: true, configurable: true, writable: true }) : e4[t4] = r3, e4;
        }
        function p(e4, t4) {
          if (null == e4)
            return {};
          var r3, n3, o3 = function(e5, t5) {
            if (null == e5)
              return {};
            var r4, n4, o4 = {}, a3 = Object.keys(e5);
            for (n4 = 0; n4 < a3.length; n4++)
              r4 = a3[n4], t5.indexOf(r4) >= 0 || (o4[r4] = e5[r4]);
            return o4;
          }(e4, t4);
          if (Object.getOwnPropertySymbols) {
            var a2 = Object.getOwnPropertySymbols(e4);
            for (n3 = 0; n3 < a2.length; n3++)
              r3 = a2[n3], t4.indexOf(r3) >= 0 || Object.prototype.propertyIsEnumerable.call(e4, r3) && (o3[r3] = e4[r3]);
          }
          return o3;
        }
        var h = r2(500), m = h.defaultArgs, g = h.baseOptions, d = r2(319), y = r2(698), v = y.defaultOptions, w = y.getCreateFFmpegCore, b = r2(306).version, x = Error("ffmpeg.wasm is not ready, make sure you have completed load().");
        e3.exports = function() {
          var e4 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t4 = u(u(u({}, g), v), e4), r3 = t4.log, o3 = (t4.logger, t4.progress), c2 = p(t4, ["log", "logger", "progress"]), s2 = null, f3 = null, l2 = null, h2 = null, y2 = false, F = function() {
          }, j = r3, E2 = o3, P = 0, O = 0, k = function(e5) {
            "FFMPEG_END" === e5 && null !== l2 && (l2(), l2 = null, h2 = null, y2 = false);
          }, L = function(e5, t5) {
            F({ type: e5, message: t5 }), j && index.__f__("log", "at node_modules/@ffmpeg/ffmpeg/dist/ffmpeg.min.js:1", "[".concat(e5, "] ").concat(t5));
          }, S = function(e5) {
            var t5 = i(e5.split(":"), 3), r4 = t5[0], n3 = t5[1], o4 = t5[2];
            return 60 * parseFloat(r4) * 60 + 60 * parseFloat(n3) + parseFloat(o4);
          }, C = function(e5, t5) {
            if ("string" == typeof e5)
              if (e5.startsWith("  Duration")) {
                var r4 = e5.split(", ")[0].split(": ")[1], n3 = S(r4);
                t5({ duration: n3, ratio: O }), (0 === P || P > n3) && (P = n3);
              } else if (e5.startsWith("frame") || e5.startsWith("size")) {
                var o4 = e5.split("time=")[1].split(" ")[0], a2 = S(o4);
                t5({ ratio: O = a2 / P, time: a2 });
              } else
                e5.startsWith("video:") && (t5({ ratio: 1 }), P = 0);
          }, _ = function(e5) {
            var t5 = e5.type, r4 = e5.message;
            L(t5, r4), C(r4, E2), k(r4);
          }, A = function() {
            var e5 = a(regeneratorRuntime.mark(function e6() {
              var t5, r4, n3, o4, a2;
              return regeneratorRuntime.wrap(function(e7) {
                for (; ; )
                  switch (e7.prev = e7.next) {
                    case 0:
                      if (L("info", "load ffmpeg-core"), null !== s2) {
                        e7.next = 17;
                        break;
                      }
                      return L("info", "loading ffmpeg-core"), e7.next = 5, w(c2);
                    case 5:
                      return t5 = e7.sent, r4 = t5.createFFmpegCore, n3 = t5.corePath, o4 = t5.workerPath, a2 = t5.wasmPath, e7.next = 12, r4({ mainScriptUrlOrBlob: n3, printErr: function(e8) {
                        return _({ type: "fferr", message: e8 });
                      }, print: function(e8) {
                        return _({ type: "ffout", message: e8 });
                      }, locateFile: function(e8, t6) {
                        if ("undefined" != typeof window || "undefined" != typeof WorkerGlobalScope) {
                          if (void 0 !== a2 && e8.endsWith("ffmpeg-core.wasm"))
                            return a2;
                          if (void 0 !== o4 && e8.endsWith("ffmpeg-core.worker.js"))
                            return o4;
                        }
                        return t6 + e8;
                      } });
                    case 12:
                      s2 = e7.sent, f3 = s2.cwrap(c2.mainName || "proxy_main", "number", ["number", "number"]), L("info", "ffmpeg-core loaded"), e7.next = 18;
                      break;
                    case 17:
                      throw Error("ffmpeg.wasm was loaded, you should not load it again, use ffmpeg.isLoaded() to check next time.");
                    case 18:
                    case "end":
                      return e7.stop();
                  }
              }, e6);
            }));
            return function() {
              return e5.apply(this, arguments);
            };
          }(), T = function() {
            return null !== s2;
          }, R = function() {
            for (var e5 = arguments.length, t5 = new Array(e5), r4 = 0; r4 < e5; r4++)
              t5[r4] = arguments[r4];
            if (L("info", "run ffmpeg command: ".concat(t5.join(" "))), null === s2)
              throw x;
            if (y2)
              throw Error("ffmpeg.wasm can only run one command at a time");
            return y2 = true, new Promise(function(e6, r5) {
              var o4 = [].concat(n2(m), t5).filter(function(e7) {
                return 0 !== e7.length;
              });
              l2 = e6, h2 = r5, f3.apply(void 0, n2(d(s2, o4)));
            });
          }, N = function(e5) {
            for (var t5 = arguments.length, r4 = new Array(t5 > 1 ? t5 - 1 : 0), n3 = 1; n3 < t5; n3++)
              r4[n3 - 1] = arguments[n3];
            if (L("info", "run FS.".concat(e5, " ").concat(r4.map(function(e6) {
              return "string" == typeof e6 ? e6 : "<".concat(e6.length, " bytes binary file>");
            }).join(" "))), null === s2)
              throw x;
            var o4 = null;
            try {
              var a2;
              o4 = (a2 = s2.FS)[e5].apply(a2, r4);
            } catch (t6) {
              throw "readdir" === e5 ? Error("ffmpeg.FS('readdir', '".concat(r4[0], "') error. Check if the path exists, ex: ffmpeg.FS('readdir', '/')")) : "readFile" === e5 ? Error("ffmpeg.FS('readFile', '".concat(r4[0], "') error. Check if the path exists")) : Error("Oops, something went wrong in FS operation.");
            }
            return o4;
          }, U = function() {
            if (null === s2)
              throw x;
            h2 && h2("ffmpeg has exited"), y2 = false;
            try {
              s2.exit(1);
            } catch (e5) {
              L(e5.message), h2 && h2(e5);
            } finally {
              s2 = null, f3 = null, l2 = null, h2 = null;
            }
          }, I = function(e5) {
            E2 = e5;
          }, G = function(e5) {
            F = e5;
          }, D = function(e5) {
            j = e5;
          };
          return L("info", "use ffmpeg.wasm v".concat(b)), { setProgress: I, setLogger: G, setLogging: D, load: A, isLoaded: T, run: R, exit: U, FS: N };
        };
      }, 352: (e3, t3, r2) => {
        r2(666);
        var n2 = r2(906), o2 = r2(698).fetchFile;
        e3.exports = { createFFmpeg: n2, fetchFile: o2 };
      }, 835: (e3) => {
        e3.exports = { CREATE_FFMPEG_CORE_IS_NOT_DEFINED: function(e4) {
          return "\ncreateFFmpegCore is not defined. ffmpeg.wasm is unable to find createFFmpegCore after loading ffmpeg-core.js from ".concat(e4, ". Use another URL when calling createFFmpeg():\n\nconst ffmpeg = createFFmpeg({\n  corePath: 'http://localhost:3000/ffmpeg-core.js',\n});\n");
        } };
      }, 185: (e3) => {
        var t3 = false, r2 = function() {
        };
        e3.exports = { logging: t3, setLogging: function(e4) {
          t3 = e4;
        }, setCustomLogger: function(e4) {
          r2 = e4;
        }, log: function(e4, n2) {
          r2({ type: e4, message: n2 }), t3 && index.__f__("log", "at node_modules/@ffmpeg/ffmpeg/dist/ffmpeg.min.js:1", "[".concat(e4, "] ").concat(n2));
        } };
      }, 319: (e3) => {
        e3.exports = function(e4, t3) {
          var r2 = e4._malloc(t3.length * Uint32Array.BYTES_PER_ELEMENT);
          return t3.forEach(function(t4, n2) {
            var o2 = e4.lengthBytesUTF8(t4) + 1, a = e4._malloc(o2);
            e4.stringToUTF8(t4, a, o2), e4.setValue(r2 + Uint32Array.BYTES_PER_ELEMENT * n2, a, "i32");
          }), [t3.length, r2];
        };
      }, 666: (e3) => {
        var t3 = function(e4) {
          var t4, r2 = Object.prototype, n2 = r2.hasOwnProperty, o2 = "function" == typeof Symbol ? Symbol : {}, a = o2.iterator || "@@iterator", i = o2.asyncIterator || "@@asyncIterator", c = o2.toStringTag || "@@toStringTag";
          function s(e5, t5, r3) {
            return Object.defineProperty(e5, t5, { value: r3, enumerable: true, configurable: true, writable: true }), e5[t5];
          }
          try {
            s({}, "");
          } catch (e5) {
            s = function(e6, t5, r3) {
              return e6[t5] = r3;
            };
          }
          function f2(e5, t5, r3, n3) {
            var o3 = t5 && t5.prototype instanceof d ? t5 : d, a2 = Object.create(o3.prototype), i2 = new L(n3 || []);
            return a2._invoke = /* @__PURE__ */ function(e6, t6, r4) {
              var n4 = l;
              return function(o4, a3) {
                if (n4 === h)
                  throw new Error("Generator is already running");
                if (n4 === m) {
                  if ("throw" === o4)
                    throw a3;
                  return C();
                }
                for (r4.method = o4, r4.arg = a3; ; ) {
                  var i3 = r4.delegate;
                  if (i3) {
                    var c2 = P(i3, r4);
                    if (c2) {
                      if (c2 === g)
                        continue;
                      return c2;
                    }
                  }
                  if ("next" === r4.method)
                    r4.sent = r4._sent = r4.arg;
                  else if ("throw" === r4.method) {
                    if (n4 === l)
                      throw n4 = m, r4.arg;
                    r4.dispatchException(r4.arg);
                  } else
                    "return" === r4.method && r4.abrupt("return", r4.arg);
                  n4 = h;
                  var s2 = u(e6, t6, r4);
                  if ("normal" === s2.type) {
                    if (n4 = r4.done ? m : p, s2.arg === g)
                      continue;
                    return { value: s2.arg, done: r4.done };
                  }
                  "throw" === s2.type && (n4 = m, r4.method = "throw", r4.arg = s2.arg);
                }
              };
            }(e5, r3, i2), a2;
          }
          function u(e5, t5, r3) {
            try {
              return { type: "normal", arg: e5.call(t5, r3) };
            } catch (e6) {
              return { type: "throw", arg: e6 };
            }
          }
          e4.wrap = f2;
          var l = "suspendedStart", p = "suspendedYield", h = "executing", m = "completed", g = {};
          function d() {
          }
          function y() {
          }
          function v() {
          }
          var w = {};
          w[a] = function() {
            return this;
          };
          var b = Object.getPrototypeOf, x = b && b(b(S([])));
          x && x !== r2 && n2.call(x, a) && (w = x);
          var F = v.prototype = d.prototype = Object.create(w);
          function j(e5) {
            ["next", "throw", "return"].forEach(function(t5) {
              s(e5, t5, function(e6) {
                return this._invoke(t5, e6);
              });
            });
          }
          function E2(e5, t5) {
            function r3(o4, a2, i2, c2) {
              var s2 = u(e5[o4], e5, a2);
              if ("throw" !== s2.type) {
                var f3 = s2.arg, l2 = f3.value;
                return l2 && "object" == typeof l2 && n2.call(l2, "__await") ? t5.resolve(l2.__await).then(function(e6) {
                  r3("next", e6, i2, c2);
                }, function(e6) {
                  r3("throw", e6, i2, c2);
                }) : t5.resolve(l2).then(function(e6) {
                  f3.value = e6, i2(f3);
                }, function(e6) {
                  return r3("throw", e6, i2, c2);
                });
              }
              c2(s2.arg);
            }
            var o3;
            this._invoke = function(e6, n3) {
              function a2() {
                return new t5(function(t6, o4) {
                  r3(e6, n3, t6, o4);
                });
              }
              return o3 = o3 ? o3.then(a2, a2) : a2();
            };
          }
          function P(e5, r3) {
            var n3 = e5.iterator[r3.method];
            if (n3 === t4) {
              if (r3.delegate = null, "throw" === r3.method) {
                if (e5.iterator.return && (r3.method = "return", r3.arg = t4, P(e5, r3), "throw" === r3.method))
                  return g;
                r3.method = "throw", r3.arg = new TypeError("The iterator does not provide a 'throw' method");
              }
              return g;
            }
            var o3 = u(n3, e5.iterator, r3.arg);
            if ("throw" === o3.type)
              return r3.method = "throw", r3.arg = o3.arg, r3.delegate = null, g;
            var a2 = o3.arg;
            return a2 ? a2.done ? (r3[e5.resultName] = a2.value, r3.next = e5.nextLoc, "return" !== r3.method && (r3.method = "next", r3.arg = t4), r3.delegate = null, g) : a2 : (r3.method = "throw", r3.arg = new TypeError("iterator result is not an object"), r3.delegate = null, g);
          }
          function O(e5) {
            var t5 = { tryLoc: e5[0] };
            1 in e5 && (t5.catchLoc = e5[1]), 2 in e5 && (t5.finallyLoc = e5[2], t5.afterLoc = e5[3]), this.tryEntries.push(t5);
          }
          function k(e5) {
            var t5 = e5.completion || {};
            t5.type = "normal", delete t5.arg, e5.completion = t5;
          }
          function L(e5) {
            this.tryEntries = [{ tryLoc: "root" }], e5.forEach(O, this), this.reset(true);
          }
          function S(e5) {
            if (e5) {
              var r3 = e5[a];
              if (r3)
                return r3.call(e5);
              if ("function" == typeof e5.next)
                return e5;
              if (!isNaN(e5.length)) {
                var o3 = -1, i2 = function r4() {
                  for (; ++o3 < e5.length; )
                    if (n2.call(e5, o3))
                      return r4.value = e5[o3], r4.done = false, r4;
                  return r4.value = t4, r4.done = true, r4;
                };
                return i2.next = i2;
              }
            }
            return { next: C };
          }
          function C() {
            return { value: t4, done: true };
          }
          return y.prototype = F.constructor = v, v.constructor = y, y.displayName = s(v, c, "GeneratorFunction"), e4.isGeneratorFunction = function(e5) {
            var t5 = "function" == typeof e5 && e5.constructor;
            return !!t5 && (t5 === y || "GeneratorFunction" === (t5.displayName || t5.name));
          }, e4.mark = function(e5) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(e5, v) : (e5.__proto__ = v, s(e5, c, "GeneratorFunction")), e5.prototype = Object.create(F), e5;
          }, e4.awrap = function(e5) {
            return { __await: e5 };
          }, j(E2.prototype), E2.prototype[i] = function() {
            return this;
          }, e4.AsyncIterator = E2, e4.async = function(t5, r3, n3, o3, a2) {
            void 0 === a2 && (a2 = Promise);
            var i2 = new E2(f2(t5, r3, n3, o3), a2);
            return e4.isGeneratorFunction(r3) ? i2 : i2.next().then(function(e5) {
              return e5.done ? e5.value : i2.next();
            });
          }, j(F), s(F, c, "Generator"), F[a] = function() {
            return this;
          }, F.toString = function() {
            return "[object Generator]";
          }, e4.keys = function(e5) {
            var t5 = [];
            for (var r3 in e5)
              t5.push(r3);
            return t5.reverse(), function r4() {
              for (; t5.length; ) {
                var n3 = t5.pop();
                if (n3 in e5)
                  return r4.value = n3, r4.done = false, r4;
              }
              return r4.done = true, r4;
            };
          }, e4.values = S, L.prototype = { constructor: L, reset: function(e5) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = t4, this.done = false, this.delegate = null, this.method = "next", this.arg = t4, this.tryEntries.forEach(k), !e5)
              for (var r3 in this)
                "t" === r3.charAt(0) && n2.call(this, r3) && !isNaN(+r3.slice(1)) && (this[r3] = t4);
          }, stop: function() {
            this.done = true;
            var e5 = this.tryEntries[0].completion;
            if ("throw" === e5.type)
              throw e5.arg;
            return this.rval;
          }, dispatchException: function(e5) {
            if (this.done)
              throw e5;
            var r3 = this;
            function o3(n3, o4) {
              return c2.type = "throw", c2.arg = e5, r3.next = n3, o4 && (r3.method = "next", r3.arg = t4), !!o4;
            }
            for (var a2 = this.tryEntries.length - 1; a2 >= 0; --a2) {
              var i2 = this.tryEntries[a2], c2 = i2.completion;
              if ("root" === i2.tryLoc)
                return o3("end");
              if (i2.tryLoc <= this.prev) {
                var s2 = n2.call(i2, "catchLoc"), f3 = n2.call(i2, "finallyLoc");
                if (s2 && f3) {
                  if (this.prev < i2.catchLoc)
                    return o3(i2.catchLoc, true);
                  if (this.prev < i2.finallyLoc)
                    return o3(i2.finallyLoc);
                } else if (s2) {
                  if (this.prev < i2.catchLoc)
                    return o3(i2.catchLoc, true);
                } else {
                  if (!f3)
                    throw new Error("try statement without catch or finally");
                  if (this.prev < i2.finallyLoc)
                    return o3(i2.finallyLoc);
                }
              }
            }
          }, abrupt: function(e5, t5) {
            for (var r3 = this.tryEntries.length - 1; r3 >= 0; --r3) {
              var o3 = this.tryEntries[r3];
              if (o3.tryLoc <= this.prev && n2.call(o3, "finallyLoc") && this.prev < o3.finallyLoc) {
                var a2 = o3;
                break;
              }
            }
            a2 && ("break" === e5 || "continue" === e5) && a2.tryLoc <= t5 && t5 <= a2.finallyLoc && (a2 = null);
            var i2 = a2 ? a2.completion : {};
            return i2.type = e5, i2.arg = t5, a2 ? (this.method = "next", this.next = a2.finallyLoc, g) : this.complete(i2);
          }, complete: function(e5, t5) {
            if ("throw" === e5.type)
              throw e5.arg;
            return "break" === e5.type || "continue" === e5.type ? this.next = e5.arg : "return" === e5.type ? (this.rval = this.arg = e5.arg, this.method = "return", this.next = "end") : "normal" === e5.type && t5 && (this.next = t5), g;
          }, finish: function(e5) {
            for (var t5 = this.tryEntries.length - 1; t5 >= 0; --t5) {
              var r3 = this.tryEntries[t5];
              if (r3.finallyLoc === e5)
                return this.complete(r3.completion, r3.afterLoc), k(r3), g;
            }
          }, catch: function(e5) {
            for (var t5 = this.tryEntries.length - 1; t5 >= 0; --t5) {
              var r3 = this.tryEntries[t5];
              if (r3.tryLoc === e5) {
                var n3 = r3.completion;
                if ("throw" === n3.type) {
                  var o3 = n3.arg;
                  k(r3);
                }
                return o3;
              }
            }
            throw new Error("illegal catch attempt");
          }, delegateYield: function(e5, r3, n3) {
            return this.delegate = { iterator: S(e5), resultName: r3, nextLoc: n3 }, "next" === this.method && (this.arg = t4), g;
          } }, e4;
        }(e3.exports);
        try {
          regeneratorRuntime = t3;
        } catch (e4) {
          Function("r", "regeneratorRuntime = r")(t3);
        }
      }, 306: (e3) => {
        e3.exports = JSON.parse('{"name":"@ffmpeg/ffmpeg","version":"0.11.0","description":"FFmpeg WebAssembly version","main":"src/index.js","types":"src/index.d.ts","directories":{"example":"examples"},"scripts":{"start":"node scripts/server.js","start:worker":"node scripts/worker-server.js","build":"rimraf dist && webpack --config scripts/webpack.config.prod.js","build:worker":"rimraf dist && webpack --config scripts/webpack.config.worker.prod.js","prepublishOnly":"npm run build","lint":"eslint src","wait":"rimraf dist && wait-on http://localhost:3000/dist/ffmpeg.dev.js","test":"npm-run-all -p -r start test:all","test:all":"npm-run-all wait test:browser:ffmpeg test:node:all","test:node":"node node_modules/mocha/bin/_mocha --exit --bail --require ./scripts/test-helper.js","test:node:all":"npm run test:node -- ./tests/*.test.js","test:browser":"mocha-headless-chrome -a allow-file-access-from-files -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000","test:browser:ffmpeg":"npm run test:browser -- -f ./tests/ffmpeg.test.html"},"browser":{"./src/node/index.js":"./src/browser/index.js"},"repository":{"type":"git","url":"git+https://github.com/ffmpegwasm/ffmpeg.wasm.git"},"keywords":["ffmpeg","WebAssembly","video"],"author":"Jerome Wu <jeromewus@gmail.com>","license":"MIT","bugs":{"url":"https://github.com/ffmpegwasm/ffmpeg.wasm/issues"},"engines":{"node":">=12.16.1"},"homepage":"https://github.com/ffmpegwasm/ffmpeg.wasm#readme","dependencies":{"is-url":"^1.2.4","node-fetch":"^2.6.1","regenerator-runtime":"^0.13.7","resolve-url":"^0.2.1"},"devDependencies":{"@babel/core":"^7.12.3","@babel/preset-env":"^7.12.1","@ffmpeg/core":"^0.11.0","@types/emscripten":"^1.39.4","babel-eslint":"^10.1.0","babel-loader":"^8.1.0","chai":"^4.2.0","cors":"^2.8.5","eslint":"^7.12.1","eslint-config-airbnb-base":"^14.1.0","eslint-plugin-import":"^2.22.1","express":"^4.17.1","mocha":"^8.2.1","mocha-headless-chrome":"^2.0.3","npm-run-all":"^4.1.5","wait-on":"^5.3.0","webpack":"^5.3.2","webpack-cli":"^4.1.0","webpack-dev-middleware":"^4.0.0"}}');
      } }, t2 = {};
      function r(n2) {
        if (t2[n2])
          return t2[n2].exports;
        var o2 = t2[n2] = { exports: {} };
        return e2[n2](o2, o2.exports, r), o2.exports;
      }
      return r.m = e2, r.d = (e3, t3) => {
        for (var n2 in t3)
          r.o(t3, n2) && !r.o(e3, n2) && Object.defineProperty(e3, n2, { enumerable: true, get: t3[n2] });
      }, r.g = function() {
        if ("object" == typeof globalThis)
          return globalThis;
        try {
          return this || new Function("return this")();
        } catch (e3) {
          if ("object" == typeof window)
            return window;
        }
      }(), r.o = (e3, t3) => Object.prototype.hasOwnProperty.call(e3, t3), r.r = (e3) => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e3, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e3, "__esModule", { value: true });
      }, (() => {
        var e3;
        r.g.importScripts && (e3 = r.g.location + "");
        var t3 = r.g.document;
        if (!e3 && t3 && (t3.currentScript && (e3 = t3.currentScript.src), !e3)) {
          var n2 = t3.getElementsByTagName("script");
          n2.length && (e3 = n2[n2.length - 1].src);
        }
        if (!e3)
          throw new Error("Automatic publicPath is not supported in this browser");
        e3 = e3.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/"), r.p = e3;
      })(), r.b = document.baseURI || self.location.href, r(352);
    })();
  });
})(ffmpeg_min);
exports.RecordApp = RecordApp;
exports.Recorder = Recorder;
exports._export_sfc = _export_sfc;
exports.createSSRApp = createSSRApp;
exports.e = e;
exports.f = f;
exports.index = index;
exports.n = n;
exports.o = o;
exports.resolveComponent = resolveComponent;
exports.t = t;
exports.wx$1 = wx$1;
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map
