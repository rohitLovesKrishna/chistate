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
  chiAudio: () => chiAudio,
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
function chiAudio(config) {
  const {
    src,
    playlist = [],
    initialIndex = 0,
    autoplay = false,
    volume: initialVolume = 100
  } = config;
  const normalizeTrack = (item, i) => {
    if (typeof item === "string") {
      return {
        id: i,
        src: item,
        name: `Track ${i + 1}`,
        artist: "Unknown Artist",
        image: ""
      };
    }
    return {
      id: item.id ?? i,
      name: item.name ?? `Track ${i + 1}`,
      artist: item.artist ?? "Unknown Artist",
      image: item.image ?? "",
      ...item
    };
  };
  const list = playlist.length > 0 ? playlist.map(normalizeTrack) : src ? [normalizeTrack(src, 0)] : [];
  const audio = typeof window !== "undefined" ? new window.Audio() : null;
  const playing = chiState(false);
  const loading = chiState(false);
  const muted = chiState(false);
  const index = chiState(
    Math.max(
      0,
      Math.min(initialIndex, list.length - 1)
    )
  );
  const currentTime = chiState(0);
  const duration = chiState(0);
  const volume = chiState(initialVolume);
  const startTime = chiComputed(() => formatTime(currentTime.value));
  const endTime = chiComputed(() => formatTime(duration.value));
  const length = chiComputed(
    () => list.length
  );
  const current = chiComputed(
    () => list[index.value] ?? {
      id: 0,
      src: "",
      name: "",
      artist: "",
      image: ""
    }
  );
  const progress = chiComputed(() => {
    if (!duration.value) return 0;
    return currentTime.value / duration.value * 100;
  });
  const getSrc = () => current.value.src;
  const applyVolume = () => {
    if (!audio) return;
    audio.volume = volume.value / 100;
  };
  const load = async (auto = autoplay) => {
    if (!audio) return;
    const file = getSrc();
    if (!file) return;
    loading.value = true;
    audio.src = file;
    audio.load();
    currentTime.value = 0;
    applyVolume();
    if (auto) {
      try {
        audio.play();
      } catch {
      }
    }
  };
  if (audio) {
    audio.onloadedmetadata = () => {
      duration.value = audio.duration || 0;
      loading.value = false;
    };
    audio.ontimeupdate = () => {
      currentTime.value = audio.currentTime || 0;
    };
    audio.onplay = () => {
      playing.value = true;
    };
    audio.onpause = () => {
      playing.value = false;
    };
    audio.onended = () => {
      if (length.value > 1) {
        next();
      } else {
        playing.value = false;
      }
    };
  }
  const play = async () => {
    if (!audio) return;
    try {
      await audio.play();
    } catch {
    }
  };
  const pause = () => {
    if (!audio) return;
    audio.pause();
  };
  const toggle = () => {
    playing.value ? pause() : play();
  };
  const setIndex = async (i, auto = true) => {
    if (i < 0 || i >= list.length)
      return;
    index.value = i;
    await load(auto);
  };
  const next = async () => {
    await setIndex(
      index.value + 1 >= list.length ? 0 : index.value + 1,
      true
    );
  };
  const prev = async () => {
    await setIndex(
      index.value - 1 < 0 ? list.length - 1 : index.value - 1,
      true
    );
  };
  const seekTo = (sec) => {
    if (!audio) return;
    audio.currentTime = sec;
    currentTime.value = sec;
  };
  const seekPercent = (percent) => {
    seekTo(
      percent / 100 * duration.value
    );
  };
  const setVolume = (v) => {
    const safe = Math.max(
      0,
      Math.min(100, v)
    );
    volume.value = safe;
    if (!audio) return;
    audio.volume = safe / 100;
  };
  const mute = () => {
    muted.value = true;
    if (!audio) return;
    audio.muted = true;
  };
  const unmute = () => {
    muted.value = false;
    if (!audio) return;
    audio.muted = false;
  };
  const destroy = () => {
    if (!audio) return;
    audio.pause();
    audio.src = "";
  };
  function formatTime(sec) {
    if (!sec || isNaN(sec)) return "00:00";
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  if (audio) {
    load(false);
  }
  return {
    audio,
    playing,
    loading,
    muted,
    length,
    index,
    current,
    currentTime,
    duration,
    progress,
    volume,
    startTime,
    endTime,
    play,
    pause,
    toggle,
    next,
    prev,
    seekTo,
    seekPercent,
    setVolume,
    mute,
    unmute,
    setIndex,
    destroy
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Chi,
  chiAudio,
  chiBatch,
  chiComputed,
  chiLog,
  chiState,
  chiView
});
