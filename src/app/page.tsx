import { getActiveHeroBanners } from "@/lib/data/hero-banners";
import { NewArrivalsSection } from "@/components/storefront/home/new-arrivals-section";
import { HeroBannerSlider } from "@/components/storefront/home/hero-banner-slider";

export default async function Home() {
  const banners = await getActiveHeroBanners();
  const banner = banners[0];

  if (!banner) {
    return null;
  }

  const desktopImage = banner.desktopImageUrl;
  const mobileImage = banner.mobileImageUrl ?? banner.desktopImageUrl;

  return (
    <main>
      <HeroBannerSlider banners={banners} />

      <NewArrivalsSection />
    </main>
  );
}