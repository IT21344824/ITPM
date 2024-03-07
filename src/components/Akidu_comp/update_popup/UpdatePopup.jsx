import './UpdatePopup.scss';
import React, { useState, useEffect, useRef } from "react";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { collection, doc, updateDoc, setDoc, serverTimestamp, getDocs, onSnapshot } from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
//notify-
//import NofitySuc from "../../../components/notify_status/nofity";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//--


const UpdatePopup = ({ open, onClose, id }) => {

  //-------error massage------
  const [ShowHint, setShowHint] = useState(false);

  //nofify--
  const notifyStyle = {
    whiteSpace: 'pre-line'
  }
  const progressStyle = {
    background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)'
  }

  //---

  //------------images-------------------------
  const [files, setFiles] = useState([]);
  //-------------------------------------




  //---------------------------------------Product data---------------------------------
  const initialUpdateData = {
    Product_id: "",
    item_name: "",
    price: "",
    qty: "",
    description: "",
    item_type: "",
    status: "",
    //imgs: [], // add imgs to formData to store multiple image urls
  };

  const [UpdateData, setFormData] = useState(initialUpdateData);

  const handleInputChange = (event) => {
    setShowHint(false);
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  //---------------------------------------------------------------------------------------------






  //--------------------------------submit update---------------------------------
  const [per, setPer] = useState(null);
  const [loading, setLoading] = useState(false);



  const perRef = useRef(null); // create a mutable ref variable for the progress percentage

  const handleUpdate = async (event) => {
    event.preventDefault();

    let hasError = false;

    if (!UpdateData.Product_id) {
      // alert("Please enter the Product_id");
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
    if (!UpdateData.item_name) {
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

    if (!UpdateData.price || isNaN(UpdateData.price)) {
      //alert("Please enter a number for the item price ");
      setShowHint(true);
      hasError = true;
      toast.warn('Please a number for the item price!', {
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

    if (!UpdateData.qty || isNaN(UpdateData.qty)) {
      //alert("Please enter a number for the quantity");
      setShowHint(true);
      hasError = true;
      toast.warn('Please enter a number for the quantity!', {
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
    if (!UpdateData.item_type) {
      //alert("Please select a category");
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
    if (!UpdateData.status) {
      //alert("Please select a status type");
      setShowHint(true);
      hasError = true;
      toast.warn('Please enter the status type!', {
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

    if (!UpdateData.description) {
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

    setLoading(true);

    const images = UpdateData.img ? UpdateData.img : [];

    try {
      const uploadTasks = files.map((file) => {
        const storageRef = ref(storage, file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            perRef.current = progress;
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              images.push(downloadURL);
              if (images.length === files.length) {
                const collectionRef = collection(db, "products");
                const docRef = doc(collectionRef, id);

                updateDoc(docRef, {
                  ...UpdateData,
                  img: images,
                  timeStamp: serverTimestamp(),
                })
                  .then(() => {
                    console.error(UpdateData);

                    setFormData(initialUpdateData);
                    setFiles([]);
                    document.getElementById("category").selectedIndex = 0;
                    //alert(` Product have Updated succesfully and ID: ${id}`);
                    toast.success(`Successful \nID: ${id}`, {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                    setLoading(false);
                  })
                  .catch((error) => {
                    console.error("Error updating document: ", error);
                    toast.error(`Error updating`, {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                    setLoading(false);
                  });
              }
            });
          }
        );

        return uploadTask;
      });

      await Promise.all(uploadTasks);
    } catch (error) {
      console.error("Error uploading image: ", error);
      setLoading(false);
    }
  };


  useEffect(() => {
    // update the state and trigger a re-render when the progress changes
    setPer(perRef.current);
  }, [perRef.current]);

  //---------------------------------------------------------------------------------------------
  const handleReset = () => {
    setFormData(initialUpdateData);
    setFiles([]);
    setShowHint(false);
    document.getElementById("category").selectedIndex = 0;

  };


  // category ------------------------------------------
  const [data, setData] = useState([]);

  //fetch categorys-----------

  const fetchData = () => {
    const unsub = onSnapshot(
      collection(db, "Product_Category"),
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

  //---------------------------------------------------------------------------------------------

  useEffect(() => {
    const unsub = fetchData();
    return () => {
      unsub();
    };
  }, []);

  //---------------------------------------------------------------------------------------------

  // const handleCategoryChange = (event) => {
  //   const selectedOption = data.find((item) => item.id === event.target.value);
  //   const category = selectedOption ? selectedOption.Cat_name : '';
  //   setFormData({ ...UpdateData, item_type: category });
  //   console.log(category);
  // }
  const handleCategoryChange = (event) => {
    const selectedOption = data.find((item) => item.Cat_name === event.target.value);
    const item_type_ref = selectedOption ? doc(db, "Product_Category", selectedOption.id) : null;
    setFormData({ ...UpdateData, item_type: item_type_ref });
    console.log(item_type_ref);
  };


  //---------------------------------------------------------------------------------------------

  //------------------cancles-------------------------
  const handleCancel = () => {
    setFormData(initialUpdateData);
    setFiles([]);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="popup-overlay">

      <div className="popup">

        <h1>Update Product </h1>


        <div className="full_from">

          <form onReset={handleReset} onSubmit={handleUpdate} onClose={handleCancel} >
            <div className="line_rows">

              <div className="top">

                <h1 className='details_tag'> details </h1>

                <div className="formInput">
                  <label htmlFor="file">
                    <DriveFolderUploadIcon className="icon" /> : Image
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
                      Please Select Image!
                    </div>
                  )}
                </div>
              </div>
              <div className="mid">

                {files.length > 0 ? (
                  files.map((file) => (
                    <img
                      key={file.name}
                      src={URL.createObjectURL(file)}
                      alt=""
                      style={{ maxWidth: "100%", marginBottom: "10px" }}
                    />
                  ))
                ) : (
                  <img
                    src={
                      "/no-image-icon-0.jpg"
                    }
                    alt=""
                  />
                )}


              </div>



              {/*------------------------------------------------------------------*/}

              <div className="bot">
                <div className="formInput">
                  <label> Product Id : </label>
                  <input className={ShowHint && !UpdateData.Product_id ? 'error' : ''} type="text" name="Product_id" value={UpdateData.Product_id} onChange={handleInputChange} placeholder="Enter Product Id...." />
                  {ShowHint && !UpdateData.Product_id && (
                    <div className="p_new_hint" >
                      Please enter the Product Id!
                    </div>
                  )}
                </div>

                <div className="formInput">
                  <label>Item Name : </label>
                  <input className={ShowHint && !UpdateData.item_name ? 'error' : ''} type="text" name="item_name" value={UpdateData.item_name} onChange={handleInputChange} placeholder="Enter Product Name...." />
                  {ShowHint && !UpdateData.item_name && (
                    <div className="p_new_hint" >
                      Please enter the Item Name!
                    </div>
                  )}
                </div>

                <div className="formInput">
                  <label>Price (RS) : </label>
                  <input className={ShowHint && (!UpdateData.price || isNaN(UpdateData.price)) ? 'error' : ''} type="text" name="price" value={UpdateData.price} onChange={handleInputChange} placeholder="Enter Product Price...." />
                  {ShowHint && (!UpdateData.price || isNaN(UpdateData.price)) && (
                    <div className="p_new_hint" >
                      Please enter a number for Price !
                    </div>
                  )}
                </div>

                <div className="formInput">
                  <label>Quantity : </label>
                  <input className={ShowHint && (!UpdateData.qty || isNaN(UpdateData.qty)) ? 'error' : ''} type="text" name="qty" value={UpdateData.qty} onChange={handleInputChange} placeholder="Enter Product Quantity...." />
                  {ShowHint && (!UpdateData.qty || isNaN(UpdateData.qty)) && (
                    <div className="p_new_hint" >
                      Please enter a number for Quantity !
                    </div>
                  )}
                </div>

                <div className="formInput">
                  <div>
                    <div className="Item_Type">
                      <label htmlFor="item_type">Category :</label>
                      <select id="category" name="category" className={`P_cat ${ShowHint && !UpdateData.item_type ? 'error' : ''}`} onChange={handleCategoryChange}>
                        <option value=""> </option>
                        {/* <option value={formData.item_type}> </option> */}
                        {data.map((item) => (
                          <option key={item.Cat_name} value={item.Cat_name} >

                            {item.Cat_name}
                          </option>
                        ))}
                      </select>
                      {ShowHint && !UpdateData.item_type && (
                        <div className="p_new_hint" >
                          Please select a Category !
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="status" >
                    <label> status : </label>
                    <div className={`line_height ${ShowHint && !UpdateData.status ? 'error' : ''}`} style={{ display: "flex", alignItems: "center" }}>
                      <label style={{ marginRight: "20px" }}>
                        <input
                          type="radio"
                          name="status"
                          value="In Stock"
                          checked={UpdateData.status === "In Stock"}
                          onChange={handleInputChange}
                        />
                        In&nbsp;Stock
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="status"
                          value="Out Of Stock"
                          checked={UpdateData.status === "Out Of Stock"}
                          onChange={handleInputChange}
                        />
                        Out&nbsp;Of&nbsp;Stock
                      </label>
                    </div>
                    {ShowHint && !UpdateData.status && (
                      <div className="p_new_hint" >
                        Please select the status!
                      </div>
                    )}
                  </div>
                </div>






                <div className="formInput">
                  <label>Description :</label>
                  <textarea
                    className={`Description ${ShowHint && !UpdateData.description ? 'error' : ''}`}
                    name="description"
                    value={UpdateData.description}
                    onChange={handleInputChange}
                    placeholder="Enter Product Description...."
                  ></textarea>
                  {ShowHint && !UpdateData.description && (
                    <div className="p_new_hint" >
                      Please enter the Description !
                    </div>
                  )}
                </div>


              </div>

              <div className="buttons">
                <button type="submit" className="submit"> Update </button>
                <button type="reset" className="reset">  Clear </button>
                <button onClick={onClose}  >Cancel</button>
              </div>
            </div>
          </form>
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
};

export default UpdatePopup;
