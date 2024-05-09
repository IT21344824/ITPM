import React from 'react'
import "./Avishka_pages.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { Link } from "react-router-dom";



const Avishka_pages = ({ userId }) => {
  return (
    <div className="Avishka_pages">
      <Sidebar userId={userId} />
      <div className="Avishka_pages_Container">
        <Navbar />

        <div>
          <div className="datatableTitle">
            Add New Prodcut
            <Link to="/Forecast/ForecastNew" className="link" >
              Add New
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Avishka_pages
