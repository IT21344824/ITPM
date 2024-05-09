import "./Analysischart.scss";
import React, { useEffect, useRef, useState } from 'react';
import { collection, getDocs, getDoc, addDoc, serverTimestamp, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebase";
import Chart from 'react-apexcharts';
import  exportChart  from 'react-apexcharts';


const Analy_char = ({ userId, grossProfit, operatingIncome, netIncomeBeforeTaxes, incomeTaxes, netIncomeAfterTaxes }) => {

    const [chartData, setChartData] = useState([]);



    useEffect(() => {
        // Define chart data based on the provided props
        const newData = [
            { label: "Gross Profit", value: grossProfit },
            { label: "Operating Income", value: operatingIncome },
            { label: "Net Income Before Taxes", value: netIncomeBeforeTaxes },
            { label: "Income Taxes", value: incomeTaxes },
            { label: "Net Income After Taxes", value: netIncomeAfterTaxes }
        ];
        setChartData(newData);
    }, [grossProfit, operatingIncome, netIncomeBeforeTaxes, incomeTaxes, netIncomeAfterTaxes]);

   
    return (
        <div className="Analy_char">
            <div className="datatable">
                <div className="datatableTitle">
                    <h1><span>Summary Chart</span></h1>
                    <div className="donutChart">
                        <Chart
                            type='donut'
                            height='400'
                            series={chartData.map(item => item.value)}
                            options={{
                                labels: chartData.map(item => item.label),
                                chart: {
                                    width: '100%',
                                    height: '100%',
                                    type: 'donut',
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
                                },
                                plotOptions: {
                                    pie: {
                                        donut: {
                                            size: '65%'
                                        }
                                    }
                                },
                                legend: {
                                    position: 'bottom'
                                },

                            }}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analy_char;
