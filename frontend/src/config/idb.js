import { openDB } from "idb";

// Open the database
const db = await openDB("myAppDB", 1, {
  upgrade(db) {
    db.createObjectStore("auth", { keyPath: "key" });
  },
});

// Save user data
export async function saveUserInfo(userInfo, token) {
  const db = await openDB("myAppDB", 1);
  await db.put("auth", { key: "userInfo", value: userInfo });
  await db.put("auth", { key: "token", value: token });
}

// Retrieve user data
export async function getUserInfo() {
  const db = await openDB("myAppDB", 1);
  const userInfo = await db.get("auth", "userInfo");
  const token = await db.get("auth", "token");
  return { userInfo: userInfo?.value, token: token?.value };
}
