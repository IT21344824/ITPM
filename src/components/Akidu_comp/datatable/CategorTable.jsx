import "./CategorTable.scss";
import { DataGrid, GridToolbar, GridValueGetterParams } from '@mui/x-data-grid';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, where, query } from "firebase/firestore";
import { db } from "../../../firebase";
import CatUpdate from '../category_update/CatUpdate'; // pass the page , id to update page
//notify-
//import NofitySuc from "../../../components/notify_status/nofity";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//delete
import { onConfirm } from 'react-confirm-pro';
//--
import { CsvBuilder } from 'filefy';


const CategorTable = ({ id, Cat_name, userId }) => {

    //nofify--
    const notifyStyle = {
        whiteSpace: 'pre-line'
    }
    const progressStyle = {
        background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)'
    }

    //---

    const [searchQuery, setSearchQuery] = useState("");
    //----------------------------------------------------------Category------------------------------------------------------------
    const [Cat_data, setCat_Data] = useState([]);

    const initialFormData = {
        Cat_name: "",
        Description: "",
    };

    const [formData, setFormData] = useState(initialFormData);

    //Category headers
    const Cat_columns = [
        { field: "Row_id", headerName: "Row", width: 65 },
        { field: "Cat_name", headerName: "Category", width: 160 },
        { field: "Description", headerName: "Description", width: 200 },
    ];

    // show all Category data
    useEffect(() => {
        const unsub = onSnapshot(
            query(
                collection(db, "Inventory_Category"),
                where("user_id", "==", userId)
            ),
            (snapshot) => {
                let list = []
                snapshot.docs.forEach(doc => {
                    list.push({ id: doc.id, ...doc.data() })
                });
                setCat_Data(list);
            },
            (error) => {
                console.log(error);
            }
        );
        return () => {
            unsub();
        };
    }, [userId]);


    //search Category by name / id
    const filtered_Category_Data = Cat_data.filter((Cat_row) =>
        ["id", "Cat_name"].some(
            (field) =>
                Cat_row[field] && Cat_row[field].toString().toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
        )
    );

    //Category action header /function
    const actionColum_cat = [
        {
            field: "action",
            headerName: "Action",
            width: 160,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        {/* <Link to={`/Product_Category/${params.row.id}`} style={{ textDecoration: "none" }} state={{ id: params.row.id }}> */}
                        <button onClick={() => handleOpen(params.row.id, params.row.Cat_name)} className="cat_btn"> Update </button>

                        {/* </Link> */}
                        <div className="deleteButton" onClick={() => handleDelete_Cat(params.row.id)}  > Delete </div>
                    </div>
                );
            },
        }
    ];

    //Category delete data function
    const handleDelete_Cat = async (id) => {
        const defaultOptions = {
            title: (
                <h3>
                    Are you sure?
                </h3>
            ),
            description: (
                <p>Do you really want to delete this records? This process cannot be undone.</p>
            ),
            onSubmit: async () => {
                try {


                    await deleteDoc(doc(db, "Inventory_Category", id));
                    setCat_Data(Cat_data.filter((item) => item.id !== id));

                    toast.success(`Successfully Deleted \nID: ${id}`, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        icon: (
                            <span
                                style={{

                                    background: "#CC0D00",
                                    borderRadius: "50%",
                                    width: "25px",
                                    height: "25px",
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                    lineHeight: "27px",
                                    color: "white",
                                    fontSize: "14px",
                                }}
                            >
                                &#10003;
                            </span>
                        ),
                        style: {
                            background: "gray",
                            color: "white",
                        },
                    });
                } catch (error) {
                    console.log(error);

                    toast.error(`error deleting `, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            },
            onCancel: () => {
                // alert("Cancel")
            },
        };
        onConfirm({
            ...defaultOptions,
            type: "dark",
            btnSubmit: "confirm ",
            btnCancel: "Cancle ",
            keyboardEvents: {
                escape: true,
                submit: true
            }
        })

        //if (window.confirm("Are you sure you want to delete this category?")) {

        // }
    };

    const handleSubmitCat = async (event) => {
        event.preventDefault();

        if (!formData.Cat_name) {
            // alert("Please enter the new Category name");
            toast.warn(`Please enter Category name !`, {
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
        try {
            const productsRef = collection(db, "Inventory_Category");
            const queryRef = query(productsRef, where("user_id", "==", userId), where("Cat_name", "==", formData.Cat_name));

            const querySnapshot = await getDocs(queryRef);
            if (querySnapshot.size > 0) {
                toast.error('Cat_name already exists in the database!', {
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

            // Add the product data to the database
            const newProductRef = await addDoc(collection(db, "Inventory_Category"), {
                ...formData,
                user_id: userId,
                timeStamp: serverTimestamp(),
            });
            console.log("Document written with ID: ", newProductRef.id);
            //nofity

            toast.success(`Successful \nID: ${newProductRef.id}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setFormData(initialFormData);
            console.error(formData);

        } catch (error) {
            console.error("Error adding document: ", error);
            toast.error(`Error adding`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };


    //pasing cat id to open CatUpdate-------------------------------------------------------- 
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedcatname, setSelectedcatname] = useState(null);

    const handleOpen = (id, Cat_name) => {
        setSelectedId(id);
        setSelectedcatname(Cat_name);
        setOpen(true);
    };



    const handleClose = () => {
        setOpen(false);
    };

    //----------------------------------------------------------------------------------------  
    // Function to export all rows to CSV
    const exportAllRows = () => {
        const csvBuilder = new CsvBuilder("Cat_data.csv")
            .setColumns([
                "Categoty Name",
                "Description",
                "Time"

            ]) // Adjust column names as needed
            .addRows(Cat_data.map(row => [
                row.Cat_name,
                row.Description,
                row.timeStamp?.toDate().toLocaleString()
            ])) // Adjust row data as needed
            .exportFile();

    }

    return (
        <div className="Akidu_categories">

            <div className="datatable">
                <div className="Category_all">

                    <div className="all">
                        <div className="Category_all_title">
                            Category All
                            <button className="button" onClick={exportAllRows}><FileDownloadIcon /></button>

                        </div>

                        <DataGrid
                            slots={{ toolbar: GridToolbar }}
                            className="Cat_datagrid"
                            rows={filtered_Category_Data.map((row, index) => ({ ...row, Row_id: index + 1 }))}
                            columns={Cat_columns.concat(actionColum_cat)}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            checkboxSelection
                            getRowId={(Cat_row) => Cat_row.id}
                        />

                    </div>
                    <div className="add">
                        <div className="Category_add">
                            Category Add
                        </div>
                        <div className="cat_add_from">
                            <form onSubmit={handleSubmitCat}>

                                <div className="c_field">
                                    <div>
                                        <label> Category name </label>
                                        <input
                                            type="text"
                                            name="price"
                                            value={formData.Cat_name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, Cat_name: e.target.value })
                                            }
                                            placeholder="Enter Category name...."
                                        />

                                    </div>

                                    <div className="cD_field">
                                        <label> Description </label>
                                        <textarea
                                            type="text"
                                            name="price"
                                            value={formData.Description}
                                            onChange={(e) =>
                                                setFormData({ ...formData, Description: e.target.value })
                                            }
                                            placeholder="Enter Description name...."
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="submit" > Add </button>
                            </form>
                        </div>
                    </div>

                </div>
                <CatUpdate open={open} onClose={handleClose} id={selectedId} Cat_name={selectedcatname} />
            </div>


        </div>
    )
}

export default CategorTable
