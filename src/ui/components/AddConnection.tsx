import "./AddConnection.css";

interface IAddConnectionProps {
  onCancel: () => void;
}

export const AddConnection = ({ onCancel }: IAddConnectionProps) => {
  return (
    <div className="addConnection">
      <h2>New Connection</h2>

      <div className="connectionConfigForm">
        <div className="group">
          <div>
            <div className="label">Host</div>
            <input style={{ width: "300px" }} type="text" />
          </div>
          <div>
            <div className="label">Port</div>
            <input style={{ width: "100px" }} type="number" />
          </div>
        </div>
        <div className="group">
          <div>
            <div className="label">Username</div>
            <input type="text" />
          </div>
          <div>
            <div className="label">Password</div>
            <input type="text" />
          </div>
        </div>
        <div>
          <div className="label">Key file</div>
          <input style={{ width: "424px" }} type="file" />
        </div>
      </div>

      <div className="saveAndCancelButtonContainer">
        <button className="secondary" onClick={onCancel}>
          Cancel
        </button>
        <button onClick={onCancel}>Save</button>
      </div>
    </div>
  );
};
