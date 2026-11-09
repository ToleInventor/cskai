import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import APIs from "../apis";
import LoginFunc from "./Login";
import SignUp from "./SignUp";

export default function Navigation(){
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path='/apis' element={<APIs />} />
            <Route path='/login' element={<LoginFunc />} />
            <Route path='/sign-up' element={<SignUp />} />
        </Routes>
        </BrowserRouter>
    )
}