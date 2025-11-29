import React from "react";
import ReactDOM from "react-dom";
import Loader from "../../../components/ui/Loader";
import "../rolepermission/role/RolePermission.css";
import {
  useManageServices,
  getFinalPriceFromService,
  defaultFormState,
  formatPriceLabel,
} from "./IndexUse";
import Add from "./Add";
import Edit from "./Edit";

const Index = () => {
  const {
    list,
    loading,
    error,
    form,
    galleryFields,
    formError,
    submitting,
    panelOpen,
    panelMode,
    finalPriceLabel,
    openAddPanel,
    closePanel,
    handleChange,
    handleGalleryChange,
    handleAddGalleryField,
    handleRemoveGalleryField,
    handleSubmit,
    handleEdit,
    handleDelete,
  } = useManageServices();

  const modalRoot =
    typeof document !== "undefined"
      ? document.getElementById("modal-root") || document.body
      : null;

  const modalContent =
    panelOpen &&
    (panelMode === "edit" ? (
      <Edit
        form={form}
        galleryFields={galleryFields}
        formError={formError}
        submitting={submitting}
        finalPriceLabel={finalPriceLabel}
        onClose={closePanel}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onGalleryChange={handleGalleryChange}
        onAddGalleryField={handleAddGalleryField}
        onRemoveGalleryField={handleRemoveGalleryField}
      />
    ) : (
      <Add
        form={form}
        galleryFields={galleryFields}
        formError={formError}
        submitting={submitting}
        finalPriceLabel={finalPriceLabel}
        onClose={closePanel}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onGalleryChange={handleGalleryChange}
        onAddGalleryField={handleAddGalleryField}
        onRemoveGalleryField={handleRemoveGalleryField}
      />
    ));

  const renderChargesCell = (service) => (
    <>
      <div className="rolepermission-role-name">
        <span className="rolepermission-role-label">
          Paper: {service.paperCharge || "--"}
        </span>
      </div>
      <div className="rolepermission-role-name">
        <span className="rolepermission-role-label">
          Print: {service.printCharge || "--"}
        </span>
      </div>
    </>
  );

  const renderSupportCell = (service) => (
    <span className="rolepermission-status active">
      {service.supportWindow || "--"}
    </span>
  );

  const renderReviewCell = (service) => {
    const rating =
      typeof service.rating === "number" && !Number.isNaN(service.rating)
        ? service.rating.toFixed(1)
        : "--";
    const reviews =
      typeof service.reviewCount === "number" && service.reviewCount > 0
        ? `${service.reviewCount}+ reviews`
        : "No reviews";
    return (
      <div className="rolepermission-role-name">
        <span className="rolepermission-role-label">
          {rating} · {reviews}
        </span>
      </div>
    );
  };

  const renderFinalPriceCell = (service) => (
    <span className="rolepermission-status active">
      {formatPriceLabel(
        getFinalPriceFromService(service),
        service.unitLabel || defaultFormState.unitLabel
      )}
    </span>
  );

  return (
    <div className="rolepermission-page">
      <section className="rolepermission-card rolepermission-table-card">
        <div className="rolepermission-head">
          <div>
            <p className="rolepermission-role-meta">Services management</p>
            <h1>Service catalog</h1>
            <p className="rolepermission-section-subtitle">
              Configure every print/design service, pricing split, and support
              window from a single admin screen.
            </p>
            <small>{`${list.length} services in catalog`}</small>
          </div>
          <div className="rolepermission-head-controls">
            <button
              type="button"
              className="rolepermission-btn primary"
              onClick={openAddPanel}
            >
              Add service
            </button>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="rolepermission-empty">
            <p>Unable to load services. {error}</p>
          </div>
        ) : (
          <div className="rolepermission-table-wrapper">
            <table className="rolepermission-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Service</th>
                  <th>Title</th>
                  <th>Charges</th>
                  <th>Support</th>
                  <th>Reviews</th>
                  <th>Final price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="rolepermission-empty">
                      No services configured yet.
                    </td>
                  </tr>
                ) : (
                  list.map((service, index) => (
                    <tr key={service.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="rolepermission-role-name">
                          <span className="rolepermission-role-label">
                            {service.category || service.name || service.title}
                          </span>
                          <small>ID: {service.id}</small>
                        </div>
                      </td>
                      <td>{service.title || service.name}</td>
                      <td>{renderChargesCell(service)}</td>
                      <td>{renderSupportCell(service)}</td>
                      <td>{renderReviewCell(service)}</td>
                      <td>{renderFinalPriceCell(service)}</td>
                      <td>
                        <div className="rolepermission-actions rolepermission-table-actions">
                          <button
                            type="button"
                            className="rolepermission-btn ghost"
                            onClick={() => handleEdit(service)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="rolepermission-btn ghost danger"
                            onClick={() => handleDelete(service.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalRoot && ReactDOM.createPortal(modalContent, modalRoot)}
    </div>
  );
};

export default Index;
