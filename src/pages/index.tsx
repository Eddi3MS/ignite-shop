import Image from "next/future/image";
import { HomeContainer, Product } from "../styles/pages/home";

import Stripe from "stripe";

import { useKeenSlider } from "keen-slider/react";

import "keen-slider/keen-slider.min.css";
import { stripe } from "../lib/stripe";
import { GetStaticProps } from "next";
import Link from "next/link";

interface IHomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
  }[];
}

export default function Home({ products }: IHomeProps) {
  const [sliderRef] = useKeenSlider({
    breakpoints: {
      "(min-width: 400px)": {
        slides: { perView: 1.4, spacing: 32 },
      },
      "(min-width: 1000px)": {
        slides: { perView: 2.4, spacing: 48 },
      },
    },
    slides: {
      perView: 1.2,
      spacing: 16,
    },
  });

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      {products.map((product) => (
        <Link
          href={`/products/${product.id}`}
          key={product.id}
          prefetch={false}
        >
          <Product className="keen-slider__slide">
            <Image src={product.imageUrl} width={520} height={480} alt="" />

            <footer>
              <strong>{product.name}</strong>
              <span>{product.price}</span>
            </footer>
          </Product>
        </Link>
      ))}
    </HomeContainer>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ["data.default_price"],
  });

  const products = response.data.map((prod) => {
    const price = prod.default_price as Stripe.Price;

    return {
      id: prod.id,
      name: prod.name,
      imageUrl: prod.images[0],
      price: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price.unit_amount / 100),
    };
  });

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // 2 horas
  };
};
