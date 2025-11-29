export const PersonaHighlightsSection = ({
  eyebrow,
  title,
  subtitle,
  items,
}) => (
  <section className="rolepermission-card rolepermission-highlight-card">
    <header>
      <p className="rolepermission-role-meta">{eyebrow}</p>
      <h3>{title}</h3>
      <p className="rolepermission-section-subtitle">{subtitle}</p>
    </header>
    <div className="rolepermission-highlight-grid">
      {items.map((item) => (
        <article key={item.label} className="rolepermission-metric-card">
          <p className="label">{item.label}</p>
          <h4>{item.value}</h4>
          <span
            className={`trend ${item.trend?.startsWith("-") ? "down" : "up"}`}
          >
            {item.trend}
          </span>
          <p className="hint">{item.hint}</p>
        </article>
      ))}
    </div>
  </section>
);

export const PersonaJourneySection = ({
  eyebrow,
  title,
  subtitle,
  journeys,
}) => (
  <section className="rolepermission-card rolepermission-journey-card">
    <header>
      <p className="rolepermission-role-meta">{eyebrow}</p>
      <h3>{title}</h3>
      <p className="rolepermission-section-subtitle">{subtitle}</p>
    </header>
    <ol className="rolepermission-journey-list">
      {journeys.map((journey) => (
        <li key={journey.title}>
          <div className="journey-head">
            <strong>{journey.title}</strong>
            <span>{journey.window}</span>
          </div>
          <p>{journey.description}</p>
        </li>
      ))}
    </ol>
  </section>
);

export const PersonaChecklistSection = ({
  eyebrow,
  title,
  subtitle,
  items,
}) => (
  <section className="rolepermission-card rolepermission-checklist-card">
    <header>
      <p className="rolepermission-role-meta">{eyebrow}</p>
      <h3>{title}</h3>
      <p className="rolepermission-section-subtitle">{subtitle}</p>
    </header>
    <ul className="rolepermission-checklist">
      {items.map((item) => (
        <li key={item.title}>
          <div>
            <strong>{item.title}</strong>
            <p>{item.description}</p>
          </div>
          <span className={`status ${item.status}`}>{item.statusLabel}</span>
        </li>
      ))}
    </ul>
  </section>
);
