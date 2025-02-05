import { useCallback } from "react";
import { useNavigate, useParams, Link} from "react-router-dom";
import PropTypes from "prop-types";
import useFetchProducts from "../../hooks/useFetchProducts";

const ProductDescription = ({ className = "" }) => {
  const navigate = useNavigate();
  const { storeId } = useParams();

  const { products, loading, error } = useFetchProducts(storeId);

  const onProductDescriptionContainerClick = useCallback(() => {
    navigate("/sp");
  }, [navigate]);

  return (
    <>
      {loading && <p>Loading Products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
        {products.map((item, index) => (
          <Link
            key={index}
            to={`/product/${item._id}`}
            className={`flex flex-col items-center justify-start gap-2 cursor-pointer text-left text-black font-poppins w-[200px] sm:w-[180px] ${className}`}
          >
            <img
              className="w-full h-[180px] object-cover rounded-lg"
              alt={item.name}
              src={item.images[0]}
            />
            <div className="w-full text-center">
              <div className="text-base font-medium text-ellipsis overflow-hidden whitespace-nowrap">
                {item.name}
              </div>
              <div className="text-sm text-gray-500 overflow-hidden line-clamp-2">
                {item.description}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="line-through text-red-500">{item.price}</span>
                <b className="text-black">
                  {item.calculatedPrice || item.price}
                </b>
              </div>
              {item.discountRate > 0 && (
                <div className="text-green-500 font-semibold text-sm">
                  {item.discountRate}% Off
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

ProductDescription.propTypes = {
  className: PropTypes.string,
};

export default ProductDescription;
