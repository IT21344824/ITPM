import "./AnalusisTable.scss";
import { useEffect, useState } from "react";
import { collection, getDoc, getDocs, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { CsvBuilder } from 'filefy';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Link } from "react-router-dom";
import { onConfirm } from 'react-confirm-pro';
import { ToastContainer, toast } from 'react-toastify';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';

const AnalusisTable = ({ userId }) => {

    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    //table headers
    const columns = [
        { field: "Row_id", headerName: "Row", width: 65 },
        { field: "company_name", headerName: "Company Name", width: 130 },
        {
            field: "time_Stamp", headerName: "Time", width: 100,
            valueGetter: (params) => new Date(params.row.time_Stamp?.toDate()).toLocaleString()
        },

    ];




    useEffect(() => {
        const unsub = onSnapshot(
            query(
                collection(db, "AnalysisGen"),
                where("user_id", "==", userId)
            ),
            (snapshot) => {
                let list = []
                snapshot.docs.forEach(doc => {
                    list.push({ id: doc.id, ...doc.data() })
                });
                setData(list);
            }, (error) => {
                console.log(error);
            });
        return () => {
            unsub();
        }
    }, [userId]);


    //table action header /function
    const actionColum = [
        {
            field: "action",
            headerName: "Action",
            width: 125,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to={`/PLAnalysis/${params.row.id}`} style={{ textDecoration: "none" }} state={{ id: params.row.id }}>
                            <div className="viewButton"> View </div>
                        </Link>
                        <div className="deleteButton" onClick={() => handleDelete(params.row.id, params.row.imageName)}> Delete </div>          </div>
                );
            },
        }
    ];

    //all date or search by name / id
    const filteredData = data.filter((row) =>
        searchQuery === "" ||
        ["id", "Product_id", "item_name"].some(
            (field) =>
                row[field] && row[field].toString().toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
        )
    );

    //table delete data function
    const handleDelete = async (id) => {
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
                    await deleteDoc(doc(db, "AnalysisGen", id));
                    setData(data.filter((item) => item.id !== id));

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

                    toast.error(`Error deleting `, {
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

    };

    // Function to export all rows to CSV
    const exportAllRows = () => {
        const csvBuilder = new CsvBuilder("Analysis_form.csv")
            .setColumns([
                "company_name",
                "revenue_Type",
                "revenue_Amount",
                "cost_Type",
                "cost_Amount",
                "expense_Type",
                "expense_Amount",
                "other_Type",
                "other_Amount",
                "total_Revenue",
                "total_Cost",
                "total_Expense",
                "total_Other",
                "time_Stamp"
            ]) // Adjust column names as needed
            .addRows(data.map(row => [
                row.company_name,
                row.revenue_Type,
                row.revenue_Amount,
                row.cost_Type,
                row.cost_Amount,
                row.expense_Type,
                row.expense_Amount,
                row.other_Type,
                row.other_Amount,
                row.total_Revenue,
                row.total_Cost,
                row.total_Expense,
                row.total_Other,
                row.time_Stamp?.toDate().toLocaleString()
            ])) // Adjust row data as needed
            .exportFile();

    }


    return (
        <div className="AnalusisTable_formContainer">
            <div className="newContainer">
                <div className="box">
                    <div className="datatableTitle">
                        All Analysis
                        <button onClick={exportAllRows} className="button" > <FileDownloadIcon /> </button>

                    </div>

                    <DataGrid
                        className="datagrid"
                        rows={filteredData.map((row, index) => ({ ...row, Row_id: index + 1 }))}
                        columns={columns.concat(actionColum)}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        checkboxSelection
                        getRowId={(row) => row.id}

                    />


                </div>
            </div>

        </div>


    )
}

export default AnalusisTable
