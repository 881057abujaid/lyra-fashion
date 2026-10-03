import { getActiveHeroBanners } from "@/lib/data/hero-banners";
import { NewArrivalsSection } from "@/components/storefront/home/new-arrivals-section";
import { HeroBannerSlider } from "@/components/storefront/home/hero-banner-slider";
import { BestSellersSection } from "@/components/storefront/home/best-sellers-section";
import { FeaturedProductsSection } from "@/components/storefront/home/featured-products-section";

export default async function Home() {
  const banners = await getActiveHeroBanners();

  return (
    <main>
      {banners.length > 0 && <HeroBannerSlider banners={banners} />}

      <NewArrivalsSection />

      <FeaturedProductsSection />

      <BestSellersSection />
    </main>
  );
}