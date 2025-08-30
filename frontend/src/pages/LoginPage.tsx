import { useState } from 'react';
import api from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { LoginResponse , VerifyOtpResponse} from '../types/api';

const Login = () => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Send OTP
  const handleGetOtp = async () => {
    try {
      setLoading(true);
      const res = await api.post<LoginResponse>('/api/auth/login', {
        email: formData.email,
      });
      alert(res.data.message);
      setStep('otp');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Sign In
  const handleSignIn = async () => {
    try {
      setLoading(true);
      const res = await api.post<VerifyOtpResponse>('/api/auth/verify-otp', {
        email: formData.email,
        otp: formData.otp,
      });

      // Handle "Keep me logged in" logic (optional)
      // This is a simple example; you'd typically store the token in localStorage or cookies
      login(res.data.user, res.data.token);

        // Inside handleSignIn, in the try block after getting the response:
        if (res.data.token) {
        // Remove this line:
        // localStorage.setItem('token', res.data.token); // <-- DELETE THIS LINE

        // Keep this line:
        login(res.data.user, res.data.token); // This handles storage

        // Redirect to dashboard
        navigate('/dashboard');
        }

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center items-center relative">
        {/* Logo */}
        <div className="flex items-center mb-8">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
              <path d="M10 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          <span className="ml-2 text-xl font-bold text-gray-800">HD</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Sign in</h1>
        <p className="text-sm text-gray-600 mb-6">Please login to continue to your account.</p>

        <form className="w-full max-w-md space-y-4">
          {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-500 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="jonas_kahnwald@gmail.com"
                />
              </div>

          
          {step === 'email' ? (
            <>        
              {/* Get OTP Button */}
              <button
                type="button"
                onClick={handleGetOtp}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </>
                ) : (
                  'Get OTP'
                )}
              </button>
            </>
          ) : (
            <>
              {/* OTP Input */}
              <div>
                <label htmlFor="otp" className="block text-xs font-medium text-gray-500 mb-1">
                  OTP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                    placeholder="123456"
                    maxLength={6}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 absolute right-3 top-2.5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Resend OTP Link */}
              <p className="text-sm text-blue-600 cursor-pointer hover:underline">
                <button type="button" onClick={() => setStep('email')}>
                  Resend OTP
                </button>
              </p>

              {/* Keep Me Logged In Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="keepLoggedIn"
                  name="keepLoggedIn"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="keepLoggedIn" className="ml-2 block text-sm text-gray-700">
                  Keep me logged in
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="button"
                onClick={handleSignIn}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </>
          )}

          {/* Create Account Link */}
          <p className="mt-6 text-sm text-gray-600 text-center">
            Need an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline font-medium">Create one</a>
          </p>
        </form>
      </div>

      {/* Right Side - Image (Desktop Only) */}
      <div className="hidden md:block w-1/2 relative rounded-2xl">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/82/Mandel_zoom_05_tail_part.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-lg"
        />
        {/* <div className="absolute inset-0 bg-black bg-opacity-20 rounded-r-lg"></div> */}
      </div>
    </div>
  );
};

export default Login;