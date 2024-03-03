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




function App() {

  const { darkMode } = useContext(DarkModeContext);

  const { currentUser } = useContext(AuthContext)


  // if there is a current user go to children (home page) if not go to log in
  const RequireAuth = ({ children }) => {
    return currentUser ? (children) : <Navigate to="/login" />
  }



  return (
    <div className={darkMode ? "app dark" : "app"} >

      <BrowserRouter>
        <Routes>
          <Route path="/" >
            <Route path="login" element={<Login />} />

            <Route index element={
              <RequireAuth>
                <Home />
              </RequireAuth>} />


            <Route path="Employees" >
              <Route index element={
                <RequireAuth>
                  <AdminList />
                </RequireAuth>} />

              <Route path=":adminsId" element={<RequireAuth>
                <Ad_single />
              </RequireAuth>} />

              <Route path="new" element={<RequireAuth>
                <AdminNew inputs={adminInput} title="Add New Employees" />
              </RequireAuth>} />

            </Route>




          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
