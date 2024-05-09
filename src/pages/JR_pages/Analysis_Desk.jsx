import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { collection, getDocs, getDoc, addDoc, serverTimestamp, query, where, onSnapshot, doc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import "./Analysis_Desk.scss"; // Import the SCSS file
import Analy_char from "../../components/JR_comp/Analysischart";
import AnalusisTable from "../../components/JR_comp/AnalusisTable";
import Analysischart_2 from "../../components/JR_comp/Analysischart_2";

function Analysis_Desk({ userId }) {
  const { id } = useParams();
  console.log("AN_D_ID", id);

  const [data, setData] = useState({});
  const [grossProfit, setGrossProfit] = useState(0);
  const [operatingIncome, setOperatingIncome] = useState(0);
  const [netIncomeBeforeTaxes, setNetIncomeBeforeTaxes] = useState(0);
  const [incomeTaxes, setIncomeTaxes] = useState(0);
  const [netIncomeAfterTaxes, setNetIncomeAfterTaxes] = useState(0);


  //------------chart 2 ----------------

  const [operatingMargin, setOperatingMargin] = useState(0);
  const [EBITDA, setEBITDA] = useState(0);
  const [ROI, setROI] = useState(0);
  const [breakEvenPoint, setBreakEvenPoint] = useState(0);
  const [contributionMargin, setContributionMargin] = useState(0);

  useEffect(() => {
    const docRef = doc(db, "AnalysisGen", id);

    const unsubscribe = onSnapshot(
      docRef,
      async (doc) => {
        const data = doc.data();
        setData(data);

        // Calculate Gross Profit
        const grossProfit = parseFloat(data.total_Revenue) - parseFloat(data.total_Cost);
        setGrossProfit(grossProfit);

        // Calculate Operating Income
        const operatingIncome = parseFloat(grossProfit) - parseFloat(data.total_Expense);
        setOperatingIncome(operatingIncome);

        // Calculate Net Income Before Taxes
        const netIncomeBeforeTaxes = parseFloat(operatingIncome) + parseFloat(data.total_Other);
        setNetIncomeBeforeTaxes(netIncomeBeforeTaxes);

        // For demonstration, let's assume income taxes are 20% of net income before taxes
        const incomeTaxes = netIncomeBeforeTaxes * 0.2;
        setIncomeTaxes(incomeTaxes);

        // Calculate Net Income After Taxes
        const netIncomeAfterTaxes = netIncomeBeforeTaxes - incomeTaxes;
        setNetIncomeAfterTaxes(netIncomeAfterTaxes);

        ///-----------------------------------------  charT 2  ------------------------------------------

        // Calculate Operating Income
        const operatingIncome2 = data.total_Revenue - data.total_Cost - data.total_Expense;
        const operatingMargin = (operatingIncome2 / data.total_Revenue) * 100;
        setOperatingMargin(operatingMargin);

        const EBITDA = data.total_Revenue - data.total_Cost - data.total_Expense - data.total_Other;
        setEBITDA(EBITDA);

        const ROI = (netIncomeBeforeTaxes / (data.total_Cost + data.total_Expense + data.total_Other)) * 100;
        setROI(ROI);

        const breakEvenPoint = data.total_Cost + data.total_Expense + data.total_Other;
        setBreakEvenPoint(breakEvenPoint);

        const contributionMargin = (data.total_Revenue - data.total_Cost) / data.total_Revenue;
        setContributionMargin(contributionMargin);


      },
      (error) => {
        console.log("Error getting document:", error);
      }
    );



    // Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, [id]);

  return (
    <div className="Analysis_Desk_formContainer">
      <div className="new">
        <Sidebar />
        <div className="newContainer">
          <Navbar />
          <div className="horizontalContainer">
            <div className="box">
              <p className="label">Company Name:</p>
              <p>{data.company_name}</p>
            </div>
            <div className="box">
              <p className="label">Gross Profit:</p>
              <p>{grossProfit}</p>
            </div>
            <div className="box">
              <p className="label">Operating Income:</p>
              <p>{operatingIncome}</p>
            </div>
            <div className="box">
              <p className="label">Net Income Before Taxes:</p>
              <p>{netIncomeBeforeTaxes}</p>
            </div>
            <div className="box">
              <p className="label">Income Taxes:</p>
              <p>{incomeTaxes}</p>
            </div>
            <div className="box">
              <p className="label">Net Income After Taxes:</p>
              <p>{netIncomeAfterTaxes}</p>
            </div>
          </div>


          <div className="all_charts">
            {/* Render Analy_char component and pass the required data */}
            <Analy_char
              userId={userId}
              grossProfit={grossProfit}
              operatingIncome={operatingIncome}
              netIncomeBeforeTaxes={netIncomeBeforeTaxes}
              incomeTaxes={incomeTaxes}
              netIncomeAfterTaxes={netIncomeAfterTaxes}
            />

            <Analysischart_2
              userId={userId}
              operatingMargin={operatingMargin}
              EBITDA={EBITDA}
              ROI={ROI}
              breakEvenPoint={breakEvenPoint}
              contributionMargin={contributionMargin}
            />

          </div>

        </div>
      </div>

    </div>
  );
}

export default Analysis_Desk;
