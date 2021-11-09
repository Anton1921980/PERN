import React, { useContext, useEffect } from 'react';
import {  Container } from 'react-bootstrap';
// import bigStar from '../assets/bigStar.png'
// import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { fetchBrands, fetchTypes } from '../http/deviceAPI';


const Main = observer(() =>
{
    const { device } = useContext( Context )
    console.log("TCL: device", device)
    useEffect(() => {
        fetchTypes().then(data => device.setTypes(data))
        fetchBrands().then(data => device.setBrands(data))
        console.log('device:',device)
    }, [])

   

   

    // const device1 = { id: 1, name: 'Iphone 12pro', price: 158566, rating: 5, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' }
    // const description = [
    //     { id: 1, title: 'Оперативная память', description: '5 gb' },
    //     { id: 2, title: 'Камера', description: '48 mp' },
    //     { id: 3, title: 'Процессор', description: '2 ghz' },
    //     { id: 4, title: 'Аккумулятор', description: '4000 mah' },
    // ]


    //  Создаём функцию для записи 
   
    return (
        <Container>
           <div>MAIN PAGE</div>
        </Container>
    )
})

export default Main