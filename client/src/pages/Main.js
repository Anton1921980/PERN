import React, { useContext, useEffect } from 'react';
import { Col, Container } from 'react-bootstrap';
// import bigStar from '../assets/bigStar.png'
// import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { fetchBrands, fetchTypes } from '../http/deviceAPI';
import { SliderHomepage } from '../components/Slider/Slider';
import TypeBar from '../components/TypeBar';
import { useHistory } from 'react-router-dom';

const Main = observer( () =>
{
    const { device } = useContext( Context )
    const history = useHistory()

    console.log( "TCL: device", device )

    useEffect( () =>
    {
        fetchTypes().then( data => device.setTypes( data ) )
        fetchBrands().then( data => device.setBrands( data ) )
        console.log( 'device:', device )
    }, [] )

    useEffect( () =>
    {
        if ( +device.selectedType.id > 0 )
        {
            let query = `&types=${ device.selectedType.id }&page=${ device.page }&limit=${ device.limit }`;

            console.log( "TCL: query", query )

            history.push( `/shop/?${ query }` )
        }
    }, [ device.selectedType.id ] )


    return (
        <Container className='d-flex flex-column flex-lg-row mt-3'>
            {/* <h1>MAIN PAGE</h1> */ }
            <Col className='col-12 col-lg-6'>
                <TypeBar main="main"/>
            </Col>
            <Col className='col-12 col-lg-6'>
                <SliderHomepage
                    dots={ true }
                    center={ false }
                    auto={ true }
                    homePage={ true }
                    show={ 1 }                   
                    width={ '100%' }
                    arrows={ false } />
            </Col>
        </Container>
    )
} )

export default Main