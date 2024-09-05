import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Notification from "./Notification";
import MyQuillComponent from "./MyQuillComponent";
import PicturesModule from "./PicturesModule.jsx";
import auth from "./authModule.js";
import "./Manage.css";
import fetchData from "../fetchData.js";
import Login from "./Login.jsx";
import ConfirmOverlay from "./ConfirmOverlay.jsx";
import ModuleNames from "./ModuleNames.js";
import {
  updateOverlayIdBehavior,
  resetModifiedDataBehavior,
} from "./OverlayModules/OverlayModuleNames.jsx";
import SidePanel from "./SidePanel.jsx";
import PhotoUpload from "./OverlayModules/PhotoUpload.jsx";
import PhotoDeletion from "./OverlayModules/PhotoDeletion.jsx";
import CreateSchemaElement from "./OverlayModules/CreateSchemaElement.jsx";
import SchemaElementDeletion from "./OverlayModules/SchemaElementDeletion.jsx";

const Manage = () => {
  const [data, setData] = useState(null);
  const [modifiedData, setModifiedData] = useState(null);
  const [showOverlayConfimation, setShowOverlayConfimation] = useState(false);
  const isDataModified = JSON.stringify(data) !== JSON.stringify(modifiedData);
  const overlayCallback = useRef(() => {
    return;
  });

  const [areControlsDisabled, setAreControlsDisabled] = useState(false);

  const [activeModule, setActiveModule] = useState(ModuleNames.TEXT);

  const [activeOverlayModule, setActiveOverlayModule] = useState(null);
  const [overlayModuleUpdateId, setOverlayModuleUpdateId] = useState(0);
  const updateActiveOverlayModule = useCallback(
    (newValue) => {
      setActiveOverlayModule(newValue);
      if (updateOverlayIdBehavior(newValue) && newValue !== null)
        setOverlayModuleUpdateId(overlayModuleUpdateId + 1);
    },
    [overlayModuleUpdateId]
  );

  const [lang, setLang] = useState("eng");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState("");
  const [allowIn, setAllowIn] = useState(false);

  const [category, setCategory] = useState(0);
  const [gallery, setGallery] = useState(0);
  const nameLangAttr = lang === "eng" ? "name-eng" : "name-fr";
  const introLangAttr = lang === "eng" ? "intro-eng" : "intro-fr";

  const [arg1, setArg1] = useState(null);
  const [arg2, setArg2] = useState(null);
  const [arg3, setArg3] = useState(null);
  const [arg4, setArg4] = useState(null);

  const changeContext = useCallback(
    (onClick, callerModuleName = "others") => {
      return () => {
        if (areControlsDisabled) return;
        // Any additional logic before the onClick action can go here
        if (
          !isDataModified ||
          !resetModifiedDataBehavior(callerModuleName) ||
          callerModuleName === null
        )
          onClick();
        else {
          setShowOverlayConfimation(true);
          overlayCallback.current = {
            confirm: () => {
              onClick();
              setModifiedData(data);
              setShowOverlayConfimation(false);
            },
            deny: () => {
              setShowOverlayConfimation(false);
            },
          };
        }
        // Any additional logic after the onClick action can go here
      };
    },
    [areControlsDisabled, data, isDataModified]
  );

  const controls = useMemo(
    () => ({
      category: { value: category, set: setCategory },
      gallery: { value: gallery, set: setGallery },
      activeModule: { value: activeModule, set: setActiveModule },
      activeOverlayModule: {
        value: activeOverlayModule,
        set: updateActiveOverlayModule,
      },
      areControlsDisabled: {
        value: areControlsDisabled,
        set: setAreControlsDisabled,
      },
      showNotification: { value: showNotification, set: setShowNotification },
      notificationStatus: {
        value: notificationStatus,
        set: setNotificationStatus,
      },
      arg1: { value: arg1, set: setArg1 },
      arg2: { value: arg2, set: setArg2 },
      arg3: { value: arg3, set: setArg3 },
      arg4: { value: arg4, set: setArg4 },
      overlayModuleUpdateId,
      nameLangAttr,
      introLangAttr,
      changeContext,
      getData,
    }),
    [
      activeModule,
      activeOverlayModule,
      areControlsDisabled,
      arg1,
      arg2,
      arg3,
      arg4,
      category,
      changeContext,
      gallery,
      introLangAttr,
      nameLangAttr,
      notificationStatus,
      overlayModuleUpdateId,
      showNotification,
      updateActiveOverlayModule,
    ]
  );

  const RENEW_TOKEN_TIME_IN_MINUTES = 5 * 60;

  function getToken() {
    auth.token.valid().then((validity) => {
      console.log(`tokenValidity: ${validity}`);
      setAllowIn(validity);
    });
  }

  useEffect(() => {
    // Define the interval ID inside the useEffect block
    getToken();
    const intervalId = setInterval(() => {
      getToken();
    }, 1000 * RENEW_TOKEN_TIME_IN_MINUTES);

    // Return a cleanup function that clears the interval
    return () => clearInterval(intervalId);
  }, []);

  function handleClick() {
    setShowNotification(true);
    setNotificationStatus("pending");
    fetch(`${import.meta.env.VITE_API_URL}/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token.get()}`,
      },
      body: JSON.stringify({ data: [...modifiedData] }),
    })
      .then((response) => {
        if (response.status === 200) {
          setNotificationStatus("success");
          // return response.json();
          // const newData = response.json().data;
          // setData(newData);
          // setModifiedData(newData);
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .then(getData)
      .catch((error) => {
        setNotificationStatus("error");
        console.log(error.message);
        getToken();
      })
      .finally(() => {
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      });
  }

  function getData() {
    console.log("getting data");
    fetchData().then((data) => {
      setData(data.data);
      setModifiedData(data.data);
    });
  }

  useEffect(() => getData(), []);

  return (
    <>
      {!allowIn && <Login getToken={getToken} />}
      <div className="grid-container">
        <SidePanel
          data={data}
          controls={controls}
          handleClick={changeContext}
        />
        <section>
          <div className="controls">
            <div className="ctrl-group">
              <div
                className={`selectable ${lang === "eng" ? "selected" : ""}`}
                onClick={changeContext(() => setLang("eng"))}
              >
                eng
              </div>
              <div
                className={`selectable ${lang === "fra" ? "selected" : ""}`}
                onClick={changeContext(() => setLang("fra"))}
              >
                fra
              </div>
            </div>
            <div className="ctrl-group">
              <div
                className={`selectable ${
                  activeModule === ModuleNames.TEXT ? "selected" : ""
                }`}
                onClick={changeContext(() => setActiveModule(ModuleNames.TEXT))}
              >
                {ModuleNames.TEXT}
              </div>
              <div
                className={`selectable ${
                  activeModule === ModuleNames.PICTURES ? "selected" : ""
                }`}
                onClick={changeContext(() =>
                  setActiveModule(ModuleNames.PICTURES)
                )}
              >
                {ModuleNames.PICTURES}
              </div>
              <div
                className={`selectable ${
                  activeModule === ModuleNames.SCHEMA ? "selected" : ""
                }`}
                onClick={changeContext(() =>
                  setActiveModule(ModuleNames.SCHEMA)
                )}
              >
                {ModuleNames.SCHEMA}
              </div>
            </div>
            {isDataModified && (
              <button className="save" onClick={handleClick}>
                Save
              </button>
            )}
          </div>
          <div
            className={
              "manage-content " +
              (activeOverlayModule !== null ? "restricted" : "")
            }
          >
            {activeOverlayModule !== null && (
              <div className="overlay-module">
                <img
                  className="close-overlay-module-btn"
                  src="/x.svg"
                  onClick={changeContext(() => {
                    setActiveOverlayModule(null);
                  }, null)}
                />
                <PhotoUpload data={data} controls={controls} />
                <PhotoDeletion data={data} controls={controls} />
                <CreateSchemaElement data={data} controls={controls} />
                <SchemaElementDeletion data={data} controls={controls} />
              </div>
            )}
            <MyQuillComponent
              data={data}
              controls={controls}
              onTextChange={setModifiedData}
            />
            <PicturesModule
              data={data}
              controls={controls}
              onChange={setModifiedData}
            />
            <SidePanel
              data={data}
              controls={controls}
              handleClick={changeContext}
              onChange={setModifiedData}
              isEditable={true}
            />
          </div>
        </section>
      </div>
      <Notification isVisible={showNotification} status={notificationStatus} />
      {showOverlayConfimation && (
        <ConfirmOverlay
          callback={overlayCallback.current}
          question="Are you sure?"
          explanation="You have some unsaved changes. Leave and loose edited parts or go back to editing?"
          confirmBtnTxt="Leave"
          denyBtnTxt="Go back"
        />
      )}
    </>
  );
};

export default Manage;
