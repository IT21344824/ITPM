import React from 'react'
import "./Najas_pages.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { Link } from "react-router-dom";



const Najas_pages = ({ userId }) => {
  return (
    <div className="Najas_pages">
      <Sidebar userId={userId} />
      <div className="Najas_pages_Container">
        <Navbar />
        <div>
          <div className="datatableTitle">
            Add New Discount
            <Link to="/Promo/PromotionalNew" className="link" >
              Add New
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Najas_pages
