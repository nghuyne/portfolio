import { career } from '../data'
import { SectionHead } from './Chrome'

export default function Career() {
  return (
    <section id="career" className="career">
      <SectionHead index="02" label="Experience" align="center">
        Where I've <em>worked</em>
      </SectionHead>
      <div className="timeline">
        <div className="timeline-line"><span className="timeline-fill" /></div>
        {career.map((c) => (
          <div className="tl-item" key={c.title + c.period} data-reveal>
            <div className="tl-left">
              <p className="tl-period">{c.period}</p>
            </div>
            <span className="tl-dot" />
            <div className="tl-right">
              <h3>
                {c.title} <span className="tl-at">@ {c.org}</span>
              </h3>
              {c.role && <p className="tl-role">{c.role}</p>}
              <ul className="tl-points">
                {c.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
