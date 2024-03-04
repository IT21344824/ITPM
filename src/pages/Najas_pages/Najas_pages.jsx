import React from 'react'
import "./Najas_pages.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";



const Najas_pages = ({ userId }) => {
  return (
    <div className="Najas_pages">
    <Sidebar userId={userId} />
    <div className="Najas_pages_Container">
      <Navbar />
      <div>
      Najas_pages
        </div>
    </div>
  </div>
  )
}

export default Najas_pages
