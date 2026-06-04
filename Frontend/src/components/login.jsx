import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const credentials = {
            email,
            password
        };

        try {
            const response = await fetch(
                "https://localhost:7010/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(credentials)
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                alert("Login successful!");
                navigate("/dashboard");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Server error");
        }
    };
    const [email, setEmail] = useState("") ;
    const [password, setPassword] = useState("");
    return (
        <>
            <form onSubmit={handleSubmit}>
                <label >Email </label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label >Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
        </>
    );
}