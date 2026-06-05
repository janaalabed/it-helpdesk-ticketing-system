// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export function Login() {
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const credentials = {
//             email,
//             password
//         };

//         try {
//             const response = await fetch(
//                 "https://localhost:7010/api/login",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify(credentials)
//                 }
//             );

//             const data = await response.json();

//             if (response.ok) {
//                 localStorage.setItem("token", data.token);
//                 localStorage.setItem("role", data.role);
//                 alert("Login successful!");
//                 navigate("/dashboard");
//             } else {
//                 alert(data.message);
//             }
//         } catch (error) {
//             console.error(error);
//             alert("Server error");
//         }
//     };
//     const [email, setEmail] = useState("") ;
//     const [password, setPassword] = useState("");
//     return (
//         <>
//             <form onSubmit={handleSubmit}>
//                 <label >Email </label>
//                 <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//                 <label >Password</label>
//                 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//                 <button type="submit">Submit</button>
//             </form>
//         </>
//     );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
                localStorage.setItem("role", data.role);

                navigate("/dashboard");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Server error");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 font-sans">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-8">
                
                <div className="mb-8 text-center">
                    <h1 className="text-xl font-medium text-slate-900">
                        HelpDesk Login
                    </h1>
                    <p className="text-sm text-slate-400 mt-2">
                        Sign in to access your dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-xs text-slate-500 mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@helpdesk.com"
                            required
                            className="
                                w-full
                                px-3 py-2
                                border border-slate-200
                                rounded-md
                                text-sm
                                focus:outline-none
                                focus:ring-2
                                focus:ring-cyan-500
                                focus:border-cyan-500
                            "
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-slate-500 mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="
                                w-full
                                px-3 py-2
                                border border-slate-200
                                rounded-md
                                text-sm
                                focus:outline-none
                                focus:ring-2
                                focus:ring-cyan-500
                                focus:border-cyan-500
                            "
                        />
                    </div>

                    <button
                        type="submit"
                        className="
                            w-full
                            bg-cyan-500
                            hover:bg-cyan-400
                            text-white
                            text-sm
                            font-medium
                            py-2.5
                            rounded-md
                            transition
                        "
                    >
                        Sign In
                    </button>

                </form>
            </div>
        </div>
    );
}