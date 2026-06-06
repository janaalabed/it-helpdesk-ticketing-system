import { useState } from "react";

export function AdminDashboard() {
    const [name,setName] = useState("");
    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [role,setRole] = useState("");
    
   async function addUser() {
        const user = {
            name,
            email,
            password,
            role
       };
       
       const token = localStorage.getItem("token");
        try{

        const response = await fetch("https://localhost:7010/api/users",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(user)

          });
        // const data = await response.json();
        if (response.ok) {
            alert("user created successfully");
        }
        else {
            alert("failed to create new user");
        }
         } catch (error) {
            console.error(error);
            alert("Server error");
        }        
    };
    return (
        <>
        <h1>Welcome to admin dashboard</h1>
         
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <label>Email</label>      
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Password</label>           
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <select
                value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Select a Role</option>
                <option value="3">Employee</option>
                <option value="4">Manager</option>
                <option value="2">IT Support</option>
                <option value="1">Admin</option>
            </select>
            <button onClick={addUser} >Add User</button></>

    );  
}