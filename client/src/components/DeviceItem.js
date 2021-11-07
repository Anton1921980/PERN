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
            <Card style={ { width: 250, height: 400, cursor: 'pointer' } } border={ 'light' }>
                <div style={ { width: 250, height: 250, overflow: 'hidden' } }>
                    <Image style={ { objectFit: 'contain', width: '100%', height: '100%' } }
                        src={ process.env.REACT_APP_API_URL + device1.img } />
                </div>
                <div className="text-black-50 mt-1 d-flex justify-content-between align-items-center">
                    <div className='d-flex align-items-center'>
                        <div>{ device1.rating }</div>
                        <Image width={ 18 } height={ 18 } src={ star } />
                    </div>
                </div>
                <div>{ device1.name }&nbsp;
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
            </Card>
        </Col >
    );
} );

export default DeviceItem;