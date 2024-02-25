import { useEffect, useState } from "react";

import styled from "styled-components";
// TODO: 1 zrobinie algorytmu do szukania zagadek

const HOW_BIG = 5;
const HOW_MANY_COLORS = 2;

const StyledContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
`;

const StyledRandomBoardContainer = styled.div`
  display: grid;
  grid-template-columns: 50px auto;
  grid-template-rows: auto 50px;
`;

const StyledRandomBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(${HOW_BIG}, 100px);
  grid-template-rows: repeat(${HOW_BIG}, 100px);
`;

const handleColorType = (color) => {
  switch (color) {
    case 1:
      return "blue";
    case 2:
      return "red";
    case null:
      return "white";
    default:
      return "white";
  }
};

const StyledBox = styled.div`
  background: ${({ color }) => handleColorType(color)};
  border: 2px solid black;
`;

const StyledRowColors = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const StyledColumnColors = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const InsideColor = styled.div`
  width: 20px;
  height: 20px;
  background: ${({ color }) => (color === 1 ? "blue" : "red")};
`;

function App() {
  const [randomBoard, setRandomBoard] = useState(null);
  const [randomColors, setRandomColors] = useState(null);

  const [myGameBoard, setMyGameBoard] = useState(
    Array.from({ length: HOW_BIG }, (_) =>
      Array.from({ length: HOW_BIG }, (_) => null),
    ),
  );
  const main = (howBig = 2, howManyColors = 2) => {
    const getRandomColors = () => {
      const randomColors = Array.from(
        { length: howBig * 2 },
        (_) => Math.floor(Math.random() * howManyColors) + 1,
      );
      let isPass = true;
      Array.from({ length: howManyColors }).forEach((_, i) => {
        if (!randomColors.some((e1) => e1 !== i + 1)) isPass = false;
      });
      if (isPass) {
        return randomColors;
      } else {
        getRandomColors();
      }
    };

    const random = getRandomColors();

    let result = Array.from({ length: howBig }, (_) =>
      Array.from({ length: howBig }),
    );
    const onPaint = (id, colorToChange) => {
      if (id < howBig) {
        result[id].fill(colorToChange);
      } else {
        const col = id - howBig;
        result = result.map((inArr) => {
          return inArr.map((prevColors, index) =>
            index === col ? colorToChange : prevColors,
          );
        });
      }
    };

    for (let i = 0; i < 100; i++) {
      const randomClick = Math.floor(Math.random() * (howBig * howBig));
      onPaint(randomClick, random[randomClick]);
    }
    return [result, random];
  };

  const onPointBoard = (id, colorToChange) => {
    console.log(id);
    if (id < HOW_BIG) {
      setMyGameBoard((prev) => {
        let arr = prev;
        arr[id].fill(colorToChange);
        console.log(arr);
        return [...arr];
      });
    } else {
      const col = id - HOW_BIG;
      setMyGameBoard((prev) => {
        return prev.map((inArr) => {
          return inArr.map((prevColors, index) =>
            index === col ? colorToChange : prevColors,
          );
        });
      });
    }
  };

  useEffect(() => {
    const [result, randomColors] = main(HOW_BIG, HOW_MANY_COLORS);
    setRandomBoard(result);
    setRandomColors(randomColors);
  }, []);

  return (
    <>
      {randomBoard === null ? (
        "Ładowanie"
      ) : (
        <StyledContainer>
          <StyledRandomBoardContainer>
            <StyledRowColors>
              {randomColors.slice(0, HOW_BIG).map((e) => (
                <InsideColor color={e} />
              ))}
            </StyledRowColors>
            <StyledRandomBoard>
              {randomBoard.map((e) => e.map((e2) => <StyledBox color={e2} />))}
            </StyledRandomBoard>
            <span></span>
            <StyledColumnColors>
              {randomColors.slice(HOW_BIG, HOW_BIG * 2).map((e) => (
                <InsideColor color={e} />
              ))}
            </StyledColumnColors>
          </StyledRandomBoardContainer>
          <StyledRandomBoardContainer>
            <StyledRowColors>
              {randomColors.slice(0, HOW_BIG).map((e, i) => (
                <InsideColor color={e} onClick={() => onPointBoard(i, e)} />
              ))}
            </StyledRowColors>
            <StyledRandomBoard>
              {myGameBoard.map((e) => e.map((e2) => <StyledBox color={e2} />))}
            </StyledRandomBoard>
            <span></span>
            <StyledColumnColors>
              {randomColors.slice(HOW_BIG, HOW_BIG * 2).map((e, i) => (
                <InsideColor
                  color={e}
                  onClick={() => onPointBoard(i + HOW_BIG, e)}
                />
              ))}
            </StyledColumnColors>
          </StyledRandomBoardContainer>
          <h1>
            {JSON.stringify(randomBoard) === JSON.stringify(myGameBoard) &&
              "WIN!"}
          </h1>
        </StyledContainer>
      )}
    </>
  );
}

export default App;
