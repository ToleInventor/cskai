export default function LogoutUser(){
    localStorage.clear();
    window.location.href = '/';
}