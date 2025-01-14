import { useContext } from "react";
import styled from "@emotion/styled";
import { IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import { IMenuProduct } from "../../types/menu";

import ItemPrice from "./ItemPrice";

import { CartContext } from "../../contexts/Cart";

const Container = styled.div`
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 15px;
  transition: background 0.3s;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  &.active {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ZoomButton = styled(IconButton)`
  transition: transform 0.2s;
  margin-right: 8px;
  transform: scale(0);

  &.active {
    transform: scale(1);
  }

  &.active:hover {
    transform: scale(1.5);
  }
`;

const FirstColumn = styled.div`
  display: flex;
  align-items: center;
`;

const QtyDiv = styled.div`
  font-size: 23px;
  max-width: 0px;
  padding-right: 0px;
  opacity: 0;
  overflow: hidden;

  transition: all 0.5s;

  &.open {
    max-width: 50px;
    padding-right: 18px;
    opacity: 1;
  }
`;

const NameAndPrice = styled.div``;

interface IMenuProductProps {
  item: IMenuProduct;
  qty: number;
}

export const MenuItem = ({ item, qty }: IMenuProductProps) => {
  const { addItem, removeItem } = useContext(CartContext);

  const handleAdd = () => {
    addItem(item.id);
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <Container className={qty > 0 ? "active" : ""}>
      <FirstColumn>
        <QtyDiv className={qty > 0 ? "open" : ""}>{qty}</QtyDiv>
        <NameAndPrice>
          <div>{item.name}</div>
          <ItemPrice price={item.price} qty={qty} />
        </NameAndPrice>
      </FirstColumn>
      <div>
        <ZoomButton
          edge='end'
          aria-label='remove'
          color='primary'
          className={qty > 0 ? "active" : ""}
          onClick={handleRemove}
        >
          <RemoveCircleIcon />
        </ZoomButton>
        <ZoomButton
          edge='end'
          aria-label='add'
          color='secondary'
          onClick={handleAdd}
          className='active'
        >
          <AddCircleIcon />
        </ZoomButton>
      </div>
    </Container>
  );
};
