import React, { useContext } from 'react';
import { Context } from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import { ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import Container from "react-bootstrap/Container";
import { useHistory } from 'react-router-dom'

const NavBar = observer(() =>
{
    const { user } = useContext( Context )
    return (
        <Navbar bg="dark" expand="lg">
            <Container>
            <NavLink style={ { color: 'white', textDecoration: 'none' } } to={ SHOP_ROUTE }>Idevice</NavLink>
            { user.isAuth ?
                <Nav
                    className="ml-auto"
                    style={ { maxHeight: '100px', color: 'white' } }
                >
                    {/* <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#action2">Link</Nav.Link>
                <Nav.Link href="#" disabled>Link</Nav.Link> */}
                    <Button variant={ 'outline-light' }>Админка</Button>
                    <Button variant={ 'outline-light' }className="ml-2">Войти</Button>
                </Nav>
                :
                <Nav
                    className="ml-auto"
                    style={ { maxHeight: '100px', color: 'white' } }
                >
                    <Button variant={ 'outline-light' } onClick={() => user.setIsAuth(true)} >Авторизация</Button>
                    
                </Nav>
            }
            </Container>
        </Navbar>
    );
});

export default NavBar;