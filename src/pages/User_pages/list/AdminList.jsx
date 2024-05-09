import "./AdminList.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";

import AdminDataTable from "../../../components/User_comp/datatable/AdminDataTable";


const AdminList = () => {
    return (
        <div className="list">
          <Sidebar/>
            <div className="listContainer">
              <Navbar/>
             
              <AdminDataTable/>
            </div>
        </div>
      )
    }

export default AdminList
