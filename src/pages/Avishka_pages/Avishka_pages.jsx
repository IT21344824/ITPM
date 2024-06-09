import React, { useState, useEffect } from 'react';
import './Avishka_pages.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios'; // Import Axios
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Typography, } from '@mui/material';
import { collection, getDocs, addDoc,deleteDoc,doc,updateDoc, serverTimestamp } from "firebase/firestore"; // Import addDoc and serverTimestamp
import { db } from "../../firebase";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Swal from 'sweetalert2';
import TablePagination from '@mui/material/TablePagination'; // Import TablePagination
import { Box } from '@mui/material';
import jsPDF from 'jspdf';
import "jspdf-autotable";

const Avishka_pages = ({ userId }) => {
  const [Itemcode, setItemcode] = useState('');
  const [Color, setColor] = useState('');
  const [Size, setSize] = useState('');
  const [id, setid] = useState('');
  const [Brand, setBrand] = useState('');
  const [Category, setCategory] = useState('');
  const [Material, setMaterial] = useState('');
  const [responseText, setResponseText] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState({});
  const [page, setPage] = useState(0); // Pagination state: page number
  const [rowsPerPage, setRowsPerPage] = useState(5); // Pagination state: rows per page
  const [editingItem, setEditingItem] = useState(null);
  const [DuplicateAdvertisements, setDuplicateallAdvertisements] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        debugger;
        const querySnapshot = await getDocs(collection(db, 'Forecast'));
        const documents = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(documents);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Run only once on component mount

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const validateForm = () => {
    const errors = {};
    if (!Color || !Size || !Brand || !Category || !Material ) {
      errors.general = 'All fields are required';
    }
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };
  const validateForm1 = () => {
    const errors = {};
    if (!Color || !Size || !Brand || !Category || !Material || !responseText) {
      errors.general = 'All fields are required';
    }
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };
  const getNextItemId = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Forecast"));
      const itemCount = querySnapshot.size;
      const nextItemId = "TL" + ("000" + (itemCount + 1)).slice(-3); // Generate ID in the format "TL001", "TL002", ...
      return nextItemId;
    } catch (error) {
      console.error("Error fetching document count: ", error);
      throw error;
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form
    const isValid = validateForm1();
    if (!isValid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all required fields.',
      });
      return; // Prevent form submission if validation fails
    
    }

    // Mapping Size, Brand, Category, Color, and Material values
    const sizeMap = ['XS', 'M', 'XL', 'XXL', 'S', 'L'];
    const brandMap = ['New Balance', 'Under Armour', 'Nike', 'Adidas', 'Reebok', 'Puma'];
    const categoryMap = ['Dress', 'Jeans', 'Shoes', 'Sweater', 'Jacket', 'T-shirt'];
    const colorMap = ['White', 'Black', 'Red', 'Green', 'Yellow', 'Blue'];
    const materialMap = ['Nylon', 'Silk', 'Wool', 'Cotton', 'Polyester', 'Denim'];

    const size = sizeMap[parseInt(Size)];
    const brand = brandMap[parseInt(Brand)];
    const category = categoryMap[parseInt(Category)];
    const color = colorMap[parseInt(Color)];
    const material = materialMap[parseInt(Material)];

    try {
      const nextItemId = await getNextItemId();
debugger;
      const newProductRef = await addDoc(collection(db, "Forecast"), {
        // id:newProductRef.id,
        Itemcode:nextItemId,
        Color: color,
        Size: size,
        Brand: brand,
        Category: category,
        Material: material,
        price: responseText,
        timeStamp: serverTimestamp(), // Include the server timestamp
      });
      console.log("Document written with ID: ", newProductRef.id);
      //setResponseText('Data saved successfully!');
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your Datahas been saved',
        showConfirmButton: false,
        timer: 1500
      });
      window.location.reload();
    } catch (error) {
      console.error("Error adding document: ", error);
      //setResponseText('Error occurred while saving data');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
  };
  const handleDelete = async (id) => {
    debugger;
    try {
      await deleteDoc(doc(db, "Forecast", id));
      Swal.fire({
        title: "Are you sure Delete Item?",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
          
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
        
      });
      window.location.reload();
    } catch (error) {
      console.error('Error removing document: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
  };
  
  
  // const handleDelete = async (documentId) => {
  //   try {
  //     await deleteDoc(doc(db, "Forecast",id));
  //     setData(prevData => prevData.filter(item => item.id !== id));
  //     Swal.fire({
  //       position: 'top-end',
  //       icon: 'success',
  //       title: 'Your Datahas been deleted',
  //       showConfirmButton: false,
  //       timer: 1500
  //     });
  //   } catch (error) {
  //     console.error('Error removing document: ', error);
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Oops...',
  //       text: 'Something went wrong!',
  //     });
  //   }
  // };
  function handleSearch(searchItem) {
    const results = DuplicateAdvertisements?.filter((advertisement) => {
        return advertisement?.Brand.toLowerCase().includes(searchItem.toLowerCase())
    })
    console.log(results);
    setData(results);
}
const handleGeneratePDF = (item) => {
  const doc = new jsPDF();
  const tableColumn = [
    "ID", "Brand", "Size", "Color", "Category", "Material", "Price"
  ];
  const tableRows = [];

  data.map((item) => {
    const rowData = [
      item.Itemcode,
      item.Brand,
      item.Size,
      item.Color,
      item.Category,
      item.Material,
      item.price
    ];
    tableRows.push(rowData);
  });

  doc.text("Product Details Price Prediction Report", 70, 8).setFontSize(13);
  doc.autoTable(tableColumn, tableRows, { startY: 20 });
  doc.save("Product_Details_Report.pdf");
};


 



  const handleEdit = (item) => {
    debugger;
    // isEdit = true
    // Set the item being edited to the state
    setEditingItem(item);
    // Populate the form fields with the item's data
    setItemcode(item.Itemcode);
    setColor(item.Color);
    setSize(item.Size);
    setBrand(item.Brand);
    setCategory(item.Category);
    setMaterial(item.Material);
    setResponseText(item.price);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const isValid = validateForm1();
    if (!isValid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    const sizeMap = ['XS', 'M', 'XL', 'XXL', 'S', 'L'];
    const brandMap = ['New Balance', 'Under Armour', 'Nike', 'Adidas', 'Reebok', 'Puma'];
    const categoryMap = ['Dress', 'Jeans', 'Shoes', 'Sweater', 'Jacket', 'T-shirt'];
    const colorMap = ['White', 'Black', 'Red', 'Green', 'Yellow', 'Blue'];
    const materialMap = ['Nylon', 'Silk', 'Wool', 'Cotton', 'Polyester', 'Denim'];

    const size = sizeMap[parseInt(Size)];
    const brand = brandMap[parseInt(Brand)];
    const category = categoryMap[parseInt(Category)];
    const color = colorMap[parseInt(Color)];
    const material = materialMap[parseInt(Material)];

    try {
      // Update the document in Firestore with the edited data
      await updateDoc(doc(db, "Forecast", editingItem.id), {
        Itemcode,
        Color: color,
        Size: size,
        Brand: brand,
        Category: category,
        Material: material,
        price: responseText,
        timeStamp: serverTimestamp(),
      });
      // Clear the editing state and form fields
      setEditingItem(null);
      setItemcode('');
      setColor('');
      setSize('');
      setBrand('');
      setCategory('');
      setMaterial('');
      setResponseText('');
      // Show success message
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your Data has been updated',
        showConfirmButton: false,
        timer: 1500
      });
      window.location.reload();

    } catch (error) {
      console.error("Error updating document: ", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
  };
  const sendRequest = async () => {
    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all required fields.',
      });
      return; // Prevent form submission if validation fails
    }
    try {
      // Convert string values to numeric
      const numericBrand = parseInt(Brand);
      const numericCategory = parseInt(Category);
      const numericColor = parseInt(Color);
      const numericSize = parseInt(Size);
      const numericMaterial = parseInt(Material);

      const inputData = {
        Brand: numericBrand,
        Category: numericCategory,
        Color: numericColor,
        Size: numericSize,
        Material: numericMaterial,
      };

      console.log(inputData);

      try {
        const response = await axios.post('http://127.0.0.1:5000/predict', inputData);

        console.log(response);

        if (response.status === 200) {
          const result = response.data;
          setResponseText(result.predicted_price); // Assuming the response has a 'predicted_price' field
        }
        if (response.status === 200) {
          const predictedPrice = response.data.predicted_price;
          let detailsParagraph = '';

          if (predictedPrice === '40') {
            detailsParagraph = 'The predicted price is low.';
          } else if (predictedPrice === '120') {
            detailsParagraph = 'The predicted price is medium.';
          } else if (predictedPrice === '170') {
            detailsParagraph = 'The predicted price is high.';
          } else {
            detailsParagraph = 'The predicted price is not recognized.';
          }

          setResponseText(
            ` ${predictedPrice}`
          );
        } else {
          setResponseText('Error occurred while fetching data');
        }
      } catch (error) {
        console.error('There was a problem with your Axios request:', error);
      }
    } catch (error) {
      console.error('There was a problem:', error);
    }
  };

  return (
    <>
      <div className="Avishka_pages">
        <Sidebar userId={userId} />
        <div className="Avishka_pages_Container">
          <Navbar />
          <div>
          <Card sx={{ backgroundColor: '#e3f2fd' }}>
      <CardContent>
      <Typography variant="h5" sx={{ fontFamily: 'Arial, sans-serif',marginBottom: '15px'  }}>
          Feture Forecast  Prediction
        </Typography>
      </CardContent>
    </Card>
          </div>
          <Card>
            <CardContent>
              {formError.general && <p style={{ color: 'red' }}>{formError.general}</p>}
              <div className="form-container">
              <Typography variant="h6" sx={{ fontFamily: 'Arial, sans-serif', justifyContent: 'center' }}>
          Trend Analyst for price prediction
          {editingItem ? 'Edit Item' : 'Add Item'}
        </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      value={responseText}
                      placeholder="Predicted Price" 
                      InputProps={{
                        readOnly: true, // Make the input field read-only
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                  <text>{Size}</text>
                    <FormControl fullWidth>
                      <InputLabel>Select SizeType</InputLabel>
                      <Select
                        value={Size}
                        onChange={(e) => setSize(e.target.value)}
                        label="Select SizeType"
                      >
                        <MenuItem value="">Select SizeType</MenuItem>
                        <MenuItem value="0">XS</MenuItem>
                        <MenuItem value="1">M</MenuItem>
                        <MenuItem value="2">XL</MenuItem>
                        <MenuItem value="3">XXL</MenuItem>
                        <MenuItem value="4">S</MenuItem>
                        <MenuItem value="5">L</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                  <text>{Color}</text>
                    <FormControl fullWidth>
                      <InputLabel>Select Color</InputLabel>
                      <Select
                        value={Color}
                        onChange={(e) => setColor(e.target.value)}
                        label="Select Color"
                      >
                        <MenuItem value="">Select Color</MenuItem>
                        <MenuItem value="0">White</MenuItem>
                        <MenuItem value="1">Black</MenuItem>
                        <MenuItem value="2">Red</MenuItem>
                        <MenuItem value="3">Green</MenuItem>
                        <MenuItem value="4">Yellow</MenuItem>
                        <MenuItem value="5">Blue</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                  <text>{Brand}</text>
                    <FormControl fullWidth>
                      <InputLabel>Select Brand</InputLabel>
                      <Select
                        value={Brand}
                        onChange={(e) => setBrand(e.target.value)}
                        label="Select Brand"
                      >
                        <MenuItem value="">Select Brand</MenuItem>
                        <MenuItem value="0">New Balance</MenuItem>
                        <MenuItem value="1">Under Armour</MenuItem>
                        <MenuItem value="2">Nike</MenuItem>
                        <MenuItem value="3">Adidas</MenuItem>
                        <MenuItem value="4">Reebok</MenuItem>
                        <MenuItem value="5">Puma</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                  <text>{Category}</text>
                    <FormControl fullWidth>
                      <InputLabel>Select Category</InputLabel>
                      <Select
                        value={Category}
                        onChange={(e) => setCategory(e.target.value)}
                        label="Select Category"
                      >
                        <MenuItem value="">Select Category</MenuItem>
                        <MenuItem value="0">Dress</MenuItem>
                        <MenuItem value="1">Jeans</MenuItem>
                        <MenuItem value="2">Shoes</MenuItem>
                        <MenuItem value="3">Sweater</MenuItem>
                        <MenuItem value="4">Jacket</MenuItem>
                        <MenuItem value="5">T-shirt</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                  <text>{Material}</text>
                    <FormControl fullWidth>
                      <InputLabel>Select Material</InputLabel>
                      <Select
                        value={Material}
                        onChange={(e) => setMaterial(e.target.value)}
                        label="Select Material"
                      >
                        <MenuItem value="">Select Material</MenuItem>
                        <MenuItem value="0">Nylon</MenuItem>
                        <MenuItem value="1">Silk</MenuItem>
                        <MenuItem value="2">Wool</MenuItem>
                        <MenuItem value="3">Cotton</MenuItem>
                        <MenuItem value="4">Polyester</MenuItem>
                        <MenuItem value="5">Denim</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button variant="contained"  onClick={sendRequest}>
                      PredictPrice
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                  <Button variant="contained" onClick={editingItem ? handleUpdate : handleSubmit}>
                      {editingItem ? 'Update' : 'Save'}
                    </Button>
                  </Grid>
                </Grid>
              </div>
              <div style={{ marginLeft: '5px' }}>
    <Card sx={{ backgroundColor: '#e3f2fd', marginTop: '20px' }}>
        <CardContent>
        <Grid container justifyContent="flex-end"> 
       
            {/* Search bar component */}
            

            <Grid item xs={12} sm={10}><TextField
                label="Search"
                variant="outlined"
                size="small"
                onChange={(e) => {
                  handleSearch(e.target.value);}}
                style={{ marginBottom: '20px' }}
            /></Grid> 
                <Grid item xs={12} sm={2}>
                    <Button variant="contained" color="success" onClick={handleGeneratePDF}>
                        Generate Report
                    </Button>
                </Grid>
                {/* Add more Grid items if needed */}
            </Grid>
        </CardContent>
    </Card>
</div>

            </CardContent>
          </Card>
          <div>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <>
                <TableContainer component={Paper} >
                  <Table>
                    <TableHead sx={{ backgroundColor: "#4194C4" }}>
                      <TableRow>
                        <TableCell align="center">ID</TableCell>
                        <TableCell align="center">Brand</TableCell>
                        <TableCell align="center">Size</TableCell>
                        <TableCell align="center">Color</TableCell>
                       
                        <TableCell align="center">Category</TableCell>
                        <TableCell align="center">Material</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell>Action</TableCell>
                        {/* Add more table headers as needed */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowsPerPage > 0
                        ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : data
                      ).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell align="center">{item.Itemcode
                          }</TableCell>
                          <TableCell align="center">{item.Brand}</TableCell>
                          <TableCell align="center">{item.Size}</TableCell>
                          <TableCell align="center">{item.Color}</TableCell>
                          <TableCell align="center">{item.Category}</TableCell>
                          <TableCell align="center">{item.Material}</TableCell>
                          <TableCell align="center">{item.price}</TableCell>
                          <TableCell>
                          <Box sx={{ display: 'inline-block', marginRight: 1 }}>
                          <Button variant="contained" color="success" onClick={() => handleEdit(item)}>
                                Edit
                              </Button>
                        </Box>
                        <Button 
                              variant="contained" 
                              color="error" 
                              onClick={() => handleDelete(item.id)} 
                            >
                              Delete
                            </Button>
                          </TableCell>
                          {/* Add more table cells based on your data structure */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Avishka_pages;
