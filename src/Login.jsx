import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "./services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const res = await API.post("/auth/login", {
      email,
      password,
    });
    console.log("Response:",res.data);

    localStorage.setItem("token", res.data.token);
    console.log("Saved token:",localStorage.getItem("token"));

    alert("Login Successful");
    navigate("/home");
  } catch (error) {
    alert(error.response?.data?.message || "Login Failed");
  }
};

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Momentum</h1>
        <p>Smart Tasks.Better You.</p>
<h2>Welcome Back
</h2>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
  className="login-btn"
  onClick={handleLogin}
>
  Login
</button>

        <div className="login-links">
          <a href="#">Forgot Password?</a>

          <br />
          <br />

          <Link to="/signup">Create Account</Link>
        </div>

        <Link to="/home" className="back-home">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Login;