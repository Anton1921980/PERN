import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Button, Pagination } from 'react-bootstrap';
import { Context } from '../index';
import '../scss/styles.scss';

const Pages = observer( () =>
{
    const { device } = useContext( Context )

    const pagesCount = Math.ceil( device.totalCount / device.limit )//количество страниц всего и номер последней страницы 
    let portionSize = 1
    let portionCount = Math.ceil( pagesCount / portionSize ); // количество порций

    let [ portionNumber, setPortionNumber ] = useState( 1 ); // номер порции начальный локальный стейт

    let leftPortionPageNumber = ( portionNumber - 1 ) * portionSize + 1; //крайняя цифра порции слева
    let rightPortionPageNumber = portionNumber * portionSize; //крайняя цифра порции справа

    const pages = []

    for ( let i = 0; i < pagesCount; i++ )
    {
        pages.push( i + 1 )
    }

    return (
        // <div className='d-flex justify-content-between'>
        <Pagination className="m-3" variant='flush'>
            <Pagination.Prev
                activeLabel={ false }
                onClick={ () => device.setPage( device.page - 1 ) }
            >
                { portionNumber > 1 &&
                    device.page < leftPortionPageNumber &&
                    setPortionNumber( portionNumber - 1 ) }
            </Pagination.Prev>
            {/* 1st page */ }
            { ( device.page > "2" ) && (
                <Pagination.Item
                    className={ 'paginationItemStyle' }
                    active={ device.page === 1 }
                    activeLabel={ false }
                    onClick={ () => device.setPage( 1 ) }
                >
                    { 1 }
                </Pagination.Item> ) }
            {/* три точки */ }
            { ( device.page > "3" ) && (
                <Pagination.Ellipsis
                    activeLabel={ false }
                    onClick={ () => device.setPage( device.page - 2 ) }
                />
            ) }
            {
                pages.filter(
                    page =>
                        page + 1 >= leftPortionPageNumber &&
                        page - 1 <= rightPortionPageNumber
                ).map( page =>
                    <Pagination.Item
                        className={ 'paginationItemStyle' }
                        key={ page }
                        active={ device.page === page }
                        activeLabel={ false }
                        onClick={ () => device.setPage( page ) }
                    >
                        { page }
                    </Pagination.Item>
                )
            }
            {/* {три точки} */ }
            { ( device.page < pagesCount - 2 ) && (
                <Pagination.Ellipsis
                    activeLabel={ false }
                    onClick={ () => device.setPage( device.page + 2 ) }
                />
            ) }
            {/* last page */ }
            { ( device.page < pagesCount - 1 ) && (
                <Pagination.Item
                    className={ 'paginationItemStyle' }
                    active={ device.page === pagesCount }
                    activeLabel={ false }
                    onClick={ () => device.setPage( pagesCount ) }
                >
                    { pagesCount }
                </Pagination.Item>
            ) }
            <Pagination.Next
                activeLabel={ false }
                onClick={ () => device.setPage( device.page + 1 ) }
            >
                { portionCount > portionNumber &&
                    device.page > rightPortionPageNumber &&
                    setPortionNumber( portionNumber + 1 ) }
            </Pagination.Next>
        </Pagination>



        // CREATE INDEX devices_idx ON devices (name);
        // CLUSTER devices USING devices_idx;
        // CREATE SEQUENCE devices_seq;
        // SELECT setval('devices_seq', 1);
        // UPDATE devices set id=nextval('devices_seq');


        // </div>
    );
} );

export default Pages;

/* <Pagination>
  <Pagination.First />
  <Pagination.Prev />
  <Pagination.Item>{1}</Pagination.Item>
  <Pagination.Ellipsis />

  <Pagination.Item>{10}</Pagination.Item>
  <Pagination.Item>{11}</Pagination.Item>
  <Pagination.Item active>{12}</Pagination.Item>
  <Pagination.Item>{13}</Pagination.Item>
  <Pagination.Item disabled>{14}</Pagination.Item>

  <Pagination.Ellipsis />
  <Pagination.Item>{20}</Pagination.Item>
  <Pagination.Next />
  <Pagination.Last />
</Pagination> */