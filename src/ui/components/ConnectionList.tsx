import "./ConnectionList.css";

interface IConnectionListProps {
  showAddConnectionForm: () => void;
  connections: ConnectionData[];
}

export const ConnectionList = ({
  showAddConnectionForm,
  connections,
}: IConnectionListProps) => {
  return (
    <div className="connectionList">
      <div>
        <h3>Saved Connections</h3>

        <ul>
          {connections.map((connection, index) => (
            <li key={index}>
              <span>Host: {connection.host}</span>
              <span>Port: {connection.port}</span>
              <span>Username: {connection.username}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="addButtonContainer">
        <button style={{ width: "100%" }} onClick={showAddConnectionForm}>
          + Add
        </button>
      </div>
    </div>
  );
};
