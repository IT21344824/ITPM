import "./Inv_char.scss";
import React, { useEffect, useState } from 'react';
import { collection, getDocs, getDoc, addDoc, serverTimestamp, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import Chart from 'react-apexcharts';

const Inv_char = () => {
    const [allcatdata, setAllCatData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const inventorySnapshot = await getDocs(collection(db, "Inventory"));
                const inventoryCategorySnapshot = await getDocs(collection(db, "Inventory_Category"));

                let itemCounts = {};

                inventorySnapshot.forEach(doc => {
                    const data = doc.data();
                    const item_typeRef = data.item_type;
                    itemCounts[item_typeRef.id] = (itemCounts[item_typeRef.id] || 0) + 1;
                });

                const aggregatedCatData = [];
                inventoryCategorySnapshot.forEach(doc => {
                    const { Cat_name } = doc.data();
                    const count = itemCounts[doc.id] || 0;
                    aggregatedCatData.push({ Cat_name, count });
                });

                setAllCatData(aggregatedCatData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const inventoryUnsub = onSnapshot(collection(db, "Inventory"), () => {
            fetchData();
        });

        const categoryUnsub = onSnapshot(collection(db, "Inventory_Category"), () => {
            fetchData();
        });

        // Cleanup function
        return () => {
            inventoryUnsub();
            categoryUnsub();
        };
    }, []);

    return (
        <div className="Inv_char">
            <div className="datatable">
                <div className="datatableTitle">
                    <h1><span> Categories </span></h1>
                    <div className="IpieChar">
                        <Chart
                            type='donut'
                            height='100%'
                            series={allcatdata.map(item => item.count)}
                            options={{
                                labels: allcatdata.map(item => item.Cat_name),
                                chart: {
                                    height: '100%',
                                    width: '100%'
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Inv_char;
