import { useState } from 'react'
import { profile, stack } from '../data'
import { ArrowIcon } from './Icons'
import { SectionHead } from './Chrome'

export function Stack() {
  return (
    <section id="stack" className="stack">
      <SectionHead index="04" label="Tech stack">
        Tools I <em>work with</em>
      </SectionHead>
      <dl className="stack-list">
        {stack.map((g) => (
          <div className="stack-row" key={g.group} data-reveal>
            <dt>{g.group}</dt>
            <dd>
              <ul>
                {g.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

const FORM_ENDPOINT = 'https://formspree.io/f/xeevndrn'

export function Contact() {
  const [state, setState] = useState('idle') // idle | sending | ok | error

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setState('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setState('ok')
    } catch {
      setState('error')
    }
  }

  const links = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
    { label: 'GitHub', value: profile.github.replace('https://', ''), href: profile.github },
    profile.linkedin && { label: 'LinkedIn', value: profile.linkedin.replace(/https?:\/\/(www\.)?/, ''), href: profile.linkedin },
  ].filter(Boolean)

  return (
    <section id="contact" className="contact">
      <div className="contact-left" data-reveal>
        <p className="kicker"><span>05</span> — Contact</p>
        <h2 className="contact-title">Let's <em>talk.</em></h2>
        <p className="contact-text">
          Open to Java Backend intern / fresher roles — HCMC or remote. I reply within 24h.
        </p>
        <ul className="contact-links">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                <span className="cl-label">{l.label}</span>
                <span className="cl-value">{l.value}</span>
                <ArrowIcon className="cl-arrow" />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <form className="contact-form" onSubmit={onSubmit} data-reveal>
        <label>
          <span>Name</span>
          <input name="name" required autoComplete="name" placeholder="Your name" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
        </label>
        <label>
          <span>Message</span>
          <textarea name="message" required rows={5} placeholder="Tell me about the role or project" />
        </label>
        <button type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Send message'} <ArrowIcon width={16} height={16} />
        </button>
        <p className={`form-status ${state}`} role="status">
          {state === 'ok' && '✓ Message sent — I’ll get back to you soon.'}
          {state === 'error' && `Couldn't send right now — please email ${profile.email} directly.`}
        </p>
      </form>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} {profile.name}</span>
      <a href="#hero">Back to top ↑</a>
    </footer>
  )
}
