import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDoc, getDocs, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';


const ProdcutsPdf = () => {

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

    
    //-------------------------------------------------------styles-------------------------------------------------------------------------------------------



    const styles = StyleSheet.create({
        body: {
            paddingTop: 35,
            paddingBottom: 65,
            paddingHorizontal: 35,
        },
        title: {
            fontSize: 24,
            textAlign: "center",

        },
        text: {
            margin: 12,
            fontSize: 14,
            textAlign: "justify",


        },
        image: {
            marginVertical: 15,
            marginHorizontal: 100,
        },
        header: {
            fontSize: 12,
            marginBottom: 20,
            textAlign: "center",
            color: "grey",

        },
        bot: {
            marginBottom: 20,

        },
        pageNumber: {
           
            textAlign: "center",
          
        },
       
    });


    return (
        <Document>
            <Page style={styles.body}>
                <View style={styles.header} >
                  

                    {data.map((row, index) => (
                        <View key={row.id}>
                            <Text className="tableCell" style={styles.header} >{index + 1}</Text>
                            <Text className="tableCell"> BID : {row.id}</Text>
                            <Text className="tableCell">  Brand : {row.Product_id}</Text>

                            <Text> Name :{row.item_name}</Text>

                            <Text className="tableCell"> Quantity : {row.qty}</Text>
                            <Text className="tableCell"> Type : {itemTypeData[row.id]}</Text>
                            <View className={`status ${row.status}`} >
                                <Text> Status : {row.status}</Text>
                            </View>
                            <Text className="tableCell" style={styles.bot} > description : {row.description}</Text>
                        </View>
                    ))}

                    {/* <Text style={styles.pageNumber}
                        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed /> */}
                </View>
            </Page>
        </Document>
    );
};




export default ProdcutsPdf;
