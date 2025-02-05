import { useState, useCallback } from "react";
import AddAddress from "../../components/user/AddAddress";
import PortalPopup from "../../components/PortalPopup";
import { useLocation } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isAddAddressPopupOpen, setAddAddressPopupOpen] = useState(false);
  const [address, setAddress] = useState("");
  const { items, totalPrice } = location.state || { items: [], totalPrice };
  console.log("Items in checkout: ", items);
  // console.log(name);
  // console.log(quantity);
  console.log("Total Price; ", totalPrice);
  // console.log(productImage);

  const openAddAddressPopup = useCallback(() => {
    setAddAddressPopupOpen(true);
  }, []);

  const closeAddAddressPopup = useCallback(() => {
    setAddAddressPopupOpen(false);
  }, []);

  const handleCheckout = () => {
    if (!userName || !phoneNumber || !address) {
      alert("Please fill in all required fields!");
      return;
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      alert("Phone number should be exactly 10 digits.");
      return;
    }

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

    const whatsappUrl = `https://wa.me/9849432199?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <div className="w-full relative bg-white overflow-hidden flex flex-col items-center justify-center py-[60px] px-0 box-border text-left text-mini1 text-black font-poppins">
        <div className="w-[480px] flex flex-col items-center justify-center gap-[17px] sm1:self-stretch sm1:w-auto sm1:pl-[30px] sm1:pr-[30px] sm1:box-border">
          <div className="self-stretch flex flex-col items-start justify-start gap-2.5 text-xl text-gray-700">
            <div className="w-[480px] bg-white h-[30px] overflow-hidden shrink-0 flex flex-row items-start justify-start py-0 px-2.5 box-border">
              <b className="flex-1 relative tracking-[0.01em] lg:flex-1 sm1:flex-1">
                Checkout
              </b>
            </div>
            <div className="w-[480px] bg-white h-[30px] overflow-hidden shrink-0 flex flex-row items-start justify-start py-0 px-2.5 box-border text-black">
              <b className="w-[1420px] relative tracking-[0.01em] inline-block shrink-0 lg:flex-1 sm1:flex-1">
                Samparka’s Store
              </b>
            </div>
          </div>
          <div className="self-stretch rounded-6xs1 border-gray-1000 border-[1px] border-solid flex flex-col items-start justify-start py-5 px-[15px] gap-2.5 text-xs">
            <div className="self-stretch bg-white overflow-hidden flex flex-row items-start justify-start py-0 px-2.5 text-mini1">
              <div className="flex-1 relative tracking-[0.01em] lg:flex-1 sm1:flex-1">
                Customer*
              </div>
            </div>
            <form action="">
              <div className="self-stretch bg-white overflow-hidden flex flex-col items-start justify-start py-[7px] px-2.5 gap-[3px]">
                <div className="relative tracking-[0.01em]">Name</div>
                <input
                  className="border-gray-300 border-[1px] border-solid [outline:none] bg-[transparent] self-stretch rounded-6xs1 flex flex-row items-start justify-start p-2.5"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div className="self-stretch bg-white overflow-hidden flex flex-col items-start justify-start py-[7px] px-2.5 gap-[3px]">
                <div className="relative tracking-[0.01em]">
                  WhatsApp Number
                </div>
                <div className="self-stretch flex flex-row items-start justify-start gap-2.5">
                  {/* <input
                  className="border-gray-300 border-[1px] border-solid [outline:none] bg-[transparent] w-[65px] rounded-6xs1 box-border flex flex-row items-start justify-start p-2.5"
                  type="text"
                /> */}
                  <span className="bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-700 rounded-l-md">
                    +977
                  </span>
                  <input
                    className="border-gray-300 border-[1px] border-solid [outline:none] bg-[transparent] flex-1 rounded-6xs1 flex flex-row items-start justify-start p-2.5"
                    type="number"
                    id="phone"
                    name="phone"
                    placeholder="Enter your whatsapp number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="self-stretch rounded-6xs1 border-gray-300 border-[1px] border-solid flex flex-col items-start justify-start py-5 px-2.5 gap-2.5">
            <div className="self-stretch bg-white overflow-hidden flex flex-row items-start justify-start py-0 px-2.5">
              <div className="flex-1 relative tracking-[0.01em] lg:flex-1 sm1:flex-1">
                Items
              </div>
            </div>
            {items.length > 0 ? (
              items.map((item, index) => (
                <div
                  key={index}
                  className="self-stretch border-gray-300 border-b-[1px] flex items-center gap-4 p-4"
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium">{item.productName}</div>
                    <div>Quantity: {item.productQuantity}</div>
                    <div>Price: Rs {item.productTotalPrice}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center">
                No items in your cart.
              </div>
            )}
          </div>
          <div className="self-stretch rounded-6xs1 border-gray-300 border-[1px] border-solid flex flex-col items-start justify-start py-5 px-2.5 gap-[13px]">
            <div className="self-stretch bg-white overflow-hidden flex flex-row items-start justify-start py-0 px-2.5">
              <div className="flex-1 relative tracking-[0.01em] lg:flex-1 sm1:flex-1">
                Items
              </div>
            </div>
            <div className="self-stretch border-gray-300 border-b-[1px] border-solid flex flex-row items-start justify-start p-2.5 text-sm lg:self-stretch lg:w-auto">
              <div className="flex-1 flex flex-col items-start justify-start gap-[5px] sm1:flex-1">
                <div className="self-stretch relative tracking-[0.01em] font-semibold lg:self-stretch lg:w-auto sm1:self-stretch sm1:w-auto">
                  Delivery
                </div>
                <div className="self-stretch relative tracking-[0.01em] whitespace-pre-wrap lg:self-stretch lg:w-auto sm1:self-stretch sm1:w-auto">{`Flat Fee of NPR 100.00`}</div>
              </div>
            </div>
            <button
              className="cursor-pointer border-gray-300 border-[1px] border-solid p-2.5 bg-[transparent] self-stretch rounded-6xs1 flex flex-row items-center justify-center gap-[3px]"
              onClick={openAddAddressPopup}
            >
              <img
                className="w-5 relative h-[18.8px] overflow-hidden shrink-0"
                alt=""
                src="/ulocationpoint.svg"
              />
              <div className="relative text-xs tracking-[0.01em] font-poppins text-black text-center">
                Enter Address
              </div>
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
                    <div  key={index} className="self-stretch border-gray-600 border-b-[1px] border-dashed flex flex-row items-start justify-start py-[7px] px-0 gap-[5px]">
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
                <div>
                  No Products here
                </div>
              )}

              <div className="self-stretch border-gray-600 border-b-[1px] border-dashed flex flex-row items-start justify-start py-[7px] px-0 gap-[5px]">
                <div className="flex-1 relative tracking-[0.01em] lg:flex-1 sm1:flex-1">
                  Discount(10%)
                </div>
                <div className="flex-1 relative tracking-[0.01em] text-right lg:flex-1 sm1:flex-1">
                  Rs 60.00
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleCheckout()}
            className="cursor-pointer border-black border-[1px] border-solid py-2.5 px-[3px] bg-darkslategray-300 self-stretch rounded-6xs box-border h-auto flex flex-row items-center justify-center max-w-full sm:h-auto sm:rounded-6xs sm:pl-0 sm:pr-0 sm:box-border"
            disabled={!userName || !phoneNumber || !address}
          >
            <div className="flex-1 relative text-sm tracking-[0.01em] font-semibold font-poppins text-black text-center sm:flex-1 sm:text-sm sm:self-stretch sm:h-auto">
              Confirm
            </div>
          </button>
        </div>
      </div>

      {isAddAddressPopupOpen && (
        <PortalPopup>
          <AddAddress
            closePopup={closeAddAddressPopup}
            onAddressChange={setAddress}
          />
        </PortalPopup>
      )}
    </>
  );
};

export default Checkout;
