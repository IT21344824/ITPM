import React from 'react'
import "./Results.scss";
import { Link } from "react-router-dom";

const Results = ({ searchQuery }) => {
  const items = [
    { name: "Home", to: "/" },
    { name: "Users", to: "/Users" },
    { name: "Add a New User", to: "/Users/new" },
    { name: "Employees", to: "/Employees" },

    //-----------------prodcuts search start---------------------
    { name: "All products", to: "/products" },
    { name: "Add a New Product", to: "/products/new" },
    //cat
    { name: "Add a New category", to: "/products" },
    { name: "All category", to: "/products" },
    //-----------------prodcuts search end---------------------


    // { name: "members", to: "/members" },

    //-----------------coach search start---------------------
    { name: "coaches", to: "/coaches" },
    { name: "packages", to: "/packages" },
    //-----------------coach search end---------------------

    { name: "patment info", to: "/patment_INFO" },

    //-----------------additional search start---------------------
    { name: "Additional", to: "/Additional" },    
    { name: "Home Page Details", to: "/Additional" },   
    { name: "Product banner", to: "/Additional" },
    { name: "More page slider", to: "/Additional/more" },
    { name: "About us", to: "/Additional/more" },
    { name: "Contact us", to: "/Additional/more" },
    { name: "Applycation", to: "/Additional/more" },

    //-----------------additional search end---------------------

  ];

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='results'>
      <div className="">
        {filteredItems.length === 0 ?
          <div>No data found</div>
          : filteredItems.map((items, index) => (
            <Link key={index} to={items.to} style={{ textDecoration: "none" }}>
              <div className="filter_search">{items.name}</div>
            </Link>
          ))}
      </div>
    </div>
  )
}

export default Results
