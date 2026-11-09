import '../App.css'
import { MdContentCopy } from "react-icons/md";

export default function Apis({api_key, nickname, date_generated, status}:{api_key:string, nickname:string, date_generated:string, status:string}){
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

    return(<>
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
    </div>
    </>
    )
}
