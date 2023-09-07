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
