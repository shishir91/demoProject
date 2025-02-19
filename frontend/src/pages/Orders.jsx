import { useEffect, useState } from "react";
import api from "../api/config";
import { toast } from "sonner";
import { EllipsisVertical } from "lucide-react";
import EditComponent from "../components/EditComponent";

export default function Orders() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [stores, setStores] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [editOrder, setEditOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showMenu, setShowMenu] = useState(null); // Manage which menu is open

  useEffect(() => {
    if (!storeId) return;
    const fetchOrders = async () => {
      try {
        const response = await api.get(`/order/${storeId}`, {
          headers: { token },
        });
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          toast.error(response.data.message, { duration: 2000 });
          setOrders([]);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message, { duration: 2000 });
      }
    };
    fetchOrders();
  }, [storeId]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response =
          user.role === "admin"
            ? await api.get("/store", { headers: { token } })
            : await api.get("/store/myStores", { headers: { token } });

        if (response.data.success) {
          setStores(response.data.stores);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message, { duration: 2000, theme: "colored" });
      }
    };

    fetchStores();
  }, [token]);

  // Function to handle confirm/decline or delete/edit action
  const handleOrderAction = async (orderId, action) => {
    try {
      if (action == "edit") {
        const orderToEdit = orders.find((order) => order._id == orderId);
        setEditOrder(orderToEdit);
        return;
      }

      if (action === "delete") {
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this order?"
        );
        if (!confirmDelete) return;
      }

      let status = "";
      switch (action) {
        case "confirm":
          status = "paid";
          break;
        case "decline":
          status = "failed";
          break;
        case "delete":
          await api.delete(`/order/status/${orderId}`, { headers: { token } });
          toast.success("Order deleted successfully!");
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order._id !== orderId)
          );
          return;
        case "edit":
          toast.info("Edit functionality is not implemented yet.");
          return;
        default:
          return;
      }

      const response = await api.put(
        `/order/status/${storeId}`,
        { orderId, status },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(`Order ${action} successfully!`);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: status } : order
          )
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="p-4 sm:ml-64 bg-stone-800 min-h-screen mr-4 mt-4 rounded-xl text-white overflow-x-auto">
      {/* Header */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <div className="text-emerald-500">
          <select
            onChange={(e) => setStoreId(e.target.value)}
            className="w-32 px-2 py-2 rounded-lg bg-stone-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700"
          >
            <option disabled selected>
              Select Store
            </option>
            {stores.map((store) => (
              <option value={store._id} key={store._id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="border-b-2 border-white">
            <th className="p-2 text-center">Order ID</th>
            <th className="p-2 text-center">Order Date</th>
            <th className="p-2 text-center">Customer Name</th>
            <th className="p-2 text-center">Customer Phone No</th>
            <th className="p-2 text-center">Customer Address</th>
            <th className="p-2 text-center">Table No</th>
            <th className="p-2 text-center">Extra Notes</th>
            <th className="p-2 text-center">Products</th>
            <th className="p-2 text-center">Total Price</th>
            <th className="p-2 text-center">Status</th>
            <th className="p-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b border-white">
              <td className="p-2 text-center">#{order._id.slice(-5)}</td>
              <td className="p-2 text-center">{order.orderDate}</td>
              <td className="p-2 text-center">{order.userName}</td>
              <td className="p-2 text-center">{order.userPhone}</td>
              <td className="p-2 text-center">{order.userAddress? order.userAddress :"- - -"}</td>
              <td className="p-2 text-center">{order.tableNo? order.tableNo : "- - -"}</td>
              <td className="p-2 text-center">{order.extraNotes?order.extraNotes : "- - -"}</td>
              <td className="p-2 text-center">
                <table className="min-w-full table-auto border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="p-2 text-center">Product Name</th>
                      <th className="p-2 text-center">Quantity</th>
                      <th className="p-2 text-center">Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((product) => (
                      <tr
                        key={product._id}
                        className="border-b border-gray-600"
                      >
                        <td className="p-2 text-center">
                          {product.productName}
                        </td>
                        <td className="p-2 text-center">
                          {product.productQuantity}
                        </td>
                        <td className="p-2 text-center">
                          ${product.productTotalPrice}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
              <td className="p-2 text-center">${order.totalAmount}</td>
              <td className="p-2 text-center">
                <span
                  className={`px-3 py-1 rounded text-white text-sm ${
                    order.status === "pending"
                      ? "bg-yellow-500"
                      : order.status === "paid"
                      ? "bg-green-500"
                      : order.status === "failed"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="p-2 text-center relative">
                {" "}
                {/* Make the td relative */}
                <div className="relative inline-block">
                  <button
                    onClick={() =>
                      setShowMenu(showMenu === order._id ? null : order._id)
                    }
                    className="text-white p-2 bg-gray-700 rounded-full"
                  >
                    <EllipsisVertical />
                  </button>
                  {showMenu === order._id && (
                    <div className="absolute right-0 mt-2 bg-gray-700 text-white rounded-lg shadow-lg w-32 z-10">
                      <button
                        onClick={() => handleOrderAction(order._id, "confirm")}
                        className="w-full text-left px-4 py-2 hover:bg-green-600"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleOrderAction(order._id, "decline")}
                        className="w-full text-left px-4 py-2 hover:bg-red-600"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleOrderAction(order._id, "delete")}
                        className="w-full text-left px-4 py-2 hover:bg-red-700"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleOrderAction(order._id, "edit")}
                        className="w-full text-left px-4 py-2 hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {
        editOrder && (
          <EditComponent order={editOrder} onClose={()=>setEditOrder(null)}/>
        )
      }
    </div>
  );
}
