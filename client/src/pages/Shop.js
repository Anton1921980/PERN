import React, { useContext, useEffect } from 'react';
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TypeBar from "../components/TypeBar";
import BrandBar from "../components/BrandBar";
import DeviceList from "../components/DeviceList";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchBrands, fetchDevices, fetchTypes } from "../http/deviceAPI";
import Pages from "../components/Pages";
import { useHistory, useLocation } from 'react-router-dom';
// import { set } from 'mobx';


const Shop = observer( () =>
{
    const { device } = useContext( Context )
    const history = useHistory()


    const location = useLocation()
    const path = location.search

    // console.log( "TCL: path", path )

    const queryString = require( "query-string" )
    const parsed = queryString.parse( location.search )
    console.log( "TCL: parsed.types", parsed.types )

    let parsedTypes
    parsed.types ? parsedTypes = +parsed.types : parsedTypes = null
    let parsedBrands
    parsed.brands ? parsedBrands = +parsed.brands : parsedBrands = null


    let linked = undefined;//переход по урл
    // let initial = undefined;
    path && ( path.length > 16 ) ? linked = 1 : linked = undefined
    // linked === undefined ? initial = 1 : initial = undefined

    // console.log( "TCL: initial", initial )
    // console.log( "TCL: linked", linked )
    // useEffect первая загрузка все товары или по query string в url
    let string

    //отрабатывает один раз при переходе по url или на /shop
    useEffect( () =>
    {
        if ( linked === 1 )//загрузка по строке
        {
            string = 1

            fetchTypes().then( data =>
            {
                device.setTypes( data )
                device.setSelectedType( { id: parsedTypes } )
            } )

            fetchBrands(parsedTypes ).then( data =>
            {
                device.setBrands( data )
                device.setSelectedBrand( { id: +parsedBrands } )
            } )

            fetchDevices( parsedTypes, parsedBrands, parsed.page, parsed.limit ).then( data =>
            {
                device.setDevices( data.rows )
                device.setTotalCount( data.count )
            } )

            console.log( 'device по строке:', device )
        }


        else//загрузка первичная /shop все товары 
        {
            fetchTypes().then( data => device.setTypes( data ) )

            fetchBrands().then( data => device.setBrands( data ) )

            fetchDevices( null, null, device.page, device.limit ).then( data =>
            {
                device.setDevices( data.rows )
                device.setTotalCount( data.count )
            } )
            console.log( 'device без фильтров:', device )
        }
    }, [] )

    //пока аcинхронно грузятся отфильтрованые товары успевает второй useEffect отработать создать пустую строку

    // useEffect для фильтров
    useEffect( () =>
    {
        let type = "";
        let brand = "";
        if ( string !== 1 )
        {
            // device.selectedType.name && ( device.selectedType.name ).length > 0 ? type = `types=${ device.selectedType.name }` : type = ''
            // device.selectedBrand.name && ( device.selectedBrand.name ).length > 0 ? brand = `&brands=${ device.selectedBrand.name }` : brand = ''

            device.selectedType.id ? type = `types=${ device.selectedType.id }` : type = ''
            device.selectedBrand.id ? brand = `&brands=${ device.selectedBrand.id }` : brand = ''

            let query = `${ type }${ brand }&page=${ device.page }&limit=${ device.limit }`;
            console.log( "TCL: query", query )

            history.push( `/shop/?${ query }` )

            fetchDevices( device.selectedType.id, device.selectedBrand.id, device.page, device.limit ).then( data =>
            {
                device.setDevices( data.rows )
                device.setTotalCount( data.count )

                console.log( "TCL: device с фильтрами", device );
            } )
            fetchBrands( parsedTypes ).then( data =>
            {
                device.setBrands( data )
                // device.setSelectedBrand( { id: +parsedBrands } )

                console.log( "fetch brands2" )

            } )
        }
    }, [ device.page, device.selectedType, device.selectedBrand, parsedTypes, parsed.page, history, string, device ] )
    // }, [  ] )




    return (
        <Container>
            <Row className="mt-2">
                <Col md={ 3 }>
                    <TypeBar seltype={ parsed.type } />
                </Col>
                <Col md={ 9 }>
                    <BrandBar />
                    <Pages />
                    <DeviceList />
                </Col>
            </Row>
        </Container>
    );
} );

export default Shop;