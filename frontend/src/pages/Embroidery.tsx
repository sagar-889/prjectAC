import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Heart, Star, Phone, Upload, CheckCircle2, Eye, Clock, RefreshCw, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface EmbroideryRequest {
  id: string;
  name: string;
  mobile_number: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  design_image_url: string;
  shipping_cost: number;
  design_cost: number;
  total_cost: number;
  status: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

const Embroidery = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [myRequests, setMyRequests] = useState<EmbroideryRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    mobile_number: "",
    address: "",
    state: "",
    city: "",
    pincode: ""
  });

  const phone = import.meta.env.VITE_PHONE || '+918247588435';
  const whatsapp = import.meta.env.VITE_WHATSAPP || '918247588435';

  // Auto-fill form when user data is available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.full_name || prev.name,
        mobile_number: user.mobile_number || prev.mobile_number,
      }));
      fetchMyRequests();
    }
  }, [user]);

  const fetchMyRequests = async () => {
    if (!user) return;
    
    setLoadingRequests(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/embroidery/requests`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch requests');

      const data = await response.json();
      setMyRequests(data);
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleApproveQuote = async (requestId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/embroidery/requests/${requestId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to approve quote');

      toast.success("Quote approved! We'll start working on your design.");
      fetchMyRequests();
    } catch (error) {
      toast.error("Failed to approve quote. Please try again.");
    }
  };

  const handleRejectQuote = async (requestId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/embroidery/requests/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          rejection_reason: rejectionReason || 'Cost not acceptable'
        })
      });

      if (!response.ok) throw new Error('Failed to reject quote');

      toast.success("Quote rejected. We'll contact you to discuss alternatives.");
      setRejectingId(null);
      setRejectionReason("");
      fetchMyRequests();
    } catch (error) {
      toast.error("Failed to reject quote. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'quoted': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'approved': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'in_progress': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'completed': return 'bg-green-600/10 text-green-700 border-green-600/20';
      case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending': return 'We are reviewing your design. You will receive a quote within 24 hours.';
      case 'quoted': return 'Quote ready! Review the pricing and choose to accept or reject.';
      case 'approved': return 'Quote approved! We will start working on your design soon.';
      case 'in_progress': return 'Your design is being crafted by our expert artisans.';
      case 'completed': return 'Your embroidered design is ready and will be shipped soon!';
      case 'cancelled': return 'This request has been cancelled. Contact us to discuss alternatives.';
      default: return 'Status unknown';
    }
  };

  // Calculate shipping cost based on state
  const shippingCost = formData.state.toLowerCase() === 'andhra pradesh' ? 80 : 150;

  const services = [
    {
      title: "Maggam Work",
      description: "Traditional hand embroidery with intricate designs using beads, stones, and threads",
      features: ["Bridal Blouses", "Lehenga Borders", "Saree Pallu Work", "Custom Designs"]
    },
    {
      title: "Aari Work",
      description: "Delicate chain stitch embroidery creating beautiful floral and paisley patterns",
      features: ["Wedding Outfits", "Party Wear", "Designer Blouses", "Dupattas"]
    },
    {
      title: "Stone Work",
      description: "Elegant stone and sequin embellishments for a glamorous look",
      features: ["Heavy Bridal Wear", "Reception Outfits", "Festive Collection", "Custom Orders"]
    },
    {
      title: "Thread Work",
      description: "Classic thread embroidery with traditional and contemporary designs",
      features: ["Casual Wear", "Ethnic Outfits", "Kurtis", "Dress Materials"]
    }
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      // Compress and resize image
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Resize to max 1200px width while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          const maxWidth = 1200;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with compression (0.7 quality)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setImagePreview(compressedBase64);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to submit a design request");
      navigate("/auth", { state: { from: "/embroidery" } });
      return;
    }

    if (!imageFile) {
      toast.error("Please upload a design image");
      return;
    }

    setSubmitting(true);

    try {
      // Use the already compressed preview image
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/embroidery/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          ...formData,
          design_image_url: imagePreview // Use compressed preview
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to submit request' }));
        throw new Error(error.error || 'Failed to submit request');
      }

      const data = await response.json();
      
      toast.success("Design request submitted successfully! We'll contact you with the quote soon.");
      setShowForm(false);
      setImageFile(null);
      setImagePreview("");
      setFormData({
        name: user.full_name || "",
        mobile_number: user.mobile_number || "",
        address: "",
        state: "",
        city: "",
        pincode: ""
      });
      
      // Refresh the requests list
      fetchMyRequests();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || "Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const makePhoneCall = () => {
    window.location.href = `tel:${phone}`;
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${whatsapp}?text=Hi, I'm interested in embroidery/maggam work services`, '_blank');
  };

  const handleGetQuote = () => {
    if (!user && !authLoading) {
      toast.error("Please login to submit a design request");
      navigate("/auth", { state: { from: "/embroidery" } });
      return;
    }
    setShowForm(true);
    // Scroll to form
    setTimeout(() => {
      document.getElementById('design-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      <Helmet>
        <title>Embroidery & Maggam Work | Lakshmi Collections</title>
        <meta name="description" content="Expert embroidery and maggam work services. Custom bridal blouses, designer wear, and traditional hand embroidery." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20 lg:pt-24">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-b from-secondary/30 to-background py-20">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-6">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Expert Craftsmanship</span>
                </div>
                
                <h1 className="font-display text-4xl md:text-6xl font-medium mb-6">
                  Embroidery & Maggam Work
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8">
                  Transform your outfits with exquisite hand embroidery and traditional maggam work. 
                  From bridal blouses to designer wear, we bring your vision to life with intricate craftsmanship.
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                  <Button variant="hero" size="lg" onClick={handleGetQuote}>
                    Upload Design & Get Quote
                  </Button>
                  <Button variant="outline" size="lg" onClick={openWhatsApp}>
                    WhatsApp Us
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Design Upload Form */}
          {showForm && (
            <section id="design-form" className="py-20 bg-secondary/30">
              <div className="container mx-auto px-6">
                <div className="max-w-2xl mx-auto">
                  <div className="bg-background border border-border p-8 rounded-sm">
                    <h2 className="font-display text-3xl font-medium mb-6 text-center">
                      Submit Your Design
                    </h2>
                    <p className="text-muted-foreground text-center mb-8">
                      Upload your blouse design image and we'll provide you with a custom quote
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Image Upload */}
                      <div>
                        <label className="text-sm font-medium block mb-2">
                          Design Image *
                        </label>
                        <div className="border-2 border-dashed border-border rounded-sm p-8 text-center hover:border-accent transition-colors cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="design-image"
                            required
                          />
                          <label htmlFor="design-image" className="cursor-pointer">
                            {imagePreview ? (
                              <div className="space-y-4">
                                <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-sm" />
                                <p className="text-sm text-muted-foreground">Click to change image</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                                <div>
                                  <p className="font-medium">Click to upload design image</p>
                                  <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                                </div>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>

                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="text-sm font-medium block mb-2">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your name"
                        />
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label htmlFor="mobile_number" className="text-sm font-medium block mb-2">
                          Mobile Number *
                        </label>
                        <Input
                          id="mobile_number"
                          name="mobile_number"
                          type="tel"
                          required
                          pattern="[0-9]{10}"
                          value={formData.mobile_number}
                          onChange={handleInputChange}
                          placeholder="10-digit mobile number"
                        />
                      </div>

                      {/* Address */}
                      <div>
                        <label htmlFor="address" className="text-sm font-medium block mb-2">
                          Address *
                        </label>
                        <textarea
                          id="address"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full p-3 rounded-md border border-input bg-background resize-none"
                          placeholder="Enter your complete address"
                        />
                      </div>

                      {/* State */}
                      <div>
                        <label htmlFor="state" className="text-sm font-medium block mb-2">
                          State *
                        </label>
                        <select
                          id="state"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full p-3 rounded-md border border-input bg-background"
                        >
                          <option value="">Select State</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Other">Other State</option>
                        </select>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* City */}
                        <div>
                          <label htmlFor="city" className="text-sm font-medium block mb-2">
                            City
                          </label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Enter city"
                          />
                        </div>

                        {/* Pincode */}
                        <div>
                          <label htmlFor="pincode" className="text-sm font-medium block mb-2">
                            Pincode
                          </label>
                          <Input
                            id="pincode"
                            name="pincode"
                            pattern="[0-9]{6}"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            placeholder="6-digit pincode"
                          />
                        </div>
                      </div>

                      {/* Shipping Cost Display */}
                      {formData.state && (
                        <div className="bg-accent/10 border border-accent/20 p-4 rounded-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Estimated Shipping Cost:</span>
                            <span className="text-lg font-bold text-accent">₹{shippingCost}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Design cost will be calculated by our team after reviewing your image
                          </p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        variant="hero"
                        size="xl"
                        className="w-full"
                        disabled={submitting}
                      >
                        {submitting ? "Submitting..." : "Submit Design Request"}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        By submitting, you agree to our terms and conditions. We'll contact you within 24 hours with a quote.
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* My Requests Section */}
          {user && (
            <section className="py-20 bg-background">
              <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-display text-3xl font-medium">My Design Requests</h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={fetchMyRequests}
                      disabled={loadingRequests}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${loadingRequests ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                  
                  {loadingRequests ? (
                    <div className="text-center py-12 bg-secondary/30 rounded-lg">
                      <Clock className="h-12 w-12 mx-auto text-muted-foreground animate-pulse mb-4" />
                      <p className="text-muted-foreground">Loading your requests...</p>
                    </div>
                  ) : myRequests.length === 0 ? (
                    <div className="text-center py-12 bg-secondary/30 rounded-lg">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">You haven't submitted any design requests yet</p>
                      <Button variant="outline" onClick={handleGetQuote}>
                        Submit Your First Design
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {myRequests.map((request) => (
                      <div key={request.id} className="bg-secondary/30 border border-border rounded-lg p-6">
                        <div className="grid md:grid-cols-3 gap-6">
                          {/* Design Image */}
                          <div>
                            <img 
                              src={request.design_image_url} 
                              alt="Design" 
                              className="w-full h-48 object-contain bg-background rounded-lg cursor-pointer hover:scale-105 transition-transform"
                              onClick={() => setSelectedImage(request.design_image_url)}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-2"
                              onClick={() => setSelectedImage(request.design_image_url)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Full Image
                            </Button>
                          </div>

                          {/* Request Details */}
                          <div className="md:col-span-2 space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg mb-1">Request #{request.id.substring(0, 8)}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Submitted on {new Date(request.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                                {request.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>

                            {/* Status Message */}
                            <div className={`p-3 rounded-lg border ${getStatusColor(request.status)}`}>
                              <p className="text-sm">{getStatusMessage(request.status)}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">State:</span>
                                <span className="ml-2 font-medium">{request.state}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">City:</span>
                                <span className="ml-2 font-medium">{request.city || 'N/A'}</span>
                              </div>
                            </div>

                            {/* Pricing */}
                            <div className="bg-background border border-border rounded-lg p-4">
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Shipping Cost:</span>
                                  <span className="font-medium">₹{request.shipping_cost}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Design Cost:</span>
                                  <span className="font-medium">
                                    {request.design_cost > 0 ? `₹${request.design_cost}` : 'Pending'}
                                  </span>
                                </div>
                                <div className="border-t border-border pt-2 flex justify-between font-semibold">
                                  <span>Total Cost:</span>
                                  <span className="text-accent">₹{request.total_cost || request.shipping_cost}</span>
                                </div>
                              </div>
                            </div>

                            {/* Admin Notes */}
                            {request.admin_notes && (
                              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                <p className="text-sm font-medium mb-1">Message from Admin:</p>
                                <p className="text-sm">{request.admin_notes}</p>
                              </div>
                            )}

                            {/* Action Buttons */}
                            {request.status === 'quoted' && request.design_cost > 0 && (
                              <div className="space-y-3">
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                  <p className="text-sm font-medium mb-2">Review the quote and let us know:</p>
                                  <div className="flex gap-3">
                                    <Button
                                      variant="default"
                                      className="flex-1"
                                      onClick={() => handleApproveQuote(request.id)}
                                    >
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Accept Quote
                                    </Button>
                                    <Button
                                      variant="outline"
                                      className="flex-1 border-red-500/20 text-red-600 hover:bg-red-500/10"
                                      onClick={() => setRejectingId(request.id)}
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Reject Quote
                                    </Button>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={openWhatsApp}
                                >
                                  <Phone className="h-4 w-4 mr-2" />
                                  Discuss on WhatsApp
                                </Button>
                              </div>
                            )}

                            {request.status === 'approved' && (
                              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <div>
                                  <p className="font-medium text-green-700">Quote Approved!</p>
                                  <p className="text-sm text-green-600">We're working on your design.</p>
                                </div>
                              </div>
                            )}

                            {request.status === 'in_progress' && (
                              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 flex items-center gap-3">
                                <Clock className="h-5 w-5 text-purple-600 animate-pulse" />
                                <div>
                                  <p className="font-medium text-purple-700">Work in Progress</p>
                                  <p className="text-sm text-purple-600">Your design is being crafted.</p>
                                </div>
                              </div>
                            )}

                            {request.status === 'completed' && (
                              <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4 flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-700" />
                                <div>
                                  <p className="font-medium text-green-800">Completed!</p>
                                  <p className="text-sm text-green-700">Your design is ready for delivery.</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Services Section */}
          <section className="py-20">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-medium mb-4">
                  Our Services
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Specializing in traditional and contemporary embroidery techniques
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {services.map((service, index) => (
                  <div 
                    key={index}
                    className="bg-secondary/30 p-8 rounded-sm hover:bg-secondary/50 transition-colors"
                  >
                    <h3 className="font-display text-2xl font-medium mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <Star className="h-4 w-4 text-accent fill-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="py-20 bg-secondary/30">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="font-display text-3xl md:text-4xl font-medium mb-12 text-center">
                  Why Choose Us
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-medium text-lg mb-2">Expert Artisans</h3>
                    <p className="text-sm text-muted-foreground">
                      Skilled craftspeople with years of experience in traditional embroidery
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-medium text-lg mb-2">Custom Designs</h3>
                    <p className="text-sm text-muted-foreground">
                      Personalized designs tailored to your preferences and occasion
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-accent fill-accent" />
                    </div>
                    <h3 className="font-medium text-lg mb-2">Quality Materials</h3>
                    <p className="text-sm text-muted-foreground">
                      Premium threads, beads, stones, and embellishments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="py-20">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="font-display text-3xl md:text-4xl font-medium mb-12 text-center">
                  How It Works
                </h2>

                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2">Upload Design</h3>
                      <p className="text-muted-foreground">
                        Upload your blouse design image and provide your details
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2">Get Quote</h3>
                      <p className="text-muted-foreground">
                        Our team reviews your design and sends you a detailed quote within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2">Crafting</h3>
                      <p className="text-muted-foreground">
                        Once approved, our expert artisans bring your design to life
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2">Delivery</h3>
                      <p className="text-muted-foreground">
                        Receive your beautifully embroidered outfit at your doorstep
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-accent text-accent-foreground">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-display text-3xl md:text-4xl font-medium mb-6">
                  Ready to Create Something Beautiful?
                </h2>
                <p className="text-lg mb-8 opacity-90">
                  Upload your design today and get a custom quote within 24 hours
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={handleGetQuote}
                  >
                    Upload Design Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={makePhoneCall}
                    className="bg-transparent border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Info Section */}
          <section className="py-12 bg-secondary/30">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Working Hours:</strong> Monday - Saturday, 10:00 AM - 08:30 PM
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Location:</strong> 9-262 pallapuveedhy, sankhavaram
                </p>
              </div>
            </div>
          </section>
        </main>

        <Footer />

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="max-w-4xl max-h-[90vh] overflow-auto">
              <img 
                src={selectedImage} 
                alt="Design Full View" 
                className="w-full h-auto"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <button
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2"
              onClick={() => setSelectedImage(null)}
            >
              <Star className="h-6 w-6" />
            </button>
          </div>
        )}

        {/* Rejection Dialog */}
        {rejectingId && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setRejectingId(null);
              setRejectionReason("");
            }}
          >
            <div 
              className="bg-background border border-border rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Reject Quote</h3>
                <button
                  onClick={() => {
                    setRejectingId(null);
                    setRejectionReason("");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Please let us know why you're rejecting this quote. We'll contact you to discuss alternatives.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Reason (Optional)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    className="w-full p-3 rounded-md border border-input bg-background resize-none"
                    placeholder="e.g., Cost is too high, Need different design, etc."
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setRejectingId(null);
                      setRejectionReason("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={() => handleRejectQuote(rejectingId)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Quote
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Embroidery;
