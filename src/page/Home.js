import React from "react";
import SearchBar from "../components/SearchBar";
import styled from "styled-components";

const Home = () => {
  return (
    <Container>
      <SearchBar />
    </Container>
  );
};

export default Home;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
`;
