import React from "react";
import ReactDOM from "react-dom"; // Import from "react-dom" instead of "react"

function PhotoPicker({ onChange }) {
  const component = <input type="file" hidden id="photo-picker" onChange={onChange} />;
  return ReactDOM.createPortal(component, document.getElementById("photo-picker-element"));
}

export default PhotoPicker;
