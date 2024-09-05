import { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import ModuleNames from "./ModuleNames.js";
import OverlayModuleNames from "./OverlayModules/OverlayModuleNames.jsx";
import "./SidePanel.css";

function SidePanelNotMemo({
  data,
  controls,
  onChange,
  handleClick,
  isEditable = false,
}) {
  console.log("SidePanel was rendered at", new Date().toLocaleTimeString());

  const [localData, setLocalData] = useState();
  const [localSelectedCat, setLocalSelectedCat] = useState();
  const [localSelectedGal, setLocalSelectedGal] = useState();

  useEffect(() => {
    setLocalData(JSON.parse(JSON.stringify(data)));
    setLocalSelectedCat(controls.category.value);
    setLocalSelectedGal(controls.gallery.value);
  }, [data, controls.activeModule.value, controls.overlayModuleUpdateId]);

  const galObj = localData?.[localSelectedCat]?.gallery?.[localSelectedGal];

  function attemptSwapping(useCategory, indexOriginal, indexGoal, catIndex) {
    let targetArray = localData;
    if (!useCategory) {
      targetArray = localData[catIndex].gallery;
    }
    const length = targetArray.length;
    if (indexGoal < 0 || indexGoal >= length) return;
    [targetArray[indexOriginal], targetArray[indexGoal]] = [
      targetArray[indexGoal],
      targetArray[indexOriginal],
    ];
    if (useCategory) {
      if (localSelectedCat === indexOriginal) {
        setLocalSelectedCat(indexGoal);
      } else if (localSelectedCat === indexGoal)
        setLocalSelectedCat(indexOriginal);
    } else if (catIndex === localSelectedCat) {
      if (localSelectedGal === indexOriginal) {
        setLocalSelectedGal(indexGoal);
      } else if (localSelectedGal === indexGoal)
        setLocalSelectedGal(indexOriginal);
    }
    setLocalData([...localData]);
    onChange(JSON.parse(JSON.stringify(localData)));
  }

  function createControls(useCategory, index, catIndex) {
    return (
      <div className="inline-block side-panel-ctrl-buttons">
        <img
          className={"ctrl-btn up " + (!useCategory ? "margin-left" : "")}
          src="/arrow-left-solid.svg"
          onClick={() => {
            attemptSwapping(useCategory, index, index - 1, catIndex);
          }}
        />
        <img
          className="ctrl-btn down"
          src="/arrow-left-solid.svg"
          onClick={() => {
            attemptSwapping(useCategory, index, index + 1, catIndex);
          }}
        />
        {/* <div className="inline-block">
          {index} {useCategory.toString()}
        </div> */}
      </div>
    );
  }

  return (
    <div
      className={`${isEditable ? "" : "side-panel"}  ${
        //  editable  XOR  module not schema
        isEditable !== (controls.activeModule.value !== ModuleNames.SCHEMA)
          ? ""
          : "hidden"
      }`}
    >
      <div className="inline-block">
        {localData?.map((cat, index) => (
          <div
            className={`control-text ${
              !isEditable
                ? index === controls.category.value
                  ? "selected-cat"
                  : ""
                : index === localSelectedCat
                ? "selected-cat"
                : ""
            }`}
            key={index}
          >
            {isEditable && createControls(true, index)}

            <div
              className="panel-cat inline-block"
              onClick={
                isEditable
                  ? () => {
                      setLocalSelectedCat(index);
                      setLocalSelectedGal(0);
                    }
                  : () => {}
              }
              style={isEditable ? { cursor: "pointer" } : {}}
            >
              {cat[controls.nameLangAttr]}
            </div>
            {cat.gallery.map((gal, galIndex) => (
              <div key={galIndex}>
                {isEditable && createControls(false, galIndex, index)}
                <div
                  className="selectable-wrapper inline-block"
                  onClick={
                    !isEditable
                      ? handleClick(() => {
                          controls.category.set(index);
                          controls.gallery.set(galIndex);
                        })
                      : () => {
                          setLocalSelectedCat(index);
                          setLocalSelectedGal(galIndex);
                        }
                  }
                >
                  <div
                    className={`selectable ${
                      !isEditable
                        ? galIndex === controls.gallery.value &&
                          index === controls.category.value
                          ? "selected"
                          : ""
                        : galIndex === localSelectedGal &&
                          index === localSelectedCat
                        ? "selected"
                        : ""
                    }`}
                  >
                    {gal[controls.nameLangAttr]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {isEditable && (
        <div className="inline-block contextual-menu">
          <div className="schema-btns">
            <button
              className="regular-btn"
              onClick={controls.changeContext(() => {
                controls.activeOverlayModule.set(OverlayModuleNames.CREATE_CAT);
                controls.arg1.set(localData?.[localSelectedCat]["local-path"]);
              })}
            >
              Create new category
            </button>
            <button
              className="regular-btn"
              onClick={controls.changeContext(() => {
                controls.arg1.set(localData?.[localSelectedCat]["local-path"]);
                controls.arg2.set(
                  localData?.[localSelectedCat][
                    controls.nameLangAttr
                  ].toUpperCase()
                );
                controls.activeOverlayModule.set(OverlayModuleNames.CREATE_GAL);
              })}
            >
              Create new gallery
            </button>
          </div>
          <div className="selected-ctrl-div">
            {localData?.[localSelectedCat]?.[controls.nameLangAttr]}
            <img
              className="hidden"
              src="/edit.svg"
              onClick={controls.changeContext(() => {
                controls.activeOverlayModule.set(OverlayModuleNames.OTHERS);
              })}
            />
            <img
              src="/delete-outline.svg"
              onClick={controls.changeContext(() => {
                controls.arg1.set(localData?.[localSelectedCat]["local-path"]);
                controls.arg3.set(
                  localData?.[localSelectedCat][
                    controls.nameLangAttr
                  ].toUpperCase()
                );
                controls.activeOverlayModule.set(OverlayModuleNames.DELETE_CAT);
              })}
            />
          </div>
          {galObj?.[controls.nameLangAttr] && (
            <div className="selected-ctrl-div">
              {galObj?.[controls.nameLangAttr]}
              <img
                className="hidden"
                src="/edit.svg"
                onClick={controls.changeContext(() => {
                  controls.activeOverlayModule.set(OverlayModuleNames.OTHERS);
                })}
              />
              <img
                src="/delete-outline.svg"
                onClick={controls.changeContext(() => {
                  controls.arg1.set(
                    localData?.[localSelectedCat]["local-path"]
                  );
                  controls.arg2.set(galObj?.["local-path"]);
                  controls.activeOverlayModule.set(
                    OverlayModuleNames.DELETE_GAL
                  );
                  controls.arg3.set(
                    localData?.[localSelectedCat][
                      controls.nameLangAttr
                    ].toUpperCase()
                  );
                  controls.arg4.set(
                    galObj?.[controls.nameLangAttr].toUpperCase()
                  );
                })}
              />
            </div>
          )}
          <div className="cover-container">
            <img
              className="cover"
              src={(() => {
                let path = `/${localData?.[localSelectedCat]?.["local-path"]}/cover-FM.jpg`;
                if (import.meta.env.VITE_APP_ENV !== "development") {
                  path = "/photos" + path;
                }
                return path;
              })()}
            />
            <div
              className="bottomright"
              onClick={controls.changeContext(() => {
                controls.activeOverlayModule.set(
                  OverlayModuleNames.UPLOAD_COVER
                );
                controls.arg1.set(
                  localData?.[localSelectedCat]?.["local-path"]
                );
              }, OverlayModuleNames.UPLOAD_COVER)}
            >
              <img src="/change-circle.svg" />
            </div>
            <div className="topcenter">COVER</div>
          </div>
        </div>
      )}
    </div>
  );
}

const SidePanel = memo(SidePanelNotMemo);
// const SidePanel = SidePanelNotMemo;

export default SidePanel;

SidePanelNotMemo.propTypes = {
  data: PropTypes.array,
  controls: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  handleClick: PropTypes.func.isRequired,
  isEditable: PropTypes.bool,
};
