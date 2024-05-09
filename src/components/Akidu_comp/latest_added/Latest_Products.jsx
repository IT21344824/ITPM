import "./Latest_Products.scss";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from "react-router-dom";
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../../firebase';


const Latest_Products = ({ userId }) => {

  const [newproducts, setNewProducts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const prevMonth = new Date(new Date().setMonth(today.getMonth() - 2));
      const prevMonthQuery = query(
        collection(db, 'Inventory'),
        where('user_id', '==', userId), // Filter by user_id
        where('timeStamp', '>', prevMonth),
        orderBy('timeStamp', 'desc'),  // sort by timestamp in descending order
        // limit(3) // limit to only the latest 3 products
      );

      const unsub = onSnapshot(prevMonthQuery, (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const timestamp = data.timeStamp;
          const date = new Date(timestamp.toMillis());
          list.push({
            id: doc.id,
            Product_id: data.Product_id,
            item_name: data.item_name,
            img: data.img,
            date: date.toLocaleString(), // format the date as a string
            action: data.action,
          });
        });
        setNewProducts(list);
      }, (error) => {
        console.log(error);
      });

      return () => {
        unsub();
      };
    };

    fetchData();
  }, []);


  console.log(newproducts);

  //table headers
  const columns = [
    { field: "Row_id", headerName: "Row", width: 30, className: "tb_LP" },
    { field: "Product_id", headerName: "Brand", width: 130, className: "tb_LP" },
    {
      field: "image",
      headerName: "Image",
      width: 130,
      renderCell: (params) => {
        const firstImg = params.row.img[0];
        return (
          <div className="cellWrapper">
            <img className="image" src={firstImg} alt="" />
            {params.row.item_name}
          </div>
        );
      },
      className: "tb_LP"
    },
    { field: "date", headerName: "date", width: 180, className: "tb_LP" },

  ];




  //table action header /function
  const actionColum = [
    {
      field: "action",
      headerName: "Action",
      width: 90,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/Inventory/${params.row.id}`} style={{ textDecoration: "none" }} state={{ id: params.row.id }}>
              <div className="viewButton"> View </div>
            </Link>
          </div>
        );
      },
    }
  ];


  return (

    <div className="Akidu_Latest_Products">
      <h1> <span> Latest Added Items </span> </h1>
      <div className="simple_table">
        <DataGrid
          className="datagrid"
          rows={newproducts.map((row, index) => ({ ...row, Row_id: index + 1 }))}
          columns={columns.concat(actionColum)}
          pageSize={6}   // pageSize or rowsPerPageOptions 2ken ekai puluwan
          //rowsPerPageOptions={[3,5,10]}
          checkboxSelection
          getRowId={(row) => row.id}
        />
      </div>

    </div>
  )
}

export default Latest_Products
