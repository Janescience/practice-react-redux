import React , { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Routes ,BrowserRouter, Route , Link } from "react-router-dom";
import { Grid  , Button , Box } from '@mui/material';
import "./App.css";
import * as Unicons from '@iconscout/react-unicons';

import Login from "./components/Login";
import Transactions from "./components/Transactions";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from "./helpers/history";


const App = () => {

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  const logOut = () => {
    dispatch(logout());
  };

  const today = () => {
    const currentDate = new Date();
    const dd = currentDate.getDate().toString().padStart(2, '0')
    const mm = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const yyyy = currentDate.getFullYear();
    return dd + '.' + mm + '.' + yyyy
  }

  return (
              <BrowserRouter history={history}>

    <div >
      <Box sx={{ padding : '8px'}}>
        {currentUser ? (
          <Grid container spacing={2} sx={{ textAlign : 'center' , fontSize : '12px'}}>
            <Grid item xs={12} >
              { currentUser.name }  |  { today() }
            </Grid>
          </Grid>
        ) : "" }
            <Routes>
              <Route exact path="/login" element={<Login/>} />
              <Route exact path="/transactions" element={<Transactions/>} />
            </Routes>

            {currentUser ? (
              <Grid container spacing={2} sx={{ backgroundColor : '#E5E5E5' , position: 'fixed', bottom: 5 }}>
                <Grid item xs sx={{ textAlign : "left" }}>
                  <Link to={"/login"}> <Button onClick={logOut} sx={{ borderRadius : '7px' , backgroundColor : 'white'}} variant="contained"  size="large" ><Unicons.UilSignInAlt size="20" className="icon-btn"/> </Button></Link>
                </Grid>
                <Grid item xs sx={{ mb : '10px' }}>
                  <Button  ton sx={{ borderRadius : '7px' , backgroundColor : 'white' , mr:1}} variant="contained"  size="large" ><Unicons.UilFilePlusAlt size="20" className="icon-btn"/></Button>
                  <Button sx={{ borderRadius : '7px' , backgroundColor : 'white'}} variant="contained"  size="large" ><Unicons.UilChart size="20" className="icon-btn"/></Button>
                </Grid>
              </Grid>
          ) : "" }
      </Box>
      
    </div>
    </BrowserRouter>  

  );
}

export default App;
