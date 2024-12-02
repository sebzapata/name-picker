import "./checkboxStyles.css";
import TickIcon from "./tick-thick-icon.svg";

const Checkbox = ({
  entrant,
  onClick,
  checked,
}: {
  entrant: string;
  onClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}) => {
  return (
    <label
      htmlFor={entrant}
      className="flex relative pl-9 mb-3 cursor-pointer text-base select-none"
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
  );
};

export default Checkbox;
