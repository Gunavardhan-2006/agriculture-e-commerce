import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export * from "./auth-schema";

export const roleEnum = pgEnum("role", [
  "farmer",
  "buyer",
  "transporter",
  "admin",
]);
export const listingStatusEnum = pgEnum("listing_status", [
  "active",
  "paused",
  "sold_out",
  "deleted",
]);
export const orderStatusEnum = pgEnum("order_status", [
  "placed",
  "confirmed",
  "harvest_packing",
  "handed_to_transport",
  "in_transit",
  "delivered",
  "cancelled",
  "partial",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "success",
  "failed",
  "refunded",
]);
export const paymentMethodEnum = pgEnum("payment_method", [
  "upi",
  "card",
  "cod",
]);

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  passwordHash: text("password_hash"),
  role: roleEnum("role").notNull().default("buyer"),
  suspended: boolean("suspended").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const farmerProfiles = pgTable(
  "farmer_profiles",
  {
    userId: varchar("user_id", { length: 36 })
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    fpoName: text("fpo_name"),
    village: text("village").notNull(),
    district: text("district").notNull(),
    state: text("state").notNull(),
    pincode: varchar("pincode", { length: 10 }).notNull(),
    lat: real("lat").notNull(),
    lng: real("lng").notNull(),
    upiId: text("upi_id"),
    ratingAvg: real("rating_avg").notNull().default(0),
    ratingCount: integer("rating_count").notNull().default(0),
  },
  (t) => [index("farmer_location_idx").on(t.lat, t.lng)],
);
export const buyerProfiles = pgTable(
  "buyer_profiles",
  {
    userId: varchar("user_id", { length: 36 })
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    buyerType: varchar("buyer_type", { length: 20 }).notNull(),
    defaultAddress: text("default_address").notNull(),
    lat: real("lat").notNull(),
    lng: real("lng").notNull(),
  },
  (t) => [index("buyer_location_idx").on(t.lat, t.lng)],
);
export const transporterProfiles = pgTable("transporter_profiles", {
  userId: varchar("user_id", { length: 36 })
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  vehicleType: text("vehicle_type").notNull(),
  capacityKg: integer("capacity_kg").notNull(),
  serviceRegion: text("service_region").notNull(),
});
export const produceCategories = pgTable("produce_categories", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull().unique(),
  unitOptions: jsonb("unit_options").notNull(),
});
export const listings = pgTable(
  "listings",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    farmerId: varchar("farmer_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    categoryId: varchar("category_id", { length: 36 })
      .notNull()
      .references(() => produceCategories.id, { onDelete: "restrict" }),
    variety: text("variety").notNull(),
    quantityValue: real("quantity_value").notNull(),
    quantityUnit: varchar("quantity_unit", { length: 12 }).notNull(),
    qualityGrade: varchar("quality_grade", { length: 12 }).notNull(),
    imageUrl: text("image_url"),
    pricePerUnit: real("price_per_unit").notNull(),
    suggestedPricePerUnit: real("suggested_price_per_unit").notNull(),
    minOrderQty: real("min_order_qty").notNull(),
    harvestDate: timestamp("harvest_date").notNull(),
    availableFrom: timestamp("available_from").notNull(),
    availableUntil: timestamp("available_until").notNull(),
    deliveryOptions: jsonb("delivery_options").notNull(),
    status: listingStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("listing_category_idx").on(t.categoryId),
    index("listing_status_idx").on(t.status),
  ],
);
export const orders = pgTable(
  "orders",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    buyerId: varchar("buyer_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    status: orderStatusEnum("status").notNull().default("placed"),
    subtotal: real("subtotal").notNull(),
    logisticsFee: real("logistics_fee").notNull(),
    platformFee: real("platform_fee").notNull(),
    total: real("total").notNull(),
    deliveryAddress: text("delivery_address").notNull(),
    deliverySlot: text("delivery_slot").notNull(),
    idempotencyKey: text("idempotency_key").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("order_idempotency_idx").on(t.idempotencyKey)],
);
export const orderItems = pgTable("order_items", {
  id: varchar("id", { length: 36 }).primaryKey(),
  orderId: varchar("order_id", { length: 36 })
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  listingId: varchar("listing_id", { length: 36 })
    .notNull()
    .references(() => listings.id, { onDelete: "restrict" }),
  farmerId: varchar("farmer_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  quantity: real("quantity").notNull(),
  pricePerUnitAtOrder: real("price_per_unit_at_order").notNull(),
});
export const deliveries = pgTable("deliveries", {
  id: varchar("id", { length: 36 }).primaryKey(),
  orderId: varchar("order_id", { length: 36 })
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  transporterId: varchar("transporter_id", { length: 36 }).references(
    () => users.id,
    { onDelete: "set null" },
  ),
  pickupLocation: text("pickup_location").notNull(),
  dropLocation: text("drop_location").notNull(),
  estimatedDistanceKm: real("estimated_distance_km").notNull(),
  estimatedCost: real("estimated_cost").notNull(),
  status: text("status").notNull().default("open"),
  pickedUpAt: timestamp("picked_up_at"),
  deliveredAt: timestamp("delivered_at"),
});
export const payments = pgTable("payments", {
  id: varchar("id", { length: 36 }).primaryKey(),
  orderId: varchar("order_id", { length: 36 })
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  method: paymentMethodEnum("method").notNull(),
  status: paymentStatusEnum("status").notNull(),
  mockReference: text("mock_reference").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const inquiries = pgTable("inquiries", {
  id: varchar("id", { length: 36 }).primaryKey(),
  listingId: varchar("listing_id", { length: 36 })
    .notNull()
    .references(() => listings.id, { onDelete: "restrict" }),
  buyerId: varchar("buyer_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  requestedQty: real("requested_qty").notNull(),
  messageThread: jsonb("message_thread").notNull(),
  status: text("status").notNull().default("open"),
});
export const reviews = pgTable("reviews", {
  id: varchar("id", { length: 36 }).primaryKey(),
  orderId: varchar("order_id", { length: 36 })
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  farmerId: varchar("farmer_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  buyerId: varchar("buyer_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
});
export const regionalPrices = pgTable("regional_prices", {
  id: varchar("id", { length: 36 }).primaryKey(),
  categoryId: varchar("category_id", { length: 36 })
    .notNull()
    .references(() => produceCategories.id, { onDelete: "cascade" }),
  region: text("region").notNull(),
  avgPricePerUnit: real("avg_price_per_unit").notNull(),
  sampleDate: timestamp("sample_date").notNull(),
});
