import { useState } from 'react';
import api from '../utils/axiosInstance';
import type { SignUpResponse, VerifyOtpResponse } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
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
      const res = await api.post<SignUpResponse>('/api/auth/signup', {
        name: formData.name,
        dob: formData.dob,
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

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const res = await api.post<VerifyOtpResponse>('/api/auth/verify-otp', {
        email: formData.email,
        otp: formData.otp,
      });
      login(res.data.user, res.data.token);
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

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Sign up</h1>
        <p className="text-sm text-gray-600 mb-6">Sign up to enjoy the feature of HD</p>

        <form className="w-full max-w-md space-y-4">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-500 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Jonas Kahnwald"
                />
              </div>

              {/* Date of Birth Input */}
              <div>
                <label htmlFor="dob" className="block text-xs font-medium text-gray-500 mb-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

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
          {step === 'form' ? (
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

              {/* Sign Up Button */}
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  'Sign up'
                )}
              </button>
            </>
          )}

          {/* Sign In Link */}
          <p className="mt-6 text-sm text-gray-600 text-center">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-medium">Sign in</a>
          </p>
        </form>
      </div>

      {/* Right Side - Image (Desktop Only) */}
      <div className="hidden md:block w-1/2 relative">
        <img
          src="https://hwdlte.com/RvqdLn/blue-wave-bg.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover rounded-r-lg shadow-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-r-lg"></div>
      </div>
    </div>
  );
};

export default SignUpPage;