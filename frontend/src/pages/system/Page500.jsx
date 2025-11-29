import { Link } from "react-router-dom";
import "./SystemPages.css";

const Page500 = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <section className="system-page">
      <div className="system-page__glass">
        <p className="system-page__tag">Error 500</p>
        <p className="system-page__digits">500</p>
        <h1 className="system-page__title">Something went wrong</h1>
        <p className="system-page__subtitle">
          Our team has been notified and is already investigating. You can retry
          loading the page or head back to a safe spot.
        </p>
        <div className="system-page__actions">
          <button
            type="button"
            className="system-page__action is-primary"
            onClick={handleReload}
          >
            Try again
          </button>
          <Link to="/" className="system-page__action is-secondary">
            Back to dashboard
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Page500;
