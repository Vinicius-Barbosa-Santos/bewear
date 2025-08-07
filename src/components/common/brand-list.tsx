"use client";

import { Brand } from "@/images/brand-images";

import BrandItem from "./brand-item";

interface ProductListProps {
  title: string;
  images: Brand[];
}

const BrandList = ({ title, images }: ProductListProps) => {
  return (
    <div className="space-y-6">
      <h3 className="px-5 font-semibold">{title}</h3>
      <div className="flex w-full gap-4 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
        {images.map((image) => (
          <div key={image.name}>
            <BrandItem image={image} key={image.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandList;
