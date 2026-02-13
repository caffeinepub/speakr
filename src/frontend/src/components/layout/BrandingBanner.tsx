import BrandingBannerDropdown from './BrandingBannerDropdown';

export default function BrandingBanner() {
  return (
    <div className="w-full border-b border-border/40 bg-background py-6 md:py-8">
      <div className="container px-4 md:px-6">
        <div className="relative flex flex-col items-center justify-center gap-3">
          {/* Top-left dropdown menu */}
          <div className="absolute left-0 top-0">
            <BrandingBannerDropdown />
          </div>
          
          {/* Centered logo and slogan */}
          <div className="rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-4 shadow-sm">
            <img
              src="/assets/generated/speakr-logo-reupload.dim_1536x864.png"
              alt="SPEAKR"
              className="h-16 sm:h-20 md:h-24 w-auto object-contain"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground/90 tracking-tight">
            Giving everyone a voice!
          </p>
        </div>
      </div>
    </div>
  );
}
