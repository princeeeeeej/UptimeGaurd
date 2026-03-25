import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
  text,
  real,
} from "drizzle-orm/pg-core";


export const monitors = pgTable("monitors", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(), 
  url: varchar("url", { length: 2048 }).notNull(),        
  name: varchar("name", { length: 255 }).notNull(),       
  interval: integer("interval").default(60).notNull(),     
  isActive: boolean("is_active").default(true).notNull(),  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


export const pingResults = pgTable("ping_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  monitorId: uuid("monitor_id")
    .references(() => monitors.id, { onDelete: "cascade" })
    .notNull(),
  statusCode: integer("status_code"), 
  responseTime: real("response_time"),             
  isUp: boolean("is_up").notNull(),                 
  errorMessage: text("error_message"),              
  checkedAt: timestamp("checked_at").defaultNow().notNull(),
});


export const incidents = pgTable("incidents", {
  id: uuid("id").defaultRandom().primaryKey(),
  monitorId: uuid("monitor_id")
    .references(() => monitors.id, { onDelete: "cascade" })
    .notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),           
  cause: text("cause"),                             
});


export const alertChannels = pgTable("alert_channels", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),   
  target: varchar("target", { length: 500 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rootCauseAnalyses = pgTable("root_cause_analyses", {
  id: uuid("id").defaultRandom().primaryKey(),
  incidentId: uuid("incident_id")
    .references(() => incidents.id)
    .notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  description: text("description").notNull(),
  suggestion: text("suggestion").notNull(),
  technicalDetail: text("technical_detail"),
  analyzedAt: timestamp("analyzed_at").defaultNow().notNull(),
});

// Add to schema.ts
export const sslChecks = pgTable("ssl_checks", {
  id: uuid("id").defaultRandom().primaryKey(),
  monitorId: uuid("monitor_id")
    .references(() => monitors.id, { onDelete: "cascade" })
    .notNull(),
  isValid: boolean("is_valid").notNull(),
  issuer: varchar("issuer", { length: 255 }),
  validFrom: timestamp("valid_from"),
  validTo: timestamp("valid_to"),
  daysUntilExpiry: integer("days_until_expiry"),
  protocol: varchar("protocol", { length: 50 }),
  warning: text("warning"),
  checkedAt: timestamp("checked_at").defaultNow().notNull(),
});