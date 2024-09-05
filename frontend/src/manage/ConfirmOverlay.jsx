import PropTypes from "prop-types";
import "./ConfirmOverlay.css";

function ConfirmOverlay({
  callback,
  question = "Are you sure?",
  explanation,
  confirmBtnTxt = "Yes",
  denyBtnTxt = "No",
  isPositionBlock = false,
}) {
  return (
    <div className={`overlay ${isPositionBlock && "block"}`}>
      <div className="flex-container">
        <div className="confirm-question">{question}</div>
        <div className="first-row">{explanation}</div>
        <div className="second-row">
          <button onClick={callback.confirm}>{confirmBtnTxt}</button>
          <button onClick={callback.deny}>{denyBtnTxt}</button>
        </div>
      </div>
    </div>
  );
}

ConfirmOverlay.propTypes = {
  callback: PropTypes.object.isRequired,
  question: PropTypes.string,
  explanation: PropTypes.string.isRequired,
  confirmBtnTxt: PropTypes.string,
  denyBtnTxt: PropTypes.string,
  isPositionBlock: PropTypes.bool,
};
export default ConfirmOverlay;
