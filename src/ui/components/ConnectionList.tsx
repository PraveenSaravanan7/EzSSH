import "./ConnectionList.css";

interface IConnectionListProps {
  showAddConnectionForm: () => void;
  connections: ConnectionData[];
  activeConnection?: ConnectionData;
  setActiveConnection: (activeConnection: ConnectionData) => void;
}

export const ConnectionList = ({
  showAddConnectionForm,
  connections,
  activeConnection,
  setActiveConnection,
}: IConnectionListProps) => {
  return (
    <div className="connectionList">
      <div>
        <h3 style={{ marginTop: "8px" }}>Saved Connections</h3>
      </div>

      <div className="connectionItemsContainer">
        {connections.map((connection, index) => (
          <div
            className={`connectionItem ${
              activeConnection?.id == connection.id ? "active" : ""
            }`}
            key={index}
            onClick={() => setActiveConnection(connection)}
          >
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
