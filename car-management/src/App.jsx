// App.js
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginComponent from './LoginComponent';
import RegisterComponent from './RegisterComponent';
import ShowListComponent from './ShowListComponent';
import DetailCarComponent from './DetailCarComponent';
import MyAccountComponent from './MyAccountComponent';
import MyAccountEditComponent from './MyAccountEditComponent';
import CreateComponent from './CreateComponent';
import EditComponent from './EditComponent';
import PrivateRoute from './PrivateRoute';
import ContactComponent from './ContactComponent'
import HomeComponent from './HomeComponent'
import DetailNewsComponent from './DetailNewsComponent'
import Menu from './Menu'
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  useEffect(() => {
    axios.defaults.baseURL = 'https://api-car.demo-website.click'
  }, [])

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', background: 'rgb(242 242 242)' }}>
        <div style={{ width: '992px', background: '#fff', minHeight: '100vh' }}>
          <Menu />
          <div style={{ marginTop: '10px', width: '100%' }}>
            <Switch>
              <Route exact path="/login" component={LoginComponent} />
              <Route exact path="/register" component={RegisterComponent} />
              <Route exact path="/" component={HomeComponent} />
              <Route exact path="/car" component={ShowListComponent} />
              <Route exact path="/contact" component={ContactComponent} />
              <Route exact path="/car/detail/:id" component={DetailCarComponent} />
              <Route exact path="/news/detail/:id" component={DetailNewsComponent} />
              <PrivateRoute exact path="/myaccount" component={MyAccountComponent} />
              <PrivateRoute exact path="/myaccount/edit" component={MyAccountEditComponent} />
              <PrivateRoute exact path="/create" component={CreateComponent} />
              <PrivateRoute exact path="/edit/:id" component={EditComponent} />
            </Switch>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        icon={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
