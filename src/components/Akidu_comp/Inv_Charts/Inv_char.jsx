import "./Inv_char.scss";
import React, { useEffect, useState } from 'react';
import { collection, getDocs, getDoc, addDoc, serverTimestamp, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import Chart from 'react-apexcharts';

const Inv_char = ({ userId }) => {
    const [allcatdata, setAllCatData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const inventorySnapshot = await getDocs(query(collection(db, "Inventory"), where("user_id", "==", userId)));
                const inventoryCategorySnapshot = await getDocs(query(collection(db, "Inventory_Category"), where("user_id", "==", userId)));


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
        <div className="Akidu_Inv_char">
            <div className="datatable">
                <div className="datatableTitle">
                    <h1><span> Categories </span></h1>
                    <div className="IpieChar">
                        {allcatdata.length > 0 ? (
                            <Chart
                                type='donut'
                                height='100%'
                                series={allcatdata.map(item => item.count)}
                                options={{
                                    labels: allcatdata.map(item => item.Cat_name),
                                    chart: {
                                        height: '100%',
                                        width: '100%',
                                        toolbar: {
                                            show: true,
                                            offsetX: 0,
                                            offsetY: 0,
                                            tools: {
                                              download: true,
                                              selection: true,
                                              zoom: true,
                                              zoomin: true,
                                              zoomout: true,
                                              pan: true,
                                              reset: true | '<img src="/static/icons/reset.png" width="20">',
                                              customIcons: []
                                            },
                                        }
                                    }
                                }}
                            />
                        ) : (
                            <p>No category</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Inv_char;
