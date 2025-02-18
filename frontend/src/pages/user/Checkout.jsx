import { useState, useCallback } from "react";
import AddAddress from "../../components/user/AddAddress";
import PortalPopup from "../../components/PortalPopup";
import { useLocation } from "react-router-dom";
import api from "../../api/config";
import { MapPin } from "lucide-react";
import DineInComponent from "../../components/user/DineInComponent";
import { useQueryClient } from "@tanstack/react-query";

const Checkout = (store) => {
  const host = window.location.hostname.split(".");
  const sub = host.length > 1 ? host[0] : null;
  const subdomain = sub;

  console.log("Subdomain : ", subdomain);
  console.log("Store Detailis: ", store);
  const queryClient = useQueryClient();
  const { storeData } = queryClient.getQueryData(["store"]);

  console.log("Store Data: ", storeData);
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isAddAddressPopupOpen, setAddAddressPopupOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const { items, totalPrice } = location.state || { items: [], totalPrice };

  // State for custom dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+977");
  const [orderType, setOrderType] = useState("dineIn");
  // const [address, setAddress] = useState("");
  const [extraNotes, setExtraNotes] = useState("");

  const handleOrderTypeChange = (e) => {
    setOrderType(e.target.value);
  };

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
      storeId: store.store._id,
      userName,
      userPhone: phoneNumber,
      userAddress: address,
      products: items,
    };
    console.log("order Data: ", orderData);

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
          <div className="w-full text-lg font-bold">{store?.store?.name}</div>

          {/* Customer Section */}
          <div className="w-full border border-gray-300 p-4 rounded-md text-sm">
            <div className="font-semibold mb-2">Customer*</div>
            <form onSubmit={(e) => e.preventDefault()}>
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

          {/* Items Section */}
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

          {/* Delivery Section */}
          {/* <div className="w-full border border-gray-300 p-4 rounded-md text-sm">
            <div className="font-semibold mb-2">Delivery</div>
            <div>Your Delivery Address: {address}</div>
            <button
              className="mt-2 w-full border border-gray-300 p-2 rounded-md flex items-center justify-center gap-2"
              onClick={openAddAddressPopup}
            >
              <MapPin className="w-5 h-5" />
              <span>Enter Address</span>
            </button>
          </div> */}
          <div className="w-full border border-gray-300 p-4 rounded-md text-sm">
            <div className="font-semibold mb-2">Delivery</div>

            {storeData?.type == "retail" && (
              <div className="self-stretch rounded-6xs flex flex-col items-center justify-end py-[15px] px-2.5 gap-[13px] z-[1]">
                <div className="self-stretch flex flex-col items-start justify-start gap-[9px] sm1:self-stretch sm1:w-auto">
                  <div className="self-stretch relative tracking-[0.01em] font-semibold lg:self-stretch lg:w-auto sm1:self-stretch sm1:w-auto">
                    Enter Address
                  </div>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Type your address here"
                    className="border-gray-300  p-2 border-[1px] border-solid bg-[transparent] [outline:none] self-stretch rounded-6xs box-border h-[40px]"
                  />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start gap-[9px] sm1:self-stretch sm1:w-auto">
                  <div className="self-stretch relative tracking-[0.01em] font-semibold lg:self-stretch lg:w-auto sm1:self-stretch sm1:w-auto">
                    Add Extra Notes
                  </div>
                  <textarea
                    value={extraNotes}
                    onChange={(e) => setExtraNotes(e.target.value)}
                    placeholder="Delivery Details"
                    className="border-gray-300 border-[1px] border-solid bg-[transparent] [outline:none] self-stretch rounded-6xs box-border p-2 h-[40px]"
                  />
                </div>
                {/* <button
                  // onClick={handleConfirm}
                  className="cursor-pointer border-black border-[1px] border-solid py-2.5 px-[3px] bg-darkslategray-300 self-stretch rounded-6xs box-border h-auto flex flex-row items-center justify-center max-w-full sm:h-auto sm:rounded-6xs sm:pl-0 sm:pr-0 sm:box-border"
                >
                  <div className="flex-1 relative text-sm tracking-[0.01em] font-semibold font-poppins text-black text-center sm:flex-1 sm:text-sm sm:self-stretch sm:h-auto">
                    Confirm
                  </div>
                </button> */}
              </div>
            )}
            {/* For Food Based */}
            {storeData?.type == "food" && (
              <div className="self-stretch rounded-6xs flex flex-col items-center justify-end py-[15px] px-2.5 gap-[13px] z-[1]">
                <div className="self-stretch flex flex-col items-start justify-start gap-[9px] sm1:self-stretch sm1:w-auto">
                  <div className="self-stretch relative tracking-[0.01em] font-semibold lg:self-stretch lg:w-auto sm1:self-stretch sm1:w-auto">
                    Select Order Type
                  </div>
                  <div className="flex gap-4">
                    <label>
                      <input
                        type="radio"
                        value="dineIn"
                        checked={orderType === "dineIn"}
                        onChange={handleOrderTypeChange}
                        className="mr-2"
                      />
                      Dine In
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="delivery"
                        checked={orderType === "delivery"}
                        onChange={handleOrderTypeChange}
                        className="mr-2"
                      />
                      Delivery
                    </label>
                  </div>
                </div>

                {orderType === "dineIn" ? (
                  <>
                    <div className="self-stretch flex flex-col items-start justify-start gap-[9px] sm1:self-stretch sm1:w-auto">
                      <div className="self-stretch relative tracking-[0.01em] font-semibold lg:self-stretch lg:w-auto sm1:self-stretch sm1:w-auto">
                        Insert Your Table Number
                      </div>
                      <textarea
                        value={address}
                        placeholder="Table No."
                        onChange={(e) => setAddress(e.target.value)}
                        className="border-gray-300 p-2 border-[1px] border-solid bg-[transparent] [outline:none] self-stretch rounded-6xs box-border h-[40px]"
                      />
                    </div>
                    <div className="self-stretch flex flex-col items-start justify-start gap-[9px] sm1:self-stretch sm1:w-auto">
                      <div className="self-stretch relative tracking-[0.01em] font-semibold lg:self-stretch lg:w-auto sm1:self-stretch sm1:w-auto">
                        Note
                      </div>
                      <textarea
                        value={extraNotes}
                        placeholder="Add Extra Details"
                        onChange={(e) => setExtraNotes(e.target.value)}
                        className="border-gray-300 border-[1px] border-solid bg-[transparent] [outline:none] self-stretch rounded-6xs box-border p-2 h-[40px]"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="self-stretch flex flex-col items-start justify-start gap-[9px] sm1:self-stretch sm1:w-auto">
                      <div className="self-stretch relative tracking-[0.01em] font-semibold lg:self-stretch lg:w-auto sm1:self-stretch sm1:w-auto">
                        Enter Address
                      </div>
                      <textarea
                        value={address}
                        placeholder="Type your address here"
                        onChange={(e) => setAddress(e.target.value)}
                        className="border-gray-300 p-2 border-[1px] border-solid bg-[transparent] [outline:none] self-stretch rounded-6xs box-border h-[40px]"
                      />
                    </div>
                    <div className="self-stretch flex flex-col items-start justify-start gap-[9px] sm1:self-stretch sm1:w-auto">
                      <div className="self-stretch relative tracking-[0.01em] font-semibold lg:self-stretch lg:w-auto sm1:self-stretch sm1:w-auto">
                        Add Extra Notes
                      </div>
                      <textarea
                        value={extraNotes}
                        placeholder="Delivery Details"
                        onChange={(e) => setExtraNotes(e.target.value)}
                        className="border-gray-300 border-[1px] border-solid bg-[transparent] [outline:none] self-stretch rounded-6xs box-border p-2 h-[40px]"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {storeData?.type == "service" && (
              <div className="self-stretch rounded-6xs flex flex-col items-center justify-end py-[15px] px-2.5 gap-[13px] z-[1]">
                <div className="self-stretch flex flex-col items-start justify-start gap-[9px] sm1:self-stretch sm1:w-auto">
                  <div className="self-stretch relative tracking-[0.01em] font-semibold lg:self-stretch lg:w-auto sm1:self-stretch sm1:w-auto">
                    Insert Date
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={today} // Prevents selecting a past date
                    className="border-gray-300 p-2 border-[1px] border-solid bg-[transparent] [outline:none] self-stretch rounded-6xs box-border h-[40px]"
                  />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start gap-[9px] sm1:self-stretch sm1:w-auto">
                  <div className="self-stretch relative tracking-[0.01em] font-semibold lg:self-stretch lg:w-auto sm1:self-stretch sm1:w-auto">
                    Insert Time
                  </div>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="border-gray-300 border-[1px] border-solid bg-[transparent] [outline:none] self-stretch rounded-6xs box-border p-2 h-[40px]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Section */}
          <div className="w-full max-w-[440px] sm:max-w-full rounded-lg border border-gray-300 flex flex-col items-center justify-end py-4 px-3 text-sm">
            <div className="w-full flex flex-col items-start justify-start gap-2">
              <div className="w-full text-left font-semibold tracking-wide">
                Order Summary
              </div>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <div
                    key={index}
                    className="w-full border-gray-600 border-b border-dashed flex flex-row items-start justify-between py-2"
                  >
                    <div className="text-left flex-1">
                      {item.productName} ({item.productQuantity})
                    </div>
                    <div className="text-right flex-1">
                      Rs {item.productTotalPrice}
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full text-center">No Products here</div>
              )}
            </div>
          </div>

          {/* Checkout Button */}
          <div className="flex items-center justify-between bg-black text-white px-6 py-3 rounded-[10px] shadow-lg w-[90%] sm:w-[300px]">
            <button
              onClick={handleCheckout}
              className="rounded-md flex-1 text-center font-semibold text-xl sm:text-lg disabled:opacity-50"
              disabled={!userName || !phoneNumber}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>

      {/* Address Popup */}
      {isAddAddressPopupOpen && (
        <PortalPopup>
          {/* <AddAddress */}
          <DineInComponent
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
