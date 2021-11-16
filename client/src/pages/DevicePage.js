import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap';
import bigStar from '../assets/bigStar.png'
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { fetchBrands, fetchOneDevice, fetchTypes, addtoBasket } from '../http/deviceAPI';


const DevicePage = observer( () =>
{
    const { device } = useContext( Context )
    console.log( "TCL: device", device )
    useEffect( () =>
    {
        fetchTypes().then( data => device.setTypes( data ) )
        fetchBrands().then( data => device.setBrands( data ) )
        console.log( 'device:', device )
    }, [] )


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



    //если в базе id товара не подряд в корзину не добавляет ошибка на сервере
    //UnhandledPromiseRejectionWarning: SequelizeForeignKeyConstraintError: insert або update в таблиці "basket_devices" порушує обмеження зовнішнього ключа "basket_devices_deviceId_fkey"

    //   функция для записи 
    const add = async () =>
    {
        const formData = new FormData()
        await formData.append( 'deviceId', id )
        await addtoBasket( formData ).then( response => alert( `Товар ` + device1.name + ` был добавлен в вашу корзину!` ) )
    }
    return (
        <Container>
            <Row className='mt-3'>
                <Col md={ 6 }>
                    <div style={ { width: 500, height: 400, overflow: 'hidden' } }>
                        <Image style={ { objectFit: 'contain', width: '100%', height: '100%' } } src={ device1.img } />
                    </div>
                </Col>
                <Col md={ 6 } >
                    <div className='d-flex flex-column'>
                        <h2>{ device1.name }&nbsp;
                            <div style={ { color: 'lightgrey' } }>
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
                            </div>
                        </h2>
                        <div className='d-flex flex-row'>

                            <Card className='d-flex flex-row align-items-center justify-content-around'
                                style={ { width: '100%', height: 120, fontSize: 32, border: '1px solid lightgrey' } }
                            >
                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={ { background: `url(${ bigStar }) no-repeat center center`, width: 80, height: 80, backgroundSize: 'cover', fontSize: 24 } }
                                >
                                    { device1.rating }
                                </div>
                                <h3>{ device1.price } грн</h3>
                                <Button variant={ "outline-dark" } onClick={ add } >Добавить в корзину</Button>
                            </Card>
                        </div>


                    </div>
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
} )

export default DevicePage