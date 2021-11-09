import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Button, Pagination } from 'react-bootstrap';
import { Context } from '../index';

const Pages = observer( () =>
{
    const { device } = useContext( Context )
    const pageCount = Math.ceil( device.totalCount / device.limit )
    const pages = []

    for ( let i = 0; i < pageCount; i++ )
    {
        pages.push( i + 1 )
    }

    return (
        // <div className='d-flex justify-content-between'>
            <Pagination className="mt-3">
                { pages.map( page =>
                    <Pagination.Item
                        key={ page }
                        active={ device.page === page }
                        activeLabel={ false }
                        onClick={ () => device.setPage( page ) }
                    >
                        { page }
                    </Pagination.Item>
                ) }

            </Pagination>
        

           
        // </div>
    );
} );

export default Pages;