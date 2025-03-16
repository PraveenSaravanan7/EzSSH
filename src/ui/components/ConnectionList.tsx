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
        <h3 style={{ marginTop: "8px" }}>Saved Connections</h3>
      </div>

      <div className="connectionItemsContainer">
        {connections.map((connection, index) => (
          <div className="connectionItem" key={index}>
            <div>
              <div className="connectionName"> {connection.name}</div>
              <div className="connectionInfo">
                {connection.username}@{connection.host}:{connection.port}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="addButtonContainer">
        <button style={{ width: "100%" }} onClick={showAddConnectionForm}>
          + Add
        </button>
      </div>
    </div>
  );
};
