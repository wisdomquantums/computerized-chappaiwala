import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { resolveAssetUrl } from "../../../../utils/assetUrl";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const ImageUploadField = ({
  value,
  onChange,
  placeholder = "https://",
  helperText = "Paste a direct URL or upload from your computer.",
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const previewUrl = value ? resolveAssetUrl(value) : "";

  const handleUrlChange = (event) => {
    setUploadError(null);
    onChange?.(event.target.value);
  };

  const handleClear = () => {
    setUploadError(null);
    onChange?.("");
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Upload failed");
      }

      const data = await response.json();
      const nextUrl = resolveAssetUrl(data.url || data.path);
      if (!nextUrl) {
        throw new Error("Upload succeeded but URL is missing.");
      }

      onChange?.(nextUrl);
    } catch (error) {
      console.error("Image upload failed", error);
      setUploadError(error?.message || "Unable to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value || ""}
        onChange={handleUrlChange}
        placeholder={placeholder}
        disabled={disabled || uploading}
        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm disabled:cursor-not-allowed"
      />
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
        <label className="inline-flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
            Upload image
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled || uploading}
            className="text-xs disabled:cursor-not-allowed disabled:opacity-50"
          />
        </label>
        {uploading && <span>Uploading...</span>}
        {previewUrl && (
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-emerald-600"
          >
            Preview
          </a>
        )}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="font-semibold text-rose-500"
          >
            Clear
          </button>
        )}
      </div>
      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      {uploadError && (
        <p className="text-xs font-semibold text-rose-500">{uploadError}</p>
      )}
    </div>
  );
};

ImageUploadField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ImageUploadField;
