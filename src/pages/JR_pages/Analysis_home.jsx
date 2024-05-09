import React, { useState, useEffect } from "react";
import "./Analysis_home.scss";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, getDoc, addDoc, serverTimestamp, query, where, onSnapshot, doc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import Analysis_foam1 from "../../components/JR_comp/Analysis_foam1";
import AnalusisTable from "../../components/JR_comp/AnalusisTable";

const Analysis_home = ({ userId }) => {
    return (
        <div className="Analysis_home_formContainer">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="AN_Container">
                    <div className="AN_Left">
                        <Analysis_foam1 userId={userId}/>
                    </div>
                    <div className="AN_Right">
                        <AnalusisTable userId={userId} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Analysis_home
