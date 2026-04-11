# chistate

> ⚡ Reactive state. No hooks. No boilerplate.

---

## 🚀 Install

```bash
npm install chistate
```

---

## ⚠️ Important (Read First)

### ✅ Use in Client Components only

```tsx
"use client";
```

👉 Required when using in Next.js (App Router)

## 🧠 Philosophy

> Just mutate variables. UI updates automatically.

---

# ✨ Simple Usage

```tsx
"use client";

import { chiState, chiView } from "chistate";

const count = chiState(0);

export default function App() {
  return chiView(() => (
    <div>
      <h1>{count.value}</h1>

      <button onClick={() => count.value++}>
        Increment
      </button>
    </div>
  ));
}
```

---

# 📦 API

---

## 🟢 chiState

Create reactive state.

```ts
const count = chiState(0);
```

### Usage

```tsx
<h1>{count.value}</h1>
<button onClick={() => count.value++}>+</button>
```

---

## 🔵 chiView

Wrap UI to enable reactivity.

```tsx
return chiView(() => (
  <div>{count.value}</div>
));
```

---

## 🟡 chiComputed

Create derived state.

```ts
const count = chiState(2);

// ✅ define globally
const double = chiComputed(() => count.value * 2);
```

```tsx
<h1>{double.value}</h1>
```

---

## 🟣 chiLog

Reactive logging (effect).

```ts
// ✅ define globally
chiLog(() => {
  console.log("Count:", count.value);
});
```

---

## 🟠 chiBatch

Batch multiple updates.

```ts
chiBatch(() => {
  count.value++;
  count.value++;
});
```

---

### ✅ Use `chiLog`, `chiComputed` OUTSIDE components

```ts
// ✅ Correct (global scope)
const double = chiComputed(() => count.value * 2);

chiLog(() => {
  console.log(count.value);
});
```

```tsx
// ❌ Wrong (inside component)
export default function App() {
  chiLog(() => { ... }) // ❌ can cause memory leaks
}
```

👉 These should run once, not on every render.

---

---

# 🧪 Examples

---

## Multiple States

```tsx
"use client";

const count = chiState(1);
const isDark = chiState(false);

export default function App() {
  return chiView(() => (
    <div>
      <h1>{count.value}</h1>
      <h2>{isDark.value ? "Dark" : "Light"}</h2>

      <button onClick={() => count.value++}>+</button>
      <button onClick={() => isDark.value = !isDark.value}>
        Toggle
      </button>
    </div>
  ));
}
```

---

## Async Example

```tsx
"use client";

const user = chiState(null);
const loading = chiState(false);

async function fetchUser() {
  loading.value = true;

  const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
  user.value = await res.json();

  loading.value = false;
}
```

```tsx
return chiView(() => (
  <div>
    {loading.value && <p>Loading...</p>}
    {user.value && <h1>{user.value.name}</h1>}

    <button onClick={fetchUser}>Fetch</button>
  </div>
));
```

---

# ⚠️ Rules

### ❗ Always use `chiView`

```tsx
❌ return <div>{count.value}</div>

✅ return chiView(() => <div>{count.value}</div>)
```

---

### ❗ Always use `.value`

```ts
count.value = 10  // ✅
count = 10        // ❌
```

---

# 🧠 Mental Model

`chiState` = reactive variable

* reads → tracked
* updates → UI re-renders

---

# ⚡ Why chistate?

* No boilerplate
* No providers
* No reducers
* Just variables

---

# ❤️ Author

Rohit Ambawata

---

# ⭐ Support

If you like it, give a ⭐ on [Github!](https://github.com/rohitLovesKrishna/chistate).

## Contributing

For usage related query feel free to contact "admin@appsitesolutions.in"

## License

MIT