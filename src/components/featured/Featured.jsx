import "./featured.scss";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CircularProgressbar } from "react-circular-progressbar" ;
import "react-circular-progressbar/dist/styles.css" ;
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


const Featured = () => {
  return (
    <div className="featured"> 
      
      <div className="top">
        <h1 className="title"> Total membership register </h1>
        <MoreVertIcon fontSize="small"/>
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar value={70} text={"70%"}  strokeWidth={5} />
        </div>
        <p className="title"> Total member attendent </p>
        <p className="amount"> 500 </p>
        <p className="desc"> latest update </p>

        <div className="summary">
            <div className="item">
                <div className="itemTitle"> Target </div>
                <div className="itemResult nagative">
                    <KeyboardArrowDownIcon fontSize="small"/>
                    <div className="resultAmount"> 40 </div>
                </div>
            </div>
            <div className="item">
                <div className="itemTitle"> Last Week </div>
                <div className="itemResult nagative">
                    <KeyboardArrowDownIcon fontSize="small"/>
                    <div className="resultAmount"> 40 </div>
                </div>
            </div>
            <div className="item">
                <div className="itemTitle"> Last Month </div>
                <div className="itemResult positive">
                    <KeyboardArrowUpIcon fontSize="small"/>
                    <div className="resultAmount"> 40 </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  )
}

export default Featured
