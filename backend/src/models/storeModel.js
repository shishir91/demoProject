import mongoose from "mongoose";

const loyaltySchema = new mongoose.Schema({
  logo: {
    type: String,
    default:
      "https://res.cloudinary.com/spyc/image/upload/v1737542135/SAMPARKA_ynzpeq.png",
  },
  bgColor: { type: String, default: "#000000" },
  textColor: { type: String, default: "#001001" },
  cardColor: { type: String, default: "#FFFFFF" },
  stampColor: { type: String, default: "#2f6a4f" },
  stamp: { type: String, default: "thumbsUp" },
  customStamp: { type: String },
});

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    logo: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    email: { type: String },
    pass: { type: String },
    loyaltyCard: { type: loyaltySchema, default: () => ({}) },
    status: {
      type: String,
      enum: ["active", "deactive"],
      default: "active",
    },
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Store", storeSchema);
