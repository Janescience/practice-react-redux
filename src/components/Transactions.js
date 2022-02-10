import React, { useState, useEffect } from "react";
import * as Unicons from '@iconscout/react-unicons';
import { Box ,Grid , Card , CardContent , CardActions  , 
    Typography , TextField , MenuItem, Button , Snackbar , 
    Divider , List , ListItem , Dialog , DialogActions ,
    DialogContent , DialogContentText , DialogTitle  } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import NumberFormat from 'react-number-format';

import { Navigate } from "react-router-dom";
import { useDispatch , useSelector } from "react-redux";

import { createTransaction , getTransactions , getTransactionsByType , deleteTransaction } from "../actions/transactions";

const types = [
    {
        value:"Income",
        label:"Income",
        categories : [
            {
                value:"Salary",
                label:"Salary"
            },
            {
                value:"Wages",
                label:"Wages"
            },
            {
                value:"Commission",
                label:"Commission"
            },
            {
                value:"Interest",
                label:"Interest"
            },
            {
                value:"Investments",
                label:"Investments"
            },
            {
                value:"Gifts",
                label:"Gifts"
            },
            {
                value:"Government Payments",
                label:"Government Payments"
            },
            {
                value:"Refund",
                label:"Refund"
            }
        ]
    },
    {
        value:"Expense",
        label:"Expense",
        categories : [
            {
                value:"Food",
                label:"Food"
            },
            {
                value:"Shopping",
                label:"Shopping"
            },
            {
                value:"Drinks",
                label:"Drinks"
            },
            {
                value:"Debt",
                label:"Debt"
            },
            {
                value:"Travel",
                label:"Travel"
            },
            {
                value:"Credit Card",
                label:"Credit Card"
            },
            {
                value:"Family",
                label:"Family"
            },
            {
                value:"Business",
                label:"Business"
            },
            {
                value:"Maintainence",
                label:"Maintainence"
            },
            {
                value:"Rent",
                label:"Rent"
            }
        ]
    }
]

const searchKey = [
    {
        key : 'Type',
        value : 'type',
        type : 'select',
        data : [
            'Income',
            'Expense'
        ]
    },
    {
        key : 'Category',
        value : 'category',
        type : 'select',
        data : [
            types[0].categories.map((x) => x.value ),
            types[1].categories.map((x) => x.value )
        ]
    },
    {
        key : 'Transaction Date',
        value : 'transactionDate',
        type : 'date',
        data : new Date()
    }
]

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;
  
    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
      />
    );
});

const styleDivide = {
    width: '100%',
    bgcolor: 'background.paper',
};

const Transactions = (props) => {

    const [categories,setCategories] = useState(types[1].categories);

    const { user: currentUser } = useSelector(state => state.auth);

    const [ newTransaction , setNewTransaction ] = useState({
        type : types[1].value,
        category : types[1].categories[0].value,
        transactionDate : new Date(),
        amount : "",
        desc : "",
        user : currentUser ? currentUser.id : null
    })

    const [ searchTransaction , setSearchTransaction ] = useState({
        key : searchKey[0].value,
        value : "Income"
    })

    const [transactionDelete,setTransactionDelete] = useState({});
    const [createBtnDisabled,setCreateBtnDisabled] = useState(true);
    const [searchBtnDisabled,setSearchBtnDisabled] = useState(true);
    const [filterType,setFilterType] = useState("All");

    const [alert,setAlert] = useState(false);
    const [alertMessage,setAlertMessage] = useState("");
    const [confirm,setConfirm] = useState(false);

    const { isLoggedIn } = useSelector(state => state.auth);
    const { transactions : listTransaction } = useSelector(state => state.transactions);

    const dispatch = useDispatch();

    const onChangeInput = (event) => {
        const { name , value } = event.target;
        setNewTransaction(prevState => ({ ...prevState, [name] : value }));

        switch(name) {
            case 'type' :
                let categories = types.filter(x => x.value === value)[0].categories;
                setCategories(categories);
                setNewTransaction(prevState => ({ ...prevState, category : categories[0].value }));
                break;
            case 'amount' :
                setCreateBtnDisabled(value <= 0);
                break;    
            default :
        } 
    }

    const onChangeInputSearch = (event) => {
        const { name , value } = event.target;
        console.log('onChangeInputSearch : ',event.target)
        if(name !== 'key'){
            setSearchTransaction(prevState => ({ ...prevState, value : value }))
        }else{
            setSearchTransaction(prevState => ({ ...prevState, key : value }))
        }
    }

    const refreshNewTransaction = () => {
        setNewTransaction(prevState => ({ ...prevState, desc : "" , amount : "" }));
    }

    const handleConfirmDelete = (tranDelete) => {
        setConfirm(true);
        setTransactionDelete(tranDelete)
    }

    const handleAlert = (message) => {
        setAlert(true);
        setAlertMessage(message)
    }

    useEffect(() => {
        fecthTransaction()
    },[ ])

    const fecthTransaction = () => {
        let userId = currentUser ? currentUser.id : null ;
        if(userId){
            dispatch(getTransactions(userId));
        }
    }

    const sumAmount = (type) => {
        let total = 0;
        listTransaction && listTransaction.map((transaction) => {
            if(transaction.type === type){
                total = total + transaction.amount;
            }
        })
        
        return total;
    }


    const formatDate = (date) => {
        const currentDate = !date ? new Date() : new Date(date);
        const dd = currentDate.getDate().toString().padStart(2, '0')
        const mm = (currentDate.getMonth() + 1).toString().padStart(2, '0')
        const yyyy = currentDate.getFullYear();
        return dd + '.' + mm + '.' + yyyy
    }

    const filterTransaction = (type) => {
        if(type === 'All'){
            fecthTransaction()
        }else{
            let userId = currentUser ? currentUser.id : null ;
            if(userId){
                dispatch(getTransactionsByType(userId,type));
            }
        }

        handleAlert("Filter data by " + type + " type.")
        setFilterType(type);
    }

    const submitSearch = () => {
        
    }

    const submitCreate = () => {
        dispatch(createTransaction(newTransaction)).then(() => {
            fecthTransaction()
            refreshNewTransaction()
            handleAlert("Created transaction successfully.")
        },(error) => {
            console.log(error)
        })
        
    }

    const submitDelete = () => {
        dispatch(deleteTransaction(transactionDelete._id))
        .then(() => {
            fecthTransaction()
            setTransactionDelete({})
            setConfirm(false)
            handleAlert("Deleted transaction successfully.")
        },(error) => {
            console.log(error)
        })
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <Box>
            <Grid container spacing={2} sx={{ textAlign:"center" , fontSize : "8px" , mt : 0.5 }}>
                <Grid  item xs={6}>
                { filterType === 'All' ? 'income' : '' }
                </Grid>
                <Grid item xs={6}>
                { filterType === 'Expense' || filterType === 'All' ? 'expense' : 'income' }
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ textAlign:"center" , fontSize : "20px" , fontWeight : 1000}}>
                <Grid  item xs={6} >
                    {  filterType === 'All' ? sumAmount('Income').toLocaleString() : "" }
                </Grid>
                <Grid item xs={6} >
                    { filterType === 'All' || filterType === 'Expense' ?  sumAmount('Expense').toLocaleString() : sumAmount('Income').toLocaleString() }
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ textAlign:"center" , fontSize : "8px" , mt : 0.5 }}>
                <Grid item xs={12} sx={{ textAlign : 'center' }}>
                    { filterType === 'All' ? 'balance' : '' }
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ textAlign:"center" , fontSize : "20px" , fontWeight : 1000}}>
                <Grid item xs={12} sx={{ textAlign : 'center' }} >
                    { filterType === 'All' ? (sumAmount('Income') - sumAmount('Expense')).toLocaleString() : "" }
                </Grid>
            </Grid>
            
            <Box sx={{ overflow : 'auto' , height : '90vh' }}>
                <Card  sx={{ minWidth: 275 , mt: 2 , borderRadius:'10px'  }}>
                    {/* <Typography color="GrayText" variant="body2" sx={{ textAlign:"center" , mt : 1 , mb : 1}}>
                            Transactions
                    </Typography>   */}
                    
                    <CardContent sx={{ height: "30vh" , overflow : 'auto' , mt : 1}} >
                        <List sx={styleDivide} component="nav" aria-label="mailbox folders">

                        {
                            listTransaction && Array.from(listTransaction).map((_, index) => (
                                <Box>
                                    <ListItem>
                                        <Grid container ket={index}  sx={{  fontSize : "16px"  }} color="GrayText">
                                            <Grid  item xs={10} sx={{ fontSize : "14px" }}>
                                                {_.type === 'Income' ? 'INC' : 'EXP'} - { _.category }  { _.desc ? '> ' + _.desc : ''}
                                            </Grid>
                                            <Grid item xs={2} sx={{ textAlign : "right" }}>
                                                <Unicons.UilTimesSquare onClick={() => handleConfirmDelete(_)} sx={{ cursor : 'pointer' }} size="18" className="icon-btn"/>
                                            </Grid>
                                            <Grid item xs={4} sx={{ fontSize : "10px" }}>
                                                {  formatDate(_.transactionDate) }
                                            </Grid>
                                            <Grid item xs={8} sx={{ fontSize : "14px" , textAlign : "right" }} >
                                                {   (_.type === 'Income' ? '+ ' : '- ') + _.amount.toLocaleString() }
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <Divider />
                                </Box>
                            ))
                        }
                        </List>
                    </CardContent>
                    <CardActions>
                        <Grid container spacing={1} sx={{  mt:0.8 , padding : '5px' }} >
                            <Grid  item xs={4} > 
                                <TextField
                                    select
                                    label="Key"
                                    value={searchTransaction.key}
                                    name="key"
                                    variant="outlined"
                                    onChange={onChangeInputSearch}
                                    fullWidth
                                    size="small"
                                    >
                                    {searchKey.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.key}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid  item xs={8} > 
                            { 
                            searchKey.find(x => x.value === searchTransaction.key).type === 'select' ?
                                ( <TextField 
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={searchTransaction.value} 
                                    onChange={onChangeInputSearch} 
                                    size="small" 
                                    fullWidth 
                                    label={searchTransaction.key}
                                    name={searchTransaction.key}
                                    variant="outlined" 
                                    select >
                                        {searchKey.find(x => x.value === searchTransaction.key).data.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                ) : 
                                    <LocalizationProvider dateAdapter={AdapterDateFns} >
                                        <DatePicker
                                            value={searchKey.find(x => x.value === searchTransaction.key).data}
                                            onChange={onChangeInputSearch}
                                            label="Transaction Date"
                                            name={searchTransaction.key}
                                            renderInput={(params) => (
                                                <TextField fullWidth size="small" variant="outlined" {...params} />
                                            )}
                                        />
                                    </LocalizationProvider> 
                                }
                                
                            </Grid>
                            
                        </Grid>
                    </CardActions>
                </Card>

                <Card  sx={{ minWidth: 275 , mt: 2 , mb: '40px', borderRadius:'10px' , padding : '5px'}} >

                    <CardContent sx={{ height: "140px" }}  >
                        <Grid container spacing={2} >
                            <Grid item xs={6} >
                                <TextField
                                    id="standard-select-type"
                                    select
                                    value={newTransaction.type}
                                    label="Type"
                                    name="type"
                                    variant="outlined"
                                    onChange={onChangeInput}
                                    fullWidth
                                    size="small"
                                    >
                                    {types.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6} >
                                <TextField
                                    id="standard-select-category"
                                    select
                                    label="Category"
                                    value={newTransaction.category}
                                    name="category"
                                    variant="outlined"
                                    onChange={onChangeInput}
                                    fullWidth
                                    size="small"
                                    >
                                    {categories.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6} >
                            <LocalizationProvider dateAdapter={AdapterDateFns} >
                                <DatePicker
                                    value={newTransaction.transactionDate}
                                    onChange={onChangeInput}
                                    label="Transaction Date"
                                    name="transactionDate"
                                    renderInput={(params) => (
                                        <TextField fullWidth size="small" variant="outlined" {...params} />
                                    )}
                                />
                            </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6} >
                                <TextField
                                    label="Amount"
                                    value={newTransaction.amount}
                                    name="amount"
                                    onChange={onChangeInput}
                                    placeholder="0"
                                    size="small"
                                    InputProps={{
                                        inputComponent: NumberFormatCustom,
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={8} >
                                <TextField 
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={newTransaction.desc} 
                                onChange={onChangeInput} 
                                size="small" 
                                fullWidth 
                                label="Description"
                                name="desc" 
                                variant="outlined" />
                            </Grid>
                            
                            <Grid item xs={4} >
                                <Button 
                                    disabled={createBtnDisabled} 
                                    sx={{ borderRadius : '10px'}} 
                                    onClick={submitCreate} 
                                    fullWidth 
                                    variant="contained" 
                                    color="inherit"  >
                                        <Unicons.UilCornerDownRightAlt size="27" className="icon-btn"/>
                                </Button>
                            </Grid>

                        </Grid>
                    </CardContent>
                </Card>

            </Box>
            
            <Snackbar 
                open={alert} 
                onClose={() => {setAlert(false)}} 
                autoHideDuration={1500} 
                message={alertMessage}/>

            <Dialog
                open={confirm}
                sx={{ borderRadius : '20px'}}
            >
                <DialogTitle >
                    {" Transaction delete ? "}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Type - { transactionDelete.type } |
                        Category - { transactionDelete.category } |
                        Description - { transactionDelete.desc } |
                        Amount - {transactionDelete.amount } |
                        Date - { formatDate(transactionDelete.transactionDate) } 
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setConfirm(false)}} color="inherit">Cancel</Button>
                    <Button onClick={submitDelete} color="inherit">Delete</Button>
                </DialogActions>
            </Dialog>    
      </Box>
    );
}

export default Transactions;