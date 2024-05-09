import { useEffect, useState } from "react";
import { getDoc, collection, query, doc, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useLocation } from "react-router-dom";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import "./Employe.scss";


const Employe = ({ id }) => {

    //geting id from http
    const location = useLocation();
    const _id = location.state?.id;


    //geting selected data
    const [data, setData] = useState({});
   // console.log(data.img);

    useEffect(() => {
        if (_id) {
            const docRef = doc(db, "Users", _id);

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
        }
    }, [_id]);


    return (
        <div className="Employe">
            <Sidebar />
            <div className="con">
                <Navbar />

                <div className="E_delail">
                    <div className="E_container">

                        <div className="pre_Img">
                            <img src={data?.img ?? ''} alt="product" style={{ height: "300px" }} />

                        </div>


                        <div className="p_inputbox">
                            <p> address : {data?.address ?? ''} </p>
                           
                        </div>

                        <div className="p_inputbox">
                            <p>  phone :{data?.phone ?? ''}</p>
                          
                        </div>

                        <div className="p_inputbox">
                            <p>  gender {data?.gender ?? ''}</p>
                           
                        </div>

                        <div className="p_inputbox">
                            <p>  name :{data?.name ?? ''}</p>
                           
                        </div>

                        <div className="p_inputbox">
                            <p>  email : {data?.email ?? ''}</p>
                           
                        </div>



                    </div>
                </div>
            </div>
        </div>
    )
}

export default Employe
