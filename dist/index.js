"use strict";
"use client";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  Chi: () => Chi,
  chiBatch: () => chiBatch,
  chiComputed: () => chiComputed,
  chiLog: () => chiLog,
  chiState: () => chiState,
  chiView: () => chiView
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var currentListener = null;
var isBatching = false;
var queue = /* @__PURE__ */ new Set();
var restoreCache = /* @__PURE__ */ new Map();
var isBrowser = () => typeof window !== "undefined";
var isDev = process.env.NODE_ENV !== "production";
function afterHydration(fn) {
  setTimeout(fn, 200);
}
function chiBatch(fn) {
  isBatching = true;
  fn();
  isBatching = false;
  queue.forEach((l) => l());
  queue.clear();
}
function chiState(initialValue) {
  let value = initialValue;
  const listeners = /* @__PURE__ */ new Set();
  const notify = () => {
    const toRun = new Set(listeners);
    toRun.forEach((l) => {
      if (isBatching) queue.add(l.fn);
      else l.fn();
    });
  };
  const state = {
    get value() {
      if (currentListener) {
        if (!listeners.has(currentListener)) {
          listeners.add(currentListener);
          currentListener.deps.add(listeners);
        }
      }
      return value;
    },
    set value(newValue) {
      if (Object.is(value, newValue)) return;
      value = newValue;
      notify();
    },
    local(key) {
      if (!isBrowser()) return state;
      const storageKey = key ?? "chiState";
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        try {
          restoreCache.set(
            storageKey,
            JSON.parse(saved)
          );
        } catch {
        }
      }
      afterHydration(() => {
        if (restoreCache.has(storageKey)) {
          state.value = restoreCache.get(storageKey);
        }
        chiLog(() => {
          localStorage.setItem(
            storageKey,
            JSON.stringify(state.value)
          );
        });
      });
      return state;
    },
    session(key) {
      if (!isBrowser()) return state;
      const storageKey = key ?? "chiState";
      const saved = sessionStorage.getItem(storageKey);
      if (saved !== null) {
        try {
          restoreCache.set(
            storageKey,
            JSON.parse(saved)
          );
        } catch {
        }
      }
      afterHydration(() => {
        if (restoreCache.has(storageKey)) {
          state.value = restoreCache.get(storageKey);
        }
        chiLog(() => {
          sessionStorage.setItem(
            storageKey,
            JSON.stringify(state.value)
          );
        });
      });
      return state;
    }
  };
  return state;
}
function chiView(renderFn) {
  const [, forceRender] = (0, import_react.useState)(0);
  const listenerRef = (0, import_react.useRef)(null);
  if (!listenerRef.current) {
    listenerRef.current = {
      fn: () => forceRender((x) => x + 1),
      deps: /* @__PURE__ */ new Set()
    };
  }
  const listener = listenerRef.current;
  listener.deps.forEach((depSet) => {
    depSet.delete(listener);
  });
  listener.deps.clear();
  currentListener = listener;
  const result = renderFn();
  currentListener = null;
  return result;
}
function chiComputed(fn) {
  const state = chiState(fn());
  chiLog(() => {
    state.value = fn();
  });
  return state;
}
function chiLog(fn) {
  if (!isBrowser()) return;
  const listener = {
    fn: run,
    deps: /* @__PURE__ */ new Set()
  };
  let cleanup;
  function run() {
    listener.deps.forEach((depSet) => {
      depSet.delete(listener);
    });
    listener.deps.clear();
    currentListener = listener;
    cleanup?.();
    cleanup = fn();
    currentListener = null;
  }
  run();
}
function useChiList(list, renderItem) {
  const cacheRef = (0, import_react.useRef)(
    /* @__PURE__ */ new Map()
  );
  const cache = cacheRef.current;
  const nextCache = /* @__PURE__ */ new Map();
  const output = list.map((item, index) => {
    const key = item?.id ?? index;
    let node = cache.get(key);
    if (!node) {
      node = renderItem(item, index);
    }
    nextCache.set(key, node);
    return node;
  });
  cacheRef.current = nextCache;
  return output;
}
function Chi(props) {
  const {
    value,
    fallback = null,
    as: Tag = "span",
    className,
    children
  } = props;
  return chiView(() => {
    if (!value) {
      if (typeof children === "function") {
        return children();
      }
      return children ?? null;
    }
    const current = value.value;
    if (current == null) {
      return fallback;
    }
    if (typeof children === "function") {
      if (Array.isArray(current)) {
        const list = current;
        if (isDev && list.length > 100) {
          console.info(
            "[chistate] Optimized array rendering enabled."
          );
        }
        return useChiList(
          list,
          children
        );
      }
      return children(current);
    }
    const type = typeof current;
    const isPrimitive = type === "string" || type === "number" || type === "boolean" || type === "bigint" || type === "symbol";
    if (isPrimitive) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className, children: String(
        current
      ) });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className, children: JSON.stringify(current) });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Chi,
  chiBatch,
  chiComputed,
  chiLog,
  chiState,
  chiView
});
