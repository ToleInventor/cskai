import { useState, useEffect } from "react";
import '../App.css';
import { MdContentCopy } from "react-icons/md";
import { GoKebabHorizontal } from "react-icons/go";
import { backend_url } from "../main";

export default function Apigenandrevoke({
  api_key,
  nickname,
  date_generated,
  status
}: {
  api_key: string,
  nickname: string,
  date_generated: string,
  status: string
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedNickname, setEditedNickname] = useState(nickname);
  const [editedDate, setEditedDate] = useState(date_generated);
  const [currentTimestamp, setCurrentTimestamp] = useState("");

  // Update timestamp every second
  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date();
      // Format to match PostgreSQL TIMESTAMPTZ format
      // Example: 2026-08-16 15:30:45.123+05:30
      const formatted = now.toISOString().replace('T', ' ').replace('Z', '');
      // PostgreSQL TIMESTAMPTZ expects: YYYY-MM-DD HH:MM:SS.MS+HH:MM
      // or YYYY-MM-DD HH:MM:SS+HH:MM (without milliseconds)
      
      const withMs = formatted.slice(0, 23);
      const timezoneOffset = -now.getTimezoneOffset();
      const sign = timezoneOffset >= 0 ? '+' : '-';
      const hours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
      const minutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
      const postgresFormat = `${withMs}${sign}${hours}:${minutes}`;
      
      
      setCurrentTimestamp(postgresFormat);
      setEditedDate(postgresFormat);
    };

    updateTimestamp();

    const intervalId = setInterval(updateTimestamp, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(api_key));
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Copied successfully!");
        } else if (Notification.permission !== "denied") {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            new Notification("Copied successfully!");
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRevoke = async () => {
    const confirmed = window.confirm("Are you sure you want to revoke this API key?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${backend_url}/revoke`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ api_key }),
      });

      if (!response.ok) {
        throw new Error("Failed to revoke API key");
      }

      const stored = localStorage.getItem("api_keys");
      const allKeys = stored ? JSON.parse(stored) : [];
      const updated = allKeys.filter((item: { api_key: string }) => item.api_key !== api_key);
      localStorage.setItem("api_keys", JSON.stringify(updated));
      window.dispatchEvent(new Event("api_keys_updated"));
    } catch (error) {
      console.error(error);
      window.alert("Could not revoke this API key.");
    }
  };

  const handleRotate = async () => {
    const confirmed = window.confirm("Are you sure you want to rotate this API key?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    try {
      const generateResponse = await fetch(`${backend_url}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!generateResponse.ok) {
        throw new Error("Failed to generate a replacement key");
      }

      const generated = await generateResponse.json();
      const newApiKey = typeof generated === "string"
        ? generated
        : generated.api_key || generated.key || api_key;

      const editResponse = await fetch(`${backend_url}/edit_api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          api_key,
          new_api_key: newApiKey,
          nickname,
          date_created: date_generated,
        }),
      });

      if (!editResponse.ok) {
        throw new Error("Failed to replace API key");
      }

      const stored = localStorage.getItem("api_keys");
      const allKeys = stored ? JSON.parse(stored) : [];
      const updated = allKeys.map((item: { api_key: string; nickname: string; date_created: string }) => {
        if (item.api_key === api_key) {
          return {
            ...item,
            api_key: newApiKey,
            nickname,
            date_created: date_generated,
          };
        }
        return item;
      });

      localStorage.setItem("api_keys", JSON.stringify(updated));
      window.dispatchEvent(new Event("api_keys_updated"));
    } catch (error) {
      console.error(error);
      window.alert("Could not rotate this API key.");
    }
  };

  const handleEditSave = async () => {
    const confirmed = window.confirm("Save these API key changes?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${backend_url}/edit_api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          api_key,
          nickname: editedNickname,
          date_created: editedDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update API key");
      }

      const stored = localStorage.getItem("api_keys");
      const allKeys = stored ? JSON.parse(stored) : [];
      const updated = allKeys.map((item: { api_key: string; nickname: string; date_created: string }) => {
        if (item.api_key === api_key) {
          return {
            ...item,
            nickname: editedNickname,
            date_created: editedDate,
          };
        }
        return item;
      });

      localStorage.setItem("api_keys", JSON.stringify(updated));
      window.dispatchEvent(new Event("api_keys_updated"));
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
      window.alert("Could not save the API key changes.");
    }
  };

  return (
    <>
      <div className='api-key'>
        <div className='api-key-container'>
          <label className='api-key-itself'>
            {api_key}
          </label>
          <button className='copy-button' onClick={handleCopy}>
            <MdContentCopy size={16} />
          </button>
        </div>

        <label className='api-key-nickname'>
          {nickname}
        </label>
        <label className='api-key-date'>
          {date_generated}
        </label>
        <label className='api-key-status'>
          {status}
        </label>

        <div className='api-key-side'>
          <button
            type='button'
            className='api-key-menu-button'
            aria-label='API key actions'
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <GoKebabHorizontal size={20} />
          </button>

          {menuOpen && (
            <div className='api-key-menu-dropdown'>
              <button type='button' className='api-key-action-button' onClick={handleRevoke}>
                Revoke
              </button>
              <button type='button' className='api-key-action-button' onClick={handleRotate}>
                Rotate
              </button>
              <button type='button' className='api-key-action-button' onClick={() => {
                setEditedNickname(nickname);
                setEditedDate(date_generated);
                setShowEditModal(true);
                setMenuOpen(false);
              }}>
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit API Key</h2>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="edit-nickname">Nickname</label>
                <input
                  id="edit-nickname"
                  type="text"
                  value={editedNickname}
                  onChange={(event) => setEditedNickname(event.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-date">Time edited</label>
                <input
                  id="edit-date"
                  type="text"
                  value={currentTimestamp || editedDate}
                  readOnly
                  className="timestamp-input"
                  style={{ 
                    backgroundColor: '#f5f5f5', 
                    cursor: 'not-allowed',
                    color: '#666'
                  }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-cancel-btn" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="modal-add-btn" onClick={handleEditSave}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}