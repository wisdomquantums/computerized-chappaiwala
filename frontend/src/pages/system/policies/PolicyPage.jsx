import PropTypes from "prop-types";

const PolicyPage = ({ title, intro, sections }) => {
  return (
    <section className="container-section space-y-8">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand">
          Legal
        </p>
        <h1 className="section-title">{title}</h1>
        {intro && <p className="section-subtitle">{intro}</p>}
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <article key={section.heading} className="card-surface space-y-3 p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {section.heading}
            </h2>
            {section.content && (
              <p className="text-sm leading-relaxed text-slate-600">
                {section.content}
              </p>
            )}
            {section.items && (
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

PolicyPage.propTypes = {
  title: PropTypes.string.isRequired,
  intro: PropTypes.string,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      heading: PropTypes.string.isRequired,
      content: PropTypes.string,
      items: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
};

export default PolicyPage;
