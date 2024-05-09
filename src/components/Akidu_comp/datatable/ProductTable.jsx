import "./productTable.scss";
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDoc, getDocs, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import CatUpdate from '../category_update/CatUpdate'; // pass the page , id to update page
//notify-
//import NofitySuc from "../../../components/notify_status/nofity";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { storage } from "../../../firebase";

//delete
import { onConfirm } from 'react-confirm-pro';
import { ref, deleteObject, getStorage } from "firebase/storage";
//--
import { CsvBuilder } from 'filefy';


const ProductTable = ({ id, userId }) => {
  //nofify--
  const notifyStyle = {
    whiteSpace: 'pre-line'
  }
  const progressStyle = {
    background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)'
  }

  //---

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  //----------------------------------------------------------Category------------------------------------------------------------



  // ------------------------------------------------------table functions----------------------------------------------------------------

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
      toast.error(`Error : ${error} `, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return "";
    }
  };

  //table headers
  const columns = [
    { field: "Row_id", headerName: "Row", width: 65 },
    { field: "Product_id", headerName: "Brand", width: 150 },
    { field: "item_name", headerName: "Item Name", width: 150 },
    {
      field: "image",
      headerName: "Image",
      width: 130,
      renderCell: (params) => {
        const firstImg = params.row.img[0];
        return (
          <div className="cellWithImg">
            <img className="cellImg" src={firstImg} alt="" />
          </div>
        );
      },
    },
    {
      field: "item_type",
      headerName: "Item Type",
      width: 150,
      valueGetter: (params) => {
        const item_type_ref = params.row.item_type;
        if (!item_type_ref) {
          return "";
        }
        if (itemTypeData[params.row.id]) {
          return itemTypeData[params.row.id];
        }
        getItemTypeData(item_type_ref).then((data) => {
          setItemTypeData((prevData) => ({ ...prevData, [params.row.id]: data }));
        });
        return "[Loading]";
      },
    },
    { field: "qty", headerName: "Quantity", width: 110 },
    { field: "price", headerName: "Price", width: 110 },

    { field: "defects", headerName: "Defects / Damaged", width: 160 },

  ];


  // show all data

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, "Inventory"),
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
  // console.log(userId);


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
          await deleteDoc(doc(db, "Inventory", id));
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
  //table action header /function
  const actionColum = [
    {
      field: "action",
      headerName: "Action",
      width: 160,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/Inventory/${params.row.id}`} style={{ textDecoration: "none" }} state={{ id: params.row.id }}>
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

  const exportInventoryRows = async () => {
    const rows = await Promise.all(data.map(async (row) => ([
      row.Product_id,
      row.item_name,
      await getItemTypeData(row.item_type),
      row.price,
      row.qty,
      row.Total,
      row.L_Revenue,
      row.description,
      row.defects,
      row.timeStamp?.toDate().toLocaleString()
    ])));

    const csvBuilder = new CsvBuilder("Inventory_data.csv")
      .setColumns([
        "Brand",
        "Item Name",
        "Type",
        "Price",
        "Quantity",
        "Total",
        "Lost Revenue",
        "Description",
        "Defects",
        "Time"
      ])
      .addRows(rows)
      .exportFile();
  }


  return (
    <div className="Akidu_pro_table">

      <div className="datatable">
        <div className="datatableTitle">
          Add Item to Inventory
          <Link to="/Inventory/new" className="link" >
            Add New
          </Link>
        </div>


        <div className="InventorydatatableTitle">
          Inventory
          <button className="button" onClick={exportInventoryRows}><FileDownloadIcon /> </button>
        </div>

        <div className="search_table">
          <input
            type="text"
            placeholder="search Product.."
            className="input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
  )
}

export default ProductTable
