import { useEffect } from "react";
import useKeyDown from "../hooks/useKeyDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

function SearchResult({ searchData, searchTerm, setSearchTerm }) {
  const { searchIndex, changeValue } = useKeyDown(searchData);

  useEffect(() => {
    if (changeValue !== "") {
      setSearchTerm(changeValue);
    }
  }, [changeValue, searchTerm]);

  return (
    <Container>
      {searchData.length > 0 && searchTerm ? (
        <div>
          추천 검색어
          <ul>
            {searchData.map((search, idx) => (
              <Li
                key={search.sickCd}
                className={idx === searchIndex ? "focus" : ""}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <span>{search.sickNm}</span>
              </Li>
            ))}
          </ul>
        </div>
      ) : (
        <div>검색어가 없습니다.</div>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 60%;
  max-height: 70%;
  padding: 24px;
  margin-top: 12px;
  border-radius: 16px;
  background-color: #ffffff;
  overflow-y: scroll;
`;

const Li = styled.li`
  width: 100%;
  margin-top: 12px;
  margin-left: -10px;
  padding: 8px 10px;
  border-radius: 16px;
  cursor: pointer;

  &.focus {
    background-color: lightGray;
  }

  & > svg {
    margin-right: 10px;
  }
`;

export default SearchResult;
