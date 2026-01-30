# Components AGENTS.md

- Use `useCallback` for callbacks passed to components or effects that interact with Canvas to avoid infinite render loops.
- All preview canvas elements should use `pointer-events-none` when inside a draggable container to avoid event interception.
- Conditionally render "Reset" actions for sliders only when values differ from defaults.
- ColorMixer component filters channels to only show those with values (empty channels hidden).
- Each HSL channel has a color indicator mapping: Red=#ef4444, Orange=#f97316, Yellow=#eab308, Green=#22c55e, Aqua=#06b6d4, Blue=#3b82f6, Purple=#a855f7, Magenta=#d946ef.
