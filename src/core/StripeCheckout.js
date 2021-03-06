import React, { useState, useEffect } from "react";
import { isAutheticated } from "../auth/helper";
import { cartEmpty, loadCart } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import { API } from "../backend";
import { createOrder } from "./helper/orderHelper";

const StripeeCheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: "",
    address: "",
  });

  const token = isAutheticated() && isAutheticated().token;
  const userId = isAutheticated() && isAutheticated().user._id;

  const getFinalPrice = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue;
    }, 0);
  };

  const getFinalAmount = () => {
    let amount = 0;
    products.map((p) => {
      amount += p.price;
    });
    return amount;
  };

  const makePayment = (token) => {
    const body = {
      token,
      products,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    return fetch(`${API}/stripepayment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log(response);
        const { status } = response;
        console.log("Status", status);
        const orderData = {
          products: products,
          transaction_id: response.transaction.id,
          amount: response.transaction.amount,
        };
        createOrder(userId, token, orderData);
        cartEmpty(() => {
          console.log("Did we got a crash");
        });
        setReload(!reload);
      })
      .catch((err) => console.log(err));
  };

  const showStripeButton = () => {
    return isAutheticated() ? (
      <StripeCheckout
        stripeKey="pk_test_k0PMXXnofjYv0xnx0ZX8hNNi00Xa7evT02"
        token={makePayment}
        amount={getFinalAmount() * 100}
        name="Buy T-Shirts"
        shippingAddress
        billingAddress
      >
        <button className="btn btn-success">Pay with Stripe</button>
      </StripeCheckout>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning">Signin</button>
      </Link>
    );
  };

  return (
    <div>
      <h3>Stripe Checkout {getFinalAmount()}</h3>
      {showStripeButton()}
    </div>
  );
};

export default StripeeCheckout;
