import { NavLink } from "react-router-dom";
import "./AdminBreadcrumb.css";

const AdminBreadcrumb = ({ items = [] }) => {
  if (!items.length) {
    return null;
  }

  return (
    <nav className="admin-breadcrumb" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div
          key={`${item.path}-${index}`}
          className="admin-breadcrumb__segment"
        >
          {index > 0 && <span className="admin-breadcrumb__divider">/</span>}
          {index === items.length - 1 ? (
            <span className="admin-breadcrumb__current">{item.label}</span>
          ) : (
            <NavLink to={item.path}>{item.label}</NavLink>
          )}
        </div>
      ))}
    </nav>
  );
};

export default AdminBreadcrumb;
