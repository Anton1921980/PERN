import React, { useContext, useEffect, useState } from 'react';
import { Card, Container, Row, Col } from "react-bootstrap";
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
    const parsed = queryString.parse( path )
    console.log( "TCL: parsed.types", parsed.types )

    let parsedTypes
    parsed.types ? parsedTypes = +parsed.types : parsedTypes = null
    let parsedBrands
    parsed.brands ? parsedBrands = +parsed.brands : parsedBrands = null

    let shopUrl = undefined;//переход по урл /shop
    let linked = undefined;//переход по урл querystring

    path && ( path.length > 16 ) ? linked = 1 : linked = undefined

    !path ? shopUrl = 1 : shopUrl = undefined

    const [ fetched, setFetched ] = useState( false )

    const [ chosen, setChosen ] = useState( false )




    //отрабатывает один раз при переходе по url или на /shop
    useEffect( () =>
    {
        if ( linked === 1 )//загрузка по строке
        {


            fetchTypes().then( data =>
            {
                device.setTypes( data )
                device.setSelectedType( { id: parsedTypes } )
            } )

            fetchBrands( parsedTypes ).then( data =>
            {
                device.setBrands( data )
                device.setSelectedBrand( { id: parsedBrands } )
            } )

            fetchDevices( parsedTypes, parsedBrands, parsed.page, parsed.limit, parsed.sort ).then( data =>
            {
                device.setDevices( data.rows )
                device.setTotalCount( data.count )
            } )
setFetched(true)
            console.log( 'device по строке:', device )
        }


        else if ( shopUrl === 1 ) //загрузка первичная /shop все товары 
        {
            fetchTypes().then( data => device.setTypes( data ) )

            fetchBrands().then( data => device.setBrands( data ) )

            fetchDevices( null, null, device.page, device.limit, device.sort ).then( data =>
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
        let sort = "";

        // if ( !fetched )
        // {
      

            device.selectedType.id ? type = `types=${ device.selectedType.id }` : type = ''
            device.selectedBrand.id ? brand = `&brands=${ device.selectedBrand.id }` : brand = ''
            device.sort ? ( sort = `&sort=${ device.sort }` ): sort =''
    
            let query = `${ type }${ brand }&page=${ device.page }&limit=${ device.limit }${ sort }`;
    
            console.log( "TCL: query", query )
    
            history.push( `/shop/?${ query }` )

        fetchBrands( device.selectedType.id ).then( data =>
        {
            device.setBrands( data )

            console.log( "fetch brands2" )

        } )
        fetchDevices( device.selectedType.id, device.selectedBrand.id, device.page, device.limit, device.sort ).then( data =>
        {
            device.setDevices( data.rows )
            device.setTotalCount( data.count )
            // device.setSort( data.sort )

            console.log( "TCL: device с фильтрами", device );
        } )


        // }
    }, [ device.selectedType, device.selectedBrand, device.sort, device.page ] )






    // useEffect( () =>
    // {
    //     let type = "";
    //     let brand = "";
    //     let sort = "";


    //     // else if ( device.selectedType.id || device.selectedBrand.id || device.sort || device.page ) //загрузка по фильтрам
    //     // {
    //     device.selectedType.id ? type = `types=${ device.selectedType.id }` : type = ''
    //     device.selectedBrand.id ? brand = `&brands=${ device.selectedBrand.id }` : brand = ''
    //     device.sort ?  sort = `&sort=${ device.sort }` : sort = ''

    //     let query = `${ type }${ brand }&page=${ device.page }&limit=${ device.limit }${ sort }`;
    //     console.log( "TCL: query", query )

    //     history.push( `/shop/?${ query }` )

    //     fetchTypes().then( data =>
    //     {
    //         device.setTypes( data )
    //         device.setSelectedType( { id: parsedTypes } )
    //     } )

    //     fetchBrands( parsedTypes ).then( data =>
    //     {
    //         device.setBrands( data )
    //         device.setSelectedBrand( { id: +parsedBrands } )
    //     } )

    //     fetchDevices( device.selectedType.id, device.selectedBrand.id, device.page, device.limit, device.sort ).then( data =>
    //     {
    //         device.setDevices( data.rows )
    //         device.setTotalCount( data.count )
    //         // device.setSort( data.sort )

    //         console.log( "TCL: device с фильтрами", device );
    //     } )


    // }
    // }, [ parsed.page, parsed.selectedType,parsed.selectedBrand, parsed.sort ] )


    return (
        <Container>
            <Row className="mt-2">
                <Col md={ 3 }>
                    <TypeBar seltype={ parsed.type } />
                </Col>
                <Col md={ 9 }>
                    <BrandBar />
                    <div className='d-flex justify-content-between'>
                        <Pages />
                        <div className='d-flex'>
                            <Card
                                className='p-1'
                                style={ { cursor: 'pointer', height: '2.5rem' } }
                                border={ 'DESC' === device.sort ? 'dark' : 'light' }
                            >
                                { chosen === false ?
                                    <div
                                        onClick={ () => { setChosen( true ); device.setSort( 'DESC' ) } }
                                    >-price
                                    </div>
                                    :
                                    ( 'DESC' === device.sort ) ? (
                                        <div
                                            onClick={ () => { setChosen( false ); device.setSort( '' ) } }
                                        >-price
                                        </div> )
                                        :
                                        ( <div
                                            onClick={ () => { setChosen( true ); device.setSort( 'DESC' ) } }
                                        >-price
                                        </div> )
                                }
                            </Card>
                            <Card
                                className='p-1'
                                style={ { cursor: 'pointer', height: '2.5rem' } }
                                border={ 'ASC' === device.sort ? 'dark' : 'light' }
                            >
                                { chosen === false ?
                                    <div
                                        onClick={ () => { setChosen( true ); device.setSort( 'ASC' ) } }
                                    >+price
                                    </div>
                                    :
                                    ( 'ASC' === device.sort ) ? (
                                        <div
                                            onClick={ () => { setChosen( false ); device.setSort( '' ) } }
                                        >+price
                                        </div> )
                                        :
                                        ( <div
                                            onClick={ () => { setChosen( true ); device.setSort( 'ASC' ) } }
                                        >+price
                                        </div> )
                                }
                            </Card>
                        </div>
                    </div>
                    <DeviceList />
                </Col>
            </Row>
        </Container>
    );
} )

export default Shop;