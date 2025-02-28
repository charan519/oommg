import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowRight, 
  ChevronLeft, 
  Fingerprint, 
  Sparkles, 
  Globe, 
  AlertCircle,
  X,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authProgress, setAuthProgress] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [formError, setFormError] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [showBiometricAnimation, setShowBiometricAnimation] = useState(false);
  
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Simulated particles for background effect
  const particlesRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
    }, 1500);

    // Simulate biometric availability check
    setTimeout(() => {
      setBiometricAvailable(true);
    }, 2000);

    // Initialize particles
    if (particlesRef.current) {
      initParticles();
    }

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const initParticles = () => {
    const canvas = particlesRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
    }[] = [];

    // Create particles
    for (let i = 0; i < 100; i++) {
      const size = Math.random() * 3 + 0.5;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: `rgba(${59 + Math.random() * 100}, ${130 + Math.random() * 50}, ${246 + Math.random() * 10}, ${0.2 + Math.random() * 0.3})`
      });
    }

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      // Draw connections between nearby particles
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!email) {
      setFormError('Please enter your email address');
      emailInputRef.current?.focus();
      return;
    }
    
    if (!password) {
      setFormError('Please enter your password');
      passwordInputRef.current?.focus();
      return;
    }
    
    setFormError('');
    setIsAuthenticating(true);
    
    // Simulate authentication progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setAuthProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsAuthenticating(false);
          navigate('/map');
        }, 500);
      }
    }, 100);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setFormError('Please enter your email address');
      return;
    }
    
    setFormError('');
    // Simulate sending reset email
    setTimeout(() => {
      setResetSent(true);
    }, 1500);
  };

  const handleBiometricAuth = () => {
    setShowBiometricAnimation(true);
    
    // Simulate biometric authentication
    setTimeout(() => {
      setIsAuthenticating(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setAuthProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAuthenticating(false);
            navigate('/map');
          }, 500);
        }
      }, 100);
    }, 2000);
  };

  const handleBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Compass className="w-16 h-16 text-blue-400 animate-spin" />
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  "0 0 0 0px rgba(59, 130, 246, 0.3)",
                  "0 0 0 20px rgba(59, 130, 246, 0)"
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          </div>
          <p className="mt-4 text-white text-xl font-medium">Loading GeoGuide AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden font-['Inter',sans-serif] bg-gradient-to-br from-gray-900 to-blue-900">
      {/* Particle background */}
      <canvas ref={particlesRef} className="absolute inset-0 z-0" />
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 z-1 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-blue-500/20 via-transparent to-transparent" style={{ transform: 'translate(-50%, -50%)', width: '200%', height: '200%' }}></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-radial from-purple-500/20 via-transparent to-transparent" style={{ transform: 'translate(50%, 50%)', width: '200%', height: '200%' }}></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute text-white/5"
          initial={{ top: '10%', left: '10%' }}
          animate={{ 
            top: ['10%', '15%', '10%'],
            left: ['10%', '12%', '10%']
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Globe className="w-32 h-32 filter blur-[1px]" />
        </motion.div>
        
        <motion.div
          className="absolute text-white/5"
          initial={{ bottom: '20%', right: '15%' }}
          animate={{ 
            bottom: ['20%', '25%', '20%'],
            right: ['15%', '18%', '15%']
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Compass className="w-40 h-40 filter blur-[1px]" />
        </motion.div>
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={handleBack}
        className="absolute top-8 left-8 z-20 flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </motion.button>

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="absolute -inset-4 rounded-full opacity-70"
                animate={{
                  background: [
                    "linear-gradient(90deg, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.3) 100%)",
                    "linear-gradient(180deg, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.3) 100%)",
                    "linear-gradient(270deg, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.3) 100%)",
                    "linear-gradient(0deg, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.3) 100%)",
                    "linear-gradient(90deg, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.3) 100%)"
                  ]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
              <div className="flex items-center">
                <Compass className="w-10 h-10 text-blue-400 mr-3 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]">
                  GeoGuide <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">AI</span>
                </h1>
              </div>
            </motion.div>
          </div>

          {/* Login Form */}
          <AnimatePresence mode="wait">
            {!showForgotPassword ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-2xl"
              >
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <span>Welcome Back</span>
                    <motion.div
                      animate={{
                        rotate: 360
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="ml-2"
                    >
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                    </motion.div>
                  </h2>

                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center text-white"
                    >
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <p className="text-sm">{formError}</p>
                    </motion.div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-1">
                      <div className="relative">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: email ? '100%' : 0 }}
                          className="absolute left-0 top-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"
                        />
                        <div className="relative">
                          <input
                            ref={emailInputRef}
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 pl-12 text-white placeholder-transparent focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 peer"
                            placeholder="Email Address"
                          />
                          <label
                            htmlFor="email"
                            className="absolute left-12 top-4 text-white/50 transition-all duration-300 peer-placeholder-shown:top-4 peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-400 peer-focus:-translate-y-3 peer-focus:bg-black/30 peer-focus:px-2"
                          >
                            Email Address
                          </label>
                          <Mail className="absolute left-4 top-4 w-5 h-5 text-white/50 peer-focus:text-blue-400 transition-colors duration-300" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="relative">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: password ? '100%' : 0 }}
                          className="absolute left-0 top-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"
                        />
                        <div className="relative">
                          <input
                            ref={passwordInputRef}
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 pl-12 text-white placeholder-transparent focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 peer"
                            placeholder="Password"
                          />
                          <label
                            htmlFor="password"
                            className="absolute left-12 top-4 text-white/50 transition-all duration-300 peer-placeholder-shown:top-4 peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-400 peer-focus:-translate-y-3 peer-focus:bg-black/30 peer-focus:px-2"
                          >
                            Password
                          </label>
                          <Lock className="absolute left-4 top-4 w-5 h-5 text-white/50 peer-focus:text-blue-400 transition-colors duration-300" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors duration-300"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-400/20"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-white/70">
                          Remember me
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="pt-2">
                      <motion.button
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isAuthenticating}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 backdrop-blur-md rounded-xl text-white font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-400/30 relative overflow-hidden"
                      >
                        {isAuthenticating ? (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-50"></div>
                            <div 
                              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300"
                              style={{ width: `${authProgress}%` }}
                            ></div>
                            <span className="relative">Authenticating...</span>
                          </>
                        ) : (
                          <>
                            <span>Sign In</span>
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>
                    </div>

                    {biometricAvailable && (
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-black/30 text-white/50">Or continue with</span>
                        </div>
                      </div>
                    )}

                    {biometricAvailable && (
                      <div className="flex justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={handleBiometricAuth}
                          className="p-4 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300 relative"
                        >
                          <AnimatePresence>
                            {showBiometricAnimation ? (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <motion.div
                                  animate={{
                                    boxShadow: [
                                      "0 0 0 0px rgba(59, 130, 246, 0.3)",
                                      "0 0 0 20px rgba(59, 130, 246, 0)"
                                    ]
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: 3,
                                    repeatType: "loop"
                                  }}
                                  className="absolute inset-0 rounded-full"
                                />
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                          <Fingerprint className="w-6 h-6 text-blue-400" />
                        </motion.button>
                      </div>
                    )}
                  </form>

                  <div className="mt-8 text-center">
                    <p className="text-white/50 text-sm">
                      Don't have an account?{' '}
                      <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Sign up
                      </a>
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-2xl"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                    <button
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetSent(false);
                        setResetEmail('');
                      }}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5 text-white/70" />
                    </button>
                  </div>

                  {resetSent ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6"
                    >
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="text-xl font-medium text-white mb-2">Email Sent</h3>
                      <p className="text-white/70 mb-6">
                        We've sent password reset instructions to your email.
                      </p>
                      <button
                        onClick={() => {
                          setShowForgotPassword(false);
                          setResetSent(false);
                          setResetEmail('');
                        }}
                        className="px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
                      >
                        Back to Login
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <p className="text-white/70 mb-6">
                        Enter your email address and we'll send you instructions to reset your password.
                      </p>

                      {formError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center text-white"
                        >
                          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                          <p className="text-sm">{formError}</p>
                        </motion.div>
                      )}

                      <form onSubmit={handleForgotPassword} className="space-y-6">
                        <div className="space-y-1">
                          <div className="relative">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: resetEmail ? '100%' : 0 }}
                              className="absolute left-0 top-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"
                            />
                            <div className="relative">
                              <input
                                type="email"
                                id="reset-email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 pl-12 text-white placeholder-transparent focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 peer"
                                placeholder="Email Address"
                                autoFocus
                              />
                              <label
                                htmlFor="reset-email"
                                className="absolute left-12 top-4 text-white/50 transition-all duration-300 peer-placeholder-shown:top-4 peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-400 peer-focus:-translate-y-3 peer-focus:bg-black/30 peer-focus:px-2"
                              >
                                Email Address
                              </label>
                              <Mail className="absolute left-4 top-4 w-5 h-5 text-white/50 peer-focus:text-blue-400 transition-colors duration-300" />
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <motion.button
                            whileHover={{ 
                              scale: 1.02,
                              boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)"
                            }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 backdrop-blur-md rounded-xl text-white font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-400/30"
                          >
                            <span>Send Reset Link</span>
                            <ArrowRight className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}