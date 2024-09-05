import PropTypes from "prop-types";
import OverlayModuleNames from "./OverlayModuleNames";
import ConfirmOverlay from "../ConfirmOverlay";
import auth from "../authModule.js";

function SchemaElementDeletion({ controls }) {
  const isGallery =
    controls.activeOverlayModule.value === OverlayModuleNames.DELETE_GAL;

  const handleClick = () => {
    console.log("Handling click");
    // return;
    controls.areControlsDisabled.set(true);
    controls.showNotification.set(true);
    controls.notificationStatus.set("pending");

    fetch(
      `${import.meta.env.VITE_API_URL}/schema?catLocalPath=${
        controls.arg1.value
      }${isGallery ? `&galLocalPath=${controls.arg2.value}` : ""}`,
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
        controls.gallery.set(0);
        if (!isGallery) controls.category.set(0);
        console.log(data);
        controls.getData();
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

  const moduleName = isGallery
    ? OverlayModuleNames.DELETE_GAL
    : OverlayModuleNames.DELETE_CAT;

  const explanation = isGallery
    ? `You will delete the whole gallery ${controls.arg4.value} with all of its pictures. Do you accept?`
    : `You will delete the whole category ${controls.arg3.value} with all of its galleries and pictures. Do you accept?`;

  return (
    <div
      className={`${
        controls.activeOverlayModule.value === moduleName ? "" : "hidden"
      }`}
    >
      <ConfirmOverlay
        callback={callback}
        explanation={explanation}
        isPositionBlock={true}
      />
    </div>
  );
}

export default SchemaElementDeletion;

SchemaElementDeletion.propTypes = {
  controls: PropTypes.object.isRequired,
};
