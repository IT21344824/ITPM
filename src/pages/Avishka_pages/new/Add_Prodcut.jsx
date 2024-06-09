import "./Add_Prodcut.scss";
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


const Add_Prodcut = ({ userId }) => {

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
        Item_code: "",
        Color: "",        
        Size: "",
        Brand: "",
        Category: "",
        Material: "",
        price: "",
        Desing_Type: "",
        img: [], // add imgs to formData to store multiple image urls
    };
    
    const [formData, setFormData] = useState(initialFormData);
    //------------

    //uploadfile
    useEffect(() => {
        const uploadFile = async () => {
            for (const file of files) {
                const name = `Forecast/${new Date().getTime()}_${file.name}`; // Adjust the storage path here
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

    
    const [prediction, setPrediction] = useState(null);

    const handleClick = async () => {
        try {
            // Convert string values to numeric
            const numericBrand = parseInt(formData.Brand);
            const numericCategory = parseInt(formData.Category);
            const numericColor = parseInt(formData.Color);
            const numericSize = parseInt(formData.Size);
            const numericMaterial = parseInt(formData.Material);
            
            const data = {
                Brand: numericBrand,
                Category: numericCategory,
                Color: numericColor,
                Size: numericSize,
                Material: numericMaterial,
            };
    
            console.log(data);
    
            try {
                const response = await fetch('http://127.0.0.1:5000/predict', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
    
                if (response.ok) {
                    console.log(response);
                }
    
                const result = await response.json();
                setPrediction(result.predicted_price); // Assuming the response has a 'prediction' field
            } catch (error) {
                console.error('There was a problem with your fetch operation:', error);
            }
        } catch (error) {
            console.error('There was a problem:', error);
        }
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Mapping Size, Brand, Category, Color, and Material values
        const sizeMap = ['XS', 'M', 'XL', 'XXL', 'S', 'L'];
        const brandMap = ['New Balance', 'Under Armour', 'Nike', 'Adidas', 'Reebok', 'Puma'];
        const categoryMap = ['Dress', 'Jeans', 'Shoes', 'Sweater', 'Jacket', 'T-shirt'];
        const colorMap = ['White', 'Black', 'Red', 'Green', 'Yellow', 'Blue'];
        const materialMap = ['Nylon', 'Silk', 'Wool', 'Cotton', 'Polyester', 'Denim'];

        formData.Size = sizeMap[parseInt(formData.Size)];
        formData.Brand = brandMap[parseInt(formData.Brand)];
        formData.Category = categoryMap[parseInt(formData.Category)];
        formData.Color = colorMap[parseInt(formData.Color)];
        formData.Material = materialMap[parseInt(formData.Material)];
        try {
            const newProductRef = await addDoc(collection(db, "Forecast"), {
                ...formData,
                timeStamp: serverTimestamp(),
            });
            console.log("Document written with ID: ", newProductRef.id);
            setFormData({
                ...formData,
                Item_code: "",
                Size: "",
                Color: "",
                Brand: "",
                Category: "",
                Material: "",
                price: "",
                Desing_Type: "",
                img: [],
            });
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
        <div className="Avishka_new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>Add New Prodcut</h1>
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
                        <form  >
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
                                <label> Item_code : </label>
                                <input
                                    type="text"
                                    name="Item_code"
                                    value={formData.Item_code}
                                    onChange={handleInputChange}
                                    placeholder="Enter Item_code...."
                                    //required
                                    // add a class to the input when ShowHint is true
                                    className={ShowHint && !formData.Item_code ? 'error' : ''}
                                />
                               
                            </div>

                            <div className={`formInput ${ShowHint ? 'error' : ''}`}>
                                <label>Size : </label>
                                <select
                                    name="Size"
                                    value={formData.Size}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select SizeType</option>
                                    <option value="0">XS</option>
                                    <option value="1">M</option>
                                    <option value="2">XL</option>
                                    <option value="3">XXL</option>
                                    <option value="4">S</option>
                                    <option value="5">L</option>
                                </select>
                               
                            </div>

                            <div className={`formInput ${ShowHint ? 'error' : ''}`}>
                                <label> Color : </label>
                                <select
                                    name="Color"
                                    value={formData.Color}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select color</option>
                                    <option value="0">White</option>
                                    <option value="1">Black</option>
                                    <option value="2">Red</option>
                                    <option value="3">Green</option>
                                    <option value="4">Yellow</option>
                                    <option value="5">Blue</option>
                                </select>
                               
                            </div>

                            <div className={`formInput ${ShowHint ? 'error' : ''}`}>
                                <label> Brand : </label>
                                <select
                                    name="Brand"
                                    value={formData.Brand}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Brand</option>
                                    <option value="0">New Balance</option>
                                    <option value="1">Under Armour</option>
                                    <option value="2">Nike</option>
                                    <option value="3">Adidas</option>
                                    <option value="4">Reebok</option>
                                    <option value="5">Puma</option>
                                 
                                </select>
                               
                            </div>

                            <div className={`formInput ${ShowHint ? 'error' : ''}`}>
                                <label> Category : </label>
                                <select
                                    name="Category"
                                    value={formData.Category}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Category</option>
                                    <option value="0">Dress</option>
                                    <option value="1">Jeans</option>
                                    <option value="2">Shoes</option>
                                    <option value="3">Sweater</option>
                                    <option value="4">Jacket</option>
                                    <option value="5">T-shirt</option>
                                 
                                </select>
                               
                            </div>

                            <div className={`formInput ${ShowHint ? 'error' : ''}`}>
                                <label> Material : </label>
                                <select
                                    name="Material"
                                    value={formData.Material}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Material</option>
                                    <option value="0">Nylon</option>
                                    <option value="1">Silk</option>
                                    <option value="2">Wool</option>
                                    <option value="3">Cotton</option>
                                    <option value="4">Polyester</option>
                                    <option value="5">Denim</option>
                                 
                                </select>
                               
                            </div>

                            <div className="formInput">
                         
                        <label>Predicted Price:</label>
                        <input
                            type="number"
                            name="price"
                            label="Predicted Price"
                            variant="outlined"
                            value={prediction || ""} // Use prediction state variable to control the input value
                            readOnly // Make the input field read-only
                            min="0"
                            placeholder="Predicted Price"
                        />
                    </div>

                            <div className="formButton" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button
                                    disabled={per !== null && per < 100}
                                   
                                    className="submit"
                                    style={{ flex: '1', marginRight: '10px' }}
                                    onClick={handleSubmit}
                                >
                                    Add
                                </button>
                                <button
                                    type="reset"
                                    className="reset"
                                    style={{ flex: '1', marginRight: '10px' }}
                                >
                                    Clear
                                </button>
                                <div style={{ flex: '1' }}>
                                    <button
                                        onClick={handleClick}
                                        style={{
                                            backgroundColor: 'blue',
                                            color: 'white',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            border: 'none',
                                            fontSize: '16px',
                                            cursor: 'pointer',
                                            width: '100%', // Make the button fill the entire space
                                        }}
                                    >
                                        PredictPrice
                                    </button>
                                    {prediction !== null && <p>Prediction: {prediction}</p>}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
          

        </div>
    );
}

export default Add_Prodcut
