import HomeComponent from "@/components/Home/Home";
import SwiperComponent from "@/components/Swiper/SwiperComponnet";
import Customer from "@/components/Customer";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <main>
      <HomeComponent />
      <SwiperComponent />
      <Customer />
      <Footer />
    </main>
  );
}
