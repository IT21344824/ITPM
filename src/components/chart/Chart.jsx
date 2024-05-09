import "./chart.scss";
import { AreaChart, Area, XAxis,  CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const data = [
  {name : "January" , Total : 1000 } ,
  {name : "February" , Total : 200 } ,
  {name : "March" , Total : 1500 } ,
  {name : "April" , Total : 578 } ,
  {name : "May" , Total : 1667 } ,
  {name : "June" , Total : 999 } ,
];

const Chart = ({aspect , title}) => {
  return (
    <div className="chart">
      <div className="title"> {title} </div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <XAxis dataKey="name" />
          
          <Tooltip />
          <Area type="monotone" dataKey="Total" stackId="1" stroke="#8884d8" fill="#8884d8" />
         
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart
