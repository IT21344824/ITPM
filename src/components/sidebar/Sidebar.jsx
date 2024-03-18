import "./sidebar.scss";
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import BookIcon from '@mui/icons-material/Book';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Group';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { Link , useNavigate} from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';
import AddchartIcon from '@mui/icons-material/Addchart';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';


const Sidebar = ({ userId }) => {

    // console.log("side id",userId);

    const { dispatch: darkModeDispatch } = useContext(DarkModeContext);
    const { uid } = useContext(AuthContext);

    //selected link 
    const [clickedElement, setClickedElement] = useState(
        localStorage.getItem("clickedElement") || ""
    );

    const handleClickedElement = (element) => {
        localStorage.setItem("clickedElement", element);
        setClickedElement(element);
    };

    // log out--
    const navigate = useNavigate();
    const { dispatch: authDispatch } = useContext(AuthContext);

    const onlogOut = ()=>{
        authDispatch({type:"LOGOUT" });
        navigate("/");
    }


    return (
        <div className="sidebar">
            <div className="top">
                <Link to="/" style={{ textDecoration: "none" }} >
                    <span className="logo"> Elite</span>
                    <img src="/logo.jpeg" alt="" className="logo" />
                </Link>

            </div>
            <hr />
            <div className="center">
                <ul>
                    <p className="title"> MAIN </p>
                    <Link to="/" style={{ textDecoration: "none" }} >
                        <li onClick={() => handleClickedElement("Dashboard")} className={clickedElement === "Dashboard" ? "selected" : ""}>

                            <DashboardIcon className="iocn" />
                            <span> Dashboard </span>
                        </li>
                    </Link>


                    <p className="title"> LIST </p>
                    {/* ----------------------------list start ----------------*/}


                    


                   


                    <Link to="/Employees" style={{ textDecoration: "none" }} >
                        <li onClick={() => handleClickedElement("Employees")} className={clickedElement === "Employees" ? "selected" : ""}>
                            <EngineeringIcon className="iocn" />
                            <span> Employees </span>
                        </li>
                    </Link>

                    <Link to="/Inventory" style={{ textDecoration: "none" }} >
                        <li onClick={() => handleClickedElement("Inventory")} className={clickedElement === "Inventory" ? "selected" : ""}>
                            <ProductionQuantityLimitsIcon className="iocn" />
                            <span> Inventory </span>
                        </li>
                    </Link>

                    <Link to="/PLAnalysis" style={{ textDecoration: "none" }} >
                        <li onClick={() => handleClickedElement("PLAnalysis")} className={clickedElement === "PLAnalysis" ? "selected" : ""}>
                            <ProductionQuantityLimitsIcon className="iocn" />
                            <span> PLAnalysis </span>
                        </li>
                    </Link>
                    
                    <Link to="/Forecast" style={{ textDecoration: "none" }} >
                        <li onClick={() => handleClickedElement("Forecast")} className={clickedElement === "Forecast" ? "selected" : ""}>
                            <ProductionQuantityLimitsIcon className="iocn" />
                            <span> Forecast </span>
                        </li>
                    </Link>

                    <Link to="/Promo" style={{ textDecoration: "none" }} >
                        <li onClick={() => handleClickedElement("Promo")} className={clickedElement === "Promo" ? "selected" : ""}>
                            <ProductionQuantityLimitsIcon className="iocn" />
                            <span> Promo </span>
                        </li>
                    </Link>

                    <Link to="/ChatBot" style={{ textDecoration: "none" }} >
                        <li onClick={() => handleClickedElement("ChatBot")} className={clickedElement === "ChatBot" ? "selected" : ""}>
                            <ProductionQuantityLimitsIcon className="iocn" />
                            <span> ChatBot </span>
                        </li>
                    </Link>

                    <p className="title"> USEFULL </p>
                    {/* ----------------------------Usefull start ----------------*/}


                    <Link to="/Contact_Us" style={{ textDecoration: "none" }} >
                    <li onClick={() => handleClickedElement("Contact Us")} className={clickedElement === "Contact Us" ? "selected" : ""}>
                        <ContactPhoneIcon className="iocn" />
                        <span> Contact Us </span>
                    </li>
                    </Link>

                    
                    <Link to="/Applycations" style={{ textDecoration: "none" }} >
                    <li onClick={() => handleClickedElement("Applycations")} className={clickedElement === "Applycations" ? "selected" : ""}>
                        <AddchartIcon className="iocn" />
                        <span> Applycations </span>
                    </li>
                    </Link>
                   
                    {/* -----------------------------Usefull end----------------------------  */}




                    <p className="title"> SERVICE </p>
                    {/* ------------------------------SERVICE start------------------------- */}


                   

                    <li onClick={() => handleClickedElement("Notifications")} className={clickedElement === "Notifications" ? "selected" : ""}>
                        <CircleNotificationsIcon className="iocn" />
                        <span> Notifications </span>
                    </li>

                    
                    {/*---------------------------------- SERVICE end---------------------------- */}




                    <p className="title"> USER </p>
                    {/*----------------------------------- USER start -------------------------------*/}


                    <li onClick={() => handleClickedElement("Profile")} className={clickedElement === "Profile" ? "selected" : ""}>
                        <AccountCircleIcon className="iocn" />
                        <span> Profile </span>
                    </li>

                    <li onClick={() => handleClickedElement("Logout")} className={clickedElement === "Logout" ? "selected" : ""}>
                        <LogoutIcon className="iocn" />
                        <span onClick={()=> onlogOut()}> Logout </span>
                    </li>
                    {/*------------------------------------ USER end--------------------------------- */}
                </ul>


                <div className="bottem">
                    <div className="colorOption" onClick={() => darkModeDispatch({ type: "LIGHT" })}></div>
                    <div className="colorOption" onClick={() => darkModeDispatch({ type: "DARK" })}></div>

                </div>

            </div>

        </div>
    )
}

export default Sidebar
