import React, { useState, useEffect } from "react";
import "../styles.css";
import { API } from "../backend";
import Base from "./Base";
import Card from "./Card";
import getProducts from "./helper/coreapicalls";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

  const loadAllProduct = () => {
    getProducts().then((data) => {
      if (data?.error) {
        setError(data.error);
      } else {
        setProducts(data);
        console.log(products);
      }
    });
  };

  useEffect(() => {
    loadAllProduct();
  }, []);

  return (
    <Base title="Home Page" description="Welcome to the Tshirt Store">
      <div className="row text-center">
        {/* <div className="col-4">
          <Card />
        </div>
        <div className="col-4">
          <button className="btn btn-success">TEST</button>
        </div>
        <div className="col-4">
          <button className="btn btn-success">TEST</button>
        </div> */}

        <h1 className="text-white">All Products</h1><br />
        <div className="row">
          {products.map((products, index) => {
            return (
              <div key={index} className="col-4 mb-4">
                <Card product={products} />
              </div>
            );
          })}
        </div>
      </div>
    </Base>
  );
}
