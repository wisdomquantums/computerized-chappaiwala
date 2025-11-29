import { Link } from "react-router-dom";
import "./SystemPages.css";

const Page404 = () => {
  return (
    <section className="system-page">
      <div className="system-page__glass">
        <p className="system-page__tag">Error 404</p>
        <p className="system-page__digits">404</p>
        <h1 className="system-page__title">We lost that page</h1>
        <p className="system-page__subtitle">
          The link you followed may be broken or the page may have been moved.
          Let&apos;s get you back on track.
        </p>
        <div className="system-page__actions">
          <Link to="/" className="system-page__action is-primary">
            Go to homepage
          </Link>
          <Link to="/services" className="system-page__action is-secondary">
            Explore services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Page404;
