import { useState } from "react";
import "./ManageSchemaForm.css";
import PropTypes from "prop-types";

// Function to validate if the string contains only English letters and numbers
const validateNameEng = (name) => /^[a-zA-Z0-9\s]+$/.test(name);

// Function to transform 'name-eng' into a web-friendly path
const makeWebPath = (nameEng) => nameEng.toLowerCase().replace(/ /g, "-");

function ManageSchemaForm({ callback, header }) {
  const [nameEng, setNameEng] = useState("");
  const [nameFr, setNameFr] = useState("");

  // TODO: I think this functino is redundant, check and delete
  const handleInputChange = (setter, value) => {
    setter(value); // Remove trailing whitespace
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    // Trim trailing whitespace before validation and submission
    const trimmedNameEng = nameEng.trimEnd();
    const trimmedNameFr = nameFr.trimEnd();

    if (!validateNameEng(trimmedNameEng)) {
      alert(
        "Invalid name-eng. It should contain only English letters and numbers."
      );
      return; // Stop execution if validation fails
    }

    const webPath = makeWebPath(trimmedNameEng);

    callback({
      "name-eng": trimmedNameEng,
      "name-fr": trimmedNameFr,
      "web-path": webPath,
      "local-path": webPath,
    });
  };

  return (
    <div className="schema-form-flex-container">
      <form className="schema-form" onSubmit={handleSubmit}>
        <h3>{header}</h3>
        <div>
          <label htmlFor="nameEng">Name (English):</label>
          <input
            id="nameEng"
            type="text"
            value={nameEng}
            onChange={(e) => handleInputChange(setNameEng, e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="nameFr">Name (French):</label>
          <input
            id="nameFr"
            type="text"
            value={nameFr}
            onChange={(e) => handleInputChange(setNameFr, e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ManageSchemaForm;

ManageSchemaForm.propTypes = {
  callback: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired,
};
