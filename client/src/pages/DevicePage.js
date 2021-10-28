import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap';
import bigStar from '../assets/bigStar.png'
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { fetchBrands, fetchOneDevice, fetchTypes } from '../http/deviceAPI';


const DevicePage = observer(() =>
{
    const { device } = useContext( Context )
    console.log("TCL: device", device)
    useEffect(() => {
        fetchTypes().then(data => device.setTypes(data))
        fetchBrands().then(data => device.setBrands(data))
        console.log('device:',device)
    }, [])

    
    const [ device1, setdevice1 ] = useState( { info: [] } )
    const { id } = useParams()

    useEffect( () =>
    {
        fetchOneDevice( id ).then( data => setdevice1( data ) )
    }, [] )

    // const device1 = { id: 1, name: 'Iphone 12pro', price: 158566, rating: 5, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' }
    // const description = [
    //     { id: 1, title: 'Оперативная память', description: '5 gb' },
    //     { id: 2, title: 'Камера', description: '48 mp' },
    //     { id: 3, title: 'Процессор', description: '2 ghz' },
    //     { id: 4, title: 'Аккумулятор', description: '4000 mah' },
    // ]
    return (
        <Container>
            <Row className='mt-3'>
                <Col md={ 4 }>
                    <Image width={ 300 } height={ 300 } src={ process.env.REACT_APP_API_URL + device1.img } />
                </Col>
                <Col md={ 4 }>
                    <div className='d-flex flex-column'>
                        <h2>{ device1.name }&nbsp;
                        { device.brands.map( brand =>
                        <span key={ brand.id }>
                            { brand.id === device1.brandId ? brand.name : '' }
                        </span>
                    ) }&nbsp;
                     { device.types.map( type =>
                        <span key={ type.id }>
                            { type.id === device1.typeId ? type.name : '' }
                        </span>
                    ) }
                        </h2>
                        <div
                            className="d-flex align-items-center justify-content-center"
                            style={{background: `url(${bigStar}) no-repeat center center`, width:240, height: 240, backgroundSize: 'cover', fontSize:64}}
                        >
                            {device1.rating}
                        </div>

                    </div>
                </Col>
                <Col md={ 4 }>
                    <Card className='d-flex flex-column align-items-center justify-content-around'
                        style={ { width: 300, height: 300, fontSize: 32, border: '5px solid grey' } }
                    >
                        <h3>{ device1.price } грн</h3>
                        <Button variant={ 'outline-dark' }>В корзину</Button>
                    </Card>
                </Col>
            </Row>
            <Row className='d-flex flex-column m-3'>
                <h1 >Характеристики:</h1>
                { device1.info.map( ( info, index ) =>
                    <Row key={ info.id } style={ { background: index % 2 === 0 ? 'lightgrey' : 'transparent', padding: 5 } }>
                        { info.title }:{ info.description }
                    </Row> ) }
            </Row>
        </Container>
    )
})

export default DevicePage