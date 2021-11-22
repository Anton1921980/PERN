import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Context } from '../index';
import { Card } from 'react-bootstrap';
import '../scss/styles.scss';

const BrandBar = observer( () =>
{
    const { device } = useContext( Context )
    const [ chosen, setChosen ] = useState( false )

    return (
        <div className='d-flex flex-direction-row flex-wrap '>
            { device.brands.map( (brand,i) =>
                <Card
                    key={ i }
                    style={ { cursor: 'pointer' } }
                    // style={ brand.id === device.selectedBrand.id ? { cursor: 'pointer', borderBottom: '2px solid black' } : { cursor: 'pointer', borderBottom: '2px solid white' } }               
                    border={ brand.id === device.selectedBrand.id ? 'secondary' : 'light' }
                >
                    { chosen === false ?
                        <div className='p-2'
                            onClick={ () => { device.setSelectedBrand( brand ); setChosen( true ) } }
                        >{ brand.name }
                        </div>
                        :
                        ( brand.id === device.selectedBrand.id ) ? (
                            <div className='p-2'
                                onClick={ () => { device.setSelectedBrand( '' ); setChosen( false ) } }
                            > { brand.name }
                            </div> )
                            :
                            ( <div className='p-2'
                                onClick={ () => { device.setSelectedBrand( brand ); setChosen( true ) } }
                            > { brand.name }
                            </div> )
                    }
                </Card>
            )
            }
        </div >
    );
} );

export default BrandBar;