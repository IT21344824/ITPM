import "./top_Additional.scss";
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
import { db } from "../../../firebase";
import { Link } from "react-router-dom";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import PDFFileProdcuts from "../../PDFFiles/ProdcutsPdf";
import PDFFileCoach from "../../PDFFiles/CoachPdf";
import CategoryIcon from '@mui/icons-material/Category';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import ReportIcon from '@mui/icons-material/Report';
import ArchiveIcon from '@mui/icons-material/Archive';
import PaidIcon from '@mui/icons-material/Paid';
import PreviewIcon from '@mui/icons-material/Preview';
import { PDFDownloadLink, Document, Page, PDFViewer, toStream } from '@react-pdf/renderer';



const Top_Additional = ({ userId }) => {
    const [diff, setDiff] = useState(null);


    const [itemCount, setItemCount] = useState(0);
    const [catCount, setCatCount] = useState(0);

    const [totalSum, setTotalSum] = useState(0);
    const [totalDamage, setTotalDamage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const inventoryQuery = query(collection(db, "Inventory"), where("user_id", "==", userId));
                const inventorySnapshot = await getDocs(inventoryQuery);
                const count = inventorySnapshot.size; // Get the number of documents in the snapshot
                setItemCount(count);

                 // Fetch total sum
                 const inventoryDocs = inventorySnapshot.docs;
                 let sum = 0;
                 inventoryDocs.forEach(doc => {
                     const data = doc.data();
                     if (data.Total) {
                         sum += data.Total;
                     }
                 });
                 setTotalSum(sum);


                  // Fetch total Damage goods
                  const inventoryDamageDocs = inventorySnapshot.docs;
                  let Damagesum = 0;
                  inventoryDamageDocs.forEach(doc => {
                      const data = doc.data();
                      if (data.defects) {
                        Damagesum += data.defects;
                      }
                  });
                  setTotalDamage(Damagesum);

                const categoryQuery = query(collection(db, "Inventory_Category"), where("user_id", "==", userId));
                const categorySnapshot = await getDocs(categoryQuery);
                const catcount = categorySnapshot.size; // Get the number of documents in the snapshot
                setCatCount(catcount);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData(); // Fetch data initially

        const inventoryUnsub = onSnapshot(collection(db, "Inventory"), () => {
            fetchData(); // Fetch data whenever there's a change
        });

        const categoryUnsub = onSnapshot(collection(db, "Inventory_Category"), () => {
            fetchData(); // Fetch data whenever there's a change
        });

        // Cleanup function
        return () => {
            inventoryUnsub();
            categoryUnsub();
        };
    }, [userId]);



    //-------------------------------------------------start of product -----------------------------------------------------------------



    //--------------------------------------------------------end of product------------------------------------------------------------------------



    return (
        <div className='Akidu_top_Additional'>

            <div className="sec">
                <div className="row1">
                    <span className="title">    Total Items   </span>
                    <div className={`percentage ${diff < 0 ? "negative" : "positive"}`}>
                        {diff < 0 ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                        {diff} %
                    </div>
                </div>
                <div className="row2">
                    <span className="counter">   {itemCount}    </span>

                </div>
                <div className="row3">

                    <ArchiveIcon className="icon"
                        style={{ color: "purple", backgroundColor: " rgba(255, 0, 0, 0.2)", }} />
                </div>

            </div>
            <div className="sec">
                <div className="row1">
                    <span className="title">     Total Categories   </span>
                    <div className={`percentage ${diff < 0 ? "negative" : "positive"}`}>
                        {diff < 0 ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                        {diff} %
                    </div>
                </div>
                <div className="row2">
                    <span className="counter">  {catCount}  </span>

                </div>
                <div className="row3">

                    <CategoryIcon className="icon"
                        style={{ color: "purple", backgroundColor: " rgba(218, 165, 32, 0.2)", }} />
                </div>

            </div>
            <div className="sec">
                <div className="row1">
                    <span className="title">  Total Asset Price  </span>
                    <div className={`percentage ${diff < 0 ? "negative" : "positive"}`}>
                        {diff < 0 ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                        {diff} %
                    </div>
                </div>
                <div className="row2">
                    <span className="counter">   {totalSum}   </span>

                </div>
                <div className="row3">

                    <PaidIcon className="icon"
                        style={{ color: "purple", backgroundColor: " rgba(0, 128, 0, 0.2)", }} />
                </div>

            </div>




            <div className="sec">
                <div className="row1">
                    <span className="title">    Total Damage Goods   </span>
                    <div className={`percentage ${diff < 0 ? "negative" : "positive"}`}>
                        {diff < 0 ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                        {diff} %
                    </div>
                </div>
                <div className="row2">
                    <span className="counter"> {totalDamage}   </span>

                </div>
                <div className="row3">

                    <ReportIcon className="icon"
                        style={{ color: "purple", backgroundColor: " rgba(128, 0, 128, 0.2)", }} />
                </div>

            </div>

        </div>
    )
}

export default Top_Additional
