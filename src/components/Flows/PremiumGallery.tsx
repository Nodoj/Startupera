'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs, Zoom, Keyboard, Mousewheel, Autoplay, EffectFade } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { X, ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/zoom'
import 'swiper/css/effect-fade'

interface PremiumGalleryProps {
  images: string[]
  title: string
}

export default function PremiumGallery({ images, title }: PremiumGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoplayActive, setIsAutoplayActive] = useState(false)

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const toggleAutoplay = () => {
    if (mainSwiper) {
      if (isAutoplayActive) {
        mainSwiper.autoplay.stop()
      } else {
        mainSwiper.autoplay.start()
      }
      setIsAutoplayActive(!isAutoplayActive)
    }
  }

  // ESC key handler for fullscreen
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscKey)
      // Prevent body scroll when fullscreen
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isFullscreen])

  return (
    <>
      {/* Main Gallery */}
      <div className="mb-10">
        <div className="relative rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-2xl overflow-hidden">
          {/* Main Swiper */}
          <Swiper
            onSwiper={setMainSwiper}
            modules={[Navigation, Pagination, Thumbs, Zoom, Keyboard, Mousewheel, Autoplay, EffectFade]}
            spaceBetween={10}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            zoom={{
              maxRatio: 3,
              minRatio: 1,
            }}
            keyboard={{
              enabled: true,
            }}
            mousewheel={{
              forceToAxis: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={images.length > 1}
            effect="fade"
            fadeEffect={{
              crossFade: true,
            }}
            onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
            className="premium-gallery-main"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="swiper-zoom-container">
                  <div className="relative h-[500px] w-full border-b-2 border-gray-200 dark:border-gray-700">
                    <Image
                      src={image}
                      alt={`${title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}

            {/* Custom Navigation Buttons */}
            <button
              className="swiper-button-prev-custom absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all hover:bg-white hover:scale-110 dark:bg-gray-800/90 dark:hover:bg-gray-800"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800 dark:text-white" />
            </button>
            <button
              className="swiper-button-next-custom absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all hover:bg-white hover:scale-110 dark:bg-gray-800/90 dark:hover:bg-gray-800"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-gray-800 dark:text-white" />
            </button>
          </Swiper>

          {/* Control Bar */}
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/70 backdrop-blur-sm px-4 py-2 shadow-lg">
            {/* Image Counter */}
            <span className="text-sm font-medium text-white">
              {currentIndex + 1} / {images.length}
            </span>

            <div className="mx-2 h-4 w-px bg-white/30" />

            {/* Zoom Hint */}
            <div className="flex items-center gap-1 text-xs text-white/80">
              <ZoomIn className="h-3 w-3" />
              <span>Double-click to zoom</span>
            </div>

            <div className="mx-2 h-4 w-px bg-white/30" />

            {/* Autoplay Toggle */}
            <button
              onClick={toggleAutoplay}
              className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-white transition-colors hover:bg-white/20"
              aria-label={isAutoplayActive ? 'Pause autoplay' : 'Start autoplay'}
            >
              {isAutoplayActive ? (
                <>
                  <Pause className="h-3 w-3" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" />
                  <span>Play</span>
                </>
              )}
            </button>

            <div className="mx-2 h-4 w-px bg-white/30" />

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-white transition-colors hover:bg-white/20"
              aria-label="Toggle fullscreen"
            >
              <Maximize2 className="h-3 w-3" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>

        {/* Thumbnail Swiper */}
        {images.length > 1 && (
          <div className="mt-4 px-2 py-3 flex justify-center">
            <Swiper
              onSwiper={setThumbsSwiper}
              modules={[Navigation, Thumbs]}
              spaceBetween={16}
              slidesPerView="auto"
              watchSlidesProgress
              centeredSlides={false}
              className="premium-gallery-thumbs !w-auto"
            >
              {images.map((image, index) => (
                <SwiperSlide key={index} className="!w-auto">
                  <div className="p-1">
                    <button
                      className={`relative h-20 w-24 rounded-lg border-2 transition-all ${
                        index === currentIndex
                          ? 'border-primary scale-105 shadow-lg'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary/50 hover:scale-105'
                      }`}
                    >
                      <div className="relative h-full w-full overflow-hidden rounded-md">
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black">
          {/* Close Button */}
          <button
            onClick={toggleFullscreen}
            className="absolute right-4 top-4 z-[10000] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20"
            aria-label="Close fullscreen"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Fullscreen Swiper */}
          <Swiper
            modules={[Navigation, Pagination, Zoom, Keyboard]}
            spaceBetween={0}
            navigation
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            zoom={{
              maxRatio: 5,
              minRatio: 1,
            }}
            keyboard={{
              enabled: true,
            }}
            loop={images.length > 1}
            initialSlide={currentIndex}
            className="h-full w-full"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="swiper-zoom-container flex h-full w-full items-center justify-center">
                  <div className="relative h-full w-full">
                    <Image
                      src={image}
                      alt={`${title} - Image ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Fullscreen Instructions */}
          <div className="absolute bottom-8 left-1/2 z-[10000] -translate-x-1/2 rounded-full bg-black/70 backdrop-blur-sm px-6 py-3 text-sm text-white">
            <div className="flex items-center gap-4">
              <span>← → Arrow keys to navigate</span>
              <div className="h-4 w-px bg-white/30" />
              <span>Double-click to zoom</span>
              <div className="h-4 w-px bg-white/30" />
              <span>ESC to exit</span>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .premium-gallery-main .swiper-pagination {
          bottom: 60px !important;
        }

        .premium-gallery-main .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: white;
          opacity: 0.5;
        }

        .premium-gallery-main .swiper-pagination-bullet-active {
          opacity: 1;
          background: #4a6cf7;
        }

        .premium-gallery-thumbs .swiper-slide {
          cursor: pointer;
        }

        .swiper-button-disabled {
          opacity: 0.3 !important;
          cursor: not-allowed !important;
        }
      `}</style>
    </>
  )
}
