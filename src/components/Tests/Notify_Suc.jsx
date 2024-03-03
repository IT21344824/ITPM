import React, { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import "./Notify_Suc.scss";

const Notify_Suc = () => {
  const [progressComplete, setProgressComplete] = useState(false);

  const handleButtonClick = () => {
    const toast = document.querySelector(".toast");
    const progress = document.querySelector(".progress");

    setProgressComplete(false);
    toast.classList.add("active");
    progress.classList.add("active");

    setTimeout(() => {
      toast.classList.remove("active");
    }, 5000);

    setTimeout(() => {
      progress.classList.remove("active");
      setProgressComplete(true);
    }, 5300);
  };

  const handleCloseClick = () => {
    const toast = document.querySelector(".toast");
    const progress = document.querySelector(".progress");
  
    toast.classList.remove("active");
    progress.classList.remove("active");
  };
  

  return (
    <div className="noti_test">
    <div className="notify_body">
      <div className="toast">
        <div className="toast-content">
          <CheckIcon className="check" />
          <div className="message">
            <span className="text text-1">Success</span>
            <span className="text text-2">Your changes have been saved</span>
          </div>
          <CloseIcon className="close" onClick={handleCloseClick} />
          <div className="progress "></div>
        </div>
       
      </div>

      <button onClick={handleButtonClick}>s</button>
    </div></div>
  );
};

export default Notify_Suc;
