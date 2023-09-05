import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserStore from './store/UserStore';
import DeviceStore from './store/DeviceStore';

const dotenv = require("dotenv"); 
dotenv.config(); 
// dotenv.config({ path: "./.env.production" }); 
console.log('env',process.env.NODE_ENV);

export const Context = createContext( null )

ReactDOM.render(
  <Context.Provider value={{
    user: new UserStore(),
    device: new DeviceStore(),

  }}>
    <App />
  </Context.Provider>
  ,
  document.getElementById( 'root' )
);


