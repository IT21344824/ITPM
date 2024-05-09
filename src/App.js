// common-------------------
// import './App.css';
//import Login from "./pages/login/Login";
//import{render} from "react-dom" ;
import { BrowserRouter, Routes, Route, Navigate, } from "react-router-dom";
import { userInput, adminInput } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/home/Home";



//user_magagement
import Login from "./pages/User_pages/login/Login";
import SignUp from "./pages/User_pages/SignUp/SignUp";
import Profile from "./pages/User_pages/Profile/Profile";



import AdminList from "./pages/User_pages/list/AdminList";
import AdminNew from "./pages/User_pages/new/Admin_new";
import Ad_single from "./pages/User_pages/single/Employe";

// Inventory_magagement
import Inventory_Chart from "./pages/Akidu_pages/Charts_Page/Charts_Page";
import Inventory_ID from "./pages/Akidu_pages/single/Product_ID";
import Inventory_New from "./pages/Akidu_pages/new/Product_New";
import Inventory_List from "./pages/Akidu_pages/List/I_List";


// Profit_loss analysis_magagement
import Form from "./components/JR_comp/Analysis_foam1";
import AL_Home from "./pages/JR_pages/Analysis_home";
import AL_List from "./components/JR_comp/AnalusisTable";
import Analysis_Desk from "./pages/JR_pages/Analysis_Desk";


// forecast_magagement
import ForecastList from "./pages/Avishka_pages/Avishka_pages";
import Trendoptimize from "./pages/Avishka_pages/Trendoptimize_page";
import Forecast_New from "./pages/Avishka_pages/new/Add_Prodcut";


// promotional_magagement
import PromotionalList from "./pages/Najas_pages/Najas_pages";
import Promotional_New from "./pages/Najas_pages/new/Add_Discount_P";


// ChatBot_magagement
import ChatBot from "./pages/ChatBot/ChatBot";




function App() {

  const { darkMode } = useContext(DarkModeContext);

  const { currentUser } = useContext(AuthContext)


  // if there is a current user go to children (home page) if not go to log in
  const RequireAuth = ({ children }) => {
    return currentUser ? (children) : <Navigate to="/login" replace={true} />
  }



  return (
    <div className={darkMode ? "app dark" : "app"} >

      <BrowserRouter>
        <Routes>
          <Route path="/" >
            <Route path="login" element={<Login />} />
            <Route path="SignUp" element={<SignUp />} />

            <Route index element={<RequireAuth> <Home userId={currentUser ? currentUser.uid : null} /></RequireAuth>} />
            <Route path="Profile" element={<RequireAuth> <Profile userId={currentUser ? currentUser.uid : null}  /> </RequireAuth>} />


            <Route path="Employees" >
              <Route index element={<RequireAuth> <AdminList /></RequireAuth>} />
              <Route path=":adminsId" element={<RequireAuth> <Ad_single /></RequireAuth>} />
              <Route path="new" element={<RequireAuth> <AdminNew inputs={adminInput} title="Add New Employees" /> </RequireAuth>} />


            </Route>

            {/* --------------------------------------------Inventory start -------------------------------------------------*/}
            <Route path="Inventory" >
              <Route index element={<RequireAuth> <Inventory_Chart userId={currentUser ? currentUser.uid : null} /> </RequireAuth>} />
              <Route path=":productId" element={<RequireAuth> <Inventory_ID userId={currentUser ? currentUser.uid : null} /> </RequireAuth>} />
              <Route path="new" element={<RequireAuth> <Inventory_New userId={currentUser ? currentUser.uid : null} /> </RequireAuth>} />
              <Route path="I_List" element={<RequireAuth> <Inventory_List userId={currentUser ? currentUser.uid : null} /> </RequireAuth>} />

            </Route>
            {/* --------------------------------------------Inventory end -------------------------------------------------*/}




            
             {/* --------------------------------------------PLAnalysis start -------------------------------------------------*/}
             <Route path="PLAnalysis" >
              <Route index element={<RequireAuth> <AL_Home userId={currentUser ? currentUser.uid : null} /> </RequireAuth>} />
              <Route path=":id" element={<RequireAuth> <Analysis_Desk userId={currentUser ? currentUser.uid : null} /> </RequireAuth>} />
              <Route path="list" element={<RequireAuth> <AL_List userId={currentUser ? currentUser.uid : null} /> </RequireAuth>} />

            </Route>
            {/* --------------------------------------------PLAnalysis end -------------------------------------------------*/}



            {/* --------------------------------------------Forecast start -------------------------------------------------*/}
            <Route path="Forecast" >
              {/* <Route index element={<RequireAuth> <ForecastList userId={currentUser ? currentUser.uid : null} /> </RequireAuth>} /> */}
              <Route index element={<RequireAuth> <Trendoptimize userId={currentUser ? currentUser.uid : null} /> </RequireAuth>} />
              <Route path="ForecastNew" element={<RequireAuth> <Forecast_New userId={currentUser ? currentUser.uid : null} /> </RequireAuth>} />

            </Route>
            {/* --------------------------------------------Forecast end -------------------------------------------------*/}



            {/* --------------------------------------------Promo start -------------------------------------------------*/}
            <Route path="Promo" >
              <Route index element={<RequireAuth> <PromotionalList userId={currentUser ? currentUser.uid : null} /> </RequireAuth>} />
              <Route path="PromotionalNew" element={<RequireAuth> <Promotional_New userId={currentUser ? currentUser.uid : null} /> </RequireAuth>} />

            </Route>
            {/* --------------------------------------------Promo end -------------------------------------------------*/}



            {/* --------------------------------------------ChatBot start -------------------------------------------------*/}
            <Route path="ChatBot" >
              <Route index element={<RequireAuth> <ChatBot userId={currentUser ? currentUser.uid : null} /> </RequireAuth>} />
            </Route>
            {/* --------------------------------------------ChatBot end -------------------------------------------------*/}




          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
