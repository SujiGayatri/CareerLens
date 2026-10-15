import React from "react";
import '../css/Loading.css';
function Loading() {
  return (
    <div className="loading-overlay">
      <div className="loading-content">

        <div className="loader"></div>

        <h4>Analyzing Resume...</h4>

      </div>
    </div>
  );
}

export default Loading;