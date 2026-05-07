export function fireConfetti(originX: number, originY: number) {
  const stage = document.createElement('div')
  stage.className = 'confetti-stage'
  document.body.appendChild(stage)
  const colors = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)', 'var(--c5)']
  for (let i = 0; i < 42; i++) {
    const s = document.createElement('span')
    const angle = Math.random() * Math.PI - Math.PI / 2
    const dist = 120 + Math.random() * 180
    s.style.left = originX + 'px'
    s.style.top = originY + 'px'
    s.style.background = colors[i % colors.length]
    s.style.setProperty('--tx', Math.cos(angle) * dist + 'px')
    s.style.setProperty('--ty', Math.sin(angle) * dist + 200 + 'px')
    s.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg')
    s.style.animationDelay = (Math.random() * 0.06) + 's'
    stage.appendChild(s)
  }
  setTimeout(() => stage.remove(), 1800)
}
