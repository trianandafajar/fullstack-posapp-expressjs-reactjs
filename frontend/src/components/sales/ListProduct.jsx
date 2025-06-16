import { useEffect, useState, useCallback } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../../features/ProductSlice.js";
import { toast } from "react-toastify";
import CardProduct from "./CardProduct.jsx";
import { FaSearch } from "react-icons/fa";
import { axiosInstance } from "../../auth/AxiosConfig.jsx";
import { addToCart, updateCart } from "../../features/CartSlice.js";
import secureLocalStorage from "react-secure-storage";
import { FixedSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const ListProduct = () => {
  const [query, setQuery] = useState("");
  const [keyword, setKeyword] = useState("");
  const products = useSelector((state) => state.product.data);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProduct(keyword));
  }, [dispatch, keyword]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
      });
    }
  }, [error]);

  const serchData = (e) => {
    e.preventDefault();
    setKeyword(query);
  };

  const setCart = async (product) => {
    const user = secureLocalStorage.getItem("user");
    let headersList = {
      Authorization: "Bearer " + secureLocalStorage.getItem("acessToken"),
      "Content-Type": "application/json",
    };

    let reqOptions = {
      url: `/api/carts/product/${product.id}/${user.id}`,
      method: "GET",
      headers: headersList,
    };
    const response = await axiosInstance.request(reqOptions);
    if (response.data.result) {
      // lakukan update cart
      const orderItem = response.data.result;
      orderItem.qty = parseInt(orderItem.qty) + 1;
      orderItem.totalPrice =
        parseInt(orderItem.price) * parseInt(orderItem.qty);
      dispatch(updateCart(orderItem));
    } else {
      // lakukan insert cart
      const orderItem = {
        price: product.price,
        productName: product.productName,
        qty: 1,
        totalPrice: product.price,
        note: "",
        productId: product.id,
        userId: user.id,
      };
      dispatch(addToCart(orderItem));
    }
  };

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * 4 + columnIndex;
    if (index >= products.length) return null;
    
    return (
      <div style={style}>
        <CardProduct
          product={products[index]}
          onAddToCart={() => setCart(products[index])}
        />
      </div>
    );
  };

  return (
    <div className="container-fluid" style={{ height: 'calc(100vh - 200px)' }}>
      <Form onSubmit={serchData} className="mb-3">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" variant="outline-secondary">
            <FaSearch />
          </Button>
        </InputGroup>
      </Form>

      <div style={{ height: '100%' }}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeGrid
              columnCount={4}
              columnWidth={width / 4}
              height={height}
              rowCount={Math.ceil(products.length / 4)}
              rowHeight={300}
              width={width}
            >
              {Cell}
            </FixedSizeGrid>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

export default ListProduct;
