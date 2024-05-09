import "./Charts_Page.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import { Link } from "react-router-dom";


import Inventory_Table from "../../../components/Akidu_comp/datatable/ProductTable";
import Inventory_Charts from "../../../components/Akidu_comp/Inv_Charts/Inv_char";
import Inventory_Latest from "../../../components/Akidu_comp/latest_added/Latest_Products";
import Widgets_Charts from "../../../components/Akidu_comp/top_Additional/Top_Additional";
import I_CategorTable from "../../../components/Akidu_comp/datatable/CategorTable";
//notify-
//import NofitySuc from "../../../components/notify_status/nofity";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//--

const Charts_Page = ({ userId }) => {

  //  console.log("Inventory id",userId);

  //nofify--
  const notifyStyle = {
    whiteSpace: 'pre-line'
  }
  const progressStyle = {
    background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)'
  }

  return (
    <div className="Akidu_Prodcutslist">
      <Sidebar />
      <div className="listContainer">
        <Navbar />

        <div className="chart_top">
          <div className="Title_list">
            Go to Inventory
            <Link to="/Inventory/I_List" className="link" >
              I List
            </Link>
          </div>

          <div className="Title_list">
            Add Item to Inventory
            <Link to="/Inventory/new" className="link" >
              Add New
            </Link>
          </div>
        </div>


        <div className="widgets">
          <Widgets_Charts userId={userId} />
        </div>


        <div className="optimazer"> <Inventory_Charts userId={userId} /> <Inventory_Latest userId={userId} /> </div>





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

export default Charts_Page
