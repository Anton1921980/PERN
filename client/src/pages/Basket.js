import React, { useEffect } from 'react';
import { useContext } from 'react';
import { Context } from '..';
import { deleteFromBasket, getBasket } from '../http/deviceAPI';

import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';

// import close from '../assets/close.svg'

const Basket = observer( () =>
{
    const { device } = useContext( Context )

    console.log( "TCL: device", device )
 

    useEffect( () =>
    {

        if ( device.selectedBasket !== null )
        {
            deleteFromBasket( device.selectedBasket ).then( data =>
            {
                device.setSelectedBasket( null )
            } )
        }

        getBasket().then( data => device.setBaskets( data ) )

    }, [ device.selectedBasket ] )




    //Считаем общую сумму, которую юзер набрал в корзину



    let prices = 0;
    {
        ( device.basket.length > 0 ) && ( device.basket.map( price =>                       
            prices += Number( price.device.price )
        ) )
    }
    return (
        <Container
            className="d-flex flex-column justify-content-center align-items-center mt-3"
        >
            <h1 className="p-4">Корзина</h1>

            { ( device.basket.length > 0 ) && ( device.basket.map( (product,i) =>

                <Card
                    className="d-flex w-100 p-2 justify-content-center mb-2" key={ i }
                    style={ { borderBottom: '1px solid grey' } }
                >
                    <Row className="d-flex ">
                        <Col md={ 3 }>
                            <img src={ product.device.img } alt={ 'device' } height={ 60 } />
                        </Col>
                        <Col md={ 6 }>
                            <div className="d-flex h-100 flex-row justify-content-start align-items-center">
                                <NavLink to={ `/device/${ product.device.id }` } >
                                    <div className="pl-3">{ product.device.name }</div>
                                </NavLink>
                            </div>
                        </Col>
                        <Col md={ 3 }>
                            <div className="d-flex h-100 flex-row justify-content-between align-items-center">
                                <Button
                                    variant={ 'outline-dark' }
                                    onClick={ () => device.setSelectedBasket( Number( product.id ) ) }
                                >удалить
                                </Button> <h4 className="font-weight-light">{ product.device.price } грн</h4>
                            </div>
                        </Col>
                    </Row>

                </Card>

            ) ) }

            <Card className="d-flex flex-row  p-2 justify-content-between align-items-center mb-2 align-self-end">
                <h3 className="pr-2">Итого:&nbsp; </h3>
                <h4 className="pl-2"> &nbsp;{ prices } <span className="font-weight-normal pl-2"> грн</span></h4>
            </Card>
        </Container >
    )
} )
export default Basket