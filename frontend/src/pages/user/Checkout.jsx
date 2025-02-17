import { useState, useCallback } from "react";
import AddAddress from "../../components/user/AddAddress";
import PortalPopup from "../../components/PortalPopup";
import { useLocation } from "react-router-dom";
import api from "../../api/config";

const Checkout = (store) => {
  console.log("Store Detailis: ", store);
import { MapPin } from "lucide-react";

  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isAddAddressPopupOpen, setAddAddressPopupOpen] = useState(false);
  const [address, setAddress] = useState("");
  const { items, totalPrice } = location.state || { items: [], totalPrice };

  // State for custom dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+977");

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Handle option selection
  const handleCountryCodeSelect = (code) => {
    setSelectedCountryCode(code);
    setIsDropdownOpen(false);
  };

  const openAddAddressPopup = useCallback(() => {
    setAddAddressPopupOpen(true);
  }, []);

  const closeAddAddressPopup = useCallback(() => {
    setAddAddressPopupOpen(false);
  }, []);

  const handleCheckout = async () => {
    if (!userName || !phoneNumber || !address) {
      alert("Please fill in all required fields!");
      return;
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      alert("Phone number should be exactly 10 digits.");
      return;
    }

    const orderData = {
      storeId:store.store._id,
      userName,
      userPhone: phoneNumber,
      userAddress: address,
      products: items,
    };
    console.log("order Data: ",orderData);

    try {
      const response = await api.post("/order", orderData);
      console.log("Order created successfully:", response.data);

      const orderSummary = items
        .map(
          (item, index) =>
            `*Item ${index + 1}:* ${item.productName}\n*Quantity:* ${
              item.productQuantity
            }\n*Price:* Rs ${item.productTotalPrice}\n\n`
        )
        .join("");

      const message =
        `*Order Summary*\n\n${orderSummary}` +
        `*Total Price:* Rs ${totalPrice}\n\n` +
        `*Customer Details*\n` +
        `*Name:* ${userName}\n` +
        `*Phone:* +977 ${phoneNumber}\n` +
        `*Address:* ${address}\n\n` +
        `Please Confirm my order.`;

      const whatsappUrl = `https://wa.me/9808000693?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Error creating order; ", error);
      alert("Failed to make order. please try again");
    }
  };

  return (
    <>
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center py-[60px] px-8 box-border text-left text-mini1 text-black font-poppins">
        <div className="max-w-lg w-full flex flex-col items-center gap-4">
          <div className="w-full text-xl font-bold text-gray-700">Checkout</div>
          <div className="w-full text-lg font-bold">{store.store.name}</div>

          <div className="w-full border border-gray-300 p-4 rounded-md text-sm">
            <div className="font-semibold mb-2">Customer*</div>
            <form>
              <div className="mb-3">
                <label className="block mb-1">Name</label>
                <input
                  className="w-full border border-gray-300 p-2 rounded-md"
                  type="text"
                  placeholder="Your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1">WhatsApp Number</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div
                      className="border border-gray-300 p-2 rounded-md flex items-center justify-between cursor-pointer"
                      onClick={toggleDropdown}
                    >
                      <span>{selectedCountryCode}</span>
                      <span>{isDropdownOpen ? "▲" : "▼"}</span>
                    </div>
                    {isDropdownOpen && (
                      <div className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
                        {["+977", "+91"].map((code) => (
                          <div
                            key={code}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleCountryCodeSelect(code)}
                          >
                            {code}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    className="flex-1 border border-gray-300 p-2 rounded-md"
                    type="number"
                    placeholder="Enter your WhatsApp number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="w-full border border-gray-300 p-4 rounded-md text-sm">
            <div className="font-semibold mb-2">Items</div>
            {items.length > 0 ? (
              items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b border-gray-300 py-3"
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium">{item.productName}</div>
                    <div>Quantity: {item.productQuantity}</div>
                    <div>Per price: {item.productPrice}</div>
                    <div>Total Price: Rs {item.productTotalPrice}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center">
                No items in your cart.
              </div>
            )}
          </div>

          <div className="w-full border border-gray-300 p-4 rounded-md text-sm">
            <div className="font-semibold mb-2">Delivery</div>
            {/* <div>Flat Fee of NPR 100.00</div> */}
            <div>Your Delivary Address: {address}</div>
            <button
              className="mt-2 w-full border border-gray-300 p-2 rounded-md flex items-center justify-center gap-2"
              onClick={openAddAddressPopup}
            >
              <MapPin className="w-5 h-5" />
              <span>Enter Address</span>
            </button>
          </div>
          {/* <div className="self-stretch rounded-6xs1 border-gray-300 border-[1px] border-solid flex flex-col items-center justify-end py-[7px] px-2.5 text-smi1">
            <div className="self-stretch bg-white overflow-hidden flex flex-row items-center justify-center py-0 px-2.5 gap-2.5">
              <img
                className="w-5 relative h-5 overflow-hidden shrink-0"
                alt=""
                src="/utagalt.svg"
              />
              <div className="relative tracking-[0.01em] lg:flex-1 sm1:flex-1">
                Discount Code
              </div>
            </div>
          </div> */}
          <div className="self-stretch rounded-6xs1 border-gray-300 border-[1px] border-solid flex flex-col items-center justify-end py-[15px] px-2.5 text-sm">
            <div className="w-[440px] flex flex-col items-start justify-start gap-[9px] sm1:self-stretch sm1:w-auto">
              <div className="self-stretch relative tracking-[0.01em] font-semibold lg:self-stretch lg:w-auto sm1:self-stretch sm1:w-auto">
                Order Summary
              </div>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <>
                    <div
                      key={index}
                      className="self-stretch border-gray-600 border-b-[1px] border-dashed flex flex-row items-start justify-start py-[7px] px-0 gap-[5px]"
                    >
                      <div className="flex-1 relative tracking-[0.01em] lg:flex-1 sm1:flex-1">
                        {item.productName}({item.productQuantity})
                        {console.log("Name: ", item.productName)}
                      </div>
                      <div className="flex-1 relative tracking-[0.01em] text-right lg:flex-1 sm1:flex-1">
                        Rs {item.productTotalPrice}
                      </div>
                    </div>
                    <div className="self-stretch flex flex-row items-start justify-start py-[7px] px-0 gap-[5px]">
                      {/* <div className="flex-1 relative tracking-[0.01em] lg:flex-1 sm1:flex-1">
                        Items({item.productQuantity})
                      </div> */}
                      {/* <div className="flex-1 relative tracking-[0.01em] text-right lg:flex-1 sm1:flex-1">
                        Rs 100.00
                      </div> */}
                    </div>
                  </>
                ))
              ) : (
                <div>No Products here</div>
              )}

          <div className="w-full border border-gray-300 p-4 rounded-md text-sm">
            <div className="font-semibold mb-2">Order Summary</div>
            {items.length > 0 ? (
              items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between border-b border-dashed border-gray-600 py-2"
                >
                  <div>
                    {item.productName} ({item.productQuantity})
                  </div>
                  <div>Rs {item.productTotalPrice}</div>
                </div>
              ))
            ) : (
              <div>No Products here</div>
            )}
            {/* <div className="flex justify-between border-b border-dashed border-gray-600 py-2">
              <div>Discount (10%)</div>
              <div>Rs 60.00</div>
            </div> */}
          </div>
          <div className="flex items-center justify-between bg-black text-white px-6 py-3 rounded-[10px] shadow-lg w-[90%] sm:w-[300px]">
            <button
              onClick={handleCheckout}
              className="rounded-md flex-1 text-center font-semibold text-xl sm:text-lg disabled:opacity-50"
              disabled={!userName || !phoneNumber || !address}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>

      {isAddAddressPopupOpen && (
        <PortalPopup>
          <AddAddress
            closePopup={closeAddAddressPopup}
            onAddressChange={setAddress}
            address={address}
          />
        </PortalPopup>
      )}
    </>
  );
};

export default Checkout;
