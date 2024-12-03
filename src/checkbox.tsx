import "./checkboxStyles.css";
import TickIcon from "./tick-thick-icon.svg";
import CrossIcon from "./cross-thick-icon.svg";

const Checkbox = ({
  entrant,
  onClick,
  checked,
  removeEntrant,
}: {
  entrant: string;
  onClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  removeEntrant: () => void;
}) => {
  return (
    <div className="flex mb-3 items-center">
      <label
        htmlFor={entrant}
        className="flex relative pl-9 cursor-pointer text-base select-none mr-2"
      >
        {
          <span className="absolute top-0 left-0 h-6 w-6 bg-slate-100 p-1">
            {checked && <img src={TickIcon} alt="tick icon" />}
          </span>
        }
        <input
          type="checkbox"
          className="absolute opacity-0 cursor-pointer h-0 w-0"
          id={entrant}
          name={entrant}
          value={entrant}
          checked={checked}
          onChange={(event) => onClick(event)}
        />
        {entrant}
      </label>
      <span className="w-4 cursor-pointer" onClick={removeEntrant}>
        <img src={CrossIcon} alt="cross icon" />
      </span>
    </div>
  );
};

export default Checkbox;
