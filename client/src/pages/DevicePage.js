import React from 'react';
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap';
import bigStar from '../assets/bigStar.png'

const DevicePage = () =>
{
    const device = { id: 1, name: 'Iphone 12pro', price: 158566, rating: 5, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' }
    const description = [
        { id: 1, title: 'Оперативная память', description: '5 gb' },
        { id: 2, title: 'Камера', description: '48 mp' },
        { id: 3, title: 'Процессор', description: '2 ghz' },
        { id: 4, title: 'Аккумулятор', description: '4000 mah' },
    ]
    return (
        <Container>
            <Row className='mt-2'>
                <Col md={ 4 }>
                    <Image width={ 300 } height={ 300 } src={ device.img } />
                </Col>
                <Col md={ 4 }>
                    <div className='d-flex flex-column'>
                        <h2>{ device.name }</h2>
                        <div
                            className='d-flex align-items-center justufy-content-center'
                            style={ { background: `url(${ bigStar }) no-repeat center center`, width: 240, height: 240, backgroundSize: 'cover' } }
                        ></div>

                    </div>
                </Col>
                <Col md={ 4 }>
                    <Card className='d-flex flex-column align-items-center justify-content-around'
                        style={ { width: 300, height: 300, fontSize: 32, border: '5px solid grey' } }
                    >
                        <h3>{ device.price } грн</h3>
                        <Button variant={ 'outline-dark' }>В корзину</Button>
                    </Card>
                </Col>
            </Row>
            <Row className='d-flex flex-column m-3'>
                <h1 >Характеристики:</h1>
                { description.map( ( info, index ) =>
                    <Row key={ info.id } style={ { background: index % 2 === 0 ? 'lightgrey' : 'transparent', padding: 5 } }>
                        { info.title }:{ info.description }
                    </Row> ) }
            </Row>
        </Container>
    )
}

export default DevicePage