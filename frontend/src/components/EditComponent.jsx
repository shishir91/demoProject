import { useState } from "react";
import { Trash2 } from "lucide-react";
import api from "../api/config";
import { toast } from "sonner";

export default function EditComponent({ order, onClose }) {
  const [updatedOrder, setUpdatedOrder] = useState({ ...order });

  const handleChange = (e) => {
    setUpdatedOrder({ ...updatedOrder, [e.target.name]: e.target.value });
  };

  const handleDeleteProduct = (productId) => {
    setUpdatedOrder({
      ...updatedOrder,
      products: updatedOrder.products.filter(
        (product) => product._id !== productId
      ),
    });
  };

  const handleAddProduct = () => {
    setUpdatedOrder({
      ...updatedOrder,
      products: [
        ...updatedOrder.products,
        {
          _id: Date.now(),
          productName: "",
          productPrice: "",
          productQuantity: "",
          productTotalPrice: "",
        },
      ],
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await api.put(
        `/order/update/${updatedOrder._id}`,
        updatedOrder
      );
      if (response.data.success) {
        toast.success("Order updated");
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
  <div className="bg-white p-6 rounded-lg w-96 text-black max-h-[80vh] overflow-hidden">
    <div className="overflow-y-auto max-h-[75vh] p-2">

        <h2 className="text-xl font-bold mb-4">Edit Order</h2>

        <label>Customer Name</label>
        <input
          type="text"
          name="userName"
          value={updatedOrder.userName}
          onChange={handleChange}
          className="border w-full p-2 rounded mb-2"
        />

        <label>Customer Phone No</label>
        <input
          type="text"
          name="userPhone"
          value={updatedOrder.userPhone}
          onChange={handleChange}
          className="border w-full p-2 rounded mb-2"
        />

        <label>Customer Address</label>
        <input
          type="text"
          name="userAddress"
          value={updatedOrder.userAddress}
          onChange={handleChange}
          className="border w-full p-2 rounded mb-2"
        />

        <label>Total Price</label>
        <input
          type="text"
          name="totalAmount"
          value={updatedOrder.totalAmount}
          onChange={handleChange}
          className="border w-full p-2 rounded mb-2"
        />

        <label>Ordered Items: </label>
        <table className="w-full border-collapse border border-gray-300 mb-2">
          <thead>
            <tr className="bg-gray-200 border-b-2">
              <th className="p-2 border">Product Name</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {updatedOrder.products.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="p-2 border">{product.productName}</td>
                <td className="p-2 border">{product.productPrice}</td>
                <td className="p-2 border">{product.productQuantity}</td>
                <td className="p-2 border">{product.productTotalPrice}</td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* <button
          onClick={handleAddProduct}
          className="w-full bg-green-500 text-white py-2 rounded mb-2 hover:bg-green-700"
        >
          Add Product
        </button> */}

        <label>Status</label>
        <select
          name="status"
          value={updatedOrder.status}
          onChange={handleChange}
          className="border w-full p-2 rounded mb-2"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
