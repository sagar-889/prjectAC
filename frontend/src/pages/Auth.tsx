import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const mobileSchema = z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number");

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, loading, isAdmin } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; mobileNumber?: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, loading, isAdmin, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; mobileNumber?: string } = {};

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    if (isSignUp && mobileNumber) {
      const mobileResult = mobileSchema.safeParse(mobileNumber);
      if (!mobileResult.success) {
        newErrors.mobileNumber = mobileResult.error.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { user: userData, error } = await signUp(email, password, fullName, mobileNumber);
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered. Please sign in.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Account created successfully!");
          if (userData?.role === 'admin') {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }
      } else {
        const { user: userData, error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid credentials")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Welcome back!");
          if (userData?.role === 'admin') {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isSignUp ? "Create Account" : "Sign In"} | Lakshmi Collections</title>
        <meta name="description" content="Sign in or create an account to access your wishlist and order history." />
      </Helmet>

      <div className="min-h-screen bg-background flex">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Link to="/" className="block mb-12">
              <h1 className="font-display text-3xl font-semibold tracking-tight">
                Lakshmi Collections
              </h1>
            </Link>

            <h2 className="font-display text-3xl font-medium mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-muted-foreground mb-8">
              {isSignUp
                ? "Join us to save your favorites and track orders"
                : "Sign in to access your account"
              }
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div>
                  <label htmlFor="fullName" className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="h-12 bg-secondary border-0"
                  />
                </div>
              )}

              {isSignUp && (
                <div>
                  <label htmlFor="mobileNumber" className="text-sm font-medium mb-2 block">Mobile Number</label>
                  <Input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value);
                      setErrors((prev) => ({ ...prev, mobileNumber: undefined }));
                    }}
                    placeholder="Enter your mobile number"
                    className={`h-12 bg-secondary border-0 ${errors.mobileNumber ? "ring-2 ring-destructive" : ""}`}
                  />
                  {errors.mobileNumber && (
                    <p className="text-sm text-destructive mt-1">{errors.mobileNumber}</p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="email" className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="Enter your email"
                  className={`h-12 bg-secondary border-0 ${errors.email ? "ring-2 ring-destructive" : ""}`}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium mb-2 block">Password</label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder="Enter your password"
                    className={`h-12 bg-secondary border-0 pr-12 ${errors.password ? "ring-2 ring-destructive" : ""}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Please wait..."
                  : isSignUp
                    ? "Create Account"
                    : "Sign In"
                }
              </Button>
            </form>

            <p className="text-center text-muted-foreground mt-8">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrors({});
                }}
                className="text-foreground font-medium link-underline"
              >
                {isSignUp ? "Sign In" : "Create One"}
              </button>
            </p>
          </div>
        </div>

        {/* Right side - Image (hidden on mobile) */}
        <div className="hidden lg:block flex-1 bg-secondary">
          <div className="h-full flex items-center justify-center p-12">
            <div className="text-center">
              <h3 className="font-display text-4xl font-medium mb-4">
                Discover Timeless Style
              </h3>
              <p className="text-muted-foreground max-w-sm">
                Join our community of conscious shoppers and get exclusive access to new collections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
