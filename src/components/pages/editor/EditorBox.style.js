import styled from "@emotion/styled";
import { Link } from "react-router-dom";

export const Section = styled.div`
  width: 1000px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: 20px 0;
  cursor: pointer;
`;

export const EditorImage = styled.img`
  width: 124px;
  height: 124px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;
`;

export const EditorLink = styled(Link)`
  text-decoration: none;
  color: #464646;
`;
