This is a standalone version of https://github.com/jiiihpeeh/errorsHaveLimitsToo. (Online demo https://kukkoilija.chickenkiller.com/errorshavelimitstoo/).
It utilizes system  using Tauri and Nim

It is recommended to have Python and SymPy installed in your system altough it works without them as well (greater loading times).
If you want PDF export LaTeX is needed too (either `xelatex` or `pdflatex`) and it needs to be available in your `PATH`.

Easy way:

https://github.com/jiiihpeeh/erroshavelimitstoo-Tauri/releases/tag/0.3.0

Building

Install depencies:
```
npm i
```

Nim source:
```
nimble install nimpy supersnappy pixie jsony
nim c -d:release --app:staticLib --noMain -d:ssl --gc:boehm
```
For some reason boehm garbage collection works better for nimpy.
For pixie use this file https://github.com/jiiihpeeh/pixie/blob/master/src/pixie/fileformats/svg.nim


```
npm run tauri build
```

Python (optional but faster loading and lighter - skips pyodide)
```
pip install sympy
```


# Tauri + React

This template should help get you started developing with Tauri and React in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
