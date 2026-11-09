import { backend_url } from "./main";
import Nav from "./part/Nav";
import './App.css';
import Apigenandrevoke from "./part/apigen&revoke";
import { RiAddFill } from "react-icons/ri";
import { useState, useEffect } from "react";

interface ApiKey {
  api_key: string;
  nickname: string;
  date_generated: string;
  status: string;
}

interface ApiKeyResponse {
  api_key: string;
  nickname: string;
  date_created: string | null;
}

export default function APIs() {
  const [newApiKey, setNewApiKey] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("");
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const token = localStorage.getItem('token');
  const [adding, setAdding] = useState<boolean>(false);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async (): Promise<void> => {
    try {
      const response = await fetch(`${backend_url}/load_apis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data: ApiKeyResponse[] = await response.json();
      const formattedKeys: ApiKey[] = data.map((key: ApiKeyResponse) => ({
        api_key: key.api_key,
        nickname: key.nickname || 'Unnamed',
        date_generated: key.date_created ? new Date(key.date_created).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).replace(/\//g, '-') : 'N/A',
        status: 'active'
      }));
      setApiKeys(formattedKeys);
    } catch (error) {
      console.error('Error loading API keys:', error);
    }
  };

  const handleAddApiKey = async (): Promise<void> => {
    if (!nickname.trim()) return;
    setAdding(true);
    try {
      const response = await fetch(`${backend_url}/add_api_key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nickname: nickname.trim() })
      });
      const data: ApiKeyResponse = await response.json();

      if (response.ok) {
        const newKey: ApiKey = {
          api_key: data.api_key,
          nickname: data.nickname || 'Unnamed',
          date_generated: data.date_created ? new Date(data.date_created).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).replace(/\//g, '-') : 'N/A',
          status: 'active'
        };
        setApiKeys([newKey, ...apiKeys]);
        setNickname("");
        setNewApiKey(false);
      }
    } catch (error) {
      console.error('Error adding API key:', error);
    }
  };

  const handleRevokeKey = async (apiKey: string): Promise<void> => {
    try {
      const response = await fetch(`${backend_url}/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ api_key: apiKey })
      });
      
      if (response.ok) {
        setApiKeys(apiKeys.filter((key: ApiKey) => key.api_key !== apiKey));
      }
    } catch (error) {
      console.error('Error revoking API key:', error);
    }
  };

  const handleCloseModal = (): void => {
    setNewApiKey(false);
    setNickname("");
  };

  return (
    <>
      <header>
        <Nav />
      </header>

      <div className="api-keys-header">
        <label className="headerLabel">API Keys</label>
        <button type="button" className="api-key-add-button" aria-label="Add API key"
        onClick={() => {
          setNewApiKey(true);
        }}>
          <RiAddFill size={18} />
        </button>
      </div>

      {apiKeys.map((key: ApiKey, index: number) => (
        <span key={index}>
          <Apigenandrevoke
            api_key={key.api_key}
            nickname={key.nickname}
            date_generated={key.date_generated}
            status={key.status}
            onRevoke={() => handleRevokeKey(key.api_key)}
          />
        </span>
      ))}

      {newApiKey && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New API Key</h2>
              <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="nickname">Nickname *</label>
                <input
                  type="text"
                  id="nickname"
                  placeholder="Enter API key nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="modal-cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              {!adding ? <button 
                className="modal-add-btn" 
                onClick={handleAddApiKey}
                disabled={!nickname.trim()}
              >
                Generate API Key
              </button>
            :
            <label className="modal-add-btn" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                Generating...
              </label>  
            }
            </div>
          </div>
        </div>
      )}
    </>
  );
}