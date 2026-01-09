import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const phone = import.meta.env.VITE_PHONE || '+918247588435';
  const whatsapp = import.meta.env.VITE_WHATSAPP || '918247588435';
  const address = import.meta.env.VITE_ADDRESS || '9-262 pallapuveedhy, sankhavaram';
  const mapUrl = import.meta.env.VITE_MAP_URL || 'https://maps.app.goo.gl/E9ccmQFJHA1nArE87';

  const openGoogleMaps = () => {
    window.open(mapUrl, '_blank');
  };

  const makePhoneCall = () => {
    window.location.href = `tel:${phone}`;
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${whatsapp}`, '_blank');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Call the contact API endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Lakshmi Collections</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20 lg:pt-24">
          <div className="container mx-auto px-6 py-12">
            <nav className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Contact Us</span>
            </nav>

            <h1 className="font-display text-4xl md:text-5xl font-medium mb-8">
              Get in Touch
            </h1>

            <p className="text-muted-foreground mb-12 max-w-2xl">
              Book an appointment or send us an enquiry about your tailored needs. Private consultations are recommended for bridal and heavy ethnic wear.
            </p>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="font-display text-2xl font-medium mb-6">Send us a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium block mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="text-sm font-medium block mb-2">
                      Phone Number *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="text-sm font-medium block mb-2">
                      Message / Inquiry *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full p-3 rounded-md border border-input bg-background resize-none"
                      placeholder="Describe your requirement..."
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="xl"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-medium mb-6">Visit the Studio</h2>
                </div>

                <div 
                  onClick={openGoogleMaps}
                  className="bg-secondary/30 p-6 rounded-sm cursor-pointer hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex gap-4">
                    <MapPin className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">Location</h3>
                      <p className="text-muted-foreground">{address}</p>
                      <p className="text-sm text-primary mt-2">Click to open in Google Maps →</p>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={makePhoneCall}
                  className="bg-secondary/30 p-6 rounded-sm cursor-pointer hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex gap-4">
                    <Phone className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">Phone</h3>
                      <p className="text-muted-foreground">{phone}</p>
                      <p className="text-sm text-primary mt-2">Click to call →</p>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={openWhatsApp}
                  className="bg-green-500/10 border border-green-500/20 p-6 rounded-sm cursor-pointer hover:bg-green-500/20 transition-colors"
                >
                  <div className="flex gap-4">
                    <MessageCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">WhatsApp</h3>
                      <p className="text-muted-foreground">{phone}</p>
                      <p className="text-sm text-green-600 mt-2">Click to chat on WhatsApp →</p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/30 p-6 rounded-sm">
                  <div className="flex gap-4">
                    <Clock className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">Working Hours</h3>
                      <p className="text-muted-foreground">Monday - Saturday: 10:00 AM - 08:30 PM</p>
                      <p className="text-muted-foreground">Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/30 p-6 rounded-sm">
                  <div className="flex gap-4">
                    <Mail className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">Email</h3>
                      <p className="text-muted-foreground">support@lakshmicollections.com</p>
                    </div>
                  </div>
                </div>

                <div className="bg-accent/10 border border-accent/20 p-6 rounded-sm">
                  <p className="text-sm">
                    <strong>Note:</strong> Private consultations are recommended for bridal and heavy ethnic wear. Please call ahead to schedule an appointment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
