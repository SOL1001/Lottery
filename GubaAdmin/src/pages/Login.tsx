import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  listings: any[];
  clients: any[];
}

interface LoginResponse {
  token: any;
  message: any;
  user: any;
}

const Login: React.FC<{ onLogin: (token: string, user: UserData) => void }> = ({
  onLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data: LoginResponse = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      if (response) {
        onLogin(data.token, data.user);
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        localStorage.setItem("token", data.token);
        localStorage.setItem("userData", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 p-4 flex items-center justify-center">
      <div className="bg-white flex flex-col md:flex-row p-0 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-200 overflow-hidden">
        {/* Left Side - Lottery Theme */}
        <div className="w-full hidden md:block md:w-1/2 bg-gradient-to-b from-purple-800 to-indigo-700 p-8 flex-col justify-center text-white">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">
              Welcome to Lottery Admin Pro
            </h1>
            <p className="text-purple-200">
              Manage lottery draws, track tickets, and oversee payouts with our
              comprehensive lottery management platform.
            </p>
          </div>

          <div className="mt-8 relative">
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-purple-900 font-bold">7</span>
            </div>
            <div className="absolute -top-6 right-10 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">23</span>
            </div>
            <div className="absolute bottom-4 left-10 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">42</span>
            </div>
            <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">15</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              alt="Lottery tickets"
              className="rounded-lg shadow-md w-full h-auto z-10 relative"
            />
          </div>

          <div className="mt-8">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-400 p-2 rounded-full mr-3">
                <svg
                  className="w-5 h-5 text-purple-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <span>Manage all lottery draws in one place</span>
            </div>
            <div className="flex items-center mb-4">
              <div className="bg-yellow-400 p-2 rounded-full mr-3">
                <svg
                  className="w-5 h-5 text-purple-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <span>Track ticket sales and winners</span>
            </div>
            <div className="flex items-center">
              <div className="bg-yellow-400 p-2 rounded-full mr-3">
                <svg
                  className="w-5 h-5 text-purple-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <span>Generate comprehensive reports</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-md">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Lottery Admin Pro
            </h1>
            <p className="text-gray-600 mt-2">Admin Portal Login</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg flex items-center border border-red-200">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition placeholder-gray-400"
                  placeholder="admin@lottery.com"
                  required
                  autoComplete="username"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition placeholder-gray-400"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showPassword ? (
                      <>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </>
                    ) : (
                      <>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </>
                    )}
                  </svg>
                </button>
              </div>
              <div className="flex justify-between items-center mt-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                {/* <a
                  href="/forgot-password"
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  Forgot password?
                </a> */}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                loading
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              } transition duration-200 flex items-center justify-center shadow-md hover:shadow-lg`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                "Access Admin Portal"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Secure access for authorized personnel only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
