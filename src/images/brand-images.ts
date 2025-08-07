export interface Brand {
  name: string;
  src: string;
}

import adidasImage from "../../public/adidas.png";
import converseImage from "../../public/converse.png";
import newBalanceImage from "../../public/new-balance.png";
import nikeImage from "../../public/nike.png";
import poloImage from "../../public/polo.png";
import pumaImage from "../../public/puma.png";
import zaraImage from "../../public/zara.png";

export const brandImages: Brand[] = [
  {
    name: "Nike",
    src: nikeImage.src,
  },
  {
    name: "Adidas",
    src: adidasImage.src,
  },
  {
    name: "Puma",
    src: pumaImage.src,
  },
  {
    name: "New Balance",
    src: newBalanceImage.src,
  },
  {
    name: "Converse",
    src: converseImage.src,
  },
  {
    name: "Polo",
    src: poloImage.src,
  },
  {
    name: "Zara",
    src: zaraImage.src,
  },
  // Adicione mais marcas aqui
];
