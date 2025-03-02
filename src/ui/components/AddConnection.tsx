import "./AddConnection.css";

interface IAddConnectionProps {
  onCancel: () => void;
}

export const AddConnection = ({ onCancel }: IAddConnectionProps) => {
  return (
    <div className="addConnection">
      <div>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};
