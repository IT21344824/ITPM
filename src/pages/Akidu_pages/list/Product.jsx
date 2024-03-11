import "./Product.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";

import Inventory_Table from "../../../components/Akidu_comp/datatable/ProductTable";
import Inventory_Charts from "../../../components/Akidu_comp/Inv_Charts/Inv_char";
import Inventory_Latest from "../../../components/Akidu_comp/latest_added/Latest_Products";

import I_CategorTable from "../../../components/Akidu_comp/datatable/CategorTable";
//notify-
//import NofitySuc from "../../../components/notify_status/nofity";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//--

const List = ({ userId }) => {

  //  console.log("Inventory id",userId);

  //nofify--
  const notifyStyle = {
    whiteSpace: 'pre-line'
  }
  const progressStyle = {
    background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)'
  }

  return (
    <div className="Prodcutslist">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        
        <div className="optimazer"> <Inventory_Charts /> <Inventory_Latest /> </div>

        <div className="div"> <Inventory_Table /></div>

        <div className="CategorTable"><I_CategorTable /></div>

      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        limit={6} //-
        hideProgressBar={false}
        newestOnTop={false} //-
        closeOnClick
        rtl={false} //--
        pauseOnFocusLoss //--
        draggable
        pauseOnHover
        theme="colored"

        style={notifyStyle}
      // progressStyle={progressStyle}
      />
    </div>
  )
}

export default List
