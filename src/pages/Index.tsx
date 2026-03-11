import Header from "@/components/Header";
import CategoryBar from "@/components/CategoryBar";
import ListingCard from "@/components/ListingCard";
import Footer from "@/components/Footer";

import car1 from "@/assets/car1.jpg";
import phone1 from "@/assets/phone1.jpg";
import property1 from "@/assets/property1.jpg";
import sofa1 from "@/assets/sofa1.jpg";
import laptop1 from "@/assets/laptop1.jpg";
import bike1 from "@/assets/bike1.jpg";
import car2 from "@/assets/car2.jpg";

const listings = [
  { title: "Honda Civic 2022 - Excellent Condition", price: "Rs 45,00,000", location: "Lahore", date: "Today", image: car1, featured: true },
  { title: "iPhone 15 Pro Max 256GB", price: "Rs 3,20,000", location: "Karachi", date: "Today", image: phone1, featured: true },
  { title: "3 Bed Apartment - DHA Phase 5", price: "Rs 2,50,00,000", location: "Islamabad", date: "Yesterday", image: property1 },
  { title: "L-Shaped Sofa Set - Almost New", price: "Rs 85,000", location: "Rawalpindi", date: "Yesterday", image: sofa1 },
  { title: "MacBook Pro M2 14-inch", price: "Rs 4,50,000", location: "Karachi", date: "2 days ago", image: laptop1, featured: true },
  { title: "Honda CBR 250R Sports Bike", price: "Rs 6,50,000", location: "Lahore", date: "2 days ago", image: bike1 },
  { title: "Toyota Corolla 2020 - Low Mileage", price: "Rs 38,00,000", location: "Faisalabad", date: "3 days ago", image: car2 },
  { title: "iPhone 15 Pro Max 256GB - PTA", price: "Rs 2,90,000", location: "Multan", date: "3 days ago", image: phone1 },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CategoryBar />

      <main className="flex-1">
        <div className="container py-6">
          <h2 className="font-display text-xl font-bold mb-4">Fresh Recommendations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {listings.map((listing, i) => (
              <ListingCard key={i} {...listing} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
