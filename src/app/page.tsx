import Image from "next/image";

import CategorySelector from "@/components/common/category-selector";
import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { getCategories } from "@/data/categories/get";
import {
  getNewlyCreatedProducts,
  getProductsWithVariants,
} from "@/data/products/get";

export const dynamic = "force-dynamic";

const Home = async () => {
  const [products, newlyCreatedProducts, categories] = await Promise.all([
    getProductsWithVariants(),
    getNewlyCreatedProducts(),
    getCategories(),
  ]);
  return (
    <>
      <Header />
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 px-5">
          <Image
            src="/banner-01.png"
            alt="Leve uma vida com estilo"
            height={0}
            width={0}
            sizes="(max-width: 1280px) 50vw, 640px"
            className="h-auto w-full"
          />
          <Image
            src="/banner-02.png"
            alt="Seja autêntico"
            height={0}
            width={0}
            sizes="(max-width: 1280px) 50vw, 640px"
            className="h-auto w-full"
          />
        </div>

        <ProductList products={products} title="Mais vendidos" />

        <div className="px-5">
          <CategorySelector categories={categories} />
        </div>

        <ProductList products={newlyCreatedProducts} title="Novos produtos" />
        <Footer />
      </div>
    </>
  );
};

export default Home;
