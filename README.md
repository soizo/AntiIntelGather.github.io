# 横書轉直書

A browser-based utility for converting horizontal Chinese text (横書) to vertical text (直書), and back again. Forked and substantially rewritten from [AntiIntelGather/AntiIntelGather.github.io](https://github.com/AntiIntelGather/AntiIntelGather.github.io).

## Example

Input (横書):

```
春眠不覺曉，處處聞啼鳥。
夜來風雨聲，花落知多少。
```

Output (直書):

```
夜春
來眠
風不
雨覺
聲曉
︐︐
花處
落處
知聞
多啼
少鳥
︒︒
```

## Features

- **Bidirectional conversion** — horizontal to vertical (橫→直) and vertical to horizontal (直→橫)
- **Two splitting modes** — split each input line by a fixed character count per column, or by a fixed total number of columns; accepts `inf` to use the line length as-is
- **Kinsoku shori** — closing punctuation is kept from appearing at a column start; opening brackets are kept from appearing at a column end
- **Half-width to full-width** — converts ASCII letters and digits to their full-width CJK equivalents
- **Vertical punctuation forms** — maps standard CJK punctuation to its rotated vertical variants (e.g. `「」` → `﹁﹂`)
- **Zero-width space insertion** — appends `U+200B` at the end of lines that are shorter than the longest column, for paste compatibility
- **Live update** — output refreshes as you type
- **Copy to clipboard** — one-click copy of the result

## Usage

Open `index.html` in any modern browser. No build step, no server, no dependencies.

1. Paste or type text into the input area. Each line break creates a new column group.
2. Choose a direction: 横→直 or 直→横.
3. If converting to vertical, choose a splitting mode and set the character count or column count.
4. Toggle options as needed.
5. Click **轉换** or enable live update to see the result immediately.
6. Click **複製結果** to copy the output.

## Options

| Option | Default | Description |
|---|---|---|
| 字母數字轉全角 | On | Converts half-width ASCII letters and digits to full-width |
| 標點轉直書 | On | Replaces horizontal punctuation with vertical-form equivalents |
| 行末加零寬空格 | On | Inserts `U+200B` at the end of short lines |
| 實時更新 | On | Triggers conversion on every input event |

## Implementation notes

- Pure vanilla JavaScript, no runtime dependencies. The Bootstrap files in `assets/js/` are unused remnants from the original fork and are not loaded.
- Fonts used: `PMingI.UVar` for body text, `Sarasa UI CL` for UI controls, `Maple Mono NF CN` for numeric inputs. All are local-first with system fallbacks.

## Licence

[CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) — dedicated to the public domain.
