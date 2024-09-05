import ManageSchemaForm from "./ManageSchemaForm.jsx";
import PropTypes from "prop-types";
import OverlayModuleNames from "./OverlayModuleNames.jsx";
import auth from "../authModule.js";

// TODO: data is needed when modify endpoint whould be added
// eslint-disable-next-line no-unused-vars
function CreateSchemaElement({ data, controls }) {
  const isGallery =
    controls.activeOverlayModule.value === OverlayModuleNames.CREATE_GAL;

  function postSchemaObj(obj) {
    console.log(obj);
    controls.areControlsDisabled.set(true);
    controls.showNotification.set(true);
    controls.notificationStatus.set("pending");

    fetch(
      `${import.meta.env.VITE_API_URL}/schema${
        isGallery ? `?categoryLocalPath=${controls.arg1.value}` : ""
      }`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token.get()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.text(); // Parses JSON response into native JavaScript objects
      })
      .then((data) => {
        controls.notificationStatus.set("success");
        controls.getData();
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
  }

  const moduleName = isGallery
    ? OverlayModuleNames.CREATE_GAL
    : OverlayModuleNames.CREATE_CAT;

  const formHeader = isGallery
    ? `Ceate new gallery in ${controls.arg2?.value}`
    : "Create new category";

  return (
    <div
      className={`${
        controls.activeOverlayModule.value === moduleName ? "" : "hidden"
      }`}
    >
      <ManageSchemaForm
        header={formHeader}
        callback={(arg) => postSchemaObj(arg)}
      />
    </div>
  );
}

export default CreateSchemaElement;

CreateSchemaElement.propTypes = {
  data: PropTypes.array,
  controls: PropTypes.object.isRequired,
  isGallery: PropTypes.object,
};
