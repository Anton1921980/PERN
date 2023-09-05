import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import { Context } from '../index';
import { authRoutes, publicRoutes } from '../routes';
import { MAIN_ROUTE } from '../utils/consts';
import { observer } from "mobx-react-lite";

const AppRouter = observer( () =>
{
    const { user } = useContext( Context );
    // const isAuth = false;
    return (

        <Switch>
            { user.isAuth && authRoutes.map( ( { path, Component }, i ) =>
                <Route key={ i } path={ path } component={ Component } exact />

            ) }
            { publicRoutes.map( ( { path, Component }, i ) =>
                <Route key={ i } path={ path } component={ Component } exact />

            ) }
            <Redirect to={ MAIN_ROUTE } />
            {/* <Redirect to={ SHOP_ROUTE } /> */ }
        </Switch>

    )
} )

export default AppRouter