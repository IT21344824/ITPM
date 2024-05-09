import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notify = () =>

toast.success(`Successful \nID: xxxxxxxxxxxxxxxxxxxx`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    icon: (
      <span
        style={{
         
          background: "#CC0D00",
          borderRadius: "50%",
          width: "25px",
          height: "25px",
          textAlign: "center",
          verticalAlign: "middle",
          lineHeight: "27px",
          color: "white",
          fontSize: "14px",
        }}
      >
        &#10003;
      </span>
    ),
    style: {
        background: "gray",
        color: "white",
      },
  });
  

const notifyStyle = {
    whiteSpace: 'pre-line'
}

const progressStyle = {
    background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)'
}

const Nofity = () => {

    return (
        <div>
            <button onClick={notify}>Notify!</button>
            <ToastContainer

                style={notifyStyle}
                progressStyle={progressStyle}
            />
        </div>
    )
}

export default Nofity;
