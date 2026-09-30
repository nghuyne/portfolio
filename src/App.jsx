import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Loader, Navbar, SocialRail } from './components/Chrome'
import { Hero, About, WhatIDo } from './components/Intro'
import Career from './components/Career'
import Work from './components/Work'
import { Stack, Contact, Footer } from './components/Outro'
import { sceneState } from './three/state'

const Scene = lazy(() => import('./three/Scene'))

gsap.registerPlugin(ScrollTrigger)

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App() {
  const [fontsReady, setFontsReady] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [loaderGone, setLoaderGone] = useState(false)
  const [sceneActive, setSceneActive] = useState(true)
  const ready = fontsReady && sceneReady

  // Fonts must be loaded before the 3D labels/code are drawn to canvas textures.
  useEffect(() => {
    const t = setTimeout(() => setFontsReady(true), 2500)
    document.fonts.ready.then(() => {
      clearTimeout(t)
      setFontsReady(true)
    })
    return () => clearTimeout(t)
  }, [])

  // Never block the page on WebGL: fall back after a few seconds.
  useEffect(() => {
    const t = setTimeout(() => setSceneReady(true), 6000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', !ready)
    if (!ready) return
    const t = setTimeout(() => setLoaderGone(true), 1100)
    return () => clearTimeout(t)
  }, [ready])

  // Pointer → scene tilt
  useEffect(() => {
    const on = (e) => {
      sceneState.pointerX = (e.clientX / window.innerWidth) * 2 - 1
      sceneState.pointerY = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', on, { passive: true })
    return () => window.removeEventListener('pointermove', on)
  }, [])

  // Scroll → scene pose (0 hero, 1 about, 2 what-i-do) and pause rendering past it.
  useEffect(() => {
    let anchors = [0, 1, 2]
    const center = (id) => {
      const el = document.getElementById(id)
      return el.offsetTop + el.offsetHeight / 2 - window.innerHeight / 2
    }
    const measure = () => {
      anchors = [0, center('about'), center('whatido')]
      update()
    }
    const update = () => {
      const y = window.scrollY
      let p
      if (y <= anchors[1]) p = y / Math.max(anchors[1], 1)
      else p = 1 + Math.min((y - anchors[1]) / Math.max(anchors[2] - anchors[1], 1), 1)
      sceneState.progress = Math.max(0, Math.min(p, 2))
    }
    measure()
    window.addEventListener('scroll', update, { passive: true })
    ScrollTrigger.addEventListener('refresh', measure)
    window.addEventListener('resize', measure)

    const st = ScrollTrigger.create({
      trigger: '#career',
      start: 'top top',
      end: 'max',
      onEnter: () => setSceneActive(false),
      onLeaveBack: () => setSceneActive(true),
    })
    if (!reducedMotion()) document.documentElement.classList.add('anim')
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', measure)
      ScrollTrigger.removeEventListener('refresh', measure)
      st.kill()
    }
  }, [])

  // Intro + reveal animations
  useGSAP(
    () => {
      if (!ready || reducedMotion()) return
      gsap.from('[data-intro]', {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.09,
        delay: 0.35,
      })
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 88%',
        once: true,
        onEnter: (els) =>
          gsap.fromTo(els, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08 }),
      })
      gsap.to('.timeline-fill', {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 60%', scrub: true },
      })
      ScrollTrigger.refresh()
    },
    { dependencies: [ready] }
  )

  const onSceneReady = useCallback(() => setSceneReady(true), [])

  return (
    <>
      {!loaderGone && <Loader done={ready} />}
      <div className={`scene-layer ${sceneActive ? '' : 'is-paused'}`} aria-hidden="true">
        <div className="scene-glow" />
        {fontsReady && (
          <Suspense fallback={null}>
            <Scene active={sceneActive} onReady={onSceneReady} />
          </Suspense>
        )}
      </div>
      <Navbar />
      <SocialRail />
      <main>
        <Hero />
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
