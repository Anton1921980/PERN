import React from 'react';
import { Container, Form } from 'react-bootstrap';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
// import Row from "react-bootstrap/Row";
import { useLocation, NavLink } from 'react-router-dom';
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from '../utils/consts';

const Auth = () =>
{
    const location = useLocation()    
    let isLogin = (location.pathname === LOGIN_ROUTE) //без скобок не работает?
   
    console.log( "TCL: isLogin", isLogin )

    return (
        <Container
            className='d-flex justify-content-center align-items-center'
            style={ { height: window.innerHeight - 54 } }>
            <Card style={ { width: 600 } } className='p-5'>
                <h2 className='m-auto'>{ isLogin ? 'Авторизация' : 'Регистрация' }</h2>
                <Form className='d-flex flex-column'>
                    <Form.Control className='mt-2' placeholder="Введите email" />
                    <div className='d-flex justify-content-between mt-3 pl-3 pr-3'>
                        { isLogin ?
                            <div>
                                Нет аккаунта?<NavLink to={ REGISTRATION_ROUTE }>Зарегистрируйтесь</NavLink>
                            </div>
                            :
                            <div>
                                Есть аккаунт?<NavLink to={ LOGIN_ROUTE }>Войти</NavLink>

                            </div>
                        }
                        <Button variant={ 'outline-success' }>
                            { isLogin ? 'Войти' : 'Регистрация' }
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    )
}

export default Auth
