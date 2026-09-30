import { useRef } from 'react'
import { projects, snippets } from '../data'
import { SectionHead } from './Chrome'
import { ArrowIcon } from './Icons'

const KW = new Set(['public', 'private', 'final', 'class', 'new', 'return', 'if', 'while', 'var', 'synchronized', 'throw', 'const', 'await', 'async', 'try', 'catch'])

function CodeArt({ code, file }) {
  return (
    <div className="code-window" aria-hidden="true">
      <div className="code-bar">
        <i /><i /><i />
        <span>{file}</span>
      </div>
      <pre className="code-art">
        {code.split('\n').slice(0, 17).map((line, i) => (
          <span key={i} className="code-line">
            <span className="ln">{i + 1}</span>
            {line.split(/(\s+|[(){}<>;,.])/).map((tok, k) => {
              let cls
              if (tok.startsWith('@')) cls = 'c-ann'
              else if (/^['"]/.test(tok)) cls = 'c-str'
              else if (KW.has(tok)) cls = 'c-kw'
              else if (/^[A-Z]\w*$/.test(tok)) cls = 'c-type'
              return cls ? <span key={k} className={cls}>{tok}</span> : tok
            })}
            {'\n'}
          </span>
        ))}
      </pre>
    </div>
  )
}

function Media({ p }) {
  const video = useRef()
  if (!p.image) {
    return (
      <div className="card-media card-media--code">
        <CodeArt code={snippets[p.code]} file={p.file} />
      </div>
    )
  }
  return (
    <div
      className="card-media"
      onMouseEnter={() => video.current?.play().catch(() => {})}
      onMouseLeave={() => video.current?.pause()}
    >
      <img src={p.image} alt={`${p.title} — screenshot`} loading="lazy" />
      {p.video && <video ref={video} src={p.video} muted loop playsInline preload="none" aria-hidden="true" />}
    </div>
  )
}

export default function Work() {
  return (
    <section id="work" className="work">
      <SectionHead index="03" label="Selected work">
        Things I've <em>built</em>
      </SectionHead>
      <div className="work-grid">
        {projects.map((p, i) => (
          <article className={`card ${i === 0 ? 'is-featured' : ''}`} key={p.id} data-reveal>
            <Media p={p} />
            <div className="card-info">
              <div className="card-top">
                <span className={`card-kind ${p.kind.includes('Live') ? 'is-live' : ''}`}>
                  {p.kind.includes('Live') && <i />}
                  {p.kind}
                </span>
              </div>
              <h3 className="card-title">{p.title}</h3>
              <p className="card-summary">{p.summary}</p>
              <ul className="card-points">
                {p.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
              <div className="card-foot">
                <ul className="tags">
                  {p.stack.map((t) => <li key={t}>{t}</li>)}
                </ul>
                <div className="card-links">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                      {l.label} <ArrowIcon width={14} height={14} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
