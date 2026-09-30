import * as THREE from 'three'

const KEYWORDS = new Set([
  'public', 'private', 'final', 'class', 'new', 'return', 'if', 'while', 'var',
  'synchronized', 'throw', 'void', 'const', 'await', 'async', 'try', 'catch',
])

const COLORS = {
  text: '#d7d3e8',
  keyword: '#c792ff',
  type: '#7fd1ff',
  string: '#9fe6a0',
  annotation: '#ffcb6b',
  punct: '#8a84a3',
  gutter: '#4a4560',
}

function tokenize(line) {
  const out = []
  const re = /(@\w+)|("[^"]*"|'[^']*')|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z_"'@]+)/g
  let m
  while ((m = re.exec(line))) {
    if (m[1]) out.push([m[1], COLORS.annotation])
    else if (m[2]) out.push([m[2], COLORS.string])
    else if (m[3]) {
      const w = m[3]
      const color = KEYWORDS.has(w) ? COLORS.keyword : /^[A-Z]/.test(w) ? COLORS.type : COLORS.text
      out.push([w, color])
    } else if (m[4]) out.push([m[4], null])
    else out.push([m[5], COLORS.punct])
  }
  return out
}

/**
 * A canvas texture that "types" through code snippets like a live editor.
 * Call `tick(dt)` every frame; the canvas only redraws when a character is added.
 */
export function createCodeScreen(snippets, { width = 1024, height = 640 } = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4

  const files = snippets.map((s) => ({ name: s.name, lines: s.code.split('\n') }))
  let fileIndex = 0
  let chars = 0
  let acc = 0
  let pause = 0
  let blink = 0
  let lastDrawn = -1

  const total = () => files[fileIndex].lines.join('\n').length

  function draw(showCaret) {
    const file = files[fileIndex]
    ctx.fillStyle = '#0d0a16'
    ctx.fillRect(0, 0, width, height)

    // title bar
    ctx.fillStyle = '#16121f'
    ctx.fillRect(0, 0, width, 52)
    ;['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
      ctx.fillStyle = c
      ctx.beginPath()
      ctx.arc(30 + i * 26, 26, 8, 0, Math.PI * 2)
      ctx.fill()
    })
    files.forEach((f, i) => {
      const x = 130 + i * 230
      ctx.fillStyle = i === fileIndex ? '#0d0a16' : 'transparent'
      if (i === fileIndex) ctx.fillRect(x, 8, 220, 44)
      ctx.font = '500 20px "Geist Mono", monospace'
      ctx.fillStyle = i === fileIndex ? '#e9e4ff' : '#6d6785'
      ctx.fillText(f.name, x + 16, 37)
    })

    // code
    const lineH = 30
    const left = 70
    let remaining = chars
    let caret = null
    ctx.font = '400 21px "Geist Mono", monospace'
    for (let i = 0; i < file.lines.length; i++) {
      const y = 96 + i * lineH
      if (y > height - 20) break
      ctx.fillStyle = COLORS.gutter
      ctx.textAlign = 'right'
      ctx.fillText(String(i + 1), left - 22, y)
      ctx.textAlign = 'left'
      if (remaining <= 0) continue
      const visible = file.lines[i].slice(0, remaining)
      remaining -= file.lines[i].length + 1
      let x = left
      for (const [tok, color] of tokenize(visible)) {
        if (color) {
          ctx.fillStyle = color
          ctx.fillText(tok, x, y)
        }
        x += ctx.measureText(tok).width
      }
      caret = { x, y }
    }
    if (showCaret && caret) {
      ctx.fillStyle = '#c792ff'
      ctx.fillRect(caret.x + 2, caret.y - 20, 11, 26)
    }

    // status bar
    ctx.fillStyle = '#7c3aed'
    ctx.fillRect(0, height - 34, width, 34)
    ctx.fillStyle = '#f5f0ff'
    ctx.font = '500 18px "Geist Mono", monospace'
    ctx.fillText('main  ✓ build passing   Java 21 · Spring Boot 3', 20, height - 11)
    texture.needsUpdate = true
  }

  function tick(dt) {
    blink += dt
    const caretOn = Math.floor(blink * 2) % 2 === 0
    if (pause > 0) {
      pause -= dt
      if (pause <= 0) {
        fileIndex = (fileIndex + 1) % files.length
        chars = 0
      }
    } else {
      acc += dt
      const step = 1 / 38 // characters per second ≈ 38
      while (acc > step) {
        acc -= step
        chars++
        if (chars >= total()) {
          pause = 2.6
          break
        }
      }
    }
    const key = chars * 2 + (caretOn ? 1 : 0) + fileIndex * 100000
    if (key !== lastDrawn) {
      lastDrawn = key
      draw(caretOn)
    }
  }

  draw(true)
  return { texture, tick, dispose: () => texture.dispose() }
}

/** Static text label rendered to a texture (used for the floating keycaps). */
export function createLabelTexture(text, { color = '#ede9fe', bg = null, size = 256 } = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (bg) {
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, size, size)
  }
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  let fontSize = size * 0.26
  ctx.font = `700 ${fontSize}px "Geist", sans-serif`
  while (ctx.measureText(text).width > size * 0.82 && fontSize > 12) {
    fontSize -= 2
    ctx.font = `700 ${fontSize}px "Geist", sans-serif`
  }
  ctx.fillText(text, size / 2, size / 2)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}
