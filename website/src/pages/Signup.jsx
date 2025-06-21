// Department options
import { BookOpen, CheckCircle, Code, Eye, EyeOff, Lock, Mail, Trophy, User } from "lucide-react";
import { useState, useEffect } from "react";

const Signup = () => {
  // Form state
  const [formData, setFormData] = useState({
    Name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [userType, setUserType] = useState("");
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  // API configuration
  const API_URL = "http://localhost:5000"; // Replace with your actual API URL

  // Timer effect for OTP countdown
  useEffect(() => {
    let timer;
    if (secondsRemaining > 0) {
      timer = setTimeout(() => {
        setSecondsRemaining(secondsRemaining - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [secondsRemaining]);

  // Show notification
  const showNotification = (message) => {
    // You can integrate with your preferred notification system
    // For now, using simple alert - replace with your notification component
    alert(message);
  };

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: "Invalid email format" };
    }

    try {
      const domain = email.split("@")[1].split(".")[0].toLowerCase();

      if (domain !== "nmamit" && domain !== "nitte") {
        return {
          valid: false,
          message: "Please use an email provided by your college (nmamit or nitte).",
        };
      }

      if (domain === "nmamit") {
        setUserType("student");
      } else {
        setUserType("admin");
      }

      return { valid: true };
    } catch (e) {
      return { valid: false, message: "Invalid email format",console: e.message};
    }
  };

  // Password validation
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return { valid: false, message: "Password must be at least 8 characters long" };
    }
    if (!hasUpperCase) {
      return { valid: false, message: "Password must contain at least one uppercase letter" };
    }
    if (!hasLowerCase) {
      return { valid: false, message: "Password must contain at least one lowercase letter" };
    }
    if (!hasNumbers) {
      return { valid: false, message: "Password must contain at least one number" };
    }
    if (!hasSpecialChar) {
      return { valid: false, message: "Password must contain at least one special character" };
    }

    return { valid: true };
  };

  // Department options

  // Get OTP
  const getOtp = async () => {
    const emailValidation = isValidEmail(formData.email);

    if (!emailValidation.valid) {
      showNotification(emailValidation.message);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: formData.email,
        }),
      });

      if (response.ok) {
        showNotification("OTP sent successfully 🎉");
        setSecondsRemaining(60);
      } else {
        const errorData = await response.text();
        showNotification(`Failed to send OTP: ${errorData}`);
      }
    } catch (error) {
      showNotification("Network error occurred");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!formData.otp) {
      showNotification("Please enter OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: formData.email,
          otp: formData.otp,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setIsOtpVerified(true);
        setSecondsRemaining(0);
        showNotification(responseData.message || "Email verified successfully! ✅");
      } else {
        let errorMsg = "Verification failed";

        if (responseData.error) {
          errorMsg = responseData.error;
        } else if (responseData.errors && responseData.errors.length > 0) {
          errorMsg = responseData.errors[0].message;
        }

        showNotification(errorMsg);
      }
    } catch (error) {
      showNotification("Network error occurred");
      console.error("Exception:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email).valid) {
      newErrors.email = isValidEmail(formData.email).message;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!termsAccepted) {
      newErrors.terms = "Please accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      showNotification("Please verify your email with OTP first");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const submitData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      userType: userType,
    };

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(submitData),
      });

      if (response.status === 201) {
        //const responseData = await response.json();

        // Store user data in memory (not using sessionStorage as per requirements)
        // You can implement your own state management here
        
        showNotification("Account created! 🎉");

        // Redirect based on user type
        setTimeout(() => {
          if (userType === "student") {
            window.location.href = "/student/dashboard";
          } else {
            window.location.href = "/admin/dashboard";
          }
        }, 2000);
      } else if (response.status === 401) {
        showNotification("Invalid OTP.. Try again later..");
        setFormData((prev) => ({ ...prev, otp: "" }));
      } else {
        const errorData = await response.text();
        console.log("Error response:", errorData);
        showNotification("Something went wrong.. Try again later..");
      }
    } catch (error) {
      showNotification("Network error occurred");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle OTP input (only numbers)
  const handleOtpChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, otp: numericValue }));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <User className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Join CarrierNest
          </h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm">
          <div className="space-y-6">
            {/* Name Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"> Name</label>
                <input
                  type="text"
                  placeholder="John"
                  value={formData.Name}
                  onChange={(e) => handleInputChange("Name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      placeholder="john.doe@nmamit.in"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      disabled={isOtpVerified}
                      className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        isOtpVerified ? "bg-green-50 border-green-300" : ""
                      }`}
                      required
                    />
                    {isOtpVerified && (
                      <CheckCircle
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                        size={20}
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={getOtp}
                    disabled={isLoading || secondsRemaining > 0 || isOtpVerified}
                    className="bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                    {secondsRemaining > 0 ? `Resend in ${secondsRemaining}s` : "Get OTP"}
                  </button>
                </div>
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* OTP Section - Show only if not verified */}
            {!isOtpVerified && formData.email && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={(e) => handleOtpChange(e.target.value)}
                    maxLength="6"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={isLoading || !formData.otp}
                    className="bg-blue-800 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </div>
            )}

            {/* Success message */}
            {isOtpVerified && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={20} />
                <span className="text-green-700 font-medium">Email verified successfully!</span>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                required
              />
              <label className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading || !isOtpVerified}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account
                  <CheckCircle className="ml-2" size={20} />
                </>
              )}
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      
    </div>
  );
};

export default Signup;