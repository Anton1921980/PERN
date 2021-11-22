import React, { useContext, useEffect, useState } from 'react';
import { Context } from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
// import { ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import Container from "react-bootstrap/Container";
import { useHistory } from 'react-router-dom';
import login5 from '../assets/login5.png'
import basket5 from '../assets/basket5.png'
import logout5 from '../assets/logout5.png'
import admin5 from '../assets/admin5.png'
import { getBasket } from '../http/deviceAPI';

const NavBar = observer( () =>
{
    const { user } = useContext( Context )
    const { device } = useContext( Context )
    const history = useHistory()
    const [ font, setFont ] = useState( [ 10, 'normal' ] )
    const [ basketLocal, setBasketLocal ] = useState( '' )

    useEffect( () =>
    {
        setFont( [ 15, 'bold' ] );
        setTimeout( () => { setFont( [ 10, 'normal' ] ) }, 1500 )
        device.localBasket ? setBasketLocal( device.localBasket ) : setBasketLocal( '' )
        console.log( "TCL: basketLocal 2", basketLocal )
    }, [ device.localBasket ] )

    useEffect( () =>
    {

        let length2 = ( JSON.parse( localStorage.getItem( 'ids' ) ) ) && ( JSON.parse( localStorage.getItem( 'ids' ) ) ).length
        length2 ? setBasketLocal( length2 ) : setBasketLocal( '' )
        console.log( "TCL: basketLocal", length2 )
        setTimeout( () => { setFont( [ 15, 'bold' ] ) }, 1500 )
    }, [] )



    const logOut = () =>
    {
        user.setUser( {} )
        user.setIsAuth( false )
    }

    useEffect( () =>
    {
        setFont( [ 15, 'bold' ] );
        getBasket().then( data =>
        {
            device.setBaskets( data );
            setTimeout( () => { setFont( [ 10, 'normal' ] ) }, 1500 )
        } )

    }, [ device.basket.length ] )

    return (
        <Navbar bg="dark" expand="lg" style={ { width: '100%', position: 'sticky', top: 0, zIndex: 11 } }>
            <Container>
                <NavLink style={ { color: 'white', textDecoration: 'none', fontSize: '40px' } } to={ '/' }>Idevice</NavLink>
                <div className='d-flex flex-row flex-no-wrap justify-content-between'>
                    <div className='mr-3'>
                        { user.isAuth ?
                            <Nav className='flex-row'
                                style={ { maxHeight: '100px', color: 'white' } }
                            >
                                <div
                                    style={ { backgroundImage: `url(${ admin5 })`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', width: 30, height: 30, backgroundSize: 'cover', color: 'white', cursor: 'pointer', marginRight: '20px' } }
                                    variant={ 'outline-light' }
                                    onClick={ () => history.push( ADMIN_ROUTE ) }
                                >
                                </div>
                                <div
                                    style={ { backgroundImage: `url(${ logout5 })`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', width: 30, height: 30, backgroundSize: 'cover', color: 'white', cursor: 'pointer', marginRight: '20px' } }
                                    variant={ 'outline-light' }
                                    onClick={ () => logOut() }
                                    className="ml-2"
                                >
                                </div>
                            </Nav>
                            :
                            <Nav

                                style={ { maxHeight: '100px', color: 'white' } }
                            >
                                <div
                                    style={ { backgroundImage: `url(${ login5 })`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', width: 37, height: 34, backgroundSize: 'cover', color: 'white', cursor: 'pointer', marginRight: '20px', position: 'relative', bottom: '4px' } }
                                    variant={ 'outline-light' }
                                    onClick={ () => history.push( LOGIN_ROUTE ) }
                                >
                                </div>
                            </Nav>
                        }
                    </div>
                    <div>
                        <Nav>
                            <div
                                style={ { background: `url(${ basket5 }) no-repeat center center`, width: 30, height: 35, backgroundSize: 'cover', color: 'white', cursor: 'pointer', position: 'relative', bottom: '4.5px' } }
                                className="mr-2 d-flex justify-content-center align-items-end"
                                onClick={ () => user.isAuth ? history.push( BASKET_ROUTE ) : alert( 'Please login or register to see basket' ) }
                            >
                                <span style={ { fontSize: font[ 0 ], fontWeight: font[ 1 ] } }>
                                    { user.isAuth ? device.basket.length : basketLocal }
                                </span>
                            </div>
                        </Nav>
                    </div>
                </div>
            </Container>
        </Navbar>
    );
} );

export default NavBar