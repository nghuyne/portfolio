import { useEffect, useState } from 'react'
import { about, heroWords, profile, services } from '../data'
import { PlusIcon } from './Icons'

export function Hero() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % heroWords.length), 2400)
    return () => clearInterval(id)
  }, [])
  const [first, ...rest] = profile.name.split(' ')

  return (
    <section id="hero" className="hero">
      <div className="hero-left">
        <p className="hero-hello" data-intro>Hello! I'm</p>
        <h1 className="hero-name" data-intro>
          <span>{first}</span>
          <span>{rest.join(' ')}</span>
        </h1>
      </div>
      <div className="hero-right">
        <p className="hero-a" data-intro>A Java</p>
        <div className="hero-words" data-intro aria-live="polite">
          {heroWords.map((w, n) => (
            <span key={w} className={n === i ? 'is-on' : n === (i - 1 + heroWords.length) % heroWords.length ? 'is-off' : ''}>
              {w}
            </span>
          ))}
        </div>
        <p className="hero-role" data-intro>DEVELOPER</p>
      </div>
      <div className="hero-foot" data-intro>
        <span className="status-pill"><i /> {profile.status}</span>
        <span className="scroll-hint">Scroll <b /></span>
      </div>
    </section>
  )
}

export function About() {
  return (
    <section id="about" className="about">
      <div className="about-card" data-reveal>
        <div className="about-head">
          <img src={profile.photo} alt={profile.name} className="about-photo" />
          <div>
            <p className="kicker"><span>01</span> — About</p>
            <p className="about-meta">{profile.role} · {profile.location}</p>
          </div>
        </div>
        <p className="about-lead">{about.lead}</p>
        <p className="about-body">{about.body}</p>
        <dl className="about-stats">
          {about.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.value}</dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export function WhatIDo() {
  const [open, setOpen] = useState(services[0].key)
  return (
    <section id="whatido" className="whatido">
      <h2 className="whatido-title" data-reveal>
        <span>WHAT</span>
        <span>I <em>DO</em></span>
      </h2>
      <div className="whatido-cards">
        {services.map((s) => {
          const isOpen = open === s.key
          return (
            <article
              key={s.key}
              className={`service ${isOpen ? 'is-open' : ''}`}
              data-reveal
              onMouseEnter={() => window.matchMedia('(hover: hover)').matches && setOpen(s.key)}
            >
              <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
              <button className="service-head" aria-expanded={isOpen} onClick={() => setOpen(s.key)}>
                <span>
                  <span className="service-title">{s.title}</span>
                  <span className="service-sub">{s.subtitle}</span>
                </span>
                <PlusIcon className="service-plus" />
              </button>
              <div className="service-body">
                <div>
                  <p>{s.text}</p>
                  <ul className="tags">
                    {s.tags.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
