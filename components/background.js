import { useEffect, useRef } from 'react'
import styles from './background.module.scss'

const minRadius = 2
const maxRadius = 3

const minSpeed = 0.3
const maxSpeed = 0.5

const spacing = 17 // higher = more sparse
const color = '#f0f0f0'

const draw = (ctx, frameCount) => {
  const w = ctx.canvas.width
  const h = ctx.canvas.height

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  for (let x = 0; x < w; x += spacing) {
    for (let y = 0; y < h; y += spacing) {
      const depthMultiplier = ((x * y) % 7) / 7
      const speedMultiplier = ((x * x * y * y) % 4457) / 4457
      const speed = minSpeed + (maxSpeed - minSpeed) * speedMultiplier

      const x1 = (x + speed * frameCount) % w
      const y1 = (y + speed * frameCount) % h

      const radius = minRadius + depthMultiplier * (maxRadius - minRadius)

      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x1, y1, radius, 0, 2 * Math.PI)
      ctx.fill()
    }
  }
}

export default function Background() {
  const ref = useRef()
  const mouseRef = useRef()

  // Resize canvas to window size
  useEffect(() => {
    function windowResize() {
      const canvas = ref.current
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    window.addEventListener('resize', windowResize)
    windowResize()

    return () => {
      window.removeEventListener('resize', windowResize)
    }
  })

  useEffect(() => {
    const mouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }
    document.addEventListener('mousemove', mouseMove)
    return () => {
      document.removeEventListener('mousemove', mouseMove)
    }
  }, [])

  useEffect(() => {
    const canvas = ref.current
    const context = canvas.getContext('2d')
    let frameCount = 137 + Math.random() * 100
    let animationFrameId

    const render = () => {
      frameCount += 1
      draw(context, frameCount, mouseRef.current)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas className={styles.canvas} ref={ref} />
}
