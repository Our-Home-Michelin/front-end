import styled from "@emotion/styled";
import { Link } from "react-router-dom";

export const Title = styled(Link)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  text-align: center;
  padding: 4px 0 36px;
  font-weight: 800;
  color: #464646;
  background-color: #fff;
  text-decoration: none;

  span {
    color: #f7411f;
  }
`;

export const User = styled.div`
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
  background-color: #fff;
  padding: 20px 30px 0 0;
  box-sizing: border-box;
`;

export const JoinMypage = styled(Link)`
  width: fit-content;
  text-align: right;
  text-decoration: none;
  color: #464646;
  font-size: 14px;
`;

export const LoginLogout = styled(Link)`
  margin-left: 10px;
  width: fit-content;
  text-align: right;
  text-decoration: none;
  color: #464646;
  font-size: 14px;
`;
