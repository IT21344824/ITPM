import "./widget.scss";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import { color } from "@mui/system";
import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import PDFFileProdcuts from "../PDFFiles/ProdcutsPdf";
import PDFFileCoach from "../PDFFiles/CoachPdf";

import PreviewIcon from '@mui/icons-material/Preview';
import { PDFDownloadLink, Document, Page, PDFViewer, toStream } from '@react-pdf/renderer';



const Widget = ({ type }) => {

    const [amount, setAmount] = useState(null);
    const [diff, setDiff] = useState(null);
    const [Cat_Count, setCat_Count] = useState(null);

    let data;

    //tempory 



    switch (type) {
        case "user":
            data = {
                title: "Users",
                navigate: "/Users",
                link: "see all users",
                query: "Users",
                icon: <AccountBoxOutlinedIcon className="icon"
                    style={{ color: "crimson", backgroundColor: " rgba(255, 0, 0, 0.2)", }} />,
            };
            break;

        case "product":
            data = {
                title: "PRODUCTS",
                subTitle1: "Products",
                subTitle2: "Category",

                navigate: "/products",
                link: "View all product & Category",
                query: "products",
                icon: (
                    <ProductionQuantityLimitsIcon
                        className="icon"
                        style={{ color: "goldenrod", backgroundColor: " rgba(218, 165, 32, 0.2)" }}
                    />
                ),
                category: "Product_Category", // Add category field
            };
            break;

        case "case_3":
            data = {
                title: "COACHES",
                navigate: "/users",
                link: "see all coaches",
                query: "Coaches",
                icon: <SportsGymnasticsIcon className="icon"
                    style={{ color: "green", backgroundColor: " rgba(0, 128, 0, 0.2)", }} />,
            };
            break;

        case "case_4":
            data = {
                title: "Profit",
                navigate: "/users",
                link: "View all orders",
                query: "payment.conunt",
                icon: <DeliveryDiningIcon className="icon"
                    style={{ color: "purple", backgroundColor: " rgba(128, 0, 128, 0.2)", }} />,
            };
            break;
        default:
            break;
    }



    //-------------------------------------------------start of product -----------------------------------------------------------------
    useEffect(() => {
        const fetchData = async () => {
            const today = new Date();
            const lastMonth = new Date(new Date().setMonth(today.getMonth() - 1));
            const prevMonth = new Date(new Date().setMonth(today.getMonth() - 2));

            const lastMonthQuery = query(
                collection(db, data.query),
                where("timeStamp", "<=", today),
                where("timeStamp", ">", lastMonth)
            );

            const prevMonthQuery = query(
                collection(db, data.query),
                where("timeStamp", "<=", lastMonth),
                where("timeStamp", ">", prevMonth)
            );

            const size = query(
                collection(db, data.query),
            );

            const lastMonthData = await getDocs(lastMonthQuery);
            const prevMonthData = await getDocs(prevMonthQuery);

            setDiff(((lastMonthData.docs.length - prevMonthData.docs.length) / prevMonthData.docs.length * 100).toFixed(1));

            const unsubLastMonth = onSnapshot(size, (snapshot) => {
                const size = snapshot.size;
                setAmount(size);
            });


            return () => {
                unsubLastMonth();
            };
        };

        if (!data.query) {
            // if the collection path is empty, return early and don't make the query
            return;
        }

        fetchData();

    }, [data.query, db]);



    // product categoty
    useEffect(() => {
        const unsub = onSnapshot(
            collection(db, "Product_Category"),
            (snapshot) => {
                setCat_Count(snapshot.size);
            },
            (error) => {
                console.log(error);
            }
        );
        return () => {
            unsub();
        };
    }, []);

    //--------------------------------------------------------end of product------------------------------------------------------------------------




    return (
        <div className="widget">

            <div className="left">

                <span className="title"> {data.title}

                    <span className="">
                        {data.title === "PRODUCTS" ? (
                            <div className="DUrl">
                                <PDFDownloadLink document={<PDFFileProdcuts />} filename="FORM">
                                    {({ loading }) => (loading ? <button>...</button> : <button>   <DownloadForOfflineIcon /></button>)}
                                </PDFDownloadLink>
                                {/* <PreviewIcon/> */}
                            </div>
                        ) : data.title === "Users" ? (
                            <div className="">
                                {/* Render content for USERS */}
                            </div>
                        ) : data.title === "COACHES" ? (
                            <div className="DUrl">
                                <PDFDownloadLink document={<PDFFileCoach />} filename="FORMCoach">
                                    {({ loading }) => (loading ? <button>...</button> : <button>   <DownloadForOfflineIcon /></button>)}
                                </PDFDownloadLink>
                                {/* <PreviewIcon/> */}
                            </div>
                        ) : data.title === "Profit" ? (
                            <div className="">
                                {/* Render content for COACH */}
                            </div>
                        ) : (
                            "?"
                        )}
                    </span>

                </span>
                <span className="counter">
                    {data.title === "PRODUCTS" ? (
                        <div className="sub">
                            <div className="th">
                                <span className="sub_title1"> {data.subTitle1} </span>
                                <span className="sub_title2">{data.subTitle2} </span>
                            </div>
                            <div className="tr">
                                <span className="sub_amount_1"> {amount ? amount : "?"} </span>

                                <span className="sub_amount_2"> {Cat_Count ? Cat_Count : "?"} </span>
                            </div>
                        </div>
                    ) : data.title === "Users" ? (
                        <div className="">
                           {amount ? amount : "?"}
                        </div>
                    ) : data.title === "COACHES" ? (
                        <div className="">
                           {amount ? amount : "?"}
                        </div>
                    ) : data.title === "Profit" ? (
                        <div className="">
                           {amount ? amount : "?"}
                        </div>
                    ) : (
                        amount ? amount : "?"
                    )}
                    
                </span>

                <span className="link">
                    <Link to={data.navigate} className="link">
                        {data.link}
                    </Link>
                </span>
            </div>
            <div className="right">
                <div className={`percentage ${diff < 0 ? "negative" : "positive"}`}>
                    {diff < 0 ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                    {diff} %
                </div>

                {data.icon}

            </div>

        </div>
    )
}

export default Widget
