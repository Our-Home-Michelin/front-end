import React, { useState } from "react";
import PortalModal from "../common/PortalModal";
import MyFridge from "../MyFridge";
import fridgeclose from "../../assets/img/fridge-close.svg";
import fridgeopen from "../../assets/img/fridge-open.svg";
import * as S from "./MyFridgeButton.style";
import useAuthStatus from "../../libs/hooks/useAuthStatus";
import MyFridgeEmpty from "../MyFridgeEmpty";

function MyFridgeButton() {
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isAuth } = useAuthStatus();

  const handleImageHover = () => {
    setIsHovered(!isHovered); // 호버 상태 토글
  };

  return (
    <>
      <S.RefrigeratorButton
        onMouseEnter={handleImageHover}
        onMouseLeave={handleImageHover}
        onClick={() => setShowModal(true)}
      >
        <S.MainRefrigerator
          src={isHovered ? fridgeopen : fridgeclose}
          alt="mainRefrigerator"
        />
      </S.RefrigeratorButton>
      <PortalModal handleShowModal={showModal} size={"40%"}>
        {isAuth ? (
          <MyFridge onClose={() => setShowModal(false)} />
        ) : (
          <MyFridgeEmpty onClose={() => setShowModal(false)} />
        )}
      </PortalModal>
    </>
  );
}

export default MyFridgeButton;
