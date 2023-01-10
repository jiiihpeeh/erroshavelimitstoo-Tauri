Install depencies:
```
npm i

```

Nim source:
```
nimble install nimpy supersnappy pixie jsony
nim c -d:release --app:staticLib --noMain  --passL:strip callnim.nim 
```
For pixie use this file https://github.com/jiiihpeeh/pixie/blob/master/src/pixie/fileformats/svg.nim


```
npm run tauri build
```

# Tauri + React

This template should help get you started developing with Tauri and React in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
