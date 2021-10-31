import React, { useEffect } from 'react';
import { useContext } from 'react';
import { Context } from '..';
import { deleteFromBasket, getBasket } from '../http/deviceAPI';

import { Card, Col, Container, Row } from 'react-bootstrap'
import { observer } from 'mobx-react-lite';

import close from '../assets/close.svg'

const Basket = observer( () =>
{
    const { device } = useContext( Context )

    useEffect( () =>
    {
        getBasket().then( data => device.setBaskets( data ) )
    }, [] )



    //Считаем общую сумму, которую юзер набрал в корзину

    let prices = 0;
    {
        device.basket.map( price =>
            prices += Number( price.device.price )
        )
    }
    return (
        <Container
            className="d-flex flex-sm-column justify-content-center align-items-center mt-3"
        >
            <h1 className="pb-2">Корзина</h1>






            { device.basket.map( product =>
                <Card className="d-flex w-100 p-2 justify-content-center mb-2" key={ product.id }>
                    <Row className="d-flex w-100">
                        <Col>
                            <div className="d-flex flex-row align-items-center">
                                <img src={ process.env.REACT_APP_API_URL + product.device.img } width={ 50 } />
                                <h1 className="pl-3">{ product.device.name }</h1>
                            </div>
                        </Col>
                        <Col>
                            <div className="d-flex h-100 flex-row justify-content-end align-items-center">
                                <h4 className="font-weight-light">{ product.device.price } грн</h4>
                            </div>
                        </Col>
                    </Row>

                </Card>
            ) }

            <Card className="d-flex flex-row  p-2 justify-content-between align-items-center mb-2 align-self-end">
                <h3 className="pr-2">Итого: </h3>
                <h3 className="pl-2"> &nbsp;{ prices } <span className="font-weight-light pl-2"> грн</span></h3>
            </Card>
        </Container>
    )
} )
export default Basket