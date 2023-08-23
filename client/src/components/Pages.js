import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Button, Pagination } from "react-bootstrap";
import { Context } from "../index";
import DevicePage from "../pages/DevicePage";
import "../scss/styles.scss";

const Pages = observer(() => {
  const { device } = useContext(Context);

  const pagesCount = Math.ceil(device.totalCount / device.limit); //количество страниц всего и номер последней страницы
  let portionSize = 1;
  let portionCount = Math.ceil(pagesCount / portionSize); // количество порций

  let [portionNumber, setPortionNumber] = useState(1); // номер порции начальный локальный стейт

  let leftPortionPageNumber = (portionNumber - 1) * portionSize + 1; //крайняя цифра порции слева
  let rightPortionPageNumber = portionNumber * portionSize; //крайняя цифра порции справа

  const pages = [];

  for (let i = 0; i < pagesCount; i++) {
    pages.push(i + 1);
  }

  return (
    // <div className='d-flex justify-content-between'>
    <Pagination className="m-3"
     style={{width: '25%'}}>
      {/* пред */}
      {device.page != 1 && (
        <Pagination.Item
          className={"paginationItemStyle"}
          activeLabel={false}
          onClick={() => device.setPage(device.page - 1)}
        >
          {portionNumber > 1 &&
            device.page < leftPortionPageNumber &&
            setPortionNumber(portionNumber - 1)}
          {"<"}
        </Pagination.Item>
      )}
      {/* 1st page */}

      <Pagination.Item
        className={"paginationItemStyle"}
        active={device.page == 1 ? true : false}
        activeLabel={false}
        onClick={() => device.setPage(1)}
      >
        {1}
      </Pagination.Item>
      {/* три точки */}
      {device.page > "3" && (
        <Pagination.Item
          className={"paginationItemStyle"}
          activeLabel={false}
          onClick={() => device.setPage(device.page - 2)}
        >
          {".."}
        </Pagination.Item>
      )}
      {pages
        .filter(
          (page) =>
            page + 1 >= leftPortionPageNumber &&
            page - 1 <= rightPortionPageNumber
        )
        .map(
          (page) =>
            page != 1 &&
            page != pagesCount && (
              <Pagination.Item
                className={"paginationItemStyle"}
                key={page}
                active={device.page === page ? true : false}
                activeLabel={false}
                onClick={() => device.setPage(page)}
              >
                {page}
              </Pagination.Item>
            )
        )}
      {/* {три точки} */}
      {device.page < pagesCount - 2 && (
        <Pagination.Item
          className={"paginationItemStyle"}
          activeLabel={false}
          onClick={() => device.setPage(device.page + 2)}
        >
          {".."}
        </Pagination.Item>
      )}
      {/* last page */}
      {pagesCount > 1 && (
        <Pagination.Item
          className={"paginationItemStyle"}
          active={device.page === pagesCount ? true : false}
          activeLabel={false}
          onClick={() => device.setPage(pagesCount)}
        >
          {pagesCount}
        </Pagination.Item>
      )}
      {/* {след} */}
      {device.page != pagesCount && pagesCount > 1 && (
        <Pagination.Item
          className={"paginationItemStyle"}
          activeLabel={false}
          onClick={() => device.setPage(device.page + 1)}
        >
          {portionCount > portionNumber &&
            device.page > rightPortionPageNumber &&
            setPortionNumber(portionNumber + 1)}
          {">"}
        </Pagination.Item>
      )}
    </Pagination>
  );
});

export default Pages;
