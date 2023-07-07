import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap';
import bigStar from '../assets/bigStar.png'
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { fetchBrands, fetchOneDevice, fetchTypes, addtoBasket, getBasket } from '../http/deviceAPI';


const DevicePage = observer( () =>
{
    const { user, device } = useContext( Context )

    console.log( "TCL: user", user )
    console.log( "TCL: device", device )

    useEffect( () =>
    {
        fetchTypes().then( data => device.setTypes( data ) )
        fetchBrands().then( data => device.setBrands( data ) )
        console.log( 'device:', device )
    }, [] )


    const [ device1, set$device1 ] = useState( { info: [] } )
    console.log("device1: ", device1);
    const { id } = useParams()

    useEffect( () =>
    {
        fetchOneDevice( id ).then( data => set$device1( data ) )
    }, [] )

    // const device1 = { id: 1, name: 'Iphone 12pro', price: 158566, rating: 5, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' }
    // const description = [
    //     { id: 1, title: 'Оперативная память', description: '5 gb' },
    //     { id: 2, title: 'Камера', description: '48 mp' },
    //     { id: 3, title: 'Процессор', description: '2 ghz' },
    //     { id: 4, title: 'Аккумулятор', description: '4000 mah' },
    // ]   


  const add = async () =>
    {
        const formData = new FormData()
        await formData.append( 'deviceId', id )
        //await addtoBasket( formData ).then( response => alert( `Товар ` + device1.name + ` был добавлен в вашу корзину!` ) )
        await addtoBasket( formData )
        await getBasket().then( data => device.setBaskets( data ) )
    }

    const addLocal = async () =>
    {
        const arr = JSON.parse( localStorage.getItem( 'ids' ) ) || []
        const ids = [ ...arr,id ]
        localStorage.setItem( 'ids', JSON.stringify( ids ) )
      device.setLocalBasket( JSON.parse(localStorage.getItem('ids')).length ) 
      
    }

    return (
        <Container>
            <Row className='mt-3'>
                <Col md={ 3 }>
                    <div style={ { width: '100%', overflow: 'hidden' } }>
                        <Image style={ { objectFit: 'contain', width: '70%' } } src={ '/' + device1.img } />
                    </div>
                </Col>
                <Col md={ 9 } >
                    <div className='d-flex flex-column'>
                        <h2>{ device1.name }&nbsp;
                            <div style={ { color: 'lightgrey' } }>
                                { device.brands.map( (brand,i) =>
                                    <span key={ i }>
                                        { brand.id === device1.brandId ? brand.name : '' }
                                    </span>
                                ) }&nbsp;
                                { device.types.map( (type,i) =>
                                    <span key={ i }>
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
                                { user.isAuth ?
                                    <Button
                                        variant={ "outline-dark" }
                                        onClick={ add }
                                    >Добавить в корзину</Button>
                                    :
                                    <Button
                                        variant={ "outline-dark" }
                                        onClick={ addLocal }
                                    >Добавить в корзину</Button>
                                }
                            </Card>
                        </div>


                    </div>
                </Col>

            </Row>
            <Row className='d-flex flex-column m-3'>
                <h1 >Характеристики:</h1>
                { device1.info.map( ( info, index ) =>
                    <Row key={ index } style={ { background: index % 2 === 0 ? 'lightgrey' : 'transparent', padding: 5 } }>
                        { info.title }:{ info.description }
                    </Row> ) }
            </Row>
        </Container>
    )
} )

export default DevicePage