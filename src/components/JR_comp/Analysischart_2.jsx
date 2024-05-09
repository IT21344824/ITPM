import "./Analysischart_2.scss";
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { collection, getDocs, getDoc, addDoc, serverTimestamp, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebase";

const Analysischart_2 = ({ userId, operatingMargin, EBITDA, ROI, breakEvenPoint, contributionMargin }) => {

    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        // Define chart data based on the provided props
        const newData = [
            { label: "Operating Margin", value: operatingMargin },
            { label: "EBITDA", value: EBITDA },
            { label: "ROI", value: ROI },
            { label: "Break Even Point", value: breakEvenPoint },
            { label: "Contribution Margin", value: contributionMargin },
        ];
        setChartData(newData);
    }, [operatingMargin, EBITDA, ROI, breakEvenPoint, contributionMargin]);

    return (
        <div className="Analy_char_2">
            <div className="datatable">
                <div className="datatableTitle">
                    <h1><span>Summary Chart</span></h1>
                    <div className="barChart">
                        <Chart
                            type='bar'
                            height='400'
                            series={[{ data: chartData.map(item => item.value.toFixed(1)) }]} // Format data values to one decimal point
                            options={{
                                xaxis: {
                                    categories: chartData.map(item => item.label),
                                    title: {
                                        text: 'Additional Details'
                                    }
                                },
                                yaxis: {
                                    title: {
                                        text: 'Value'
                                    },
                                    labels: {
                                        formatter: function (value) {
                                            return value.toFixed(1); // Formats the y-axis labels to one decimal point
                                        }
                                    }
                                },
                                plotOptions: {
                                    bar: {
                                        horizontal: false,
                                    }
                                },
                                legend: {
                                    position: 'bottom'
                                }
                                
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analysischart_2;
