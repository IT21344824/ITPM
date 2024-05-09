import "./product_New.scss";
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


const Product_New = ({ userId }) => {

    //console.log("Inventory new id",userId);
    const [total, setTotal] = useState(0); // New variable total
    const [defects, setDefects] = useState(0); // New variable defects

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


        Product_id: "",
        item_name: "",
        price: 0,
        qty: 0,
        description: "",
        item_type: null,
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
                const name = `Inventory/${new Date().getTime()}_${file.name}`; // Adjust the storage path here
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
        if (name === 'price' || name === 'qty') {
            // Update total when price or quantity changes
            const price = name === 'price' ? parseFloat(value) : parseFloat(formData.price);
            const qty = name === 'qty' ? parseFloat(value) : parseFloat(formData.qty);
            const calculatedTotal = price * qty;
            setTotal(isNaN(calculatedTotal) ? 0 : calculatedTotal);
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleReset = () => {
        setFormData(initialFormData);
        setFiles([]);
        setSelectedIndex(0); // assuming you have a setSelectedIndex function to set the index of the selected image
        setSelectedImage(null); // set the selectedImage to null
        document.getElementById("category").selectedIndex = 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let hasError = false;
        // Convert price and qty to numbers
        const parsedPrice = parseFloat(formData.price);
        const parsedQty = parseFloat(formData.qty);

        if (!formData.Product_id) {
            //alert("Please enter the Product_id");
            setShowHint(true);
            hasError = true;
            toast.warn('Please enter the Product_id!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if (!formData.item_name) {
            // alert("Please enter the item_name");
            setShowHint(true);
            hasError = true;
            toast.warn('Please enter the item_name!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,

            });
            return;
        }

        // Check if price and qty are valid numbers
        if (isNaN(parsedPrice) || isNaN(parsedQty)) {
            toast.error('Please enter valid numbers for price and quantity!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        if (!formData.item_type) {

            setShowHint(true);
            hasError = true;
            toast.warn('Please enter a category!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }


        if (!formData.description) {
            //alert("Please enter the description");
            setShowHint(true);
            hasError = true;
            toast.warn('Please enter the description!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        if (files.length === 0) {
            //alert("Please select an image");
            setShowHint(true);
            hasError = true;
            toast.warn('Please enter the image!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if (hasError) {
            return;
        }
        if (!userId) {
            // Handle the case when user is not logged in
            return;
        }

        // Initialize formData.img as an empty array if it is null
        const images = formData.img ? formData.img : [];

        try {
            const productsRef = collection(db, "Inventory");

            const queryRef = query(productsRef, where("Product_id", "==", formData.Product_id));
            const querySnapshot = await getDocs(queryRef);

            const itemQueryRef = query(productsRef, where("item_name", "==", formData.item_name));
            const itemQuerySnapshot = await getDocs(itemQueryRef);

            // Proceed with adding the product to the database if neither Product_id nor item_name exists
            if (itemQuerySnapshot.size > 0 && querySnapshot.size > 0) {
                //alert("item_name already exists in the database");
                toast.error('Item is already exists in the database!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return;
            }

            // Upload each file in the files array
            // for (const file of files) {
            //     const storageRef = ref(storage, file.name);
            //     const uploadTask = uploadBytesResumable(storageRef, file);

            //     uploadTask.on(
            //         "state_changed",
            //         (snapshot) => {
            //             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //             console.log("IMG array Upload is " + progress + "% done");
            //             setPer(progress);
            //         },
            //         (error) => {
            //             console.log(error);
            //         },
            //         () => {
            //             // Get the download URL and add it to the images array
            //             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //                 images.push(downloadURL);
            //                 setFormData((prev) => ({ ...prev, img: images }));
            //             });
            //         }
            //     );
            // }

            // Add the product data to the database
            const newProductRef = await addDoc(collection(db, "Inventory"), {
                ...formData,
                user_id: userId, // Save userId as user_id in the database
                defects: 0,
                price: parsedPrice,
                qty: parsedQty,
                L_Revenue: 0,
                Total: total,

                timeStamp: serverTimestamp(),
            });
            console.log("Document written with ID: ", newProductRef.id);
            // alert(`New Product have added and ID: ${newProductRef.id}`);

            //nofity

            toast.success(`Successful \nID: ${newProductRef.id}`, {
                background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setFormData(initialFormData);
            setFiles([]);
            setSelectedIndex(0); // assuming you have a setSelectedIndex function to set the index of the selected image
            setSelectedImage(null); // set the selectedImage to null
            document.getElementById("category").selectedIndex = 0;
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    // ----------------------------------------------------------------

    //-----------------------------------------------------------------get categorys---------------------------------------------------------------------------------

    const handleCategoryChange = (event) => {
        const selectedOption = data.find((item) => item.Cat_name === event.target.value);
        const item_type_ref = selectedOption ? doc(db, "Inventory_Category", selectedOption.id) : null;
        setFormData({ ...formData, item_type: item_type_ref });
        console.log(item_type_ref);
    };


    // ------------Product_Category----------------------------------------------------

    const fetchData = () => {
        const unsub = onSnapshot(
            query(collection(db, "Inventory_Category"), where("user_id", "==", userId)),
            (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() });
                });
                setData(list);
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

    const [searchQuery, setSearchQuery] = useState("");

    const filtered_Category_Data = data.filter((row) =>
        ["id", "Cat_name"].some(
            (field) =>
                row[field] && row[field].toString().toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
        )
    );

    //-----------------------------------------------------------------get categorys---------------------------------------------------------------------------------

    //-------------------------------------------------------image select popup-----------------------------------
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);


    const handleImageClick = (event) => {
        setSelectedImage(event.target.src);
    };

    const handleMiniImageClick = (event) => {
        setSelectedImage(event.target.dataset.src);
    };
    //-------error massage------
    const [ShowHint, setShowHint] = useState(false);


    // clear button pop ---------
    const togglePopdown = () => {
        var button = document.querySelector('.clear_img');
        button.classList.toggle('popdown');
    }





    return (
        <div className="Akidu_new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>Add New Item to Inventory</h1>
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
                        <form onSubmit={handleSubmit} onReset={handleReset}  >
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
                                    {ShowHint && (files.length === 0) && (
                                        <div className="p_new_hint img_hint" >
                                            Please select a Image !
                                        </div>
                                    )}

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
                                <label> Brand Name : </label>
                                <input
                                    type="text"
                                    name="Product_id"
                                    value={formData.Product_id}
                                    onChange={handleInputChange}
                                    placeholder="Enter Item Brand...."
                                    //required
                                    // add a class to the input when ShowHint is true
                                    className={ShowHint && !formData.Product_id ? 'error' : ''}
                                />
                                {ShowHint && !formData.Product_id && (
                                    <div className="p_new_hint" >
                                        Enter the Brand Name!
                                    </div>
                                )}
                            </div>

                            <div className="formInput">
                                <label>Item Name :</label>
                                <input
                                    type="text"
                                    name="item_name"
                                    value={formData.item_name}
                                    onChange={handleInputChange}
                                    placeholder="Enter Item Name...."
                                    //required
                                    className={ShowHint && !formData.item_name ? 'error' : ''}
                                />
                                {ShowHint && !formData.item_name && (
                                    <div className="p_new_hint" >
                                        Enter the Item Name!
                                    </div>
                                )}
                            </div>



                            <div className="formInput">
                                <label>Price (RS) :</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="Enter Item Price...."
                                    min="0"  // Set minimum value to 0 or adjust as needed
                                    step="0.01"  // Set step value if decimal inputs are allowed
                                    className={ShowHint && (!formData.price || isNaN(formData.price)) ? 'error' : ''}
                                />
                                {ShowHint && (!formData.price || isNaN(formData.price)) && (
                                    <div className="p_new_hint" >
                                        Enter a number for Price !
                                    </div>
                                )}
                            </div>

                            <div className="formInput">
                                <label>Quantity :</label>
                                <input
                                    type="number"
                                    name="qty"
                                    value={formData.qty}
                                    onChange={handleInputChange}
                                    min="0"  // Set minimum value to 0 or adjust as needed
                                    placeholder="Enter Item Quantity...."
                                    className={ShowHint && (!formData.qty || isNaN(formData.qty)) ? 'error' : ''}
                                />
                                {ShowHint && (!formData.qty || isNaN(formData.qty)) && (
                                    <div className="p_new_hint" >
                                        Enter a number for Quantity !
                                    </div>
                                )}
                            </div>

                            <div className="formInput">
                                {/* ---------------------------------------------------------------------------------------------------------------------------------------- */}

                                <div className="Item_Type">
                                    <div>
                                        <label htmlFor="item_type">Category :</label>
                                        <select id="category" name="category" className={`P_cat ${ShowHint && !formData.item_type ? 'error' : ''}`}
                                            onChange={handleCategoryChange}>
                                            <option value=""> </option>
                                            {/* <option value={formData.item_type}> </option> */}
                                            {data.map((item) => (
                                                <option key={item.Cat_name} value={item.Cat_name} >

                                                    {item.Cat_name}
                                                </option>
                                            ))}
                                        </select>
                                        {ShowHint && !formData.item_type && (
                                            <div className="p_new_hint" >
                                                select a Category !
                                            </div>
                                        )}

                                    </div>
                                </div>
                                {/* ---------------------------------------------------------------------------------------------------------------------------------------- */}



                            </div>

                            <div className="formInput">
                                <label>Description :</label>
                                <textarea
                                    className={`Description ${ShowHint && !formData.description ? 'error' : ''}`}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter Item Description...."
                                ></textarea>
                                {ShowHint && !formData.description && (
                                    <div className="p_new_hint" >
                                        Enter the Description !
                                    </div>
                                )}
                            </div>

                            <div className="formButton">
                                <button disabled={per !== null && per < 100} type="submit" className="submit" >Add Item</button>
                                <button type="reset" className="reset" > Clear </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
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
}

export default Product_New
