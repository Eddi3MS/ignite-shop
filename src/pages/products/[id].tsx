import { GetStaticPaths, GetStaticProps } from "next";
import Stripe from "stripe";
import React, { useState } from "react";
import { stripe } from "../../lib/stripe";
import axios from "axios";
import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from "../../styles/pages/product";
import Image from "next/future/image";
import { useRouter } from "next/router";

interface ISingleProduct {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string;
    defaultPriceId: string;
  };
}

const SingleProduct = ({ product }: ISingleProduct) => {
  const { isFallback } = useRouter();

  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
    useState(false);

  async function handlePurcharseButton() {
    try {
      setIsCreatingCheckoutSession(true);

      const response = await axios.post("/api/checkout", {
        priceId: product.defaultPriceId,
      });

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl;
    } catch (err) {
      alert("Falha ao redirecionar ao checkout!");
      setIsCreatingCheckoutSession(false);
    }
  }

  if (isFallback) return <p>Loading...</p>;
  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={product.imageUrl} alt="" width={520} height={480} />
      </ImageContainer>

      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>

        <p>{product.description}</p>

        <button
          disabled={isCreatingCheckoutSession}
          onClick={handlePurcharseButton}
        >
          Comprar agora
        </button>
      </ProductDetails>
    </ProductContainer>
  );
};

export default SingleProduct;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: "prod_MUxfdSPeovDyUV" } }],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
  params,
}) => {
  const productId = params.id;

  const product = await stripe.products.retrieve(productId, {
    expand: ["default_price"],
  });

  const price = product.default_price as Stripe.Price;

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(price.unit_amount / 100),
        description: product.description,
        defaultPriceId: price.id,
      },
    },
    revalidate: 60 * 60 * 1, // 1 hora
  };
};
