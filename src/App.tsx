import styled, { keyframes } from "styled-components";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import Checkbox from "./checkbox.tsx";

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

const SpinningLetter = styled.span<{ letter: number }>`
  --ch: -${(props) => props.letter};
  animation-name: ${scrollAnimation};
  animation-delay: 0.5s;
  animation-duration: 7.5s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
`;

function App() {
  const [entrantsList, setEntrantsList] = useState<string[]>(
    JSON.parse(localStorage.getItem("entrantsList") || "[]")
  );
  const [selectedEntrants, setSelectedEntrants] = useState<string[]>(
    JSON.parse(localStorage.getItem("selectedEntrants") || "[]")
  );
  const [hasSpinnerStarted, setHasSpinnerStarted] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [inputName, setInputName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [winningName, setWinningName] = useState("");

  const animationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("entrantsList", JSON.stringify(entrantsList));
    localStorage.setItem("selectedEntrants", JSON.stringify(selectedEntrants));
  }, [entrantsList, selectedEntrants]);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.addEventListener("animationend", () => {
        setIsSpinning(false);
      });
    }
  }, []);

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
                ref={animationRef}
              >
                {alphabet.map((letter) => {
                  const letterIndex = alphabet.indexOf(
                    winningName.toUpperCase().split("")[hIndex]
                  );

                  if (hasSpinnerStarted && isSpinning) {
                    return (
                      <SpinningLetter
                        letter={hIndex < winningName.length ? letterIndex : 27}
                      >
                        {hIndex === 0 ? letter : letter.toLowerCase()}
                      </SpinningLetter>
                    );
                  }

                  if (hasSpinnerStarted && !isSpinning) {
                    return <span>{winningName.split("")[hIndex] || "-"}</span>;
                  }

                  return <span>-</span>;
                })}
              </div>
            );
          })}
        </div>

        <div
          role="button"
          className={`w-1/3 bg-blue-200 h-12 rounded-md ml-auto mr-auto leading-[48px] font-bold ${
            isSpinning || !entrantsList.length
              ? "cursor-default opacity-50"
              : "cursor-pointer"
          }`}
          onClick={() => {
            if (!isSpinning && entrantsList.length) {
              const randomNumber = Math.floor(
                Math.random() * selectedEntrants.length
              );
              setWinningName(selectedEntrants[randomNumber]);
              setHasSpinnerStarted(true);
              setIsSpinning(true);
            }
          }}
        >
          Spin the wheel!
        </div>
      </div>

      <div className="flex flex-col border border-b-neutral-500 w-full min-h-48 p-4">
        <h2 className="text-2xl mb-4">Select the entrants</h2>

        <form
          className="flex mb-4 items-start"
          onSubmit={(e) => {
            e.preventDefault();

            if (entrantsList.includes(inputName)) {
              setErrorMessage("Name already exists in list!");
            } else if (inputName.length > 15) {
              setErrorMessage(
                "Can't have any names longer than 15 characters!"
              );
            } else if (inputName) {
              setEntrantsList([...entrantsList, inputName]);
              setSelectedEntrants([...selectedEntrants, inputName]);

              setInputName("");
              setErrorMessage("");
            }
          }}
        >
          <div className="flex flex-col w-9/12 mr-4 items-start">
            <input
              placeholder="Please enter a name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="border h-9 w-full mb-1 p-4"
            />
            {errorMessage && (
              <span className="text-red-600">{errorMessage}</span>
            )}
          </div>

          <button
            disabled={hasSpinnerStarted}
            className="h-9 flex flex-grow leading-4 text-base justify-center"
          >
            Add entrant
          </button>
        </form>

        <ul className="columns-3">
          {entrantsList.map((entrant) => (
            <li>
              <Checkbox
                entrant={entrant}
                checked={selectedEntrants.includes(entrant)}
                onClick={(event) => {
                  if (event.target.checked) {
                    setSelectedEntrants([
                      ...selectedEntrants,
                      event.target.value,
                    ]);
                  } else {
                    setSelectedEntrants(
                      selectedEntrants.filter((id) => id !== event.target.value)
                    );
                  }
                }}
                removeEntrant={() => {
                  setEntrantsList(entrantsList.filter((id) => id !== entrant));
                  setSelectedEntrants(
                    selectedEntrants.filter((id) => id !== entrant)
                  );
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
