import {
  API_BASE_URL,
  apiRequest,
  asArray,
  safeRequest,
} from "@/lib/api/config";
import { itemId, itemPrice } from "@/lib/utils";


export const demoMenuItems = [
  {
    id: "demo-margherita",
    name: "Margherita Classic",
    description:
      "San Marzano tomato, fresh mozzarella, basil and a drizzle of extra virgin olive oil.",
    price: 12.99,
    category: "Classic",
    image: null,
    rating: 4.8,
    reviewCount: 124,
    vendorName: "Napoli Slice",
    location: "Downtown",
    isPremium: false,
    isFeatured: true,
    status: "approved",
    isAvailable: true,
    prepTime: 20,
  },
  {
    id: "demo-pepperoni",
    name: "Pepperoni Inferno",
    description:
      "Double pepperoni, chili flakes, smoked mozzarella and our signature hot honey.",
    price: 15.99,
    category: "Pepperoni",
    image: null,
    rating: 4.9,
    reviewCount: 310,
    vendorName: "Napoli Slice",
    location: "Downtown",
    isPremium: true,
    isFeatured: true,
    status: "approved",
    isAvailable: true,
    prepTime: 22,
  },
  {
    id: "demo-bbq-chicken",
    name: "BBQ Chicken Ranch",
    description:
      "Grilled chicken, smoky BBQ sauce, red onion and cool ranch drizzle.",
    price: 16.49,
    category: "Chicken",
    image: null,
    rating: 4.7,
    reviewCount: 198,
    vendorName: "Firewood Oven",
    location: "Riverside",
    isPremium: false,
    isFeatured: true,
    status: "approved",
    isAvailable: true,
    prepTime: 25,
  },
  {
    id: "demo-truffle",
    name: "Truffle Mushroom",
    description:
      "Wild mushrooms, truffle cream, fontina and crispy thyme on a sourdough base.",
    price: 18.99,
    category: "Vegetarian",
    image: null,
    rating: 4.8,
    reviewCount: 86,
    vendorName: "Firewood Oven",
    location: "Riverside",
    isPremium: true,
    isFeatured: true,
    status: "approved",
    isAvailable: true,
    prepTime: 28,
  },
  {
    id: "demo-four-cheese",
    name: "Four Cheese Fondue",
    description:
      "Mozzarella, gorgonzola, parmesan and smoked provola with a honey finish.",
    price: 14.99,
    category: "Cheese",
    image: null,
    rating: 4.6,
    reviewCount: 142,
    vendorName: "Crust & Co.",
    location: "Midtown",
    isPremium: false,
    isFeatured: true,
    status: "approved",
    isAvailable: true,
    prepTime: 18,
  },
  {
    id: "demo-veggie",
    name: "Garden Veggie Supreme",
    description:
      "Roasted peppers, zucchini, cherry tomato, olives and basil pesto.",
    price: 13.99,
    category: "Vegetarian",
    image: null,
    rating: 4.5,
    reviewCount: 97,
    vendorName: "Crust & Co.",
    location: "Midtown",
    isPremium: false,
    isFeatured: true,
    status: "approved",
    isAvailable: true,
    prepTime: 20,
  },
  {
    id: "demo-hawaiian",
    name: "Hawaiian Sunset",
    description:
      "Smoked ham, caramelised pineapple, mozzarella and a touch of chili.",
    price: 14.49,
    category: "Classic",
    image: null,
    rating: 4.4,
    reviewCount: 73,
    vendorName: "Slice Station",
    location: "Harbor",
    isPremium: false,
    isFeatured: false,
    status: "approved",
    isAvailable: true,
    prepTime: 21,
  },
  {
    id: "demo-meat-lovers",
    name: "Meat Lovers Feast",
    description:
      "Pepperoni, Italian sausage, bacon, smoked ham and mozzarella.",
    price: 19.99,
    category: "Pepperoni",
    image: null,
    rating: 4.9,
    reviewCount: 265,
    vendorName: "Slice Station",
    location: "Harbor",
    isPremium: true,
    isFeatured: false,
    status: "approved",
    isAvailable: true,
    prepTime: 27,
  },
  {
    id: "demo-shrimp-pesto",
    name: "Shrimp Pesto",
    description:
      "Garlic shrimp, basil pesto, cherry tomatoes and lemon zest.",
    price: 21.49,
    category: "Seafood",
    image: null,
    rating: 4.7,
    reviewCount: 61,
    vendorName: "Harbor Pie",
    location: "Harbor",
    isPremium: true,
    isFeatured: false,
    status: "approved",
    isAvailable: true,
    prepTime: 26,
  },
  {
    id: "demo-tuna",
    name: "Tuna & Caper",
    description:
      "Olive-oil tuna, capers, red onion and mozzarella on a thin crust.",
    price: 17.25,
    category: "Seafood",
    image: null,
    rating: 4.3,
    reviewCount: 44,
    vendorName: "Harbor Pie",
    location: "Harbor",
    isPremium: false,
    isFeatured: false,
    status: "approved",
    isAvailable: true,
    prepTime: 24,
  },
];

export const PIZZA_CATEGORIES = [
  {
    name: "Classic",
    emoji: "🍕",
    blurb: "Timeless tomato, mozzarella and basil.",
    accent: "from-red-500/20 to-orange-400/20",
  },
  {
    name: "Pepperoni",
    emoji: "🌶️",
    blurb: "Spicy slices with a serious pepperoni pull.",
    accent: "from-orange-500/20 to-amber-400/20",
  },
  {
    name: "Vegetarian",
    emoji: "🥬",
    blurb: "Garden fresh toppings, bold and bright.",
    accent: "from-emerald-500/20 to-lime-400/20",
  },
  {
    name: "Cheese",
    emoji: "🧀",
    blurb: "Melted, stretchy, four-cheese comfort.",
    accent: "from-yellow-500/20 to-amber-300/20",
  },
  {
    name: "Chicken",
    emoji: "🍗",
    blurb: "Grilled chicken with smoky sauces.",
    accent: "from-amber-500/20 to-orange-300/20",
  },
  {
    name: "Seafood",
    emoji: "🦐",
    blurb: "Coastal flavours from the wood oven.",
    accent: "from-sky-500/20 to-cyan-300/20",
  },
];

export function normalizeMenuItem(item) {
  if (!item) return null;
  return {
    ...item,
    id: itemId(item),
    price: itemPrice(item),
    name: item.name || item.title || "Untitled pizza",
    category: item.category || item.type || "Classic",
    image: item.image || item.imageUrl || item.thumbnail || null,
    rating: Number(item.rating ?? item.averageRating ?? 0),
    reviewCount: Number(item.reviewCount ?? item.reviewsCount ?? 0),
    vendorName:
      item.vendorName ||
      item.vendor?.restaurantName ||
      item.vendor?.name ||
      item.restaurantName ||
      "PizzaHub vendor",
    location:
      item.location || item.vendor?.location || item.city || "Anywhere",
    isPremium: Boolean(
      item.isPremium ||
        item.premium ||
        item.vendorPlan === "premium" ||
        item.vendor?.plan === "premium",
    ),
    isFeatured: Boolean(item.isFeatured ?? item.featured),
    status: item.status || (item.isApproved ? "approved" : "pending"),
    isAvailable:
      item.isAvailable ?? item.available ?? item.status !== "unavailable",
  };
}


export async function getMenuItems(params = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  }
  const suffix = query.size ? `?${query.toString()}` : "";
  const payload = await safeRequest(`/menu${suffix}`, {}, null);
  const list = asArray(payload, ["menu", "menuItems", "pizzas"]);
  if (!list.length) return demoMenuItems.map(normalizeMenuItem);
  return list.map(normalizeMenuItem);
}


export async function getMenuItem(id) {
  const payload = await safeRequest(`/menu/${encodeURIComponent(id)}`, {}, null);
  const item =
    payload?.data ||
    payload?.item ||
    payload?.menuItem ||
    payload ||
    demoMenuItems.find((entry) => entry.id === id) ||
    null;
  return normalizeMenuItem(item);
}


export async function getMenuItemReviews(id) {
  const payload = await safeRequest(
    `/menu/${encodeURIComponent(id)}/reviews`,
    {},
    null,
  );
  return asArray(payload, ["reviews"]);
}

/** Client-side helper used by ReviewSection. to fetch */
export async function fetchMenuItemReviews(id) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/menu/${encodeURIComponent(id)}/reviews`,
      { cache: "no-store" },
    );
    if (!response.ok) return [];
    const payload = await response.json().catch(() => null);
    return asArray(payload, ["reviews"]);
  } catch {
    return [];
  }
}


export async function postMenuItemReview(id, review, token) {
  return apiRequest(`/menu/${encodeURIComponent(id)}/reviews`, {
    method: "POST",
    body: review,
    token,
  });
}


export async function getVendorMenuItems(vendorId, token) {
  const payload = await safeRequest(
    `/menu/vendor/${encodeURIComponent(vendorId)}`,
    { token },
    null,
  );
  return asArray(payload, ["menu", "menuItems", "pizzas"]).map(
    normalizeMenuItem,
  );
}


export async function getAdminMenuItems(params = {}, token) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  }
  const suffix = query.size ? `?${query.toString()}` : "";
  const payload = await safeRequest(
    `/admin/menu${suffix}`,
    { token },
    null,
  );
  return asArray(payload, ["menu", "menuItems", "pizzas"]).map(
    normalizeMenuItem,
  );
}
