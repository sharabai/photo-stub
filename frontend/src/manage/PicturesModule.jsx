import { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import ModuleNames from "./ModuleNames.js";
import "./PicturesModule.css";
import OverlayModuleNames from "./OverlayModules/OverlayModuleNames.jsx";

function PictureModule({ data, controls, onChange }) {
  const originPictures = useMemo(
    () =>
      data
        ? data?.[controls.category.value]?.gallery?.[controls.gallery.value]
            ?.pictureSources ?? []
        : [],
    [data, controls.category.value, controls.gallery.value]
  );
  const [pictures, setPictures] = useState([]);
  const maxOrder = pictures.reduce(
    (accumulator, currentValue) =>
      currentValue.order > accumulator ? currentValue.order : accumulator,
    -1
  );

  // useEffect(() => {
  //   console.log(pictures);
  // }, [pictures]);
  useEffect(() => {
    console.log("Original pictures update pictures array");
    setPictures(JSON.parse(JSON.stringify(originPictures)));
  }, [
    originPictures,
    controls.activeModule.value,
    controls.overlayModuleUpdateId,
  ]);

  useEffect(() => {
    console.log("new data in town...");
    console.log(data);
  }, [data]);

  function attemptChangingPosition(orderSrc, isChangeForward) {
    let orderDest = pictures.reduce(
      (accumulator, currentValue) =>
        currentValue.order > orderSrc && currentValue.order < accumulator
          ? currentValue.order
          : accumulator,
      Number.MAX_SAFE_INTEGER
    );
    // -1 is good enough since order field starts with 0 as the lowest order value
    if (!isChangeForward)
      orderDest = pictures.reduce(
        (accumulator, currentValue) =>
          currentValue.order < orderSrc && currentValue.order > accumulator
            ? currentValue.order
            : accumulator,
        -1
      );
    console.log("orderSrc: ", orderSrc, "; orderDest: ", orderDest);
    if (orderDest > maxOrder || orderDest < 0) {
      console.log("impossible move");
      return;
    }
    if (!data) return;
    const dataCopy = JSON.parse(JSON.stringify(data));
    const picturesCopy = pictures.map((item) => ({ ...item }));
    // logic for swap
    const index1 = picturesCopy.findIndex((item) => item.order === orderSrc);
    const index2 = picturesCopy.findIndex((item) => item.order === orderDest);
    console.log("index1: ", index1, ",index2: ", index2);
    [picturesCopy[index1].order, picturesCopy[index2].order] = [
      picturesCopy[index2].order,
      picturesCopy[index1].order,
    ];
    // finish
    setPictures(picturesCopy);
    dataCopy[controls.category.value].gallery[
      controls.gallery.value
    ].pictureSources = picturesCopy;
    // console.log(picturesCopy);
    // console.log(dataCopy);
    onChange(dataCopy);
  }

  return (
    <div
      className={`${
        controls.activeModule.value === ModuleNames.PICTURES ? "" : "hidden"
      }`}
    >
      <button
        className="regular-btn"
        onClick={controls.changeContext(() => {
          controls.activeOverlayModule.set(OverlayModuleNames.UPLOAD_PICTURES);
        })}
      >
        Upload photos
      </button>
      <div className={`pics-module`}>
        {pictures.map((image, index) => (
          <section
            className="manage-pics"
            key={index}
            style={{
              order: image.order,
            }}
          >
            <img
              src={
                import.meta.env.VITE_APP_ENV !== "development"
                  ? `/photos${image.thumbnails}`
                  : image.thumbnails
              }
              alt={`Gallery item ${index}`}
              draggable="false"
              // onClick={() => handleClickThumbnail(index)}
            />
            <div
              className="topleft svg-ctrl"
              onClick={() => {
                attemptChangingPosition(image.order, false);
              }}
            >
              <img src="/arrow-left-solid.svg" />
            </div>
            <div
              className="topright svg-ctrl"
              onClick={() => {
                attemptChangingPosition(image.order, true);
              }}
            >
              <img src="/arrow-right-solid.svg" />
            </div>
            <div
              className="bottomleft svg-ctrl"
              onClick={controls.changeContext(() => {
                controls.arg1.set(image.normalized);
                controls.activeOverlayModule.set(
                  OverlayModuleNames.DELETE_PICTURES
                );
              })}
            >
              <img src="/delete.svg" />
            </div>
          </section>
        ))}
        <section
          className="manage-pics"
          style={{
            order: 10000,
          }}
        >
          <img alt={`Gallery item last stretch`} draggable="false" />
        </section>
      </div>
    </div>
  );
}

export default PictureModule;

PictureModule.propTypes = {
  data: PropTypes.array,
  controls: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
