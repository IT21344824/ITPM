import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDoc, getDocs, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { Document, Page, Text, View, StyleSheet, toStream } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "./AllProdcuts.scss";

const AllProdcuts = () => {

    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

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
            return item_type_data.Cat_name.toString();
        } catch (error) {
            console.error(error);
            return "";
        }
    };

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
            });
            setData(list);
        }, (error) => {
            console.log(error);
        });
        return () => {
            unsub();
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const promises = data.map(async (row) => {
                const item_type_ref = row.item_type;
                if (item_type_ref && !itemTypeData[row.id]) {
                    const itemType = await getItemTypeData(item_type_ref);
                    setItemTypeData((prevData) => ({
                        ...prevData,
                        [row.id]: itemType,
                    }));
                }
            });
            await Promise.all(promises);
        };
        fetchData();
    }, [data, itemTypeData]);

    //all date or search by name / id
    const filteredData = data.filter((row) =>
        searchQuery === "" ||
        ["id", "Product_id", "item_name"].some(
            (field) =>
                row[field] && row[field].toString().toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
        )
    );

    //-------------------------------------------------------styles-------------------------------------------------------------------------------------------


    return (
        <div className='center'>
            <div className="middile">

            
            <TableContainer component={Paper} className=" table" >
                <Table sx={{ minWidth: 50 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="tableCell"> ROW </TableCell>
                            <TableCell className="tableCell"> BID </TableCell>
                            <TableCell className="tableCell"> Brand </TableCell>
                            <TableCell className="tableCell"> Img & Name </TableCell>

                            <TableCell className="tableCell"> Quntity </TableCell>
                            <TableCell className="tableCell"> Type </TableCell>
                            <TableCell className="tableCell"> Status </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((row, index) => (
                            <TableRow key={row.id} >

                                <TableCell className="tableCell"> {index + 1} </TableCell>
                                <TableCell className="tableCell"> {row.id} </TableCell>
                                <TableCell className="tableCell"> {row.Product_id} </TableCell>
                                <TableCell >
                                    <div className="cellWrapper">
                                        <img src={row.img} alt="" className="image" />
                                        {row.item_name}
                                    </div>
                                </TableCell>

                                <TableCell className="tableCell" > {row.qty} </TableCell>
                                <TableCell className="tableCell" > {itemTypeData[row.id]} </TableCell>
                                {/* Access the item type data using itemTypeData */}
                                <TableCell className="tableCell" > <div className={`status ${row.status}`}> {row.status} </div></TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            </div>
        </div>
    )
}

export default AllProdcuts
