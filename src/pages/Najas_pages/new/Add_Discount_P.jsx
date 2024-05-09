import "./Add_Discount_P.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { useEffect, useState } from "react";
import { collection, getDocs, getDoc, addDoc, serverTimestamp, query, where, onSnapshot, doc } from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

//notify-
//import NofitySuc from "../../../components/notify_status/nofity";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//--


const Add_Discount_P = ({ userId }) => {

    //console.log("Inventory new id",userId);
    const [total, setTotal] = useState(0); // New variable total

    // console.log("total",total);

    //nofify--
    const notifyStyle = {
        whiteSpace: 'pre-line'
    }
    const progressStyle = {
        background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)'
    }

    //---

    //image upload
    const [files, setFiles] = useState([]);
    const [per, setPer] = useState(null);
    //------------

    // category data
    const [data, setData] = useState([]);
    //------------

    // Product data
    const initialFormData = {
        Item_NO: "",
        Compane_name: "",
        price: 0,
        qty: 0,
        description: "",
        Discount: 0,
        //item_type: "",
        //status: "",
        img: [], // add imgs to formData to store multiple image urls
    };

    const [formData, setFormData] = useState(initialFormData);
    //------------

    //uploadfile
    useEffect(() => {
        const uploadFile = async () => {
            for (const file of files) {
                const name = `Discount/${new Date().getTime()}_${file.name}`; // Adjust the storage path here
                console.log(name);
                const storageRef = ref(storage, name);
                const uploadTask = uploadBytesResumable(storageRef, file);

                await new Promise((resolve, reject) => {
                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress =
                                (snapshot.bytesTransferred / snapshot.totalBytes) *
                                100;
                            console.log("Images Upload is " + progress + "% done");
                            setPer(progress);
                        },
                        (error) => {
                            console.log(error);
                            reject(error);
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then(
                                (downloadURL) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        img: [
                                            ...(prev.img || []),
                                            downloadURL,
                                        ],
                                    }));
                                }
                            );
                            resolve();
                        }
                    );
                });
            }
        };
        files && uploadFile();
    }, [files])
    //---------------------------Products-----------------------------------------------


    const handleInputChange = (event) => {
        setShowHint(false);
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();       

        try {
                     
            // Add the product data to the database
            const newProductRef = await addDoc(collection(db, "Discount"), {
                ...formData,
               
                timeStamp: serverTimestamp(),
            });
            console.log("Document written with ID: ", newProductRef.id);
           
            setFormData(initialFormData);
         
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

   
    //-------------------------------------------------------image select popup-----------------------------------
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);


   
    const handleMiniImageClick = (event) => {
        setSelectedImage(event.target.dataset.src);
    };

    //-------error massage------
    const [ShowHint, setShowHint] = useState(false);


    





    return (
        <div className="Najas_new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>Add Discount</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <div className="selected-image-container">
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt=""
                                    className="selected-image"
                                />
                            ) : (
                                <div className="placeholder-image"></div>
                            )}
                        </div>
                        <div className="mini-image-container">
                            {files.length > 0 ? (
                                files.map((file, index) => (
                                    <img
                                        key={file.name}
                                        src={URL.createObjectURL(file)}
                                        alt=""
                                        data-src={URL.createObjectURL(file)}
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            marginBottom: "10px",
                                            borderRadius: "25%",
                                            objectFit: "cover",
                                            border: selectedImage === URL.createObjectURL(file) ? "5px solid blue" : "5px solid #777474",
                                            cursor: "pointer"
                                        }}
                                        onClick={handleMiniImageClick}
                                    />
                                ))
                            ) : (
                                <img
                                    src="/no-image-icon-0.jpg"
                                    alt=""
                                />
                            )}
                        </div>
                    </div>

                    <div className="right">
                        <form onSubmit={handleSubmit}   >
                            {/*------------------------------------------------------------------*/}

                            <div className="formInput img_tag">
                                <div>
                                    <label htmlFor="file">
                                        Image : <DriveFolderUploadIcon className="icon" />
                                    </label>
                                    <input
                                        type="file"
                                        id="file"
                                        onChange={(e) => setFiles(Array.from(e.target.files))}
                                        multiple
                                        style={{ display: "none" }}
                                        className={ShowHint && (files.length === 0) ? 'error' : ''}
                                    />
                                    

                                    <button onClick={(event) => {
                                        event.preventDefault();
                                        setFormData({
                                            ...formData,
                                            img: []
                                        });
                                        setFiles([]);
                                        setSelectedIndex(0); // assuming you have a setSelectedIndex function to set the index of the selected image
                                        setSelectedImage(null); // set the selectedImage to null
                                        console.log("Image deleted ");
                                        // togglePopdown();
                                    }} className="clear_img"> clear </button>
                                </div>

                            </div>
                            {/*------------------------------------------------------------------*/}



                            <div className={`formInput ${ShowHint ? 'error' : ''}`}>
                                <label> Item_NO : </label>
                                <input
                                    type="text"
                                    name="Item_NO"
                                    value={formData.Item_NO}
                                    onChange={handleInputChange}
                                    placeholder="Enter Item_NO...."
                                    //required
                                    // add a class to the input when ShowHint is true
                                    className={ShowHint && !formData.Item_NO ? 'error' : ''}
                                />
                               
                            </div>

                            <div className="formInput">
                                <label>Compane_name :</label>
                                <input
                                    type="text"
                                    name="Compane_name"
                                    value={formData.Compane_name}
                                    onChange={handleInputChange}
                                    placeholder="Enter  Compane_name...."
                                    //required
                                    className={ShowHint && !formData.Compane_name ? 'error' : ''}
                                />
                                
                            </div>



                            <div className="formInput">
                                <label>Price (RS) :</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="Enter  Price...."
                                    min="0"  // Set minimum value to 0 or adjust as needed
                                    step="0.01"  // Set step value if decimal inputs are allowed
                                    className={ShowHint && (!formData.price || isNaN(formData.price)) ? 'error' : ''}
                                />
                               
                            </div>

                            <div className="formInput">
                                <label>Quantity :</label>
                                <input
                                    type="number"
                                    name="qty"
                                    value={formData.qty}
                                    onChange={handleInputChange}
                                    min="0"  // Set minimum value to 0 or adjust as needed
                                    placeholder="Enter  Quantity...."
                                    className={ShowHint && (!formData.qty || isNaN(formData.qty)) ? 'error' : ''}
                                />
                               
                            </div>

                            

                            <div className="formInput">
                                <label>Description :</label>
                                <textarea
                                    className={`Description ${ShowHint && !formData.description ? 'error' : ''}`}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter  Description...."
                                ></textarea>
                               
                            </div>

                            <div className="formInput">
                                <label>Discount :</label>
                                <input
                                    type="number"
                                    name="Discount"
                                    value={formData.Discount}
                                    onChange={handleInputChange}
                                    min="0"  // Set minimum value to 0 or adjust as needed
                                    placeholder="Enter Discount...."
                                    className={ShowHint && (!formData.Discount || isNaN(formData.Discount)) ? 'error' : ''}
                                />
                               
                            </div>

                            <div className="formButton">
                                <button disabled={per !== null && per < 100} type="submit" className="submit" >Add </button>
                                <button type="reset" className="reset" > Clear </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
          

        </div>
    );
}

export default Add_Discount_P
