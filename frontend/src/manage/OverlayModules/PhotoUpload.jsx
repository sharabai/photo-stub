import { useState } from "react";
import PropTypes from "prop-types";
import OverlayModuleNames from "./OverlayModuleNames";
import "./PhotoUpload.css";
import auth from "../authModule.js";

function PhotoUpload({ data, controls }) {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const isCover =
    controls.activeOverlayModule.value === OverlayModuleNames.UPLOAD_COVER;

  const handleSubmit = (event) => {
    event.preventDefault();

    // Define allowed image MIME types
    const allowedTypes = ["image/jpeg", "image/png"];
    const allowedTypeCover = ["image/jpeg"];

    // Filter out files that are not images
    const validFiles = Array.from(files).filter((file) =>
      isCover
        ? allowedTypeCover.includes(file.type)
        : allowedTypes.includes(file.type)
    );

    // Check if any invalid images were selected
    if (validFiles.length !== files.length) {
      alert(
        isCover
          ? "Please select jpeg, jpg image"
          : "Please select image files only: jpeg, jpg, png"
      );
      return;
    }

    if (validFiles.length === 0) {
      alert(
        isCover ? "Please select cover image" : "Please select some images"
      );
      return;
    }

    controls.areControlsDisabled.set(true);
    controls.showNotification.set(true);
    controls.notificationStatus.set("pending");

    const formData = new FormData();

    validFiles.forEach((file) => {
      formData.append(`photos`, file);
    });

    fetch(
      `${import.meta.env.VITE_API_URL}/photos/upload?partialPath=${
        data[controls.category.value]["local-path"]
      }/${
        data?.[controls.category.value].gallery?.[controls.gallery.value]?.[
          "local-path"
        ]
      }${isCover ? `&catLocalPath=${controls.arg1.value}` : ""}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token.get()}`,
        },
        body: formData,
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json(); // Parses JSON response into native JavaScript objects
      })
      .then((data) => {
        controls.notificationStatus.set("success");
        // TODO: think about how to update the src without
        // updating the whole SidePanel
        // controls.getData();
        console.log(data.message); // Logs: Files uploaded successfully
      })
      .catch((error) => {
        controls.notificationStatus.set("error");
        console.error("Error:", error);
      })
      .finally(() => {
        controls.areControlsDisabled.set(false);
        controls.activeOverlayModule.set(null);
        setTimeout(() => {
          controls.showNotification.set(false);
        }, 3000);
      });
  };

  const moduleName = isCover
    ? OverlayModuleNames.UPLOAD_COVER
    : OverlayModuleNames.UPLOAD_PICTURES;

  return (
    <form
      className={`photo-upload-form ${
        controls.activeOverlayModule.value === moduleName ? "" : "hidden"
      }`}
      onSubmit={handleSubmit}
    >
      {isCover ? (
        <input type="file" onChange={handleFileChange} />
      ) : (
        <input type="file" multiple onChange={handleFileChange} />
      )}
      <button className="regular-btn " type="submit">
        Upload{isCover ? " Cover" : " Photos"}
      </button>
    </form>
  );
}

export default PhotoUpload;

PhotoUpload.propTypes = {
  controls: PropTypes.object.isRequired,
  data: PropTypes.array,
};
