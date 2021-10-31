import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
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
import { useHistory, useLocation, useParams } from 'react-router';
import querystring from "query-string";
import { set } from 'mobx';


const Shop = observer( () =>
{
    const { device } = useContext( Context )
    const history = useHistory()


    const location = useLocation()
    const path = location.search

    // console.log( "TCL: path", path )

    const queryString = require( "query-string" )
    const parsed = queryString.parse( location.search )

    // console.log( "TCL: parsed", parsed )

    let linked = undefined;
    let initial = undefined;
    path && ( path.length > 16 ) ? linked = 1 : linked = undefined
    linked === undefined ? initial = 1 : initial = undefined

    // console.log( "TCL: initial", initial )
    // console.log( "TCL: linked", linked )
    // useEffect первая загрузка все товары или по query string в url
    let string


    useEffect( () =>
    {
        if ( linked === 1 )//загрузка по строке
        {
            string = 1          

            fetchTypes().then( data =>
            {
                device.setTypes( data )
                device.setSelectedType( { id: +parsed.types } )
            } )

            fetchBrands().then( data =>
            {
                device.setBrands( data )
                device.setSelectedBrand( { id: +parsed.brands } )
            } )

            fetchDevices( parsed.types, parsed.brands, parsed.page, parsed.limit ).then( data =>
            {
                device.setDevices( data.rows )
                device.setTotalCount( data.count )              
            } )

            console.log( 'device1:', device )
        }


        else//загрузка первичная
        {
            fetchTypes().then( data => device.setTypes( data ) )

            fetchBrands().then( data => device.setBrands( data ) )

            fetchDevices( null, null, 1, 3 ).then( data =>
            {
                device.setDevices( data.rows )
                device.setTotalCount( data.count )
            } )
            console.log( 'device2:', device )
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

            device.selectedType.id  ? type = `types=${ device.selectedType.id }` : type = ''
            device.selectedBrand.id  ? brand = `&brands=${ device.selectedBrand.id }` : brand = ''

            let query = `${ type }${ brand }&page=${ device.page }&limit=${ device.limit }`;
            console.log( "TCL: query", query )

            let push = history.push( `/?${ query }` )

            fetchDevices( device.selectedType.id, device.selectedBrand.id, device.page, device.limit ).then( data =>
            {
                device.setDevices( data.rows )
                device.setTotalCount( data.count )

                console.log( "TCL: device3", device );
            } )
        }
    }, [ device.page, device.selectedType, device.selectedBrand ] )





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