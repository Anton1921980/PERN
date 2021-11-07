import React, { useContext, useState } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import ListGroup from "react-bootstrap/ListGroup";


const TypeBar = observer( ( props ) =>
{

    const { device } = useContext( Context )
    console.log( "TCL: device3", device )

    const [ chosen, setChosen ] = useState( false )

    // useEffect( () =>
    // {
    //     chosen === true ? setChosen( false ) : setChosen( true )
    // }, [ chosen ] );

    

    return (
        <ListGroup>
            { device.types.map( type =>
                <ListGroup.Item
                    style={ { cursor: 'pointer' } }
                    active={ type.id === device.selectedType.id  }
                    key={ type.id }>
                    { chosen === false ?
                        <div
                            onClick={ () => { device.setSelectedType( type ); setChosen( true ) } }
                        > { type.name }
                        </div>
                        :
                        ( type.id === device.selectedType.id ) ? (
                            <div
                                onClick={ () => { device.setSelectedType( '' ); setChosen( false ) } }
                            > { type.name }
                            </div> )
                            :
                            ( <div
                                onClick={ () => { device.setSelectedType( type ); setChosen( true ) } }
                            > { type.name }
                            </div> )
                    }

                </ListGroup.Item>
            ) }
        </ListGroup>
    );
} );

export default TypeBar;