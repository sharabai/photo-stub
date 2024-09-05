import "./Notification.css";
import PropTypes from "prop-types";

const Notification = ({ isVisible, status }) => {
  if (!isVisible) return null;

  let notificationText;
  switch (status) {
    case "pending":
      notificationText = "Operation pending";
      break;
    case "success":
      notificationText = "Operation was successful";
      break;
    case "error":
      notificationText = "There was some problem";
      break;
    default:
      notificationText = "Unknown status";
  }

  return (
    <div className="notification">
      <p>{notificationText}</p>
    </div>
  );
};

export default Notification;

Notification.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
};
