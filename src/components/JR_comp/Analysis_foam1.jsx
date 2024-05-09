import React, { useState, useEffect } from "react";
import "./Analysis_foam1.scss";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, getDoc, addDoc, serverTimestamp, query, where, onSnapshot, doc, } from "firebase/firestore";
import { db, storage } from "../../firebase";




const Analysis_foam1 = ({ userId }) => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const [companyName, setCompanyName] = useState("");
  const [revenueType, setRevenueType] = useState("");
  const [revenueAmount, setRevenueAmount] = useState(0);
  const [costType, setCostType] = useState("");
  const [costAmount, setCostAmount] = useState(0);
  const [expenseType, setExpenseType] = useState("");
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [otherType, setOtherType] = useState("");
  const [otherAmount, setOtherAmount] = useState(0);
  const [companyNameError, setCompanyNameError] = useState("");

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalOther, setTotalOther] = useState(0);

  const [newProductRef, setNewProductRef] = useState(null);


  useEffect(() => {
    // Calculate totals when dropdowns or amounts change
    setTotalRevenue(revenueAmount);
    setTotalCost(costAmount);
    setTotalExpense(expenseAmount);
    setTotalOther(otherAmount);
  }, [
    revenueType,
    revenueAmount,
    costType,
    costAmount,
    expenseType,
    expenseAmount,
    otherType,
    otherAmount,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyName) {
      setCompanyNameError("Please enter the company name.");
      return;
    }

    const newProductRef = await addDoc(collection(db, "AnalysisGen"), {
      user_id: userId,
      company_name: companyName, // Save userId as user_id in the database
      revenue_Type: revenueType,
      revenue_Amount: revenueAmount,
      cost_Type: costType,
      cost_Amount: costAmount,
      expense_Type: expenseType,
      expense_Amount: expenseAmount,
      other_Type: otherType,
      other_Amount: otherAmount,
      total_Revenue: totalRevenue,
      total_Cost: totalCost,
      total_Expense: totalExpense,
      total_Other: totalOther,
      time_Stamp: serverTimestamp()

    });
    console.log("Analysis_db", newProductRef.id);
    setNewProductRef(newProductRef);

    // Assuming this is where you navigate to PLAnalysis/new

    // Submit the form data
    console.log({
      companyName,
      revenueType,
      revenueAmount,
      costType,
      costAmount,
      expenseType,
      expenseAmount,
      otherType,
      otherAmount,
    });

    // Reset form fields and errors
    resetForm();
    navigate(`/PLAnalysis/${newProductRef.id}`, { state: { newProductRef } });
  };

  const resetForm = () => {
    setCompanyName("");
    setRevenueType("");
    setRevenueAmount(0);
    setCostType("");
    setCostAmount(0);
    setExpenseType("");
    setExpenseAmount(0);
    setOtherType("");
    setOtherAmount(0);
    setCompanyNameError("");
  };

  const handleEdit = () => {
    // Add logic to edit form values
    console.log("Edit button clicked!");
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="Analysis_foam1_formContainer">
      <div className="datatableTitle">
        Analysis Generation
      </div>

      <div className="box">

        <form onSubmit={handleSubmit} className="analysisForm">
          {/* Company Name */}
          <div className="">
            <label htmlFor="companyName">Company Name: </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
            {companyNameError && (
              <p className="errorMessage">{companyNameError}</p>
            )}
          </div>

          {/* Revenues */}
          <div className="row">
            <div className="titale">
              <label htmlFor="revenueType">Select Revenue Type:</label>
              <select
                id="revenueType"
                value={revenueType}
                onChange={(e) => setRevenueType(e.target.value)}
              >
                <option value="">Select Revenue Type</option>
                <option value="Sales Revenue">Sales Revenue</option>
                <option value="Interest Income">Interest Income</option>
                <option value="Other Revenue">Other Revenue</option>
              </select>
              <label className="Amounts" htmlFor="revenueAmount">Revenue Amount:</label>
              <input
                type="number"
                id="revenueAmount"
                value={isNaN(revenueAmount) ? "" : revenueAmount}
                onChange={(e) => setRevenueAmount(parseFloat(e.target.value))}
                required
              />
            </div>
            <p>Total Revenue: {totalRevenue}</p>

            <hr />
          </div>

          {/* Cost of Goods Sold */}
          <div className="row">
            <div className="titale">
              <label htmlFor="costType">Select Cost Type:</label>
              <select
                id="costType"
                value={costType}
                onChange={(e) => setCostType(e.target.value)}
              >
                <option value="">Select Cost Type</option>
                <option value="Beginning Inventory">Beginning Inventory</option>
                <option value="Purchases">Purchases</option>
                <option value="Freight-In">Freight-In</option>
                <option value="Ending Inventory">Ending Inventory</option>
              </select>
              <label className="Amounts" htmlFor="costAmount">Cost Amount:</label>
              <input
                type="number"
                id="costAmount"
                value={isNaN(costAmount) ? "" : costAmount}
                onChange={(e) => setCostAmount(parseFloat(e.target.value))}
                required
              />
            </div>

            <p>Total Cost of Goods Sold: {totalCost}</p>
            <hr />

          </div>

          {/* Operating Expenses */}
          <div className="row">
            <div className="titale">
              <label htmlFor="expenseType">Select Expense Type:</label>
              <select
                id="expenseType"
                value={expenseType}
                onChange={(e) => setExpenseType(e.target.value)}
              >
                <option value="">Select Expense Type</option>
                <option value="Salaries and Wages">Salaries and Wages</option>
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities</option>
                <option value="Marketing and Advertising">
                  Marketing and Advertising
                </option>
                <option value="Depreciation">Depreciation</option>
                <option value="Insurance">Insurance</option>
                <option value="Repairs and Maintenance">
                  Repairs and Maintenance
                </option>
                <option value="Other Operating Expenses">
                  Other Operating Expenses
                </option>
              </select>
              <label className="Amounts" htmlFor="expenseAmount">Expense Amount:</label>
              <input
                type="number"
                id="expenseAmount"
                value={isNaN(expenseAmount) ? "" : expenseAmount}
                onChange={(e) => setExpenseAmount(parseFloat(e.target.value))}
                required
              />
            </div>

            <p>Total Operating Expenses: {totalExpense}</p>
            <hr />

          </div>

          {/* Other Income and Expenses */}
          <div className="row">
            <div className="titale">
              <label htmlFor="otherType">Select Other Type:</label>
              <select
                id="otherType"
                value={otherType}
                onChange={(e) => setOtherType(e.target.value)}
              >
                <option value="">Select Other Type</option>
                <option value="Interest Expense">Interest Expense</option>
                <option value="Gain/Loss on Sale of Assets">
                  Gain/Loss on Sale of Assets
                </option>
                <option value="Other Income">Other Income</option>
                <option value="Other Expenses">Other Expenses</option>
              </select>
              <label className="Amounts" htmlFor="otherAmount">Other Amount:</label>
              <input
                type="number"
                id="otherAmount"
                value={isNaN(otherAmount) ? "" : otherAmount}
                onChange={(e) => setOtherAmount(parseFloat(e.target.value))}
                required
              />
            </div>

            <p>Total Other Income and Expenses: {totalOther}</p>
            <hr />

          </div>
          {/* Buttons */}
          <div className="buttonContainer">
            <button type="submit" onClick={handleSubmit}>
              Submit
            </button>

            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" onClick={handleEdit}>
              Edit
            </button>
          </div>
        </form>
      </div>

    </div>

  );
};


export default Analysis_foam1;
