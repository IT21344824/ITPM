import React, { useState } from "react";
import {
    Grid,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Select,
    MenuItem
} from "@mui/material";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ReactApexChart from "react-apexcharts";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from "react-router-dom";
import Stack from '@mui/material/Stack';

const Trendoptimize_page = ({ userId }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [newProduct, setNewProduct] = useState({ id: "", name: "", price: "", category: "" });
    const [itemDetails, setItemDetails] = useState([
        { id: "FT001", name: "Nike",view: "Item",category: "cerwneck",color: "black",Material: "singlejersey180gsm", Price: 10, cost: 620,Desingtype: "plainembroider"},
        { id: "FT001", name: "Nike",view: "Item",category: "cerwneck",color: "black",Material: "singlejersey180gsm", Price: 10, cost: 620,Desingtype: "plainembroider"},
        { id: "FT001", name: "Nike",view: "Item",category: "cerwneck",color: "black",Material: "singlejersey180gsm", Price: 10, cost: 620,Desingtype: "plainembroider"},
    ]);

    const options = {
        chart: {
            type: 'donut',
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    const series = [44, 55, 41, 17, 15];

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleEditItem = (id) => {
        // Placeholder for edit logic
        console.log("Edit item with ID:", id);
    };

    const handleDeleteItem = (id) => {
        setItemDetails(itemDetails.filter(item => item.id !== id));
        console.log("Delete item with ID:", id);
    };

    const handleAddProduct = () => {
        setItemDetails([...itemDetails, newProduct]);
        setNewProduct({ id: "", name: "", price: "", category: "" });
        setOpenDialog(false);
    };

    return (
        <div className="Avishka_pages">
            <Sidebar userId={userId} />
            <div className="Avishka_pages_Container">
                <Navbar />
                <div>
                    <Typography variant="h4" gutterBottom>
                        Feture Forcust
                    </Typography>
                    <Grid container spacing={2}>

                        <Grid item xs={4} >
                            <Paper style={{ padding: 20, height: 300 }}>
                                <div id="chart">
                                    <ReactApexChart options={options} series={series} type="donut" />
                                </div>
                            </Paper>
                        </Grid>
                        <Grid item xs={4} >
                            <Paper style={{ padding: 20, height: 300 }}>
                                <div id="chart">
                                    <ReactApexChart options={options} series={series} type="donut" />
                                </div>
                            </Paper>
                        </Grid>
                        <Grid item xs={4} >
                            <Paper style={{ padding: 20, height: 300 }}>
                                <div id="chart">
                                    <ReactApexChart options={options} series={series} type="donut" />
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid item xs={8}>
                        <Paper elevation={3} style={{ padding: 20 }}>
                            <Typography variant="h5" gutterBottom>
                            <Stack direction="row" spacing={2}>
      <Button variant="contained"><div className="datatableTitle">
                            
                            <Link to="/Forecast/ForecastNew" className="link" >
                                Add New
                            </Link>
                        </div></Button>
    </Stack>


                                
                            </Typography>

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>BrandName</TableCell>
                                            <TableCell>Viwe</TableCell>
                                            <TableCell>Category</TableCell>
                                            <TableCell>Color</TableCell>
                                            <TableCell>Material</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Cost</TableCell>
                                            <TableCell>Desing Type</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {itemDetails.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.id}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.view}</TableCell>
                                                <TableCell>{item.category}</TableCell>
                                                <TableCell>{item.color}</TableCell>
                                                <TableCell>{item.Material}</TableCell>
                                                <TableCell>{item.Price}</TableCell>
                                                <TableCell>{item.cost}</TableCell>
                                                <TableCell>{item.Desingtype}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<EditIcon />}
                                                        onClick={() => handleEditItem(item.id)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        startIcon={<DeleteIcon />}
                                                        onClick={() => handleDeleteItem(item.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </div>
            </div>

            {/* <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogContent>
                    <form>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 2, sm: 2, md: 3 }}>
                            <Grid item xs={6}>
                                <TextField
                                    name="id"
                                    label="ID"
                                    value={newProduct.id}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    name="name"
                                    label="Name"
                                    value={newProduct.name}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    name="price"
                                    label="Price"
                                    value={newProduct.price}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Select
                                    name="category"
                                    label="Category"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    fullWidth
                                    margin="normal"
                                >
                                    <MenuItem value="Category 1">Category 1</MenuItem>
                                    <MenuItem value="Category 2">Category 2</MenuItem>
                                    <MenuItem value="Category 3">Category 3</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={2}>
                                <Button variant="contained" color="primary" onClick={handleAddProduct}>
                                    Add
                                </Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Button variant="contained" color="error" onClick={handleDialogClose}>
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog> */}
        </div>
    );
};

export default Trendoptimize_page;
