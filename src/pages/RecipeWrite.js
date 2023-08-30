import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import CloseIcon from "../assets/CloseIcon.js";
import requestApi from "../libs/const/api.js";
import axios from "axios";
import useAuthStatus from "../libs/hooks/useAuthStatus.js";
import * as S from "./RecipeWrite.style";
import Layout from "../components/common/Layout";

function useLayoutAuth() {
  const [authResponse, setAuthResponse] = useState(false);
  const getUserAuth = async () => {
    const response = await requestApi("get", "/check-login");
    setAuthResponse(response);
  };

  useEffect(() => {
    getUserAuth();
  }, []);

  return { authResponse };
}

function RecipeWrite(props) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [newIngredientName, setNewIngredientName] = useState("");
  const [newIngredientAmount, setNewIngredientAmount] = useState("");
  const [process, setProcess] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedType, setSelectedType] = useState("간단한 요리");
  const [selectedServing, setSelectedServing] = useState(1);
  const [recipeImg, setRecipeImg] = useState("");
  const [stateFile, setStateFile] = useState(null);
  //
  const { recipeId } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [recipeData, setRecipeData] = useState({});
  const [loading, setLoading] = useState(true);
  console.log(">> recipeId");
  console.log(recipeId);

  useEffect(() => {
    if (recipeId) {
      fetchRecipeData();
      setIsEditMode(true);
    }
  }, [recipeId]);

  const fetchRecipeData = async () => {
    try {
      const response = await axios.get(`/api/recipes/${recipeId}`);
      const recipe = response.data;
      console.log(">> fetchRecipeData  - response");
      console.log(response);
      console.log(">> fetchRecipeData  - recipe");
      console.log(recipe);
      setRecipeData(recipe);
      setLoading(false);

      // setTitle(recipe.title);
      // setIngredients(recipe.ingredient);
      // setRecipeSteps(recipe.process);
    } catch (err) {
      console.error("Error fetching recipe data: ", err);
    }
  };

  //

  useEffect(() => {
    console.log("stateFile:", stateFile);
    console.log("recipeImg:", recipeImg);
  }, [stateFile, recipeImg]);

  const { authResponse } = useLayoutAuth();
  console.log("[ authResponse ]");
  console.log(authResponse.isAuthenticated);
  console.log(authResponse);
  const navigate = useNavigate();

  const defaultRecipeImgUrl = require("../assets/img/recipeDefaultImg.png");
  const plzUploadImgUrl = require("../assets/img/plzUploadImg.png");

  const handleImgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStateFile(file);
      console.log(">> handleImgUpload stateFile");
      console.log(stateFile);
      const reader = new FileReader();
      reader.onload = () => {
        setRecipeImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    setStateFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setRecipeImg(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImgDelete = () => {
    // setRecipeImg(stateFile);
    setRecipeImg("");
    stateFile(null);
  };

  const handleDeleteIngredient = (idx) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(idx, 1);
    setIngredients(updatedIngredients);
  };
  const handleDeleteStep = (idx) => {
    // const updatedSteps = [...recipeSteps];
    const updatedSteps = [...process];
    updatedSteps.splice(idx, 1);
    // setRecipeSteps(updatedSteps);
    setProcess(updatedSteps);
  };

  const handleAddIngredient = () => {
    if (newIngredientName.trim() !== "" && newIngredientAmount.trim() !== "") {
      const newIngredient = {
        name: newIngredientName,
        amount: newIngredientAmount,
      };
      setIngredients([...ingredients, newIngredient]);
      setNewIngredientName("");
      setNewIngredientAmount("");
    } else {
      alert("식재료명과 중량을 입력해주세요!");
    }
  };

  const handleIngredientNameChange = (e) => {
    setNewIngredientName(e.target.value);
  };

  const handleIngredientAmountChange = (e) => {
    setNewIngredientAmount(e.target.value);
  };

  const handleRecipeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleAddStep = () => {
    // setRecipeSteps([...recipeSteps, ""]);
    setProcess([...process, ""]);
  };

  const handleStepChange = (event, idx) => {
    // const updatedSteps = [...recipeSteps];
    const updatedSteps = [...process];
    updatedSteps[idx] = event.target.value;
    // setRecipeSteps(updatedSteps);
    setProcess(updatedSteps);
  };

  const handleRecipeSubmit = async () => {
    try {
      const formData = new FormData();
      if (stateFile !== null) {
        formData.append("uploadRecipeImg", stateFile); // 에러 원인: 여기 ""자리가 multer에 작성한 name과 같아야했던 것!!!!
      } else {
        const confirmDefaultImg = window.confirm(
          "레시피 이미지 미업로드 경우, 냉슐랭 기본 이미지 파일로 대체하여 저장됩니다. 레시피 등록을 계속하시겠습니까?"
        );
        if (!confirmDefaultImg) {
          return;
        } else {
          formData.append("imageUrl", defaultRecipeImgUrl);
        }
      }

      if (isEditMode) {
        formData.append("recipeId", recipeId);
      }

      formData.append("title", title);
      formData.append("recipeType", selectedType);
      formData.append("recipeServing", selectedServing);
      // formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("ingredients", JSON.stringify([...ingredients]));
      // formData.append("process", JSON.stringify(recipeSteps));
      formData.append("process", JSON.stringify(process));
      formData.append("writer", authResponse.user._id);

      if (isEditMode) {
        const response = await axios.put(`/api/recipes/${recipeId}`, formData);
        alert("레시피가 성공적으로 수정되었습니다!");
      } else {
        const response = await axios.post("/api/recipes", formData);
        console.log("Recipe created: ", response.data.recipe);
        alert("레시피가 성공적으로 등록되었습니다!");
      }

      navigate("/");
    } catch (err) {
      console.error("Error creating recipe:", err);
    }
  };

  return (
    <S.Wrap>
      {/* 레시피 등록 */}
      {!isEditMode && authResponse.isAuthenticated && (
        <>
          <S.Title>레시피 수정</S.Title>
          {/*<S.RecipeFormContainer>*/}{" "}
          {/*<S.RecipeForm> == <div id="recipe-form">*/}
          <S.RecipeForm>
            <S.RecipeFormTop>
              {/* <S.RecipeFormTop> == <div id="recipe-form-top" style={{ display: "flex" }} > */}
              <S.RecipeFormTopLeft>
                {/* <S.RecipeFormAttribute> == <label htmlFor="recipe-title"> */}
                <S.RecipeFormAttribute>
                  <S.RecipeFormAttributeLabel>
                    <div>레시피 제목</div>
                    <input
                      type="text"
                      id="recipe-title"
                      placeholder="예) 한끼든든 소고기 미역국 레시피"
                      onChange={handleRecipeTitle}
                    />
                  </S.RecipeFormAttributeLabel>
                </S.RecipeFormAttribute>
                <S.RecipeFormAttribute>
                  {/* <S.RecipeFormAttributeLabel> == <label htmlFor="recipe-type-select"> */}
                  <S.RecipeFormAttributeLabel>
                    <div>요리 종류</div>
                    <select
                      name="recipe-types"
                      id="recipe-type-select"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="메인요리">메인요리</option>
                      <option value="국&찌개">국&찌개</option>
                      <option value="반찬">반찬</option>
                      <option value="간단한 요리">간단한 요리</option>
                      <option value="디저트">디저트</option>
                    </select>
                  </S.RecipeFormAttributeLabel>
                </S.RecipeFormAttribute>
                <S.RecipeFormAttribute>
                  {/* <S.RecipeFormAttributeLabel> == <label htmlFor="recipe-servings-select"> */}
                  <S.RecipeFormAttributeLabel>
                    <div>인분수량</div>
                    <select
                      name="recipe-serving"
                      id="recipe-servings-select"
                      value={selectedServing}
                      onChange={(e) =>
                        setSelectedServing(parseInt(e.target.value))
                      }
                    >
                      <option value="1">1인분</option>
                      <option value="2">2인분</option>
                      <option value="3">3인분 이상</option>
                    </select>
                  </S.RecipeFormAttributeLabel>
                </S.RecipeFormAttribute>
                <S.RecipeFormAttribute>
                  {/* <S.RecipeFormAttributeLabel> == <label htmlFor="recipe-ingredient"> */}
                  <S.RecipeFormAttributeLabel>
                    <span>재료</span>
                    <br />
                    <input
                      id="recipe-ingredient"
                      value={newIngredientName}
                      onChange={handleIngredientNameChange}
                      placeholder="식재료명"
                    />
                    <input
                      value={newIngredientAmount}
                      onChange={handleIngredientAmountChange}
                      placeholder="중량"
                    />
                    <S.Button onClick={handleAddIngredient}>추가</S.Button>
                  </S.RecipeFormAttributeLabel>
                  <div>
                    {/* 추가한 재료들이 나타나는 곳*/}
                    {ingredients.length > 0 && (
                      <S.RecipeAddBox>
                        {ingredients.map((ingredient, idx) => (
                          <div key={idx}>
                            {ingredient.name} - {ingredient.amount} &nbsp;
                            <S.DeleteButton
                              onClick={() => handleDeleteIngredient(idx)}
                            >
                              X
                            </S.DeleteButton>
                          </div>
                        ))}
                      </S.RecipeAddBox>
                    )}
                  </div>
                </S.RecipeFormAttribute>
              </S.RecipeFormTopLeft>
              {/* <S.RecipeFormTopRight> == <div id="recipe-form-top-right" style={{ right: "0", width: "30%", }} > */}
              <S.RecipeFormTopRight>
                <div
                  id="upload-img-container"
                  style={{
                    position: "sticky",
                    top: "-1000px",
                    width: "200px",
                    height: "200px",
                    backgroundImage: `url(${plzUploadImgUrl})`,
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div style={{ position: "relative" }}>
                    {recipeImg !== "" && isHovered && (
                      <div
                        onClick={handleImgDelete}
                        style={{
                          position: "absolute",
                          right: "0",
                          padding: "3px",
                          borderRadius: "2px",
                          cursor: "pointer",
                          backgroundColor: "rgba(0,0,0,0.7)",
                        }}
                      >
                        <CloseIcon color={"#fff"} />
                      </div>
                    )}
                  </div>
                  <form
                    action="/recipes"
                    method="POST"
                    encType="multipart/form-data"
                    onSubmit={handleRecipeSubmit}
                  >
                    <div
                      id="recipe-img-container"
                      style={{
                        width: "200px",
                        height: "200px",
                        backgroundImage: `url(${recipeImg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <label
                        htmlFor="fileInput"
                        className="label"
                        style={{
                          width: "inherit",
                          height: "inherit",
                          cursor: "pointer",
                          display: "inline-block",
                        }}
                      >
                        <input
                          style={{ position: "absolute", top: "-1000px" }}
                          id="fileInput"
                          type="file"
                          name="uploadRecipeImg"
                          accept="image/*"
                          // onChange={handleImgUpload}
                          onChange={handleImgChange}
                        />
                      </label>
                    </div>
                  </form>
                </div>
              </S.RecipeFormTopRight>
            </S.RecipeFormTop>
            <S.RecipeFormBottom>
              <p>요리 과정</p>
              {/* article tag 대신 다른 거 찾아보기 - 급해서 일단 적은 태그였음 */}
              <article>
                <p>
                  요리의 맛이 좌우될 수 있는 중요한 내용은 빠짐없이 적어주세요!
                </p>
                <p>
                  예) 10분간 익혀주세요. &rarr; 10분간 약한 불로 익혀주세요.
                </p>
                <p>
                  꿀을 조금 넣어주세요. &rarr; 꿀이 없는 경우 설탕 1스푼으로
                  대체 가능합니다.
                </p>
              </article>
              {/*{recipeSteps.length > 0 && (*/}
              {process.length > 0 && (
                <S.RecipeAddBox>
                  <ul>
                    {/* {recipeSteps.map((step, idx) => ( */}
                    {process.map((step, idx) => (
                      <li key={idx}>
                        {`Step ${idx + 1}`}
                        <textarea
                          value={step}
                          onChange={(e) => {
                            handleStepChange(e, idx);
                          }}
                          placeholder="요리 과정을 단계별로 작성해주세요!"
                        />
                        <S.DeleteButton
                          onClick={() => {
                            handleDeleteStep(idx);
                          }}
                        >
                          X
                        </S.DeleteButton>
                      </li>
                    ))}
                  </ul>
                </S.RecipeAddBox>
              )}
              {/* <button id="add-step-btn" onClick={handleAddStep} > */}
              <S.Button onClick={handleAddStep}>요리 과정 추가</S.Button>
            </S.RecipeFormBottom>
            <S.SubmitButton onClick={handleRecipeSubmit}>저장</S.SubmitButton>
          </S.RecipeForm>
          {/*</S.RecipeFormContainer>*/}
        </>
      )}
      {/* 레시피 수정 */}
      {isEditMode && authResponse.isAuthenticated && (
        <>
          <S.Title>레시피 수정</S.Title>
          {/*<S.RecipeFormContainer>*/}{" "}
          {/*<S.RecipeForm> == <div id="recipe-form">*/}
          <S.RecipeForm>
            <S.RecipeFormTop>
              {/* <S.RecipeFormTop> == <div id="recipe-form-top" style={{ display: "flex" }} > */}
              <S.RecipeFormTopLeft>
                {/* <S.RecipeFormAttribute> == <label htmlFor="recipe-title"> */}
                <S.RecipeFormAttribute>
                  <S.RecipeFormAttributeLabel>
                    <div>레시피 제목</div>
                    <input
                      type="text"
                      id="recipe-title"
                      placeholder="예) 한끼든든 소고기 미역국 레시피"
                      value={recipeData.title}
                      onChange={handleRecipeTitle}
                    />
                  </S.RecipeFormAttributeLabel>
                </S.RecipeFormAttribute>
                <S.RecipeFormAttribute>
                  {/* <S.RecipeFormAttributeLabel> == <label htmlFor="recipe-type-select"> */}
                  <S.RecipeFormAttributeLabel>
                    <div>요리 종류</div>
                    <select
                      name="recipe-types"
                      id="recipe-type-select"
                      value={recipeData.recipeType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="메인요리">메인요리</option>
                      <option value="국&찌개">국&찌개</option>
                      <option value="반찬">반찬</option>
                      <option value="간단한 요리">간단한 요리</option>
                      <option value="디저트">디저트</option>
                    </select>
                  </S.RecipeFormAttributeLabel>
                </S.RecipeFormAttribute>
                <S.RecipeFormAttribute>
                  {/* <S.RecipeFormAttributeLabel> == <label htmlFor="recipe-servings-select"> */}
                  <S.RecipeFormAttributeLabel>
                    <div>인분수량</div>
                    <select
                      name="recipe-serving"
                      id="recipe-servings-select"
                      value={recipeData.recipeServing}
                      onChange={(e) =>
                        setSelectedServing(parseInt(e.target.value))
                      }
                    >
                      <option value="1">1인분</option>
                      <option value="2">2인분</option>
                      <option value="3">3인분 이상</option>
                    </select>
                  </S.RecipeFormAttributeLabel>
                </S.RecipeFormAttribute>
                <S.RecipeFormAttribute>
                  {/* <S.RecipeFormAttributeLabel> == <label htmlFor="recipe-ingredient"> */}
                  <S.RecipeFormAttributeLabel>
                    <span>재료</span>
                    <br />
                    <input
                      id="recipe-ingredient"
                      value={newIngredientName}
                      onChange={handleIngredientNameChange}
                      placeholder="식재료명"
                    />
                    <input
                      value={newIngredientAmount}
                      onChange={handleIngredientAmountChange}
                      placeholder="중량"
                    />
                    <S.Button onClick={handleAddIngredient}>추가</S.Button>
                  </S.RecipeFormAttributeLabel>
                  <div>
                    {/* 추가한 재료들이 나타나는 곳*/}
                    {recipeData.ingredients.length > 0 && (
                      <S.RecipeAddBox>
                        {recipeData.ingredients.map((ingredient, idx) => (
                          <div key={idx}>
                            {ingredient.name} - {ingredient.amount} &nbsp;
                            <S.DeleteButton
                              onClick={() => handleDeleteIngredient(idx)}
                            >
                              X
                            </S.DeleteButton>
                          </div>
                        ))}
                      </S.RecipeAddBox>
                    )}
                  </div>
                </S.RecipeFormAttribute>
              </S.RecipeFormTopLeft>
              {/* <S.RecipeFormTopRight> == <div id="recipe-form-top-right" style={{ right: "0", width: "30%", }} > */}
              <S.RecipeFormTopRight>
                <div
                  id="upload-img-container"
                  style={{
                    position: "sticky",
                    top: "-1000px",
                    width: "200px",
                    height: "200px",
                    backgroundImage: `url(${plzUploadImgUrl})`,
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div style={{ position: "relative" }}>
                    {recipeImg !== "" && isHovered && (
                      <div
                        onClick={handleImgDelete}
                        style={{
                          position: "absolute",
                          right: "0",
                          padding: "3px",
                          borderRadius: "2px",
                          cursor: "pointer",
                          backgroundColor: "rgba(0,0,0,0.7)",
                        }}
                      >
                        <CloseIcon color={"#fff"} />
                      </div>
                    )}
                  </div>
                  <form
                    action="/recipes"
                    method="POST"
                    encType="multipart/form-data"
                    onSubmit={handleRecipeSubmit}
                  >
                    <div
                      id="recipe-img-container"
                      style={{
                        width: "200px",
                        height: "200px",
                        backgroundImage: `url(${recipeImg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <label
                        htmlFor="fileInput"
                        className="label"
                        style={{
                          width: "inherit",
                          height: "inherit",
                          cursor: "pointer",
                          display: "inline-block",
                        }}
                      >
                        <input
                          style={{ position: "absolute", top: "-1000px" }}
                          id="fileInput"
                          type="file"
                          name="uploadRecipeImg"
                          accept="image/*"
                          onChange={handleImgChange}
                        />
                      </label>
                    </div>
                  </form>
                </div>
              </S.RecipeFormTopRight>
            </S.RecipeFormTop>
            <S.RecipeFormBottom>
              <p>요리 과정</p>
              {/* article tag 대신 다른 거 찾아보기 - 급해서 일단 적은 태그였음 */}
              <article>
                <p>
                  요리의 맛이 좌우될 수 있는 중요한 내용은 빠짐없이 적어주세요!
                </p>
                <p>
                  예) 10분간 익혀주세요. &rarr; 10분간 약한 불로 익혀주세요.
                </p>
                <p>
                  꿀을 조금 넣어주세요. &rarr; 꿀이 없는 경우 설탕 1스푼으로
                  대체 가능합니다.
                </p>
              </article>
              {recipeData.process.length > 0 && (
                <S.RecipeAddBox>
                  <ul>
                    {recipeData.process.map((step, idx) => (
                      <li key={idx}>
                        {`Step ${idx + 1}`}
                        <textarea
                          value={step}
                          onChange={(e) => {
                            handleStepChange(e, idx);
                          }}
                          placeholder="요리 과정을 단계별로 작성해주세요!"
                        />
                        <S.DeleteButton
                          onClick={() => {
                            handleDeleteStep(idx);
                          }}
                        >
                          X
                        </S.DeleteButton>
                      </li>
                    ))}
                  </ul>
                </S.RecipeAddBox>
              )}
              {/* <button id="add-step-btn" onClick={handleAddStep} > */}
              <S.Button onClick={handleAddStep}>요리 과정 추가</S.Button>
            </S.RecipeFormBottom>
            <S.SubmitButton onClick={handleRecipeSubmit}>저장</S.SubmitButton>
          </S.RecipeForm>
          {/*</S.RecipeFormContainer>*/}
        </>
      )}
      {/* 미로그인 상태에서 레시피 작성 페이지 접근하는 경우 */}
      {!authResponse.isAuthenticated && (
        <>
          <h2>로그인 또는 회원가입이 필요합니다!</h2>
          <Link to="/login">로그인하기</Link>
          <Link to="/join">회원가입하기</Link>
        </>
      )}
    </S.Wrap>
  );
}

export default RecipeWrite;
