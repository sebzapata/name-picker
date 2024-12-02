import styled, { keyframes } from "styled-components";
import "./App.css";
import { useReducer, useState } from "react";
import Checkbox from "./Checkbox";

const alphabet = [
  "-",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  " ",
];

const scrollAnimation = keyframes`  
  0% {
    transform: translateY(calc(0 * 100%));
  }

  10% {
    transform: translateY(calc(-26 * 100%));
  }

  20% {
    transform: translateY(calc(0 * 100%));
  }

  30% {
    transform: translateY(calc(-26 * 100%));
  }

  40% {
    transform: translateY(calc(0 * 100%));
  }

  75% {
    transform: translateY(calc(-26 * 100%));
  }

  100% {
     transform: translateY(calc(var(--ch) * 100%));
  }
`;

const SpinningLetter = styled.span<{ letter: number; duration: number }>`
  --ch: -${(props) => props.letter};
  animation-name: ${scrollAnimation};
  animation-delay: 0.25s;
  animation-duration: 7.5s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
`;

function App() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [hasSpinnerStarted, setHasSpinnerStarted] = useState(false);
  const [inputName, setInputName] = useState("");
  const [isError, setIsError] = useState(false);
  const [winningName, setWinningName] = useState("");

  const entrantsList: string[] = JSON.parse(
    localStorage.getItem("entrantsList") || "[]"
  );
  const selectedEntrants: string[] = JSON.parse(
    localStorage.getItem("selectedEntrants") || "[]"
  );

  const longestName = entrantsList.reduce((acc, entrant) => {
    return entrant.length > acc.length ? entrant : acc;
  }, "0123456789");

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col mb-16">
        <div className="h-full flex items-center justify-center mb-8">
          {longestName.split("").map((_letter, hIndex) => {
            return (
              <div
                className={`flex flex-col bg-pink-200 text-[90px] h-[100px] w-[75px] leading-[100px] text-center overflow-hidden border border-black`}
              >
                {alphabet.map((letter) => {
                  const letterIndex = alphabet.indexOf(
                    winningName.toUpperCase().split("")[hIndex]
                  );

                  if (hasSpinnerStarted) {
                    return (
                      <SpinningLetter
                        letter={hIndex < winningName.length ? letterIndex : 27}
                        duration={hIndex + 1}
                      >
                        {hIndex === 0 ? letter : letter.toLowerCase()}
                      </SpinningLetter>
                    );
                  }

                  return <span>-</span>;
                })}
              </div>
            );
          })}
        </div>

        <div
          role="button"
          className="w-1/3 bg-blue-200 h-12 rounded-md ml-auto mr-auto leading-[48px] font-bold"
          onClick={() => {
            const randomNumber = Math.floor(
              Math.random() * selectedEntrants.length
            );
            setWinningName(selectedEntrants[randomNumber]);
            setHasSpinnerStarted(true);
          }}
        >
          Spin the wheel!
        </div>
      </div>

      <div className="flex flex-col border border-b-neutral-500 w-full min-h-48 p-4">
        <h2 className="text-2xl mb-4">Select the entrants</h2>

        <div className="flex mb-4 items-start">
          <div className="flex flex-col w-9/12 mr-4 items-start">
            <input
              placeholder="Please enter a name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="border h-9 w-full mb-1 p-4"
            />
            {isError && (
              <span className="text-red-600">Name already exists in list!</span>
            )}
          </div>

          <button
            className="h-9 flex flex-grow leading-4 text-base justify-center"
            onClick={() => {
              if (entrantsList.includes(inputName)) {
                setIsError(true);
              } else if (inputName) {
                localStorage.setItem(
                  "entrantsList",
                  JSON.stringify([...entrantsList, inputName])
                );
                localStorage.setItem(
                  "selectedEntrants",
                  JSON.stringify([...selectedEntrants, inputName])
                );
                setInputName("");
                setIsError(false);
              }
            }}
          >
            Add entrant
          </button>
        </div>

        <ul className="columns-3">
          {entrantsList.map((entrant) => (
            <li>
              <Checkbox
                entrant={entrant}
                checked={selectedEntrants.includes(entrant)}
                onClick={(event) => {
                  if (event.target.checked) {
                    localStorage.setItem(
                      "selectedEntrants",
                      JSON.stringify([...selectedEntrants, event.target.value])
                    );
                  } else {
                    localStorage.setItem(
                      "selectedEntrants",
                      JSON.stringify(
                        selectedEntrants.filter(
                          (id) => id !== event.target.value
                        )
                      )
                    );
                  }

                  forceUpdate();
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
