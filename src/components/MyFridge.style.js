import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { MAIN_THEME_COLOR } from "../libs/const/color";

const commonStyle = css({
  padding: "1.5rem 2rem",
});

export const Header = styled.header`
  ${commonStyle}
  color: #fff;
  background-color: ${MAIN_THEME_COLOR[1]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    font-size: 22px;
    font-weight: 900;
  }
  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }
`;

export const Content = styled.div`
  ${commonStyle}
`;

export const IngredientList = styled.div`
  height: 50vh;
  overflow: scroll;
  h4 {
    text-align: center;
    color: ${MAIN_THEME_COLOR[1]};
    font-weight: 900;
    font-size: 20px;
    span {
      color: ${MAIN_THEME_COLOR[0]};
    }
  }
`;

export const IngredientGroup = styled.div`
  margin-bottom: 24px;
  h5 {
    color: #b0b0b0;
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 14px;
  }
  ul {
    padding: 20px;
    border: 1px solid #b0b0b0;
    border-radius: 14px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    &.basicIngr {
      input {
        display: none;
        & + label {
          cursor: pointer;
          div {
          }
        }
        &:checked + label div {
          color: red;
        }
      }
    }
    li {
      button {
        width: 100%;
      }
    }
  }
`;

export const Fridge = styled.div``;

export const EmptyFridge = styled.div`
  color: ${MAIN_THEME_COLOR[1]};
  text-align: center;
  img {
    margin: 0 auto;
    display: block;
    padding-right: 40px;
  }
  h4 {
    font-size: 24px;
    margin: 20px 0 30px;
    font-weight: 700;
  }
  p {
    font-size: 18px;
    line-height: 1.3;
    margin-bottom: 40px;
  }
  button,
  a {
    background: ${MAIN_THEME_COLOR[0]};
    border: none;
    font-size: 16px;
    color: #fff;
    border-radius: 10px;
    padding: 8px 50px;
    cursor: pointer;
    margin-bottom: 10px;
    display: inline-block;
    text-decoration: none;
  }
`;

export const BtnGroup = styled.div`
  position: sticky;
  bottom: 0;
  background-color: #fff;
  border-top: 1px solid #b0b0b0;
  padding: 20px 0 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  button {
    border: none;
    background: none;
    font-size: 16px;
    color: #fff;
    border-radius: 10px;
    padding: 8px 20px;
    cursor: pointer;
    text-decoration: none;
    &.addBtn {
      background: ${MAIN_THEME_COLOR[0]};
    }
    &.cancelBtn {
      background: ${MAIN_THEME_COLOR[1]};
    }
  }
`;
