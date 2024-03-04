import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Chart from "../../components/chart/Chart";
import Featured from "../../components/featured/Featured";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Widget from "../../components/widget/Widget";
import "./home.scss";

const Home = ({ userId }) => {
  const location = useLocation();
  // console.log("home id",userId);
  
 

  return (
    <div className="home">
      <Sidebar userId={userId} />
      <div className="homeContainer">
        <Navbar />
        <hr />
        <div className="homeback_color_start">
          <div className="homeback_color_end">
            <div className="widgets">
              <Widget type="user" />
              <Widget type="product" />
              <Widget type="case_3" />
              <Widget type="case_4" />
            </div>

            <div className="charts">
              <Featured />
              <Chart title="Latest Sales" aspect={2 / 1} />
            </div>

            <div className="latest">
              <div className="listContainer" style={{ marginLeft: "50px", marginRight: "25px" }}>
                <div className="listTitle"> Latest Members </div>
              </div>

              {/* only letast 3 product will show */}
              <div className="Product_listContainer" style={{ marginLeft: "25px", marginRight: "50px" }}>
                <div className="Product_listTitle"> Latest Products </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
