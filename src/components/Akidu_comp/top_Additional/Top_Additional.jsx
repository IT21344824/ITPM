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

import PreviewIcon from '@mui/icons-material/Preview';
import { PDFDownloadLink, Document, Page, PDFViewer, toStream } from '@react-pdf/renderer';



const Top_Additional = ({ userId }) => {

    const [amount, setAmount] = useState(null);
    const [diff, setDiff] = useState(null);
    const [Cat_Count, setCat_Count] = useState(null);

    let data;

    //tempory 





    //-------------------------------------------------start of product -----------------------------------------------------------------



    //--------------------------------------------------------end of product------------------------------------------------------------------------



    return (
        <div className='Akidu_top_Additional'>
            <div className="sec">
                <div className="left">


                </div>
                <div className="right">
                    <div className={`percentage ${diff < 0 ? "negative" : "positive"}`}>
                        {diff < 0 ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                        {diff} %
                    </div>

                </div>
            </div>

            <div className="sec">
                <div className="left">


                </div>
                <div className="right">
                    <div className={`percentage ${diff < 0 ? "negative" : "positive"}`}>
                        {diff < 0 ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                        {diff} %
                    </div>

                </div>
            </div>

            <div className="sec">
                <div className="left">


                </div>
                <div className="right">
                    <div className={`percentage ${diff < 0 ? "negative" : "positive"}`}>
                        {diff < 0 ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                        {diff} %
                    </div>

                </div>
            </div>

            <div className="sec">
                <div className="left">


                </div>
                <div className="right">
                    <div className={`percentage ${diff < 0 ? "negative" : "positive"}`}>
                        {diff < 0 ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                        {diff} %
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Top_Additional
