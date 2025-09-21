"use client";

import { Brand } from "@/types/brand";
import Image from "next/image";
import brandsData from "./brandsData";

const Brands = () => {
  return (
    <section className="py-16 bg-primary/20 dark:bg-gray-dark overflow-hidden">   
      {/* Continuous Slider */}
      <div className="relative w-full">
        <div className="flex brands-scroll">
          {/* First set of brands */}
          {brandsData.map((brand) => (
            <SingleBrand key={`first-${brand.id}`} brand={brand} />
          ))}
          {/* Duplicate set for seamless loop */}
          {brandsData.map((brand) => (
            <SingleBrand key={`second-${brand.id}`} brand={brand} />
          ))}
        </div>
      </div>
      
      {/* Add custom CSS for animation */}
      <style jsx>{`
        @keyframes brandScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .brands-scroll {
          animation: brandScroll 40s linear infinite;
          width: calc(200%);
        }
        
        .brands-scroll:hover {
          animation-play-state: paused;
        }
        
        @media (max-width: 768px) {
          .brands-scroll {
            animation-duration: 25s;
          }
        }
      `}</style>
    </section>
  );
};

export default Brands;

const SingleBrand = ({ brand }: { brand: Brand }) => {
  const { href, image, name } = brand;

  return (
    <div className="flex min-w-[180px] items-center justify-center px-6 py-4 mx-3">
      <a
        href={href}
        target="_blank"
        rel="nofollow noreferrer"
        className="group relative h-10 w-full opacity-70 transition-all duration-300 hover:opacity-100 hover:scale-105 dark:opacity-60 dark:hover:opacity-100"
        title={`Visit ${name}`}
      >
        <Image 
          src={image} 
          alt={name} 
          fill 
          className="object-contain group-hover:drop-shadow-lg filter dark:brightness-0 dark:invert" 
        />
      </a>
    </div>
  );
};
