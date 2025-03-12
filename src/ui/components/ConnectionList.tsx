import "./ConnectionList.css";

interface IConnectionListProps {
  showAddConnectionForm: () => void;
}

export const ConnectionList = ({
  showAddConnectionForm,
}: IConnectionListProps) => {
  return (
    <div className="connectionList">
      <div>
        <h3>Saved Connections</h3>
      </div>
      <div className="addButtonContainer">
        <button style={{ width: "100%" }} onClick={showAddConnectionForm}>
          + Add
        </button>
      </div>
    </div>
  );
};
