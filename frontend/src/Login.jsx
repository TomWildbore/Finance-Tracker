import { useState } from "react";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const response = await fetch(
      "http://localhost:8080/auth/login",
      {
        method: "POST", // ← THIS IS CRITICAL
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const userData = await response.json();

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded-xl w-full mb-4"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded-xl w-full mb-6"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full py-2 rounded-xl"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;