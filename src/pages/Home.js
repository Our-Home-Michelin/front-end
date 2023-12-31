import React, { useEffect, useState } from "react";
import * as S from "./Home.style";
import { Container } from "../components/common/Layout";
import Contents from "../components/pages/home/Contents";
import EditorBox from "../components/pages/editor/EditorBox";
import mainRefrigerator from "../assets/img/mainRefrigerator.png";
import PortalModal from "../components/common/PortalModal";
import MyFridge from "../components/MyFridge";
import requestApi from "../libs/const/api";

const foodList = [
  {
    _id: 1,
    name: "커비",
    profileImage:
      "https://i.namu.wiki/i/ijg40CIiHx5-Ihr3ksIJUm4cQQDEnek8xMEmJaQqGR5U13DKOZnCkzwPx1L5rcEX2-xxFYAyQO7XTcyqQ2BGEw.webp",
  },
  {
    _id: 2,
    name: "꼬부기",
    profileImage:
      "https://images.velog.io/images/hyunicecream/post/252155a9-e156-4acd-bc6a-2cce0feb9c88/%E1%84%81%E1%85%A9%E1%84%87%E1%85%AE%E1%84%80%E1%85%B5.jpeg",
  },
  {
    _id: 3,
    name: "젤리",
    profileImage:
      "https://t2.daumcdn.net/thumb/R720x0/?fname=http://t1.daumcdn.net/brunch/service/user/2fG8/image/0zK7e-97apnyANk-UBEszLQuLF0.jpg",
  },
  {
    _id: 4,
    name: "고양이",
    profileImage:
      "https://blog.kakaocdn.net/dn/dKCK2U/btqUekxdPc8/obYkOupRiOMIBY7CUDShk0/img.jpg",
  },
  {
    _id: 5,
    name: "강아지",
    profileImage:
      "https://png.pngtree.com/thumb_back/fw800/background/20230518/pngtree-small-brown-puppy-is-seen-looking-at-the-camera-image_2580991.png",
  },
  {
    _id: 6,
    name: "꼬북이",
    profileImage:
      "https://images.velog.io/images/hyunicecream/post/252155a9-e156-4acd-bc6a-2cce0feb9c88/%E1%84%81%E1%85%A9%E1%84%87%E1%85%AE%E1%84%80%E1%85%B5.jpeg",
  },
  {
    _id: 7,
    name: "고양이",
    profileImage:
      "https://blog.kakaocdn.net/dn/dKCK2U/btqUekxdPc8/obYkOupRiOMIBY7CUDShk0/img.jpg",
  },
];

// 1) 가져와야될 3개 컨텐츠 데이터를 promise(병렬)로 호출(api 통신);
// 2) 상태 저장(setMainDatas)
// 3) return ( mainDatas 렌더링 )

function Home(props) {
  const [startIndex, setStartIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [fiveStarRecipes, setFiveStarRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  // const [editors, setEditors] = useState([]);

  async function fetchData() {
    try {
      const responseFiveStarRecipes = await requestApi(
        "get",
        "/fivestar-recipes?limit=5"
      ); // API 요청
      setFiveStarRecipes(responseFiveStarRecipes.fiveStarRecipes);
      const responseAllRecipes = await requestApi("get", "/recipes?limit=10");
      setAllRecipes(responseAllRecipes);

      // const responseEditors = await requestApi("get", "/editor");
      // setEditors(responseEditors);
      // console.log(responseEditors);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData(); // 컴포넌트가 마운트되면 데이터를 가져옴
  }, []); // 빈 배열을 넣어 마운트 시 한 번만 호출하도록 설정

  return (
    <S.Div>
      <S.RefrigeratorContainer onClick={() => setShowModal(true)}>
        <S.MainRefrigerator src={mainRefrigerator} alt="mainRefrigerator" />
        <p>
          냉장고에 <span>김치, 돼지고기...</span>가 있어요.
          <br />더 채우러 갈까요?
        </p>
      </S.RefrigeratorContainer>
      <PortalModal handleShowModal={showModal} size={"40%"}>
        <MyFridge onClose={() => setShowModal(false)} />
      </PortalModal>
      <Container>
        <S.Text>
          <p>
            <span>올해의 </span>에디터
          </p>
          <S.SeeMoreLink to="/editor">더보기</S.SeeMoreLink>
        </S.Text>
        <EditorBox
          editorList={foodList}
          startIndex={startIndex}
          itemsPerPage={6}
        />
      </Container>
      <Container>
        <S.Text>
          <p>
            <span>5스타 </span>레시피
          </p>
          <S.SeeMoreLink to="/editor">더보기</S.SeeMoreLink>
        </S.Text>
        <Contents foodList={fiveStarRecipes} />
      </Container>
      <Container>
        <S.Text>
          <p>
            <span>전체 </span>레시피
          </p>
          <S.SeeMoreLink to="/editor">더보기</S.SeeMoreLink>
        </S.Text>
        <Contents foodList={allRecipes} />
      </Container>
    </S.Div>
  );
}

export default Home;
