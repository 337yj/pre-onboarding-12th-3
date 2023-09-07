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
