"use client";

// src/index.tsx
import { useState, useRef } from "react";
import { jsx } from "react/jsx-runtime";
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
  const [, forceRender] = useState(0);
  const listenerRef = useRef(null);
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
    return /* @__PURE__ */ jsx(Tag, { className, children: content });
  });
}
export {
  Chi,
  chiBatch,
  chiComputed,
  chiLog,
  chiState,
  chiView
};
