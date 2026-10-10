CREATE TABLE audit_logs (
	id VARCHAR(36) NOT NULL, 
	salon_id VARCHAR(36) NOT NULL, 
	user_id VARCHAR(36), 
	action VARCHAR(100) NOT NULL, 
	resource_type VARCHAR(50) NOT NULL, 
	resource_id VARCHAR(100), 
	details TEXT, 
	created_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(salon_id) REFERENCES salons (id) ON DELETE CASCADE, 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE SET NULL
);
INSERT INTO "audit_logs" VALUES('0fd36fb5-948b-4f7b-91fb-48e50167b13f','1ae686e1-f1eb-46e6-97f8-c306f3ca2f26','7b131740-8129-4001-b2bc-b216e790f972','INVOICE_CREATED','invoice','4f2d12ef-502e-4eea-8337-47fd26a802fd','Created INV-20261010-0001 for Devendra Mehta total: ₹295.0','2026-10-10 05:26:49.821325');
INSERT INTO "audit_logs" VALUES('af2e0148-7107-4766-9142-c5c5938ed50d','639cccb0-4cd8-40e7-ab58-c5e38dcd0a2a','3a653434-db38-4e29-b13d-284168e3cdcf','INVOICE_CREATED','invoice','bf7f0917-0098-4b3c-bd5f-7f28d171d154','Created INV-20261010-0001 for Walk-in Client total: ₹708.0','2026-10-10 05:38:31.241284');
INSERT INTO "audit_logs" VALUES('0676d52f-b5f1-4ee9-95aa-820bc2f869e0','639cccb0-4cd8-40e7-ab58-c5e38dcd0a2a','3a653434-db38-4e29-b13d-284168e3cdcf','INVOICE_CREATED','invoice','7fa4c376-51b2-42a0-9147-930acba99725','Created INV-20261010-0002 for Walk-in Client total: ₹2124.0','2026-10-10 05:44:37.657952');
CREATE TABLE customers (
	id VARCHAR(36) NOT NULL, 
	salon_id VARCHAR(36) NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	phone VARCHAR(50), 
	email VARCHAR(255), 
	gender VARCHAR(20), 
	notes TEXT, 
	preferences TEXT, 
	total_visits INTEGER, 
	total_spent FLOAT, 
	last_visit_at DATETIME, 
	created_at DATETIME, 
	updated_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(salon_id) REFERENCES salons (id) ON DELETE CASCADE
);
INSERT INTO "customers" VALUES('53026ada-9aa8-4229-82ef-91178e377472','1ae686e1-f1eb-46e6-97f8-c306f3ca2f26','Devendra Mehta','+91 98200 99887',NULL,NULL,NULL,'Low fade with texture, allergic to menthol',1,295.0,'2026-10-10 05:26:49.819820','2026-10-10 05:26:49.577489','2026-10-10 05:26:49.822332');
INSERT INTO "customers" VALUES('eca833e9-10f7-4048-9b6c-4a242b8c5560','ffb7b1be-ba02-4069-ac83-94976cf268f1','smit','+919898204036',NULL,NULL,NULL,NULL,0,0.0,NULL,'2026-10-10 05:37:52.549186','2026-10-10 05:37:52.549186');
CREATE TABLE invoice_items (
	id VARCHAR(36) NOT NULL, 
	invoice_id VARCHAR(36) NOT NULL, 
	item_type VARCHAR(20), 
	service_id VARCHAR(36), 
	product_id VARCHAR(36), 
	name VARCHAR(255) NOT NULL, 
	quantity INTEGER NOT NULL, 
	unit_price FLOAT NOT NULL, 
	subtotal FLOAT NOT NULL, 
	created_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(invoice_id) REFERENCES invoices (id) ON DELETE CASCADE, 
	FOREIGN KEY(service_id) REFERENCES services (id) ON DELETE SET NULL, 
	FOREIGN KEY(product_id) REFERENCES products (id) ON DELETE SET NULL
);
INSERT INTO "invoice_items" VALUES('34385a15-5b58-4551-80ed-9ddb197379d8','4f2d12ef-502e-4eea-8337-47fd26a802fd','service','44b7a5fa-ccf6-4abb-88f0-7f1465448f9b',NULL,'Classic Fade & Styling',1,250.0,250.0,'2026-10-10 05:26:49.823836');
INSERT INTO "invoice_items" VALUES('fb89d7ee-0a2d-49fc-8cc1-4c8fb4b07f32','bf7f0917-0098-4b3c-bd5f-7f28d171d154','service','451f8db0-e1e0-452c-8374-2e00242e9439',NULL,'Classic Fade & Styling',1,250.0,250.0,'2026-10-10 05:38:31.248235');
INSERT INTO "invoice_items" VALUES('28cd3e24-f007-4a98-9fbf-fa1fb7c61918','bf7f0917-0098-4b3c-bd5f-7f28d171d154','service','760dda6e-7aef-4976-8e68-6380027a3a41',NULL,'Executive Haircut & Wash',1,350.0,350.0,'2026-10-10 05:38:31.248235');
INSERT INTO "invoice_items" VALUES('06a1c1ff-4bfe-4812-a5fd-395a5c612726','7fa4c376-51b2-42a0-9147-930acba99725','service','a2992d4e-7595-4841-bdf2-c88d6d680640',NULL,'Keratin Hair Treatment',1,1800.0,1800.0,'2026-10-10 05:44:37.658947');
CREATE TABLE invoices (
	id VARCHAR(36) NOT NULL, 
	salon_id VARCHAR(36) NOT NULL, 
	customer_id VARCHAR(36), 
	customer_name VARCHAR(255) NOT NULL, 
	customer_phone VARCHAR(50), 
	invoice_number VARCHAR(50) NOT NULL, 
	idempotency_key VARCHAR(100), 
	subtotal FLOAT NOT NULL, 
	discount_type VARCHAR(20), 
	discount_value FLOAT, 
	discount_amount FLOAT, 
	tax_rate FLOAT, 
	tax_amount FLOAT, 
	total_amount FLOAT NOT NULL, 
	paid_amount FLOAT NOT NULL, 
	balance_amount FLOAT NOT NULL, 
	status VARCHAR(50), 
	notes TEXT, 
	created_by_id VARCHAR(36), 
	created_at DATETIME, 
	updated_at DATETIME, 
	PRIMARY KEY (id), 
	CONSTRAINT uq_salon_invoice_number UNIQUE (salon_id, invoice_number), 
	FOREIGN KEY(salon_id) REFERENCES salons (id) ON DELETE CASCADE, 
	FOREIGN KEY(customer_id) REFERENCES customers (id) ON DELETE SET NULL, 
	FOREIGN KEY(created_by_id) REFERENCES users (id) ON DELETE SET NULL
);
INSERT INTO "invoices" VALUES('4f2d12ef-502e-4eea-8337-47fd26a802fd','1ae686e1-f1eb-46e6-97f8-c306f3ca2f26','53026ada-9aa8-4229-82ef-91178e377472','Devendra Mehta','+91 98200 99887','INV-20261010-0001','test-idem-key-live-2',250.0,'fixed',0.0,0.0,18.0,45.0,295.0,295.0,0.0,'PAID',NULL,'7b131740-8129-4001-b2bc-b216e790f972','2026-10-10 05:26:49.814821','2026-10-10 05:26:49.814821');
INSERT INTO "invoices" VALUES('bf7f0917-0098-4b3c-bd5f-7f28d171d154','639cccb0-4cd8-40e7-ab58-c5e38dcd0a2a',NULL,'Walk-in Client',NULL,'INV-20261010-0001','idemp_1791610711184_lebv1mo',600.0,'fixed',0.0,0.0,18.0,108.0,708.0,708.0,0.0,'PAID',NULL,'3a653434-db38-4e29-b13d-284168e3cdcf','2026-10-10 05:38:31.234246','2026-10-10 05:38:31.234246');
INSERT INTO "invoices" VALUES('7fa4c376-51b2-42a0-9147-930acba99725','639cccb0-4cd8-40e7-ab58-c5e38dcd0a2a',NULL,'Walk-in Client',NULL,'INV-20261010-0002','idemp_1791611077618_53pidym',1800.0,'fixed',0.0,0.0,18.0,324.0,2124.0,2124.0,0.0,'PAID',NULL,'3a653434-db38-4e29-b13d-284168e3cdcf','2026-10-10 05:44:37.651398','2026-10-10 05:44:37.651398');
CREATE TABLE payments (
	id VARCHAR(36) NOT NULL, 
	salon_id VARCHAR(36) NOT NULL, 
	invoice_id VARCHAR(36) NOT NULL, 
	amount FLOAT NOT NULL, 
	payment_method VARCHAR(50) NOT NULL, 
	reference_id VARCHAR(100), 
	is_verified BOOLEAN, 
	notes TEXT, 
	created_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(salon_id) REFERENCES salons (id) ON DELETE CASCADE, 
	FOREIGN KEY(invoice_id) REFERENCES invoices (id) ON DELETE CASCADE
);
INSERT INTO "payments" VALUES('9e0017ff-dec9-45aa-8acc-02842fb12a86','1ae686e1-f1eb-46e6-97f8-c306f3ca2f26','4f2d12ef-502e-4eea-8337-47fd26a802fd',295.0,'UPI','UPI-REF-TEST-8899',0,NULL,'2026-10-10 05:26:49.824845');
INSERT INTO "payments" VALUES('0f577b4f-3d47-46b1-9cfe-e424091ce75c','639cccb0-4cd8-40e7-ab58-c5e38dcd0a2a','bf7f0917-0098-4b3c-bd5f-7f28d171d154',708.0,'CASH',NULL,0,'Cash in register','2026-10-10 05:38:31.251145');
INSERT INTO "payments" VALUES('a6452c51-3d21-4511-a852-bcc0a9746529','639cccb0-4cd8-40e7-ab58-c5e38dcd0a2a','7fa4c376-51b2-42a0-9147-930acba99725',2124.0,'CASH',NULL,0,'Cash in register','2026-10-10 05:44:37.658947');
CREATE TABLE products (
	id VARCHAR(36) NOT NULL, 
	salon_id VARCHAR(36) NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	sku VARCHAR(100), 
	barcode VARCHAR(100), 
	price FLOAT NOT NULL, 
	cost_price FLOAT, 
	stock_quantity INTEGER, 
	low_stock_threshold INTEGER, 
	is_active BOOLEAN, 
	created_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(salon_id) REFERENCES salons (id) ON DELETE CASCADE
);
CREATE TABLE salon_members (
	id VARCHAR(36) NOT NULL, 
	salon_id VARCHAR(36) NOT NULL, 
	user_id VARCHAR(36) NOT NULL, 
	role VARCHAR(50) NOT NULL, 
	is_active BOOLEAN, 
	created_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(salon_id) REFERENCES salons (id) ON DELETE CASCADE, 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
);
INSERT INTO "salon_members" VALUES('8f244f55-5895-4bc2-b914-d12d3fbe710e','5992f942-6e3d-4706-85e3-4a6f3f17a355','7ba6f427-f620-4f97-837e-9523a024e408','owner',1,'2026-10-10 05:25:38.679588');
INSERT INTO "salon_members" VALUES('dbbb112f-10af-4ab7-b8d5-801bf0fa043d','1ae686e1-f1eb-46e6-97f8-c306f3ca2f26','7b131740-8129-4001-b2bc-b216e790f972','owner',1,'2026-10-10 05:26:49.081057');
INSERT INTO "salon_members" VALUES('b5961df8-8d6c-4d23-b5bf-dc393070aad4','639cccb0-4cd8-40e7-ab58-c5e38dcd0a2a','3a653434-db38-4e29-b13d-284168e3cdcf','owner',1,'2026-10-10 05:32:57.797822');
INSERT INTO "salon_members" VALUES('5e9379ef-8ce3-4775-acf5-2831ad6ad6fc','ffb7b1be-ba02-4069-ac83-94976cf268f1','05f3926b-7f0e-42ae-b1f5-177a8641ae74','owner',1,'2026-10-10 05:37:26.752486');
CREATE TABLE salons (
	id VARCHAR(36) NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	slug VARCHAR(100) NOT NULL, 
	tagline VARCHAR(255), 
	phone VARCHAR(50), 
	email VARCHAR(255), 
	address TEXT, 
	city VARCHAR(100), 
	currency VARCHAR(10), 
	tax_rate FLOAT, 
	tax_name VARCHAR(50), 
	timezone VARCHAR(50), 
	is_active BOOLEAN, 
	created_at DATETIME, 
	updated_at DATETIME, 
	PRIMARY KEY (id)
);
INSERT INTO "salons" VALUES('5992f942-6e3d-4706-85e3-4a6f3f17a355','The Royale Barber Studio','the-royale-barber-studio','Luxury Salon & Grooming Studio',NULL,'verify.owner@salondesk.io',NULL,'Mumbai','₹',18.0,'GST','Asia/Kolkata',1,'2026-10-10 05:25:38.674586','2026-10-10 05:25:38.674586');
INSERT INTO "salons" VALUES('1ae686e1-f1eb-46e6-97f8-c306f3ca2f26','The Royale Barber Studio','the-royale-barber-studio-1','Luxury Salon & Grooming Studio',NULL,'verify.owner2@salondesk.io',NULL,'Mumbai','₹',18.0,'GST','Asia/Kolkata',1,'2026-10-10 05:26:49.080553','2026-10-10 05:26:49.080553');
INSERT INTO "salons" VALUES('639cccb0-4cd8-40e7-ab58-c5e38dcd0a2a','Aura Luxury Grooming Studio','aura-luxury-grooming-studio','Luxury Salon & Grooming Studio','+91 98201 55678','demo.owner@salondesk.io',NULL,'Mumbai','₹',18.0,'GST','Asia/Kolkata',1,'2026-10-10 05:32:57.789789','2026-10-10 05:32:57.789789');
INSERT INTO "salons" VALUES('ffb7b1be-ba02-4069-ac83-94976cf268f1','test','test','Luxury Salon & Grooming Studio','918200623024','salon@gmail.com','bkhbh','ahmedabad','₹',18.0,'GST','Asia/Kolkata',1,'2026-10-10 05:37:26.731910','2026-10-10 05:38:10.377979');
CREATE TABLE service_categories (
	id VARCHAR(36) NOT NULL, 
	salon_id VARCHAR(36) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description VARCHAR(255), 
	icon VARCHAR(50), 
	display_order INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(salon_id) REFERENCES salons (id) ON DELETE CASCADE
);
INSERT INTO "service_categories" VALUES('f39f4f35-cb13-4944-9d56-22ce534001b9','5992f942-6e3d-4706-85e3-4a6f3f17a355','Hair Styling & Cut',NULL,'scissors',1);
INSERT INTO "service_categories" VALUES('4d8fce90-bd89-4a9c-93f3-a04045bde176','5992f942-6e3d-4706-85e3-4a6f3f17a355','Beard & Shave',NULL,'sparkles',2);
INSERT INTO "service_categories" VALUES('76b1a91b-b76a-4e1f-ae98-7e47b25e6316','5992f942-6e3d-4706-85e3-4a6f3f17a355','Facial & Spa',NULL,'smile',3);
INSERT INTO "service_categories" VALUES('69addc2b-2b88-4f4a-bc78-78df594bb1bc','1ae686e1-f1eb-46e6-97f8-c306f3ca2f26','Hair Styling & Cut',NULL,'scissors',1);
INSERT INTO "service_categories" VALUES('4e49ca25-9d64-4bd1-aae6-e0238bf62d99','1ae686e1-f1eb-46e6-97f8-c306f3ca2f26','Beard & Shave',NULL,'sparkles',2);
INSERT INTO "service_categories" VALUES('aa8b4d6f-fe16-479f-a5e8-b854a721a4ba','1ae686e1-f1eb-46e6-97f8-c306f3ca2f26','Facial & Spa',NULL,'smile',3);
INSERT INTO "service_categories" VALUES('3cc1b04a-f23e-4765-b70a-095687354042','639cccb0-4cd8-40e7-ab58-c5e38dcd0a2a','Hair Styling & Cut',NULL,'scissors',1);
INSERT INTO "service_categories" VALUES('1092f133-8221-4978-bd90-38c636c308b1','639cccb0-4cd8-40e7-ab58-c5e38dcd0a2a','Beard & Shave',NULL,'sparkles',2);
INSERT INTO "service_categories" VALUES('d3a943cc-b3bb-47f0-b166-9eec5f1932db','639cccb0-4cd8-40e7-ab58-c5e38dcd0a2a','Facial & Spa',NULL,'smile',3);
INSERT INTO "service_categories" VALUES('14694a3d-b054-4da0-a2b4-4a9dfff8b8f0','ffb7b1be-ba02-4069-ac83-94976cf268f1','Hair Styling & Cut',NULL,'scissors',1);
INSERT INTO "service_categories" VALUES('c2f6ff4c-37dc-47f9-8a61-4b031f4060c2','ffb7b1be-ba02-4069-ac83-94976cf268f1','Beard & Shave',NULL,'sparkles',2);
INSERT INTO "service_categories" VALUES('96de3eef-a17f-4f95-8877-2acd01d93c97','ffb7b1be-ba02-4069-ac83-94976cf268f1','Facial & Spa',NULL,'smile',3);
CREATE TABLE services (
	id VARCHAR(36) NOT NULL, 
	salon_id VARCHAR(36) NOT NULL, 
	category_id VARCHAR(36), 
	name VARCHAR(255) NOT NULL, 
	description TEXT, 
	price FLOAT NOT NULL, 
	duration_minutes INTEGER, 
	is_active BOOLEAN, 
	created_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(salon_id) REFERENCES salons (id) ON DELETE CASCADE, 
	FOREIGN KEY(category_id) REFERENCES service_categories (id) ON DELETE SET NULL
);
INSERT INTO "services" VALUES('995865d9-6286-4617-84d1-7ca3fcb87d4b','5992f942-6e3d-4706-85e3-4a6f3f17a355','f39f4f35-cb13-4944-9d56-22ce534001b9','Executive Haircut & Wash',NULL,350.0,35,1,'2026-10-10 05:25:38.681651');
INSERT INTO "services" VALUES('176185f5-0765-4080-a83e-0dfc195c9b55','5992f942-6e3d-4706-85e3-4a6f3f17a355','f39f4f35-cb13-4944-9d56-22ce534001b9','Classic Fade & Styling',NULL,250.0,30,1,'2026-10-10 05:25:38.681651');
INSERT INTO "services" VALUES('57d2092c-c037-4d8e-979d-c7af0e3f9fb9','5992f942-6e3d-4706-85e3-4a6f3f17a355','4d8fce90-bd89-4a9c-93f3-a04045bde176','Royal Beard Trim & Hot Towel',NULL,200.0,25,1,'2026-10-10 05:25:38.681651');
INSERT INTO "services" VALUES('3efe7f01-dcb7-4c37-b28f-85ff48b228c3','5992f942-6e3d-4706-85e3-4a6f3f17a355','76b1a91b-b76a-4e1f-ae98-7e47b25e6316','Hydra Glow Express Facial',NULL,850.0,45,1,'2026-10-10 05:25:38.681651');
INSERT INTO "services" VALUES('2f439403-9151-498b-ad35-3062ac050613','5992f942-6e3d-4706-85e3-4a6f3f17a355','f39f4f35-cb13-4944-9d56-22ce534001b9','Keratin Hair Treatment',NULL,1800.0,60,1,'2026-10-10 05:25:38.681651');
INSERT INTO "services" VALUES('edf33b96-2428-40a2-bc96-e844ddc40168','1ae686e1-f1eb-46e6-97f8-c306f3ca2f26','69addc2b-2b88-4f4a-bc78-78df594bb1bc','Executive Haircut & Wash',NULL,350.0,35,1,'2026-10-10 05:26:49.082063');
INSERT INTO "services" VALUES('44b7a5fa-ccf6-4abb-88f0-7f1465448f9b','1ae686e1-f1eb-46e6-97f8-c306f3ca2f26','69addc2b-2b88-4f4a-bc78-78df594bb1bc','Classic Fade & Styling',NULL,250.0,30,1,'2026-10-10 05:26:49.082063');
INSERT INTO "services" VALUES('a8675266-f33b-43bf-83f3-6ca3a3549472','1ae686e1-f1eb-46e6-97f8-c306f3ca2f26','4e49ca25-9d64-4bd1-aae6-e0238bf62d99','Royal Beard Trim & Hot Towel',NULL,200.0,25,1,'2026-10-10 05:26:49.082063');
INSERT INTO "services" VALUES('1d374489-f5e3-437c-88fa-f20e8a7409c4','1ae686e1-f1eb-46e6-97f8-c306f3ca2f26','aa8b4d6f-fe16-479f-a5e8-b854a721a4ba','Hydra Glow Express Facial',NULL,850.0,45,1,'2026-10-10 05:26:49.082063');
INSERT INTO "services" VALUES('3a4a1f7d-5c73-458f-a19e-00257a06fe27','1ae686e1-f1eb-46e6-97f8-c306f3ca2f26','69addc2b-2b88-4f4a-bc78-78df594bb1bc','Keratin Hair Treatment',NULL,1800.0,60,1,'2026-10-10 05:26:49.082063');
INSERT INTO "services" VALUES('760dda6e-7aef-4976-8e68-6380027a3a41','639cccb0-4cd8-40e7-ab58-c5e38dcd0a2a','3cc1b04a-f23e-4765-b70a-095687354042','Executive Haircut & Wash',NULL,350.0,35,1,'2026-10-10 05:32:57.798821');
INSERT INTO "services" VALUES('451f8db0-e1e0-452c-8374-2e00242e9439','639cccb0-4cd8-40e7-ab58-c5e38dcd0a2a','3cc1b04a-f23e-4765-b70a-095687354042','Classic Fade & Styling',NULL,250.0,30,1,'2026-10-10 05:32:57.798821');
INSERT INTO "services" VALUES('e7ebe07c-f474-474b-bb71-b3598f9b5d54','639cccb0-4cd8-40e7-ab58-c5e38dcd0a2a','1092f133-8221-4978-bd90-38c636c308b1','Royal Beard Trim & Hot Towel',NULL,200.0,25,1,'2026-10-10 05:32:57.798821');
INSERT INTO "services" VALUES('b37e7dc0-46d3-4c36-9504-37a3952e0904','639cccb0-4cd8-40e7-ab58-c5e38dcd0a2a','d3a943cc-b3bb-47f0-b166-9eec5f1932db','Hydra Glow Express Facial',NULL,850.0,45,1,'2026-10-10 05:32:57.798821');
INSERT INTO "services" VALUES('a2992d4e-7595-4841-bdf2-c88d6d680640','639cccb0-4cd8-40e7-ab58-c5e38dcd0a2a','3cc1b04a-f23e-4765-b70a-095687354042','Keratin Hair Treatment',NULL,1800.0,60,1,'2026-10-10 05:32:57.798821');
INSERT INTO "services" VALUES('dccbdd91-f005-4098-8491-facb92d13e88','ffb7b1be-ba02-4069-ac83-94976cf268f1','14694a3d-b054-4da0-a2b4-4a9dfff8b8f0','Executive Haircut & Wash',NULL,350.0,35,1,'2026-10-10 05:37:26.757007');
INSERT INTO "services" VALUES('4612056a-846b-4bd6-8e44-2e8d294c6c63','ffb7b1be-ba02-4069-ac83-94976cf268f1','14694a3d-b054-4da0-a2b4-4a9dfff8b8f0','Classic Fade & Styling',NULL,250.0,30,1,'2026-10-10 05:37:26.757007');
INSERT INTO "services" VALUES('d82b0632-bddb-419f-be4a-095dfa057e38','ffb7b1be-ba02-4069-ac83-94976cf268f1','c2f6ff4c-37dc-47f9-8a61-4b031f4060c2','Royal Beard Trim & Hot Towel',NULL,200.0,25,1,'2026-10-10 05:37:26.757007');
INSERT INTO "services" VALUES('519fb5e7-3c52-458f-a617-2ae4a371fa46','ffb7b1be-ba02-4069-ac83-94976cf268f1','96de3eef-a17f-4f95-8877-2acd01d93c97','Hydra Glow Express Facial',NULL,850.0,45,1,'2026-10-10 05:37:26.757007');
INSERT INTO "services" VALUES('5896f30c-93fa-4a6b-9e18-a4bd18467235','ffb7b1be-ba02-4069-ac83-94976cf268f1','14694a3d-b054-4da0-a2b4-4a9dfff8b8f0','Keratin Hair Treatment',NULL,1800.0,60,1,'2026-10-10 05:37:26.757007');
CREATE TABLE subscriptions (
	id VARCHAR(36) NOT NULL, 
	salon_id VARCHAR(36) NOT NULL, 
	plan_id VARCHAR(50) NOT NULL, 
	plan_name VARCHAR(100), 
	status VARCHAR(50) NOT NULL, 
	billing_cycle VARCHAR(20), 
	amount FLOAT, 
	current_period_start DATETIME, 
	current_period_end DATETIME, 
	is_dev_mode BOOLEAN, 
	max_staff INTEGER, 
	max_invoices_per_month INTEGER, 
	created_at DATETIME, 
	updated_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(salon_id) REFERENCES salons (id) ON DELETE CASCADE
);
INSERT INTO "subscriptions" VALUES('4a6c99cf-92e6-49f1-a820-7459dcdd002c','5992f942-6e3d-4706-85e3-4a6f3f17a355','pro','Pro Growth','trial','monthly',699.0,'2026-10-10 05:25:38.678589','2026-10-24 05:25:38.678589',1,5,1000,'2026-10-10 05:25:38.678589','2026-10-10 05:25:38.678589');
INSERT INTO "subscriptions" VALUES('5bb5c501-0207-4352-aef7-f7553a8662af','1ae686e1-f1eb-46e6-97f8-c306f3ca2f26','pro','Pro Growth','trial','monthly',699.0,'2026-10-10 05:26:49.081057','2026-10-24 05:26:49.081057',1,5,1000,'2026-10-10 05:26:49.081057','2026-10-10 05:26:49.081057');
INSERT INTO "subscriptions" VALUES('41ced0a6-e233-4196-8841-cdb559bb83c3','639cccb0-4cd8-40e7-ab58-c5e38dcd0a2a','pro','Pro Growth','trial','monthly',699.0,'2026-10-10 05:32:57.796819','2026-10-24 05:32:57.796819',1,5,1000,'2026-10-10 05:32:57.796819','2026-10-10 05:32:57.796819');
INSERT INTO "subscriptions" VALUES('efc73676-8ec5-43a7-bfa9-f47407af0b72','ffb7b1be-ba02-4069-ac83-94976cf268f1','pro','Pro Growth','trial','monthly',699.0,'2026-10-10 05:37:26.749957','2026-10-24 05:37:26.749957',1,5,1000,'2026-10-10 05:37:26.749957','2026-10-10 05:37:26.749957');
CREATE TABLE users (
	id VARCHAR(36) NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	hashed_password VARCHAR(255), 
	full_name VARCHAR(255) NOT NULL, 
	phone VARCHAR(50), 
	avatar_url VARCHAR(500), 
	is_active BOOLEAN, 
	is_superuser BOOLEAN, 
	created_at DATETIME, 
	updated_at DATETIME, 
	PRIMARY KEY (id)
);
INSERT INTO "users" VALUES('7ba6f427-f620-4f97-837e-9523a024e408','verify.owner@salondesk.io','$2b$12$.IUMd3NFaO34ic09549itefCUQ573e9RpQ8B1YZRFPGSUyfx0UFpG','Aarav Singhania',NULL,NULL,1,0,'2026-10-10 05:25:38.668370','2026-10-10 05:25:38.668370');
INSERT INTO "users" VALUES('7b131740-8129-4001-b2bc-b216e790f972','verify.owner2@salondesk.io','$2b$12$912xpjkg2BpzUVzrEgb.i.8ij36epPtyBVpT2wORly3LjNTczhGOK','Aarav Singhania',NULL,NULL,1,0,'2026-10-10 05:26:49.077642','2026-10-10 05:26:49.077642');
INSERT INTO "users" VALUES('3a653434-db38-4e29-b13d-284168e3cdcf','demo.owner@salondesk.io','$2b$12$1gSC26.ZBN44mAhmC7VRUei14y0DoGcx1.VO8YiqcgFN0CSDRKk9m','Alexander Sterling','+91 98201 55678',NULL,1,0,'2026-10-10 05:32:57.775738','2026-10-10 05:32:57.775738');
INSERT INTO "users" VALUES('05f3926b-7f0e-42ae-b1f5-177a8641ae74','salon@gmail.com','$2b$12$pBYuMpz8rJLNOYJgBRFDduMJdXufbEk/SP5Vnhw978oyfXM.b/aei','test','918200623024',NULL,1,0,'2026-10-10 05:37:26.711802','2026-10-10 05:37:26.711802');
CREATE UNIQUE INDEX ix_salons_slug ON salons (slug);
CREATE UNIQUE INDEX ix_users_email ON users (email);
CREATE INDEX ix_salon_members_salon_id ON salon_members (salon_id);
CREATE INDEX ix_salon_members_user_id ON salon_members (user_id);
CREATE INDEX ix_customers_name ON customers (name);
CREATE INDEX ix_customers_salon_id ON customers (salon_id);
CREATE INDEX ix_customers_phone ON customers (phone);
CREATE INDEX ix_service_categories_salon_id ON service_categories (salon_id);
CREATE INDEX ix_products_name ON products (name);
CREATE INDEX ix_products_sku ON products (sku);
CREATE INDEX ix_products_salon_id ON products (salon_id);
CREATE UNIQUE INDEX ix_subscriptions_salon_id ON subscriptions (salon_id);
CREATE INDEX ix_audit_logs_action ON audit_logs (action);
CREATE INDEX ix_audit_logs_created_at ON audit_logs (created_at);
CREATE INDEX ix_audit_logs_salon_id ON audit_logs (salon_id);
CREATE INDEX ix_services_salon_id ON services (salon_id);
CREATE INDEX ix_services_name ON services (name);
CREATE INDEX ix_invoices_invoice_number ON invoices (invoice_number);
CREATE INDEX ix_invoices_created_at ON invoices (created_at);
CREATE INDEX ix_invoices_idempotency_key ON invoices (idempotency_key);
CREATE INDEX ix_invoices_customer_id ON invoices (customer_id);
CREATE INDEX ix_invoices_status ON invoices (status);
CREATE INDEX ix_invoices_salon_id ON invoices (salon_id);
CREATE INDEX ix_invoice_items_invoice_id ON invoice_items (invoice_id);
CREATE INDEX ix_payments_created_at ON payments (created_at);
CREATE INDEX ix_payments_salon_id ON payments (salon_id);
CREATE INDEX ix_payments_invoice_id ON payments (invoice_id);
