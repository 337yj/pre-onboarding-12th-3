import React, { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import SearchBar from "../components/SearchBar";
import SearchResult from "../components/SearchResult";
import styled from "styled-components";

const Home = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 캐시를 활용한 API 요청
  const searchData = useFetchData(
    isClicked && searchTerm ? { isClicked, searchTerm } : ""
  );

  const activateSearchBar = (e) => {
    e.stopPropagation();
    setIsClicked(true);
  };

  const deactivateSearchBar = () => {
    setIsClicked(false);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Container onClick={() => deactivateSearchBar()}>
      <Title>
        국내 모든 임상시험 검색하고 <br />
        온라인으로 참여하기
      </Title>
      <SearchBar
        onClick={(e) => activateSearchBar(e)}
        onChange={handleSearchTermChange}
        value={searchTerm}
      />
      {isClicked ? (
        <SearchResult searchData={searchData} searchTerm={searchTerm} />
      ) : null}
    </Container>
  );
};

const Container = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
`;

const Title = styled.h1`
  font-weight: bold;
  text-align: center;
  margin-bottom: 6%;
`;

export default Home;
