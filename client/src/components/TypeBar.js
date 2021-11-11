import React, { useContext, useState } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import ListGroup from "react-bootstrap/ListGroup";


const TypeBar = observer( ( props ) =>
{

    const { device } = useContext( Context )

    const [ chosen, setChosen ] = useState( false )

    return (
        <ListGroup variant='flush'>
            { device.types.map( type =>
                <ListGroup.Item
                    style={ { cursor: 'pointer' } }
                    active={ type.id === device.selectedType.id }
                    action variant="light"
                    key={ type.id }>
                    { chosen === false ?
                        <div className='d-flex justify-content-between'
                            onClick={ () => { device.setSelectedType( type ); device.setSelectedBrand(''); setChosen( true ) } }
                        > <span>{ type.name }</span><span>&gt;</span>
                        </div>
                        :
                        ( type.id === device.selectedType.id ) ? (
                            <div className='d-flex justify-content-between'
                                onClick={ () => { device.setSelectedType( '' ); device.setSelectedBrand(''); setChosen( false ) } }
                            > <span>{ type.name }</span><span>&gt;</span>
                            </div> )
                            :
                            ( <div className='d-flex justify-content-between'
                                onClick={ () => { device.setSelectedType( type ); device.setSelectedBrand(''); setChosen( true ) } }
                            > <span>{ type.name }</span><span>&gt;</span>
                            </div> )
                    }

                </ListGroup.Item>
            ) }
        </ListGroup>
    );
} );

export default TypeBar;