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
  return {
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
      const toRun = new Set(listeners);
      toRun.forEach((l) => {
        if (isBatching) {
          queue.add(l.fn);
        } else {
          l.fn();
        }
      });
    }
  };
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
  const listenerObj = listenerRef.current;
  listenerObj.deps.forEach((depSet) => {
    depSet.delete(listenerObj);
  });
  listenerObj.deps.clear();
  currentListener = listenerObj;
  const result = renderFn();
  currentListener = null;
  return result;
}
function chiComputed(fn) {
  const state = chiState(fn());
  const compute = () => {
    state.value = fn();
  };
  chiLog(compute);
  return state;
}
function chiLog(fn) {
  const listenerObj = {
    fn: run,
    deps: /* @__PURE__ */ new Set()
  };
  let cleanup;
  function run() {
    listenerObj.deps.forEach((depSet) => {
      depSet.delete(listenerObj);
    });
    listenerObj.deps.clear();
    currentListener = listenerObj;
    cleanup?.();
    cleanup = fn();
    currentListener = null;
  }
  run();
}
function Chi(props) {
  const {
    value,
    watch,
    as: Tag = "span",
    className,
    fallback = null,
    format
  } = props;
  return chiView(() => {
    if (watch) {
      return watch();
    }
    if (!value) return null;
    const current = value.value;
    const content = current == null ? fallback : format ? format(current) : String(current);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className, children: content });
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
