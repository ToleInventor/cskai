import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./part/Nav";
import { IoSunny } from "react-icons/io5";
import { IoMoon } from "react-icons/io5";
import { IoSunnyOutline } from "react-icons/io5";
import "./App.css";
import LoadStats from "./helperfuncs/Load_stats";
import LoadAPIs, { type ApiKeyItem } from "./helperfuncs/Load_apis";
import Apis from "./part/api_keys";

export default function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [apiCalls, setApiCalls] = useState(localStorage.getItem("api_calls") || "Loading...");
  const [tokensUsed, setTokensUsed] = useState(localStorage.getItem("tokens_used") || "Loading...");
  const [accountStatus, setAccountStatus] = useState(localStorage.getItem("account_status") || "Loading...");
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(() => {
    const raw = localStorage.getItem("api_keys");
    return raw ? JSON.parse(raw) : [];
  });
  const [greeting, setGreeting] = useState("");
  const [greetingIcon, setGreetingIcon] = useState<React.ReactNode>(null);

  const syncStats = () => {
    setApiCalls(localStorage.getItem("api_calls") || "Loading...");
    setTokensUsed(localStorage.getItem("tokens_used") || "Loading...");
    setAccountStatus(localStorage.getItem("account_status") || "Loading...");
  };

  const syncApiKeys = () => {
    const raw = localStorage.getItem("api_keys");
    setApiKeys(raw ? JSON.parse(raw) : []);
  };

  const updateGreeting = () => {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 5 && hours < 12) {
      setGreeting("Good Morning");
      setGreetingIcon(<IoSunny color="#fbbf24" size={28} />);
    } else if (hours >= 12 && hours < 17) {
      setGreeting("Good Afternoon");
      setGreetingIcon(<IoSunny color="#f59e0b" size={28} />);
    } else if (hours >= 17 && hours < 20) {
      setGreeting("Good Evening");
      setGreetingIcon(<IoSunnyOutline color="#f97316" size={28} />);
    } else {
      setGreeting("Good Night");
      setGreetingIcon(<IoMoon color="#6366f1" size={28} />);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (!storedToken) {
      navigate("/login");
      return;
    }

    if (storedUsername) {
      setUsername(storedUsername);
    }

    updateGreeting();
    const intervalId = setInterval(updateGreeting, 60000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        await LoadStats();
        syncStats();
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };

    const loadApiKeys = async () => {
      try {
        await LoadAPIs();
        syncApiKeys();
      } catch (error) {
        console.error("Failed to load API keys:", error);
      }
    };

    loadStats();
    loadApiKeys();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "api_calls" || event.key === "tokens_used" || event.key === "account_status") {
        syncStats();
      }
      if (event.key === "api_keys") {
        syncApiKeys();
      }
    };

    const handleApiKeysUpdate = () => syncApiKeys();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("api_keys_updated", handleApiKeysUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("api_keys_updated", handleApiKeysUpdate);
    };
  }, []);

  return (
    <>
      <header>
        <Nav />
      </header>

      <div className="GreetingBox">
        {greetingIcon}
        <label className="primary-text">{greeting}, {username}!</label>
      </div>

      <label className="headerLabel">Usage Statistics</label>
      <div className="statswrap">
        <div className="stat">
          <label className="stat-title">API calls/month</label>
          <label className="stat-sub-title">{apiCalls}</label>
        </div>

        <div className="stat">
          <label className="stat-title">Tokens used/month</label>
          <label className="stat-sub-title">{tokensUsed}</label>
        </div>

        <div className="stat">
          <label className="stat-title">Account status</label>
          <label className="stat-sub-title">{accountStatus}</label>
        </div>
      </div>

      <label className="headerLabel">API Keys</label>

      {apiKeys.length === 0 ? (
        <p>nothing here</p>
      ) : (
        <span>
          {apiKeys.map((key, index) => (
            <Apis 
            key={`${key.api_key} - ${index}`}
            api_key={key.api_key}
            nickname={key.nickname}
            date_generated={key.date_created}
            status="active"
            />
          ))}
        </span>
      )}
    </>
  );
}