### Shift

The `Shift` component is a container designed for smooth vertical transitions between multiple children. It is useful for building multi-step forms, tab-like switching, or replacing UI elements with a sliding effect.

#### Import

```ts
import {Shift} from "addon-ui";
```

#### Basic usage

```tsx
const [step, setStep] = useState(1);

<Shift active={step} adaptiveHeight>
    <div>
        <h2>Step 1</h2>
        <p>First step content</p>
        <button onClick={() => setStep(2)}>Next</button>
    </div>
    <div>
        <h2>Step 2</h2>
        <p>Second step content</p>
        <button onClick={() => setStep(1)}>Back</button>
    </div>
</Shift>;
```

---

#### Props: Shift

Only the prop name, type, and default are listed below.

| Prop             | Type                       | Default |
| ---------------- | -------------------------- | ------- |
| `active`         | `number`                   | `1`     |
| `height`         | `number`                   | —       |
| `adaptiveHeight` | `boolean`                  | `true`  |
| `itemClassName`  | `string`                   | —       |
| —                | all `HTMLDivElement` props | —       |

#### Notes on props:

- `active`: A 1-based index (1, 2, 3...) that determines which child is currently visible.
- `height`: Fixed height for the container. If provided, `adaptiveHeight` behavior is effectively overridden.
- `adaptiveHeight`: If `true`, the container automatically adjusts its height to match the current child's height with a smooth transition.

---

### CSS variables for Shift

The following variables are used in `src/components/Shift/shift.module.scss` to control the transition animations.

| Variable                  | Fallback chain                                  |
| :------------------------ | :---------------------------------------------- |
| `--shift-speed-height`    | `var(--shift-speed-height, var(--speed-sm))`    |
| `--shift-speed-transform` | `var(--shift-speed-transform, var(--speed-sm))` |
| `--shift-speed-opacity`   | `var(--shift-speed-opacity, var(--speed-sm))`   |

---

### Accessibility (A11y)

`Shift` is a layout-oriented component and does not provide specific ARIA roles or keyboard interactions by itself. Ensure that the children inside `Shift` are accessible. When switching the `active` index, consider using ARIA live regions or manual focus management if the context changes significantly for screen reader users.

---

### Usage notes

- Each child of the `Shift` component is wrapped in an absolute-positioned container to allow smooth transitions.
- If a child is not a valid React element (e.g., a string or number), it is automatically wrapped in a `<span>`.
- `adaptiveHeight` is enabled by default, which is recommended when children have varying heights to ensure a smooth layout experience.
- The component uses `translate3d` and `opacity` for high-performance animations.
