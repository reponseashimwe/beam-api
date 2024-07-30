import { FC, ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { FreeMode, Navigation, Thumbs, Pagination } from "swiper/modules";
import { SwiperOptions } from "swiper/types";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/pagination"; // Import pagination styles
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

// Initialize Swiper modules
SwiperCore.use([FreeMode, Navigation, Thumbs, Pagination]);

type Props = {
  slides: ReactNode[];
  itemsPerView?: number;
  loop?: boolean;
  title?: string;
  slideStyles?: React.CSSProperties;
  breakpoints?: SwiperOptions["breakpoints"];
  useBullets?: boolean;
};

const Slider: FC<Props> = ({
  slides,
  itemsPerView = 1,
  loop = true,
  slideStyles,
  breakpoints,
  useBullets = false,
  title,
}) => {
  const uniqueId = "swiper-" + Math.floor(Math.random() * 1000);
  return (
    <div
      className="flex justify-center flex-col w-full max-w-full relative"
      id={`${uniqueId}`}
    >
      {(title || !useBullets) && (
        <div className="flex justify-between items-center mb-4">
          {title && (
            <div className="text-gray-900 font-medium text-md">{title}</div>
          )}
          {!useBullets && (
            <div className="flex space-x-2 justify-end">
              <div className="prev cursor-pointer h-8 aspect-square flex items-center justify-center bg-gray-100 rounded-full">
                <ChevronLeftIcon className="w-4 text-gray-900" />
              </div>
              <div className="next cursor-pointer h-8 aspect-square flex items-center justify-center bg-gray-900 rounded-full">
                <ChevronRightIcon className="w-4 text-white" />
              </div>
            </div>
          )}
        </div>
      )}
      <div className="slider w-full relative pb-12">
        <Swiper
          loop={loop}
          spaceBetween={10}
          slidesPerView={itemsPerView}
          breakpoints={breakpoints}
          navigation={
            !useBullets
              ? {
                  nextEl: `#${uniqueId} .next`,
                  prevEl: `#${uniqueId} .prev`,
                }
              : undefined
          }
          pagination={
            useBullets
              ? { clickable: true, el: `.${uniqueId}-pagination` }
              : undefined
          }
          modules={[FreeMode, Navigation, Thumbs, Pagination]}
          className="mySwiper2"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className="w-full" style={slideStyles}>
              {slide}
            </SwiperSlide>
          ))}
        </Swiper>
        {useBullets && (
          <div
            className={`${uniqueId}-pagination swiper-pagination pt-8`}
          ></div>
        )}
      </div>
    </div>
  );
};

export default Slider;
