import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Lakshmi Collections | Curated Fashion & Lifestyle Essentials</title>
        <meta
          name="description"
          content="Discover thoughtfully curated fashion and lifestyle essentials. Shop our collection of timeless pieces designed for modern elegance."
        />
        <meta name="keywords" content="fashion, clothing, designer, curated, minimalist, sustainable" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <CartSidebar />
        <main>
          <Hero />
          <FeaturedProducts />
          <Categories />
          <Newsletter />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
