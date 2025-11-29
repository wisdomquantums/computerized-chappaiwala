import "./AdminFooter.css";

const AdminFooter = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="admin-footer">
      <p>© {year} Computerized Chhappaiwala Ops Studio</p>
      <div className="admin-footer__meta">
        <span>Release 2.8 · Stable</span>
        <button type="button">View changelog</button>
      </div>
    </footer>
  );
};

export default AdminFooter;
