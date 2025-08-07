import Image from "next/image";

import { Brand } from "@/images/brand-images";

interface BrandItemProps {
  image: Brand;
}

const BrandItem = ({ image }: BrandItemProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-[120px] flex-shrink-0 md:w-[180px]">
        <Image
          src={image.src}
          alt={image.name}
          width={200}
          height={200}
          className="h-full w-full rounded-3xl object-contain"
        />
      </div>
      <div className="flex max-w-[200px] flex-col gap-1">
        <p className="truncate text-center text-sm font-medium">{image.name}</p>
      </div>
    </div>
  );
};

export default BrandItem;
