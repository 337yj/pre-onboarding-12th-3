## 원티드 프리온보딩 프론트엔드 인턴십 3주차 과제

질환명 검색시 API 호출 통해서 검색어 추천 기능 구현
<br/>
목표 : 검색창 구현 + 검색어 추천 기능 구현 + 캐싱 기능 구현

<br/>

## 프로젝트 실행 방법

```
git clone https://github.com/337yj/pre-onboarding-12th-3.git

npm install
npm start
```

<br/>

## 폴더 구조

```
  📂  src
   ├─ api
   │  ├─ apiClient.js
   │  └─ search.js
   │
   ├─ components
   │  ├─ SearchBar.js
   │  └─ SearchResult.js
   │
   ├─ hooks
   │  ├─ useDebounce.js
   │  ├─ useFetchData.js
   │  └─ useKeyDown.js
   │
   ├─ page
   │  └─ Home.js
   │
   ├─ style
   │  └─ GlobalStyle.js
   ├─ App.js
   └─ index.js
```

<br/>

## 기능 구현

### ✅ API 관리

```js
import axios from "axios";

const BASE_URL = "https://dusty-titanium-middle.glitch.me/sick";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

apiClient.interceptors.request.use(async (config) => {
  config.headers["Content-Type"] = "application/json";
  return config;
});

export default apiClient;
```

```js
import apiClient from "./apiClient";

const getData = async (params) => {
  return await apiClient.get(`?q=${params}`);
};

export default getData;
```

- 인터셉터를 사용하여 모든 요청에 대해 "Content-Type" 헤더를 설정하였습니다.
- apiClient를 사용하여 params를 기반으로 API에 GET 요청을 보냅니다.

<br/>

### ✅ API 호출별로 로컬 캐싱 구현

```js
import { useState, useEffect } from "react";
import getData from "../api/search";
import useDebounce from "./useDebounce";

const useFetchData = ({ isClicked, searchTerm }) => {
  const [data, setData] = useState([]);
  const { debounceValue } = useDebounce(searchTerm, 400);

  useEffect(() => {
    const fetchData = async () => {
      if (isClicked && debounceValue) {
        const currentTime = new Date().getTime();
        const staleTime = 1000 * 60;

        // 로컬 스토리지에서 캐시 데이터 가져오기
        const cachedData = localStorage.getItem(debounceValue);

        // 캐시에 데이터가 없거나 캐시가 만료된 경우 API 호출
        if (
          !cachedData ||
          currentTime - JSON.parse(cachedData).cachedTime > staleTime
        ) {
          console.info("calling api");
          try {
            const response = await getData(debounceValue);
            setData(response.data);

            const cacheData = {
              data: response.data,
              cachedTime: currentTime,
            };
            localStorage.setItem(debounceValue, JSON.stringify(cacheData));
          } catch (error) {
            console.error(error);
          }
        } else {
          // 캐시에 데이터가 있는 경우 캐시에서 데이터 가져옴
          setData(JSON.parse(cachedData).data);
        }
      }
    };

    fetchData();
  }, [isClicked, debounceValue]);

  return data;
};

export default useFetchData;
```

```js
// page/Home.js
const searchData = useFetchData(
  isClicked && searchTerm ? { isClicked, searchTerm } : ""
);
```

#### **localStorage를 사용한 이유**

- **데이터 변경 빈도가 낮음**: 클라이언트 측 캐싱은 주로 데이터의 변경 빈도가 낮고 상대적으로 일정 기간 동안 데이터가 변하지 않을 때 유용합니다. 서버에서 가져온 데이터가 자주 업데이트되지 않는 경우에 적합하다고 생각하여 사용하였습니다.
- **데이터의 지속성이 필요함**: 로컬 스토리지에 저장된 데이터는 브라우저 세션이나 사용자가 웹 애플리케이션을 닫고 다시 열어도 검색한 내용이 유지됩니다. 이는 사용자 경험을 향상시키는 데 도움이 됩니다.

<br/>

#### **코드 설명**

- `data`는 API 호출 결과를 저장하는 데 사용되며, `localStorage`를 사용하여 캐싱된 데이터를 관리합니다.
- `useDebounce` 훅을 사용하여 사용자가 검색어를 입력할 때 지연된 API 요청을 보내도록 최적화합니다. 사용자가 연속으로 타이핑할 때 불필요한 요청을 방지합니다.
- `fetchData` 함수에서는 다음과 같은 로직을 수행합니다.
  - `isClicked`와 `debounceValue` 값이 존재하는 경우에만 API 호출을 수행합니다.
  - `localStorage`에서 캐시 데이터를 가져옵니다.
  - 데이터가 캐시에 없거나 캐시가 만료된 경우에만 API 호출을 실행하고, API 호출 결과를 캐싱합니다.
  - 만약 캐시에 데이터가 있는 경우 캐시에서 데이터를 가져옵니다. 따라서 API가 호출되지 않는 경우에는 `"calling api"` 메시지가 출력되지 않습니다.
- `staleTime` 변수를 사용하여 캐시의 만료 시간을 설정합니다. 이 값은 현재 시간(`currentTime`)과 캐시된 데이터의 `cachedTime`을 비교하여 캐시가 만료되었는지 확인하는 데 사용됩니다.
- `localStorage`를 활용하여 캐시 데이터를 저장하고 불러옵니다. 캐싱된 데이터의 유효 기간이 지나면 해당 데이터를 다시 API로부터 가져옵니다.

<br/>

### ✅ API 호출 횟수를 줄이는 전략 수립 및 실행

```js
import { useEffect, useState } from "react";

const useDebounce = (value, delay = 400) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return { debounceValue };
};

export default useDebounce;
```

#### **디바운싱을 사용한 이유**

- 디바운싱(Debouncing)과 쓰로틀링(Throttling)은 연속적으로 발생하는 이벤트를 제어하기 위한 두 가지 기술입니다.
- 디바운싱: 연속된 이벤트를 그룹화하고, 그룹 내에서 마지막 또는 처음 이벤트만 처리합니다. 사용자 입력과 같이 예측하기 어려운 상황에서 유용하며, 중복 호출과 연산을 방지합니다.
- 쓰로틀링: 연속된 이벤트를 일정한 시간 간격을 두어 일정 주기마다 하나의 이벤트만 처리합니다. 일정한 주기로 이벤트를 처리하고자 할 때 사용합니다.
- **사용자 입력과 같이 실시간 반영이 필요하고 입력의 불규칙한 종료를 다룰 때 효과적이라 생각하여 디바운싱을 사용하였습니다.**

<br/>

#### **코드 설명**

- 입력값(`value`)과 지연 시간(`delay`)을 받아와 `debounceValue` 상태를 관리합니다. 이 상태는 입력값과 동일하게 초기화되며, API 호출에 사용됩니다.
- `useEffect` 내에서 입력값(`value`)과 지연 시간(`delay`)이 변경될 때마다 타이머를 설정합니다. 이 타이머는 입력값이 변경된 후 `delay` 시간이 지나면 `debounceValue` 상태를 업데이트하는 역할을 합니다.
- `useEffect` 내에 반환 함수를 사용하여 컴포넌트가 언마운트되거나 입력값이 변경될 때 이전 타이머를 제거합니다. 이렇게 함으로써 불필요한 타이머가 동작하지 않도록 합니다.

<br/>

### ✅ 키보드만으로 추천 검색어들로 이동 가능하도록 구현

```js
import { useEffect, useState } from "react";

const useKeyDown = (searchResult) => {
  const [searchIndex, setSearchIndex] = useState(-1);
  const [changeValue, setChangeValue] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") {
        setSearchIndex((prev) => Math.max(prev - 1, -1));
      } else if (e.key === "ArrowDown") {
        setSearchIndex((prev) => Math.min(prev + 1, searchResult.length - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchIndex, searchResult]);

  return { searchIndex, changeValue };
};

export default useKeyDown;
```

```js
const { searchIndex, changeValue } = useKeyDown(searchData);

useEffect(() => {
  if (changeValue !== "") {
    setSearchTerm(changeValue);
  }
}, [changeValue, searchTerm]);
```

- `searchIndex` 상태를 사용하여 현재 선택된 검색어의 인덱스를 관리합니다. 초기값은 -1로 설정되어 아무 검색어도 선택되지 않은 상태를 나타냅니다.
- `useEffect` 내에서 화살표 키 (위/아래) 이벤트를 처리합니다.
  - ArrowUp: 현재 선택된 검색어 인덱스를 한 칸 위로 이동시킵니다.
  - ArrowDown: 현재 선택된 검색어 인덱스를 한 칸 아래로 이동시킵니다.
- `window.addEventListener`를 사용하여 키보드 이벤트 리스너를 등록하고, 컴포넌트가 언마운트될 때 이벤트 리스너를 해제합니다.
- `changeValue`는 선택된 검색어를 변경하는 데 사용되며, 이를 통해 추천 검색어 목록을 키보드로 탐색하고 선택할 수 있게 됩니다.
