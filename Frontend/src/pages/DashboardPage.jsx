import { useNavigate } from "react-router-dom";

export function DashboardPage() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/");

    }
    return (
        <>
            <h1>HELLO dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
        </>
    );
}