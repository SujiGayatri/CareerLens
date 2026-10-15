import React from "react";
import '../css/Loading.css';
import '../css/Loading.css';

function Loading({
  title = 'Loading...',
}) {
  return (
    <div className="loading-overlay">
      <div className="loading-content">

        <div className="loader"></div>

        <h4>{title}</h4>

      </div>
    </div>
  );
}

export default Loading;