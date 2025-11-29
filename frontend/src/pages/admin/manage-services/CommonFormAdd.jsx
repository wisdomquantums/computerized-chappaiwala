import React from "react";
import CommonForm from "./CommonForm";

// Wrapper in case Add needs separate tweaks later
const CommonFormAdd = (props) => {
  return <CommonForm {...props} panelMode="add" />;
};

export default CommonFormAdd;
