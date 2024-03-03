import "./Admin_new.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { useEffect, useState } from "react";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const Admin_new = () => {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(null);
    const [userData, setUserData] = useState({
        // Modify fields to match user data
        username: "",
        email: "",
        password: "",
        img: "", // Initialize img field
        // Add other user data fields as needed
    });

    const [uploading, setUploading] = useState(false); // State to track uploading status

    useEffect(() => {
        const uploadFile = async () => {
            if (!file) return;

            setUploading(true); // Set uploading to true when file upload starts

            const name = new Date().getTime() + file.name;
            const storageRef = ref(storage, name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    setProgress(progress);
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setUserData((prevUserData) => ({ ...prevUserData, img: downloadURL }));
                    });
                    setUploading(false); // Set uploading to false when file upload completes
                }
            );
        };

        uploadFile();
    }, [file]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
    
        try {
            const res = await createUserWithEmailAndPassword(
                auth,
                userData.email,
                userData.password
            );
    
            // Ensure image URL is available before saving
            if (userData.img) {
                // Add a new document in collection "users"
                await setDoc(doc(db, "Users", res.user.uid), {
                    ...userData,
                    role: "Admins",
                    timeStamp: serverTimestamp()
                });
    
                console.log("Document written with ID: ", res.user.uid);
    
                // Reset input fields and image
                setUserData({
                    username: "",
                    email: "",
                    password: "",
                    img: ""
                });
                setFile(null);
            } else {
                console.error("Image upload incomplete or failed.");
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>Add New User</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img src={file ? URL.createObjectURL(file) : "/no-image-icon-0.jpg"} alt="" />
                    </div>
                    <div className="right">
                        <form onSubmit={handleAdd}>
                            <div className="formInput">
                                <label htmlFor="file">Image:</label>
                                <input
                                    type="file"
                                    id="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{ display: "none" }}
                                />
                                <DriveFolderUploadIcon className="icon" onClick={() => document.getElementById("file").click()} />
                            </div>

                            <div className="formInput">
                                <label>Username:</label>
                                <input type="text" name="username" value={userData.username} onChange={handleInputChange} />
                            </div>

                            <div className="formInput">
                                <label>Email:</label>
                                <input type="email" name="email" value={userData.email} onChange={handleInputChange} />
                            </div>

                            <div className="formInput">
                                <label>Password:</label>
                                <input type="password" name="password" value={userData.password} onChange={handleInputChange} />
                            </div>

                            {/* Add other user data fields as needed */}

                            <button type="submit" disabled={uploading}>Add User</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin_new;
