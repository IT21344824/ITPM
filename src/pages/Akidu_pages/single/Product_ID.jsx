import "./product_ID.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { useEffect, useState } from "react";
import { getDoc, collection, query, doc, updateDoc, serverTimestamp, onSnapshot , where } from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Link, useLocation } from "react-router-dom";
import Modal from 'react-modal';
// import 'react-modal/style/modal.css';
import Cart from '../../../components/Akidu_comp/update_popup/UpdatePopup'; // pass the page , id to update page

//notify-
//import NofitySuc from "../../../components/notify_status/nofity";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//--


const Product_ID = ({ id , userId }) => {

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

    //geting id from http
    const location = useLocation();
    const _id = location.state.id;


    ////------------------------------------------geting selected data//------------------------------------------
    const [data, setData] = useState({});
    const [itemTypeData, setItemTypeData] = useState({});

    const getItemTypeData = async (item_type_ref) => {
        if (!item_type_ref) {
            return "";
        }
        try {
            const snapshot = await getDoc(item_type_ref);
            const item_type_data = snapshot.data();
            if (!item_type_data) {
                return "";
            }
            //console.log(item_type_data.Cat_name);
            return item_type_data.Cat_name.toString();

        } catch (error) {
            console.error(error);
            return "";
        }
    };

    useEffect(() => {
        const docRef = doc(db, "Inventory", _id);

        const unsubscribe = onSnapshot(docRef, async (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setData(data);

                // update the state with retrieved data
                if (data.item_type) {
                    const categoryDoc = await getDoc(data.item_type);
                    // do something with categoryDoc
                }

                const item_type_ref = data.item_type;

                getItemTypeData(item_type_ref).then((data) => {
                    setItemTypeData((prevData) => ({ ...prevData, categoryDoc: data }));
                });

            } else {
                console.log("No such document!");
            }
        }, (error) => {
            console.log("Error getting document:", error);
        });

        // unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    }, [_id]);

    ////------------------------------------------geting selected data end------------------------------------------


    //pre image soom
    const [selectedImg, setSelectedImg] = useState(null);

    const handleImageClick = (index) => {
        setSelectedImg(index);
    };
    //------------------------------

    const [open, setOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);

    const handleOpen = (id) => {
        setSelectedId(id);
        setOpen(true);
    };


    const handleClose = () => {
        setOpen(false);
    };

    //item_type refarence 

    const [catdata, setCatdata] = useState([]);


    //featch category--start
    const fetchData = () => {
        const unsub = onSnapshot(
            query(collection(db, "Inventory_Category"), where("user_id", "==", userId)),
            (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() });
                });
                setCatdata(list);
            },
            (error) => {
                console.log(error);
            }
        );
        return unsub;
    };
    

    useEffect(() => {
        const unsub = fetchData();
        return () => {
            unsub();
        };
    }, []);


    //featch category--end---------- 
    const handleCategoryChange = (event) => {
        const selectedOption = catdata.find((item) => item.Cat_name === event.target.value);
        const item_type_ref = selectedOption ? doc(db, "Inventory_Category", selectedOption.id) : UpdateData.item_type;
        setUpdateData({ ...UpdateData, item_type: item_type_ref });
        console.log(item_type_ref);
    };


    //---------------------------------------------------------------------------one By one | start --------------------------------------------------

    //edit parts-----------------------------
    const [isEditing, setIsEditing] = useState(false);

    const initialUpdateData = {
        Product_id: "",
        item_name: "",
        price: "",
        qty: "",
        description: "",
        item_type: null,
        img: [], // add imgs to formData to store multiple image urls
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

    //uploadfile
    const uploadFile = async (file) => {
        const name = new Date().getTime() + file.name;
        //console.log(name);
        const storageRef = ref(storage, name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                    setPer(progress);
                },
                (error) => {
                    console.log(error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    //------------------------------------save updates------------------------------------
    const handleSaveChanges = async (event) => {
        event.preventDefault();

        try {
            const categoryRef = doc(collection(db, "Inventory"), _id);

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
            // Add the new image URL to the end of the array
            const newImgArray = files[0] ? [...currentImgArray, await uploadFile(files[0])] : currentImgArray;

            // Update the data with the new Total, L_Revenue, and other fields
            const NewupdateData = {
                ...UpdateData,
                timeStamp: serverTimestamp(),
                img: newImgArray,
                Total: isNaN(updatedTotal) ? 0 : updatedTotal,
                L_Revenue: isNaN(updatedLRevenue) ? 0 : updatedLRevenue,
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

            // Update the category document with only non-empty fields
            await updateDoc(categoryRef, cleanData);

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

    //delete selected img
    const handleDelete = async (index) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this image?");
        if (confirmDelete) {
            try {
                console.log(index)
                const categoryRef = doc(collection(db, "Inventory"), _id);

                // retrieve the current value of the img array
                const docSnap = await getDoc(categoryRef);
                const currentImgArray = docSnap.data().img;

                // create a copy of the data object and remove the selected image from the img array
                const newData = { ...data };
                newData.img.splice(index, 1);

                // update the client_home_pg document with the new data object
                await updateDoc(categoryRef, { img: newData.img });

                setData(newData);
            } catch (error) {
                console.error("Error deleting image: ", error);
            }
        }
    };

    //---------------------------------------------------------------------------one By one | end--------------------------------------------------


    return (
        <div className="Akidu_pro_single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="top">
                    <div className="top_pre">
                        <div className="pre_title">
                            <h1>Item Details</h1>
                            {/* <Link to={`/products/OBO/${_id}`} >xxx</Link> */}
                            {/* <button onClick={() => handleOpen(_id)}>Edit All</button> */}

                        </div>
                        <div className="pre_Img">

                            {data?.img?.map((img, index) => (
                                <div key={index}   >
                                    <div className="img">
                                        {isEditing ? (
                                            <div>
                                                <img src={img} alt="product" />
                                                <button className="viewBtn" onClick={() => handleImageClick(index)} >view</button>
                                                <button className="deleteBtn" onClick={() => handleDelete(index)} >Delete</button>

                                            </div>
                                        ) : (
                                            <img src={img} alt="product" />
                                        )}
                                    </div>

                                </div>
                            ))}
                        </div>
                        {selectedImg !== null && (
                            <Modal
                                isOpen={true}
                                onRequestClose={() => setSelectedImg(null)}
                                appElement={document.body}
                                style={{
                                    content: {
                                        //zIndex: 999
                                        // display: "flex",
                                        // justifyContent: "center",
                                        // alignItems: "center",

                                    },
                                }}
                            >
                                <img src={data?.img?.[selectedImg]} alt="product" />
                                <br />
                                <button onClick={() => setSelectedImg(null)} className="selct_img_cancle_buton">Close</button>

                            </Modal>
                        )}


                        <div className="animation_p_id box">

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

                                <div>
                                    {isEditing ? (
                                        <div className="update-img">
                                            <label htmlFor="file">
                                                Upload Image : <DriveFolderUploadIcon className="icon" />
                                            </label>
                                            <input
                                                type="file"
                                                id="file"
                                                multiple
                                                onChange={(e) => setFiles(Array.from(e.target.files))}
                                                style={{ display: "none" }}

                                            />
                                        </div>
                                    ) : ''}
                                </div>


                                <div className="delail">


                                    <div className="p_inputbox">

                                        {isEditing ? (
                                            <div>
                                                <div className="preHint">
                                                    {data?.Product_id ?? ''} </div>
                                                <input
                                                    className="In_txt"
                                                    type="text"
                                                    name="Product_id"
                                                   // placeholder={data?.Product_id ?? ''}
                                                    value={UpdateData.Product_id}
                                                    onChange={handleUpdateInputChange}
                                                />

                                            </div>
                                        ) : (
                                            <p>{data?.Product_id ?? ''}</p>
                                        )}
                                        <span> Brand </span>
                                    </div>

                                    <div className="p_inputbox">
                                        {isEditing ? (
                                            <div>
                                                <div className="preHint">
                                                    {data?.item_name ?? ''} </div>
                                                <input
                                                    className="In_txt"
                                                    type="text"
                                                    name="item_name"
                                                    value={UpdateData.item_name}
                                                    onChange={handleUpdateInputChange}
                                                />

                                            </div>
                                        ) : (
                                            <p>{data?.item_name ?? ''}</p>
                                        )}
                                        <span> Item Name </span>
                                    </div>

                                    <div className="p_inputbox">
                                        {isEditing ? (
                                            <div>
                                                <div className="preHint">
                                                    {data?.price ?? ''} </div>
                                                <input
                                                    className="In_txt"
                                                    type="text"
                                                    name="price"
                                                    value={UpdateData.price}
                                                    onChange={handleUpdateInputChange}
                                                />
                                                {ShowHint && isNaN(UpdateData.price) && (
                                                    <div className="p_new_hint" >
                                                        Please enter a number for price !
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p>{data?.price ?? ''}</p>
                                        )}
                                        <span> Price (RS) </span>
                                    </div>

                                    <div className="p_inputbox">
                                        {isEditing ? (
                                            <div>
                                                <div className="preHint">
                                                    {data?.qty ?? ''} </div>
                                                <input
                                                    className="In_txt"
                                                    type="text"
                                                    name="qty"
                                                    value={UpdateData.qty}
                                                    onChange={handleUpdateInputChange}
                                                />
                                                {ShowHint && isNaN(UpdateData.qty) && (
                                                    <div className="p_new_hint" >
                                                        Please enter a number for Quantity !
                                                    </div>
                                                )}

                                            </div>
                                        ) : (
                                            <p>{data?.qty ?? ''}</p>
                                        )}
                                        <span> Quantity </span>
                                    </div>

                                    <div className="p_inputbox">
                                        {isEditing ? (
                                            <div>
                                                <div className="preHint">
                                                    {itemTypeData?.categoryDoc ?? ''} </div>
                                                <select id="category" name="category" onChange={handleCategoryChange} >
                                                    <option value=""> </option>
                                                    {catdata.map((item) => (
                                                        <option key={item.Cat_name} value={item.Cat_name} >

                                                            {item.Cat_name}
                                                        </option>
                                                    ))}
                                                </select>

                                            </div>
                                        ) : (
                                            <p>{itemTypeData?.categoryDoc ?? ''}</p>
                                        )}
                                        <span> Item Type </span>
                                    </div>

                                    <div className="p_inputbox">
                                        <p>{data?.Total ?? ''}</p>
                                        <span> Total </span>
                                    </div>

                                    <div className="p_inputbox">
                                        {isEditing ? (
                                            <div>
                                                <div className="preHint">
                                                    {data?.defects ?? ''} </div>
                                                <input
                                                    className="In_txt"
                                                    type="text"
                                                    name="defects"
                                                    value={UpdateData.defects}
                                                    onChange={handleUpdateInputChange}
                                                />
                                                {ShowHint && isNaN(UpdateData.defects) && (
                                                    <div className="p_new_hint" >
                                                        Please enter a number for Quantity !
                                                    </div>
                                                )}

                                            </div>
                                        ) : (
                                            <p>{data?.defects ?? ''}</p>
                                        )}
                                        <span> defects / damaged items </span>
                                    </div>

                                    <div className="p_inputbox">
                                        <p>{data?.L_Revenue ?? ''}</p>
                                        <span> Lost Revenue </span>
                                    </div>



                                    <div className="p_inputbox">
                                        {isEditing ? (
                                            <div>
                                                <textarea
                                                    type="text"
                                                    name="description"
                                                    value={UpdateData.description}
                                                    onChange={handleUpdateInputChange}
                                                />

                                            </div>
                                        ) : (
                                            <p>{data?.description ?? ''}</p>
                                        )}
                                        <span>  Description </span>
                                    </div>

                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Cart open={open} onClose={handleClose} id={selectedId} />
            {/* <Cart open={open} onClose={handleClose} /> */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                limit={6} //-
                hideProgressBar={false}
                newestOnTop={false} //-
                closeOnClick
                rtl={false} //--
                pauseOnFocusLoss //--
                draggable
                pauseOnHover
                theme="colored"

                style={notifyStyle}

            // progressStyle={progressStyle}

            />
        </div>
    );
};

export default Product_ID;
