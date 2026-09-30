import { useEffect, useState } from 'react'
import { profile } from '../data'
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons'

export function Loader({ done }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    let raf
    const tick = () => {
      setPct((p) => {
        const target = done ? 100 : 88
        const next = p + Math.max(0.4, (target - p) * (done ? 0.18 : 0.04))
        return Math.min(next, target)
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [done])

  return (
    <div className={`loader ${done && pct >= 99.5 ? 'loader--out' : ''}`} aria-hidden="true">
      <div className="loader-inner">
        <span className="loader-logo">{profile.short}<span className="accent">.</span></span>
        <div className="loader-bar">
          <span style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
        <span className="loader-pct">{String(Math.round(pct)).padStart(3, '0')}%</span>
      </div>
    </div>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <a href="#hero" className="nav-logo">
        {profile.short}<span className="accent">.</span>
      </a>
      <nav className="nav-links">
        <a href="#about">About</a>
        <a href="#career">Experience</a>
        <a href="#work">Work</a>
        <a href="#stack">Stack</a>
        <a href="#contact" className="nav-cta">Contact</a>
      </nav>
    </header>
  )
}

export function SectionHead({ index, label, children, align }) {
  return (
    <header className={`section-head ${align === 'center' ? 'is-center' : ''}`} data-reveal>
      <p className="kicker"><span>{index}</span> — {label}</p>
      <h2 className="section-title">{children}</h2>
    </header>
  )
}

export function SocialRail() {
  return (
    <>
      <div className="rail">
        <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon /></a>
        {profile.linkedin && (
          <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
        )}
        <a href={`mailto:${profile.email}`} aria-label="Email"><MailIcon /></a>
      </div>
      {profile.resumeUrl && (
        <a className="resume-link" href={profile.resumeUrl} target="_blank" rel="noreferrer">
          Resume <span aria-hidden="true">↗</span>
        </a>
      )}
    </>
  )
}
