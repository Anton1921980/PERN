import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Context } from '../index';
import { Card, Row } from 'react-bootstrap';

const BrandBar = observer( () =>
{
    const { device } = useContext( Context )
    const [ chosen, setChosen ] = useState( false )    

    return (
        <div className='d-flex flex-direction-row flex-wrap'>
            { device.brands.map( brand =>
                <Card
                    key={ brand.id }
                    className='p-3'
                    style={ { cursor: 'pointer' } }
                    border={ brand.id === device.selectedBrand.id ? 'dark' : 'light' }
                >
                    { chosen === false ?
                        <div
                            onClick={ () => { device.setSelectedBrand( brand ); setChosen( true ) } }
                        >{ brand.name }
                        </div>
                        :
                        ( brand.id === device.selectedBrand.id ) ? (
                            <div
                                onClick={ () => { device.setSelectedBrand( '' ); setChosen( false ) } }
                            > { brand.name }
                            </div> )
                            :
                            ( <div
                                onClick={ () => { device.setSelectedBrand( brand ); setChosen( true ) } }
                            > { brand.name }
                            </div> )
                    }
                </Card>
            ) }
        </div>
    );
} );

export default BrandBar;