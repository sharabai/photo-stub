import { useEffect, useRef, useLayoutEffect } from "react";
import Quill from "quill";
import "../../node_modules/quill/dist/quill.snow.css";
import "./MQC.css";
import PropTypes from "prop-types";
import "../gallery/GalleryIntroParagraph.css";
import ModuleNames from "./ModuleNames.js";

function MyQuillComponent({ data, controls, onTextChange }) {
  const ref = useRef();
  const containerRef = useRef(null);
  const onTextChangeRef = useRef(onTextChange);
  const innerHTML = data
    ? data?.[controls.category.value]?.gallery?.[controls.gallery.value]?.[
        controls.introLangAttr
      ] ?? "Data hasn't loaded yet"
    : "Data hasn't loaded yet";

  useLayoutEffect(() => {
    onTextChangeRef.current = onTextChange;
  });

  useEffect(() => {
    const container = containerRef.current;
    // if (!container) return;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const fontSizeArr = [
      "8px",
      "9px",
      "10px",
      "12px",
      "14px",
      "16px",
      "20px",
      "24px",
      "32px",
      "42px",
      "54px",
      "68px",
      "84px",
      "98px",
    ];

    var Size = Quill.import("attributors/style/size");
    Size.whitelist = fontSizeArr;
    Quill.register(Size, true);

    const quill = new Quill(editorContainer, {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"], // toggled buttons
          ["blockquote", "code-block"],
          ["link"],

          [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
          [{ script: "sub" }, { script: "super" }], // superscript/subscript
          [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

          // [{ size: ["small", false, "large", "huge"] }], // custom dropdown
          [{ size: fontSizeArr }],
          [{ header: [2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ align: [] }],

          ["clean"],
        ],
      },
    });

    quill.on(Quill.events.TEXT_CHANGE, () => {
      onTextChangeRef.current?.(modifiedData());
    });

    document.querySelector(".ql-editor").innerHTML = innerHTML;

    ref.current = quill;
    console.log("My Quill component useEffect on [ref, innerHTML]");

    return () => {
      ref.current = null;
      container.innerHTML = "";
    };
  }, [ref, innerHTML, controls.activeModule.value]);

  function modifiedData() {
    if (!data) return;
    const dataCopy = JSON.parse(JSON.stringify(data));
    dataCopy[controls.category.value].gallery[controls.gallery.value][
      controls.introLangAttr
    ] = getContent();
    return dataCopy;
  }

  function getContent() {
    const rawContent = document.querySelector(".ql-editor").innerHTML;
    return rawContent;
  }

  return (
    <div
      className={
        controls.activeModule.value === ModuleNames.TEXT ? "" : "hidden"
      }
    >
      <div ref={containerRef} className="intro-manage"></div>
    </div>
  );
}

export default MyQuillComponent;

MyQuillComponent.propTypes = {
  data: PropTypes.array,
  controls: PropTypes.object.isRequired,
  onTextChange: PropTypes.func.isRequired,
};
