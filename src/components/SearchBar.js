import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

function SearchBar({ onClick, onChange, value }) {
  return (
    <Container onClick={onClick}>
      <FontAwesomeIcon icon={faMagnifyingGlass} />
      <Input
        placeholder={"질환명을 입력해 주세요."}
        onChange={onChange}
        value={value}
      />
      <Button>검색</Button>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  height: 60px;

  & > svg {
    position: absolute;
    left: 22px;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  font-size: 18px;
  border-radius: 40px 0 0 40px;
  padding: 26px 50px;
  background-color: #ffffff;
`;

const Button = styled.button`
  width: 20%;
  height: 100%;
  border-radius: 0 40px 40px 0;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  background-color: #007be9;
`;

export default SearchBar;
