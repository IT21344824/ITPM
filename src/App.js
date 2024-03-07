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


import AdminList from "./pages/User_pages/list/AdminList";
import AdminNew from "./pages/User_pages/new/Admin_new";
import Ad_single from "./pages/User_pages/single/Employe";

// Inventory_magagement
import Inventory_List from "./pages/Akidu_pages/list/Product";
import Inventory_ID from "./pages/Akidu_pages/single/Product_ID";
import Inventory_New from "./pages/Akidu_pages/new/Product_New";

// Profit_loss analysis_magagement
import P_L_List from "./pages/JR_pages/JR_page_1";


// forecast_magagement
import ForecastList from "./pages/Avishka_pages/Avishka_pages";


// promotional_magagement
import PromotionalList from "./pages/Najas_pages/Najas_pages";




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

            <Route index element={<RequireAuth> <Home userId={currentUser ? currentUser.uid : null} /></RequireAuth>} />

            <Route path="Employees" >
              <Route index element={<RequireAuth> <AdminList /></RequireAuth>} />
              <Route path=":adminsId" element={<RequireAuth> <Ad_single /></RequireAuth>} />
              <Route path="new" element={<RequireAuth> <AdminNew inputs={adminInput} title="Add New Employees" /> </RequireAuth>} />

            </Route>

            {/* --------------------------------------------Inventory start -------------------------------------------------*/}
            <Route path="Inventory" >
              <Route index element={<RequireAuth> <Inventory_List userId={currentUser ? currentUser.uid : null} /> </RequireAuth>} />
              <Route path=":productId" element={<RequireAuth> <Inventory_ID userId={currentUser ? currentUser.uid : null} /> </RequireAuth>} />
              <Route path="new" element={<RequireAuth> <Inventory_New userId={currentUser ? currentUser.uid : null} /> </RequireAuth>} />
            </Route>
            {/* --------------------------------------------Inventory end -------------------------------------------------*/}




            {/* --------------------------------------------PLAnalysis start -------------------------------------------------*/}
            <Route path="PLAnalysis" >
              <Route index element={<RequireAuth> <P_L_List userId={currentUser ? currentUser.uid : null} /> </RequireAuth>} />
            </Route>
            {/* --------------------------------------------PLAnalysis end -------------------------------------------------*/}



            {/* --------------------------------------------Forecast start -------------------------------------------------*/}
            <Route path="Forecast" >
              <Route index element={<RequireAuth> <ForecastList userId={currentUser ? currentUser.uid : null} /> </RequireAuth>} />
            </Route>
            {/* --------------------------------------------Forecast end -------------------------------------------------*/}



            {/* --------------------------------------------Promo start -------------------------------------------------*/}
            <Route path="Promo" >
              <Route index element={<RequireAuth> <PromotionalList userId={currentUser ? currentUser.uid : null} /> </RequireAuth>} />
            </Route>
            {/* --------------------------------------------Promo end -------------------------------------------------*/}




          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
