import styled from "@emotion/styled";

import { CartContext } from "../../contexts/Cart";
import { StepsContext } from "../../contexts/Steps";

import { useContext } from "react";

import BackButton from "../BackButton";
import CartList from "../Order/OrderList";

import PayButton from "../Menu/PayButton";

const Container = styled.div`
  width: 100%;
  max-width: 500px;
  min-height: 50vh;
  z-index: 10;
`;

export const OrderWidget = () => {
  const { setStep } = useContext(StepsContext);
  const { cart } = useContext(CartContext);

  const handlePay = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(0);
  };

  return (
    <Container>
      <div>
        <h1>La Cuenta</h1>
      </div>

      <CartList cart={cart} />
      <BackButton onClick={handleBack} />

      <PayButton onClick={handlePay} />
    </Container>
  );
};
