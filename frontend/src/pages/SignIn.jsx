// src/pages/SignIn.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function SignIn() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/user/signin", form);
      const token = res.data.token;
      if (!token) throw new Error("No token received");
      localStorage.setItem("authToken", token);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Signin failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - PayTM Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 to-blue-600 p-12 items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-4">PayTM</h1>
            <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
          </div>
          <h2 className="text-3xl font-light mb-6">
            Welcome Back!
          </h2>
          <p className="text-xl opacity-90 leading-relaxed">
            Access your wallet, pay bills, recharge, and manage 
            your money seamlessly.
          </p>
          <div className="mt-12">
            <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Secure & Fast Payments</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span className="text-sm">Bank-grade security</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span className="text-sm">Instant transactions</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span className="text-sm">24/7 customer support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                name="username"
                type="email"
                value={form.username}
                onChange={onChange}
                placeholder="Enter your email"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-gray-900 text-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="Enter your password"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-gray-900 text-lg"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-blue-500 hover:text-blue-600 font-semibold">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 text-lg shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </div>
              ) : (
                "Sign In to PayTM"
              )}
            </button>

            <div className="text-center pt-4">
              <span className="text-gray-600">Don&apos;t have an account? </span>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-blue-500 hover:text-blue-600 font-semibold transition-colors"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Secured by 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
