import BrandingBannerDropdown from './BrandingBannerDropdown';
import { useState } from 'react';

export default function BrandingBanner() {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="w-full border-b border-border/40 bg-background py-8 md:py-12">
      <div className="container px-4 md:px-6">
        <div className="relative flex flex-col items-center justify-center gap-4 md:gap-6">
          {/* Top-left dropdown menu */}
          <div className="absolute left-0 top-0">
            <BrandingBannerDropdown />
          </div>
          
          {/* Centered logo */}
          <div className="flex items-center justify-center">
            {!logoError ? (
              <img
                src="/assets/generated/speakr-logo-reupload.dim_1536x864.png"
                alt="SPEAKR"
                className="h-20 sm:h-28 md:h-36 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="h-20 sm:h-28 md:h-36 flex items-center justify-center px-8">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary">SPEAKR</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
