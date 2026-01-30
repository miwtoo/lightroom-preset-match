# Components AGENTS.md

- Use `useCallback` for callbacks passed to components or effects that interact with Canvas to avoid infinite render loops.
- All preview canvas elements should use `pointer-events-none` when inside a draggable container to avoid event interception.
- Conditionally render "Reset" actions for sliders only when values differ from defaults.
