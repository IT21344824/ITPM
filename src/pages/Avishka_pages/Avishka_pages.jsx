import React from 'react'
import "./Avishka_pages.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";



const Avishka_pages = ({ userId }) => {
  return (
    <div className="Avishka_pages">
      <Sidebar userId={userId} />
      <div className="Avishka_pages_Container">
        <Navbar />
        
        <div>
        Avishka_pages
        </div>
      </div>
    </div>
  )
}

export default Avishka_pages
