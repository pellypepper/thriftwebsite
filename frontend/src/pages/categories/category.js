import React from "react";
import Navbar from "../../component/navbar/navbar";
import Footer from "../../component/footer/footer";
import ProductList from "../../component/product/productList";
import { useLocation } from "react-router-dom";

const Category = () => {
  const location = useLocation();
  const category = location.state?.category;

  return (
    <main>

      <section>
        <ProductList category={category} title={category} />
      </section>
      <section className="footer">
        <Footer />
      </section>
    </main>
  );
};

export default Category;
