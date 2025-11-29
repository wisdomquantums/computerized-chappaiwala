import CommonFormAdd from "./CommonFormAdd";

const Add = ({ sectionConfig, ...props }) => {
  return (
    <div className="rolepermission-modal" role="dialog" aria-modal="true">
      <div className="rolepermission-modal-panel">
        <div className="rolepermission-modal-head">
          <div>
            <p className="rolepermission-role-meta">{sectionConfig?.meta}</p>
            <h2>Add to {sectionConfig?.label}</h2>
          </div>
          <button
            type="button"
            className="rolepermission-btn ghost"
            onClick={props.onClose}
          >
            Close
          </button>
        </div>

        <CommonFormAdd sectionConfig={sectionConfig} {...props} />
      </div>
    </div>
  );
};

export default Add;
