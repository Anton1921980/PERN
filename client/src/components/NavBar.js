import React, { useContext } from 'react';
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
import basket2 from '../assets/basket2.png'
import logout5 from '../assets/logout5.png'
import admin5 from '../assets/admin5.png'


const NavBar = observer( () =>
{
    const { user } = useContext( Context )
    const history = useHistory()

    const logOut = () =>
    {
        user.setUser( {} )
        user.setIsAuth( false )
    }


    return (
        <Navbar bg="dark" expand="lg">
            <Container>
                <NavLink style={ { color: 'white', textDecoration: 'none', fontSize: '40px' } } to={ '/' }>Idevice</NavLink>
                 <div className='d-flex flex-row flex-no-wrap justify-content-between'>
                { user.isAuth ?
                    <Nav

                        style={ { maxHeight: '100px', color: 'white' } }
                    >
                        <div
                            style={ { background: `url(${ admin5 }) no-repeat center center`, width: 30, height: 30, backgroundSize: 'cover', color: 'white', cursor: 'pointer' } }
                            variant={ 'outline-light' }
                            onClick={ () => history.push( ADMIN_ROUTE ) }
                        >
                        </div>
                        <div
                            style={ { background: `url(${ logout5 }) no-repeat center center`, width: 30, height: 30, backgroundSize: 'cover', color: 'white', cursor: 'pointer',marginLeft: '10px' } }
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
                            style={ { background: `url(${ login5 }) no-repeat center center`, width: 30, height: 30, backgroundSize: 'cover', color: 'white', cursor: 'pointer' } }
                            variant={ 'outline-light' }
                            onClick={ () => history.push( LOGIN_ROUTE ) }
                        >
                        </div>
                    </Nav>
                }
                <Nav>
                    <div
                        style={ { background: `url(${ basket2 }) no-repeat center center`, width: 30, height: 35, backgroundSize: 'cover', color: 'white', cursor: 'pointer' } }
                        className="mr-2"
                        onClick={ () => history.push( BASKET_ROUTE ) }
                    >

                    </div>
                </Nav>
                </div> 
            </Container>
        </Navbar>
    );
} );

export default NavBar;