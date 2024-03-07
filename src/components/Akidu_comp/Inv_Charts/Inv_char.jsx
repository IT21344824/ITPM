import React from 'react'
import "./Inv_char.scss";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const Inv_char = () => {
    return (


        <div className="Inv_char">

            <div className="datatable">

                <div className="datatableTitle">
               <h1>latest Added Item</h1> 
                    <div className="latest">
                        latest
                    </div>
                   

                </div>
                <div className="datatableTitle">
                <h1>IpieChar</h1> 
                    <div className="IpieChar">
                        IpieChar
                    </div>

                </div>


            </div>


        </div>
    )
}

export default Inv_char
