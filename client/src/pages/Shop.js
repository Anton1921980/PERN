import React, { useContext, useEffect, useState } from "react";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import TypeBar from "../components/TypeBar";
import BrandBar from "../components/BrandBar";
import DeviceList from "../components/DeviceList";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchBrands, fetchDevices, fetchTypes } from "../http/deviceAPI";
import Pages from "../components/Pages";
import { useHistory, useLocation } from "react-router-dom";
// import { set } from 'mobx';

const Shop = observer(() => {
  const [loading, setLoading] = useState(true);

  const { device } = useContext(Context);
  const history = useHistory();

  const location = useLocation();
  const path = location.search;

  let type = "";
  let brand = "";
  let sort = "";

  // console.log( "TCL: path", path )

  const queryString = require("query-string");
  const parsed = queryString.parse(path);
  console.log("TCL: parsed", parsed);

  let parsedTypes;
  parsed.types ? (parsedTypes = +parsed.types) : (parsedTypes = null);
  let parsedBrands;
  parsed.brands ? (parsedBrands = +parsed.brands) : (parsedBrands = null);
  let parsedSort;
  parsed.sort ? (parsedSort = parsed.sort) : (parsedSort = "");
  console.log("TCL: parsed.sort", parsed.sort);

  let shopUrl = undefined; //переход по урл /shop
  let linked = undefined; //переход по урл querystring

  path && path.length > 16 ? (linked = 1) : (linked = undefined);

  !path ? (shopUrl = 1) : (shopUrl = undefined);

  //отрабатывает один раз при переходе по url или на /shop
  useEffect(() => {
    if (linked === 1) {
      //загрузка по строке
      fetchTypes().then((data) => {
        device.setTypes(data);
        device.setSelectedType({ id: parsedTypes });
      });

      fetchBrands(parsedTypes).then((data) => {
        device.setBrands(data);
        device.setSelectedBrand({ id: parsedBrands });
        device.setSort(parsedSort);
      });

      fetchDevices(
        parsedTypes,
        parsedBrands,
        parsed.page,
        parsed.limit,
        parsedSort
      )
        .then((data) => {
          device.setDevices(data.rows);
          device.setTotalCount(data.count);
          // device.setSort( parsedSort )
        })
        .finally(() => setLoading(false));

      console.log("device по строке:", device);
    } else if (shopUrl === 1) {
      //загрузка первичная /shop все товары
      fetchTypes().then((data) => device.setTypes(data));

      fetchBrands().then((data) => device.setBrands(data));

      fetchDevices(null, null, device.page, device.limit, device.sort)
        .then((data) => {
          device.setDevices(data.rows);
          device.setTotalCount(data.count);
        })
        .finally(() => setLoading(false));
      console.log("device без фильтров:", device);
    }
  }, []);

  //пока аcинхронно грузятся отфильтрованые товары успевает второй useEffect отработать создать пустую строку

  // useEffect для фильтров

  useEffect(() => {
    fetchBrands(device.selectedType.id).then((data) => {
      console.log("fetch brands2 data: ", data);
      device.setBrands(data);
    });
    fetchDevices(
      device.selectedType.id,
      device.selectedBrand.id,
      device.page,
      device.limit,
      device.sort
    )
      .then((data) => {
        device.setDevices(data.rows);
        device.setTotalCount(data.count);

        device.selectedType.id
          ? (type = `types=${device.selectedType.id}`)
          : (type = "");

        device.selectedBrand.id
          ? (brand = `&brands=${device.selectedBrand.id}`)
          : (brand = "");

        device.sort ? (sort = `&sort=${device.sort}`) : (sort = "");

        let query = `${type}${brand}&page=${device.page}&limit=${device.limit}${sort}`;

        console.log("TCL: query", query);

        history.push(`/shop/?${query}`);

        console.log("TCL: device с фильтрами", device);
      })
      .finally(() => setLoading(false));

    // }
  }, [
    device.selectedType,
    device.selectedBrand,
    device.sort,
    device.page,
    device.limit,
  ]);

  //если нет этого бренда в категории, а он был активен удалить из строки или сбросить из селектед
  //сделать чтобы отображались только категории которые в этом бренде?

  if (loading) {
    return <Spinner animation={"border"} variant="secondary" />;
  }

  return (
    <Container className="mt-5">
      <Row className="mt-5">
        <Col md={3}>
          <TypeBar seltype={parsed.type} />
        </Col>
        <Col md={9}>
          <BrandBar />
          <div className="d-flex justify-content-end">
            <Pages />
            <div className="d-flex align-items-center ml-5">
              <Card
                className="p-1 flex-row"
                style={{ cursor: "pointer", height: "2.5rem" }}
                border={"DESC" === device.sort ? "dark" : "light"}
              >              
                  <div
                    style={{ width: "100%", height: "100%" }}
                    onClick={() => {
                        if (device.sort !== "DESC") {
                    //   setChosen(true);
                      device.setPage("1");
                      device.setSort("DESC");
                        }
                    }}
                  >
                    {["- ", <span>&#8372;</span>]}
                  </div>           
              </Card>
              <Card
                className="p-1 flex-row"
                style={{ cursor: "pointer", height: "2.5rem" }}
                border={"ASC" === device.sort ? "dark" : "light"}
              >              
                  <div
                    style={{ width: "100%", height: "100%" }}
                    onClick={() => {
                        if (device.sort !== "ASC") {
                    //   setChosen(true);
                      device.setPage("1");
                      device.setSort("ASC");
                        }
                    }}
                  >
                    {["- ", <span>&#8372;</span>]}
                  </div>           
              </Card>          
            </div>
            <div className="d-flex m-3 align-items-center ">
            <Card
                className="p-1 flex-row"
                style={{ cursor: "pointer", height: "2.5rem" }}
                border={3 === device.limit ? "dark" : "light"}
              >
           <div
                  style={{ width: "100%", height: "100%" }}
                  onClick={() => {
                    if (3 !== device.limit) {
                      device.setPage(1);
                      device.setLimit(3);
                    }
                  }}
                >                
                  <span>3</span>
                </div>
              </Card>
              <Card
                className="p-1 flex-row"
                style={{ cursor: "pointer", height: "2.5rem" }}
                border={6 === device.limit ? "dark" : "light"}
              >
                <div
                  style={{ width: "100%", height: "100%" }}
                  onClick={() => {
                    if (6 !== device.limit) {
                      device.setPage(1);
                      device.setLimit(6);
                    }
                  }}
                >                
                  <span>6</span>
                </div>
              </Card>
              <Card
                className="p-1 flex-row"
                style={{ cursor: "pointer", height: "2.5rem" }}
                border={9 === device.limit ? "dark" : "light"}
              >
           <div
                  style={{ width: "100%", height: "100%" }}
                  onClick={() => {
                    if (9 !== device.limit) {
                      device.setPage(1);
                      device.setLimit(9);
                    }
                  }}
                >                
                  <span>9</span>
                </div>
              </Card>
            </div>
          </div>
          <DeviceList />
        </Col>
      </Row>
    </Container>
  );
});

export default Shop;
