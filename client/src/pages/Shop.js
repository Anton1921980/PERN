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

    let type = "";
    let brand = "";
    let sort = "";

    // console.log( "TCL: path", path )

    const queryString = require( "query-string" )
    const parsed = queryString.parse( path )
    console.log( "TCL: parsed.types", parsed.types )

    let parsedTypes
    parsed.types ? parsedTypes = +parsed.types : parsedTypes = null
    let parsedBrands
    parsed.brands ? parsedBrands = +parsed.brands : parsedBrands = null
    let parsedSort
    parsed.sort ? parsedSort = parsed.sort : parsedSort = ''
    console.log("TCL: parsed.sort", parsed.sort)
  

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
                device.setSort( parsedSort )
            } )

            fetchDevices( parsedTypes, parsedBrands, parsed.page, parsed.limit, parsedSort ).then( data =>
            {
                device.setDevices( data.rows )
                device.setTotalCount( data.count )
                // device.setSort( parsedSort )
            } )
            setFetched( true )
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


        // if ( !fetched )
        // {


       

        fetchBrands( device.selectedType.id ).then( data =>
        {
            device.setBrands( data )

            console.log( "fetch brands2" )

        } )
        fetchDevices( device.selectedType.id, device.selectedBrand.id, device.page, device.limit, device.sort ).then( data =>
        {
            device.setDevices( data.rows )
            device.setTotalCount( data.count )
            
            device.selectedType.id ? type = `types=${ device.selectedType.id }` : type = ''
           
            device.selectedBrand.id ? brand = `&brands=${ device.selectedBrand.id }` : brand = ''
          
            device.sort ? ( sort = `&sort=${ device.sort }` ) : sort = ''
          
    
            let query = `${ type }${ brand }&page=${ device.page }&limit=${ device.limit }${ sort }`;
    
            console.log( "TCL: query", query )
    
            history.push( `/shop/?${ query }` )



            console.log( "TCL: device с фильтрами", device );
        } )


        // }
    }, [ device.selectedType, device.selectedBrand, device.sort, device.page ] )


    //если нет этого бренда в категории, а он был активен удалить из строки или сбросить из селектед
    //сделать чтобы отображались только категории которые в этом бренде?






    return (
        <Container>
            <Row className="mt-3">
                <Col md={ 3 }>
                    <TypeBar seltype={ parsed.type } />
                </Col>
                <Col md={ 9 }>
                    <BrandBar />
                    <div className='d-flex justify-content-end'>
                        <Pages />
                        <div className='d-flex align-items-center ml-5'>
                            <Card
                                className='p-1'
                                style={ { cursor: 'pointer', height: '2.5rem' } }
                                border={ 'DESC' === device.sort ? 'dark' : 'light' }
                            >
                                { chosen === false ?
                                    <div style={ { width: '100%', height: '100%' } }
                                        onClick={ () => { setChosen( true ); device.setSort( 'DESC' ) } }
                                    >-price
                                    </div>
                                    :
                                    ( 'DESC' === device.sort ) ? (
                                        <div style={ { width: '100%', height: '100%' } }
                                            onClick={ () => { setChosen( false ); device.setSort( '' ) } }
                                        >-price
                                        </div> )
                                        :
                                        ( <div style={ { width: '100%', height: '100%' } }
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
                                    <div style={ { width: '100%', height: '100%' } }
                                        onClick={ () => { setChosen( true ); device.setSort( 'ASC' ) } }
                                    >+price
                                    </div>
                                    :
                                    ( 'ASC' === device.sort ) ? (
                                        <div style={ { width: '100%', height: '100%' } }
                                            onClick={ () => { setChosen( false ); device.setSort( '' ) } }
                                        >+price
                                        </div> )
                                        :
                                        ( <div style={ { width: '100%', height: '100%' } }
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