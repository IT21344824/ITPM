import React from 'react'
import "./Profile.scss";
import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useEffect, useState } from "react";
import { getDoc, collection, query, doc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Link, useLocation } from "react-router-dom";
//notify-
//import NofitySuc from "../../../components/notify_status/nofity";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//--

const Profile = ({ userId }) => {


    //------------------------------------------nofify start------------------------------------------------
    const notifyStyle = {
        whiteSpace: 'pre-line'
    }
    const progressStyle = {
        background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)'
    }

    //------------------------------------------nofify end---------------------------------------------------------------

    //-------error massage------
    const [ShowHint, setShowHint] = useState(false);



    ////------------------------------------------geting selected data//------------------------------------------
    const [data, setData] = useState({});



    useEffect(() => {
        const docRef = doc(db, "Users", userId);

        const unsubscribe = onSnapshot(docRef, async (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setData(data);


            } else {
                console.log("No such document!");
            }
        }, (error) => {
            console.log("Error getting document:", error);
        });

        // unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    }, [userId]);

    ////------------------------------------------geting selected data end------------------------------------------



    //---------------------------------------------------------------------------one By one | start --------------------------------------------------

    //edit parts-----------------------------
    const [isEditing, setIsEditing] = useState(false);

    const initialUpdateData = {
        email: "",
        name: "",
        password: "",
       
    };

    const [UpdateData, setUpdateData] = useState(initialUpdateData);

    const handleUpdateInputChange = (event) => {
        setShowHint(false);
        const { name, value } = event.target;
        setUpdateData((prevState) => ({
            ...prevState,
            [name]: value,

        }));
        //console.log(UpdateData)
    };



    //------------------------------------save updates------------------------------------
    const handleSaveChanges = async (event) => {
        event.preventDefault();

        try {
            const categoryRef = doc(collection(db, "Inventory"), userId);

            const docSnap = await getDoc(categoryRef);
            const currentImgArray = docSnap?.data()?.img || [];

            // Get the current price and qty
            const currentPrice = parseFloat(docSnap?.data()?.price || 0);
            const currentQty = parseFloat(docSnap?.data()?.qty || 0);
            const currentDefects = parseFloat(docSnap?.data()?.defects || 0);

            let updatedTotal = data.Total;
            let updatedLRevenue = data.L_Revenue;

            if (UpdateData.price !== "" && UpdateData.qty !== "") {
                // Both price and qty are updated
                const newPrice = parseFloat(UpdateData.price);
                const newQty = parseFloat(UpdateData.qty);

                updatedTotal = newPrice * newQty;
                updatedLRevenue = newPrice * parseFloat(UpdateData.defects);
            } else if (UpdateData.price !== "" && UpdateData.qty === "") {
                // Only price is updated
                const newPrice = parseFloat(UpdateData.price);

                updatedTotal = newPrice * currentQty;
                updatedLRevenue = newPrice * parseFloat(UpdateData.defects);
            } else if (UpdateData.price === "" && UpdateData.qty !== "") {
                // Only qty is updated
                const newQty = parseFloat(UpdateData.qty);

                updatedTotal = currentPrice * newQty;
                updatedLRevenue = currentPrice * parseFloat(UpdateData.defects);
            }

            // Calculate L_Revenue if defects are updated
            if (UpdateData.defects !== "" && UpdateData.defects !== undefined) {
                const newDefects = parseFloat(UpdateData.defects);
                updatedLRevenue = currentPrice * newDefects;
            }

            // Recalculate L_Revenue if price is updated
            if (UpdateData.price !== "" && UpdateData.price !== undefined) {
                const newPrice = parseFloat(UpdateData.price);
                updatedLRevenue = newPrice * currentDefects;
            }

            // Update the data with the new Total, L_Revenue, and other fields
            const NewupdateData = {
                ...UpdateData,
                timeStamp: serverTimestamp(),

            };

            // Don't update any fields with empty strings
            const cleanData = {};
            Object.entries(NewupdateData).forEach(([key, value]) => {
                if (value !== "" && !(key === "item_type" && !value)) {
                    cleanData[key] = value;
                }
            });

            // Check that all field names are valid
            Object.keys(cleanData).forEach((key) => {
                if (key.startsWith(".") || key.endsWith(".") || key.includes("..")) {
                    throw new Error(`Invalid field name: ${key}`);
                }
            });


            // Notify
            toast.success(`Successfully updated \n`);

            setIsEditing(false);
            setUpdateData(initialUpdateData);
            setFiles([]);
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    //image upload
    const [files, setFiles] = useState([]);
    const [per, setPer] = useState(null);



    //---------------------------------------------------------------------------one By one | end--------------------------------------------------

    return (
        <div className='Profile'>
            <Sidebar userId={userId} />
            <div className="ProfieContainer">
                <Navbar />

                <div className="container2">
                    <div className="p_details">
                        {isEditing ? (
                            <div className="change-hadder">
                                Only enter what need to change
                            </div>
                        ) : ''}

                        <div className="buttons">
                            {isEditing ? (
                                <>
                                    <button className="edit"
                                        onClick={handleSaveChanges}
                                    >Save Changes</button>
                                    <button className="Cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                                </>
                            ) : (
                                <button className="edit" onClick={() => setIsEditing(true)}>Edit</button>
                            )}
                        </div>



                        <div className="delail">


                            <div className="p_inputbox">

                                {isEditing ? (
                                    <div>
                                        <div className="preHint">
                                            {data?.email ?? ''} </div>
                                        <input
                                            className="In_txt"
                                            type="text"
                                            name="email"
                                            // placeholder={data?.Product_id ?? ''}
                                            value={UpdateData.email}
                                            onChange={handleUpdateInputChange}
                                        />

                                    </div>
                                ) : (
                                    <p>{data?.email ?? ''}</p>
                                )}
                                <span> email </span>
                            </div>

                            <div className="p_inputbox">

                                {isEditing ? (
                                    <div>
                                        <div className="preHint">
                                            {data?.name ?? ''} </div>
                                        <input
                                            className="In_txt"
                                            type="text"
                                            name="name"
                                            // placeholder={data?.Product_id ?? ''}
                                            value={UpdateData.name}
                                            onChange={handleUpdateInputChange}
                                        />

                                    </div>
                                ) : (
                                    <p>{data?.name ?? ''}</p>
                                )}
                                <span> name </span>
                            </div>

                            <div className="p_inputbox">
                                {isEditing ? (
                                    <div>
                                        <div className="preHint">
                                            {data?.password ?? ''} </div>
                                        <input
                                            className="In_txt"
                                            type="text"
                                            name="password"
                                            value={UpdateData.password}
                                            onChange={handleUpdateInputChange}
                                        />

                                    </div>
                                ) : (
                                    <p>{data?.password ?? ''}</p>
                                )}
                                <span> password </span>
                            </div>


                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Profile
