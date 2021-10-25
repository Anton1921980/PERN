import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import { Context } from '../index';
import { authRoutes, publicRoutes } from '../routes';
import { SHOP_ROUTE } from '../utils/consts';
import { observer } from "mobx-react-lite";

const AppRouter = observer( () =>
{
    const { user } = useContext( Context )
    
    console.log( "TCL: user", user )
    // const isAuth = false;
    return (
        <Switch>
            { user.isAuth && authRoutes.map( ( { path, Component } ) =>
                <Route key={ path } path={ path } component={ Component } exact />

            ) }
            { publicRoutes.map( ( { path, Component } ) =>
                <Route key={ path } path={ path } component={ Component } exact />

            ) }
            <Redirect to={ SHOP_ROUTE } />
        </Switch>
    )
} )

export default AppRouter