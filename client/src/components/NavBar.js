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
import basket5 from '../assets/basket5.png'
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
                                style={ { background: `url(${ basket5 }) no-repeat center center`, width: 30, height: 35, backgroundSize: 'cover', color: 'white', cursor: 'pointer', position: 'relative', bottom: '5px' } }
                                className="mr-2"
                                onClick={ () => history.push( BASKET_ROUTE ) }
                            >

                            </div>
                        </Nav>
                    </div>
                </div>
            </Container>
        </Navbar>
    );
} );

export default NavBar;