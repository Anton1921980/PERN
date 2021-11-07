import React, { useContext } from 'react';
import { Context } from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
// import { ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { Button} from "react-bootstrap";
import { observer } from "mobx-react-lite";
import Container from "react-bootstrap/Container";
import {  useHistory } from 'react-router-dom'

const NavBar = observer( () =>
{
    const { user } = useContext( Context )
    const history =  useHistory()

    const logOut = () =>
    {
        user.setUser( {} )
        user.setIsAuth( false )
    }


    return (
        <Navbar bg="dark" expand="lg">
            <Container>
                <NavLink style={ { color: 'white', textDecoration: 'none', fontSize: '40px' } } to={ SHOP_ROUTE }>Idevice</NavLink>
                {/* <Row className='d-flex flex-row flex-no-wrap justify-content-between'> */}
                    { user.isAuth ?
                        <Nav
                            
                            style={ { maxHeight: '100px', color: 'white' } }
                        >
                            <Button
                                variant={ 'outline-light' }
                                onClick={ () => history.push( ADMIN_ROUTE ) }
                            >Админка
                            </Button>
                            <Button
                                variant={ 'outline-light' }
                                onClick={ () => logOut() }
                                className="ml-2"
                            > Выйти
                            </Button>
                        </Nav>
                        :
                        <Nav
                           
                            style={ { maxHeight: '100px', color: 'white' } }
                        >
                            <Button
                                variant={ 'outline-light' }
                                onClick={ () => history.push( LOGIN_ROUTE ) }
                            >Авторизация
                            </Button>
                        </Nav>
                    }
                    <Nav>
                        <Button
                            variant={ "outline-light" }
                            className="mr-2"
                            onClick={ () => history.push( BASKET_ROUTE ) }
                        >
                            Корзина
                        </Button>
                    </Nav>
                {/* </Row> */}
            </Container>
        </Navbar>
    );
} );

export default NavBar;