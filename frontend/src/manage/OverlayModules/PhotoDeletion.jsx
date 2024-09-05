import PropTypes from "prop-types";
import OverlayModuleNames from "./OverlayModuleNames";
import "./PhotoUpload.css";
import ConfirmOverlay from "../ConfirmOverlay";
import auth from "../authModule.js";

function PhotoDeletion({ data, controls }) {
  const handleClick = () => {
    console.log("Handling click");

    controls.areControlsDisabled.set(true);
    controls.showNotification.set(true);
    controls.notificationStatus.set("pending");

    fetch(
      `${import.meta.env.VITE_API_URL}/photos/delete?partialPath=${
        data[controls.category.value]["local-path"]
      }/${
        data?.[controls.category.value].gallery?.[controls.gallery.value]?.[
          "local-path"
        ]
      }&normalized=${controls.arg1.value}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token.get()}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.text();
      })
      .then((data) => {
        controls.notificationStatus.set("success");
        controls.getData();
        console.log(data);
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

  const callback = {
    confirm: () => {
      handleClick();
    },
    deny: () => {
      controls.activeOverlayModule.set(null);
    },
  };

  return (
    <div
      className={`${
        controls.activeOverlayModule.value ===
        OverlayModuleNames.DELETE_PICTURES
          ? ""
          : "hidden"
      }`}
    >
      <ConfirmOverlay
        callback={callback}
        explanation="You will permanently delete this picture. Do you accept?"
        isPositionBlock={true}
      />
    </div>
  );
}

export default PhotoDeletion;

PhotoDeletion.propTypes = {
  controls: PropTypes.object.isRequired,
  data: PropTypes.array,
};
