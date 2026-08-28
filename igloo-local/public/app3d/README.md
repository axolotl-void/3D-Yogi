# App3D Bundle Parts

The original `app3D.js` is a generated ES module whose declarations share one
lexical scope. These files live in `public/app3d/` because the local host serves
that directory directly. They are ordered source parts, not independent ES
modules, and must be concatenated in the order listed in `parts.json`.

`scripts/assemble-app3d.mjs` is the only assembly path. It writes the assembled
runtime to `public/App3D-f554a111.js` and synchronizes the loader to
`public/index-2eb69c09.js`. The former root `app3D.js` is archived in
`hasil-inspekc/app3D-original-before-split.js` and is not loaded by the host.
The former public copy is archived as
`hasil-inspekc/App3D-public-before-assembler.js`; the assembler recreates the
public runtime from these parts.

## Commands

```sh
npm run assemble
npm run verify:app3d
npm run build
```

Do not import a part directly and do not edit the generated root/public bundles.
This layout deliberately preserves the original runtime, including the Svelte
facade, Three.js singleton state, worker protocols, shaders, scenes, and event
ordering. A later true source rewrite can replace these parts, but it must keep
the same `interactionNode`, `relativePath`, and `ready` contract.
