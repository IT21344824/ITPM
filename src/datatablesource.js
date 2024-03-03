//import axios from "axios" ;


// admin
export const adminColums = [
    { field: 'id', headerName: 'ID', width: 200 },
    {
        field : "Users" ,
        headerName : "Admins" ,
        width :210 ,
        renderCell :(params) => {
            return(
                <div className="cellWithImg">
                    <img className="cellImg" src={params.row.img} alt="" />
                    {params.row.username}
                </div>
            );
        },
    },
    {
        field : "name" ,
        headerName : "Name" ,
        width :200 ,

    },
    {
        field : "email" ,
        headerName : "Email" ,
        width :200 ,

    },
    {
        field : "phone" ,
        headerName : "Phone" ,
        width :200 ,

    },
    {
        field : "gender" ,
        headerName : "Gender" ,
        width :200 ,

    },  
] 



