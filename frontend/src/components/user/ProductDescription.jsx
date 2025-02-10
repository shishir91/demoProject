import { useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import useFetchProducts from "../../hooks/useFetchProducts";

const ProductDescription = ({ className = "", store }) => {
  const navigate = useNavigate();

  const { products, loading, error } = useFetchProducts(store);

  const onProductDescriptionContainerClick = useCallback(() => {
    navigate("/sp");
  }, [navigate]);

  return (
    <div className="w-full max-w-6xl mx-auto rounded-xl border border-gray-300 p-5 text-base1">
      <div className="text-center">
        <b className="text-xl text-h1">Products</b>
        <p className="text-gray-500 text-sm">Our Latest Products</p>
      </div>
      <div className="mt-5">
        {loading && <p>Loading Products...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
          {products.map((item, index) => (
            <Link
              key={index}
              to={`/product/${item._id}`}
              className={`flex flex-col items-center justify-start gap-2 cursor-pointer text-left text-black font-poppins w-full ${className}`}
            >
              <img
                className="w-full h-[180px] object-cover rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                alt={item.name}
                src={item.images[0]}
              />
              <div className="w-full text-center mt-2">
                <div className="text-sm sm:text-base font-medium text-ellipsis overflow-hidden whitespace-nowrap">
                  {item.name}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 overflow-hidden line-clamp-2">
                  {item.description}
                </div>
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm mt-1">
                  <span className="line-through text-red-500">{item.price}</span>
                  <b className="text-black">
                    {item.calculatedPrice || item.price}
                  </b>
                </div>
                {item.discountRate > 0 && (
                  <div className="text-green-500 font-semibold text-xs sm:text-sm mt-1">
                    {item.discountRate}% Off
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

ProductDescription.propTypes = {
  className: PropTypes.string,
};

export default ProductDescription;
