import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Card, Col, Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Context } from '../index';
import star from '../assets/star.png'
import { DEVICE_ROUTE } from '../utils/consts';




const DeviceItem = observer( ( props ) =>
{
    //берем все бренды из стора и сравниваем бренд ид товара для получение названия бренда
    const { device } = useContext( Context )
    // console.log( "TCL: device", device )

    const device1 = props.device
    // console.log( "TCL: device1", device1 )

    const history = useHistory()
    let brands = device.brands
    // console.log( "TCL: brands", brands )
    // console.log( "TCL: history", history )
    // console.log( "TCL: DEVICE_ROUTE", DEVICE_ROUTE )

    return (
        <Col className='mt-3' md={ 4 } onClick={ () => history.push( DEVICE_ROUTE + '/' + device1.id ) }>
            <Card className='ml-3' style={ { width: 250, height: 400, cursor: 'pointer' } } border={ 'light' }>
                <div style={ { width: 250, height: 250, overflow: 'hidden' } }>
                    <Image style={ { objectFit: 'contain', width: '100%', height: '100%' } }
                        src={ 'https://pern-server-seven.vercel.app/'+ device1.img } />
                </div>
                <div className="text-black-50 mt-3 d-flex justify-content-between align-items-center">
                    <div className='d-flex align-items-center'>
                        <div>
                            { device.brands.map( (brand,i )=>
                                <span key={ i }>
                                    { brand.id === device1.brandId ? brand.name : '' }
                                </span>
                            ) }&nbsp;
                            { device.types.map( (type,i) =>
                                <span key={ i }>
                                    { type.id === device1.typeId ? type.name : '' }
                                </span>

                            ) }<span> { device1.price } грн</span>
                            &nbsp;{ device1.rating }
                        </div>
                        <Image width={ 18 } height={ 18 } src={ star } />
                    </div>
                </div>
                <div className='mt-1'>{ device1.name }
                </div>

            </Card>
        </Col >
    );
} );

export default DeviceItem;