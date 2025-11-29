import CommonForm from "./CommonForm";

const Edit = ({ sectionConfig, ...props }) => {
  return (
    <div className="rolepermission-modal" role="dialog" aria-modal="true">
      <div className="rolepermission-modal-panel">
        <div className="rolepermission-modal-head">
          <div>
            <p className="rolepermission-role-meta">{sectionConfig?.meta}</p>
            <h2>Edit {sectionConfig?.label}</h2>
          </div>
          <button
            type="button"
            className="rolepermission-btn ghost"
            onClick={props.onClose}
          >
            Close
          </button>
        </div>

        <CommonForm panelMode="edit" sectionConfig={sectionConfig} {...props} />
      </div>
    </div>
  );
};

export default Edit;
