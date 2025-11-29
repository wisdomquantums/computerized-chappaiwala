import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/ui/Loader";
import { fetchInquiries } from "../../../features/inquiries/inquiriesSlice";
import api from "../../../configs/axios";
import "../rolepermission/role/RolePermission.css";
import "./InquiryInbox.css";

const formatDateTime = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const resolveStatusClass = (status) => {
  const normalized = (status || "new").toLowerCase();
  if (normalized.includes("progress") || normalized.includes("ongoing")) {
    return "in-progress";
  }
  if (
    normalized.includes("closed") ||
    normalized.includes("done") ||
    normalized.includes("resolved")
  ) {
    return "closed";
  }
  if (normalized.includes("new")) {
    return "new";
  }
  return "default";
};

const InquiryInbox = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.inquiries);
  const [exporting, setExporting] = useState(null);

  useEffect(() => {
    dispatch(fetchInquiries());
  }, [dispatch]);

  const grouped = useMemo(() => {
    if (!Array.isArray(list)) return [];
    return list.map((item) => ({
      ...item,
      submittedAt: formatDateTime(item.createdAt),
    }));
  }, [list]);

  const refresh = () => dispatch(fetchInquiries());

  const handleExport = async (format) => {
    setExporting(format);
    try {
      const endpoint =
        format === "pdf" ? "/inquiries/export/pdf" : "/inquiries/export/excel";
      const response = await api.get(endpoint, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type:
          format === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = format === "pdf" ? "inquiries.pdf" : "inquiries.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(null);
    }
  };

  const hasData = grouped.length > 0;

  return (
    <div className="rolepermission-page">
      <div className="rolepermission-card rolepermission-table-card inquiry-card">
        <div className="rolepermission-head">
          <div>
            <h1>Inquiry Inbox</h1>
            <p>Real-time submissions from the marketing site.</p>
          </div>
          <div className="rolepermission-head-controls">
            <button
              type="button"
              onClick={refresh}
              className="rolepermission-btn ghost"
              disabled={loading}
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={() => handleExport("excel")}
              disabled={exporting === "excel"}
              className="rolepermission-btn primary"
            >
              {exporting === "excel" ? "Exporting..." : "Export Excel"}
            </button>
            <button
              type="button"
              onClick={() => handleExport("pdf")}
              disabled={exporting === "pdf"}
              className="rolepermission-btn ghost"
            >
              {exporting === "pdf" ? "Building PDF..." : "Export PDF"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rolepermission-table-loading">
            <Loader />
          </div>
        ) : error ? (
          <div className="rolepermission-empty">{error}</div>
        ) : !hasData ? (
          <div className="rolepermission-empty">
            No inquiry submissions yet. Share the inquiry link to collect new
            leads.
          </div>
        ) : (
          <div className="rolepermission-table-wrapper">
            <table className="rolepermission-table inquiry-table">
              <thead>
                <tr>
                  <th>Serial number</th>
                  <th>Submitted</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Message</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {grouped.map((entry, index) => {
                  const statusLabel = entry.status || "New";
                  const statusClass = resolveStatusClass(statusLabel);
                  const serviceLabel = entry.service?.trim() || "Not specified";
                  return (
                    <tr key={entry.id} className="rolepermission-row">
                      <td>{index + 1}</td>
                      <td>
                        <div className="inquiry-meta">
                          <span>{entry.submittedAt || "—"}</span>
                          <span
                            className={`inquiry-status-chip ${statusClass}`}
                          >
                            {statusLabel}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="rolepermission-role-name">
                          <span className="rolepermission-role-label">
                            {entry.name || "Unknown"}
                          </span>
                          <small>{entry.email || "No email"}</small>
                        </div>
                      </td>
                      <td>
                        <div className="inquiry-service">
                          <span className="inquiry-service-pill">
                            {serviceLabel}
                          </span>
                          {entry.metadata?.inquiryEmail && (
                            <span className="inquiry-meta-tag">
                              via {entry.metadata.inquiryEmail}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <p
                          className="inquiry-message"
                          title={entry.description}
                        >
                          {entry.description || "—"}
                        </p>
                        {entry.sourcePage && (
                          <span className="inquiry-meta-tag">
                            {entry.sourcePage}
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="inquiry-contact">
                          <strong>{entry.phone || "Not shared"}</strong>
                          <span>{entry.email || "No email"}</span>
                          {entry.metadata?.utm?.medium && (
                            <span className="inquiry-meta-tag">
                              {entry.metadata.utm.medium}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryInbox;
