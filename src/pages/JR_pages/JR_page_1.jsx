import React from 'react'
import "./JR_page_1.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";



const JR_page_1 = ({ userId }) => {
  return (
    <div className="JR_page_1">
      <Sidebar userId={userId} />
      <div className="JR_page_1_Container">
        <Navbar />

         
        <div>
        JR_page_1
        </div>
      </div>
    </div>
  )
}

export default JR_page_1
