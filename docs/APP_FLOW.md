# 📄 APP FLOW DOCUMENTATION (APP_FLOW.md)
## 🛒 Multi-Vendor E-commerce Platform with Payment & AI Features

---

## 0. App Description

A multi-vendor e-commerce platform where sellers can list products and customers can browse, add to cart, and purchase products using a secure payment gateway, with AI-based recommendations.

---

## 1. Entry Points

- Direct URL access (homepage `/`)
- Login page `/login`
- Signup page `/signup`
- Product page via shared link `/product/:id`
- Admin panel `/admin` (restricted)
- Session restore (auto-login if token valid)

---

## 2. Core User Flows

---

### 🔐 Flow 1: Onboarding / Registration

#### ✅ Happy Path
- `/signup` → Form (name, email, password, role)
- User enters valid data → Click "Sign Up"
- System validates → Creates account → Redirect to `/login`
- User logs in → Redirect to `/dashboard`

#### ❌ Error States
- Invalid email → "Please enter a valid email address"
- Weak password (<6 chars) → "Password must be at least 6 characters"
- Existing user → "Account already exists"
- Server error → "Something went wrong. Try again"

#### ⚠️ Edge Cases
- User refreshes page → form resets
- User leaves midway → no data saved
- Session expires → redirect to login

---

### 🛍️ Flow 2: Product Browsing & Purchase

#### ✅ Happy Path
- `/` → Product list displayed
- User clicks product → `/product/:id`
- Click "Add to Cart" → Cart updates
- Navigate to `/cart`
- Click "Checkout" → `/checkout`
- Complete payment → `/order-success`

#### ❌ Error States
- Product not found → "Product unavailable"
- Add to cart fails → "Unable to add item"
- Payment failed → "Payment failed. Try again"

#### ⚠️ Edge Cases
- Cart empty → disable checkout
- Network loss → show retry option
- Duplicate clicks → prevent multiple orders

---

### 🧑‍💼 Flow 3: Seller Product Management

#### ✅ Happy Path
- `/dashboard` → Seller panel
- Click "Add Product" → `/add-product`
- Enter details → Submit
- Product saved → visible on homepage

#### ❌ Error States
- Missing fields → "All fields are required"
- Invalid price → "Enter a valid price"
- Upload failure → "Image upload failed"

#### ⚠️ Edge Cases
- Duplicate product → allowed but flagged
- Session expired → redirect to login

---

### ⚙️ Flow 4: Account Management

#### ✅ Happy Path
- `/profile` → View details
- Edit info → Save changes
- Changes reflected instantly

#### ❌ Error States
- Invalid input → show validation error
- Save failure → "Update failed"

#### ⚠️ Edge Cases
- Unauthorized access → redirect login

---

### 🔁 Flow 5: Error Recovery

#### ✅ Happy Path
- Error occurs → message displayed
- User retries → action successful

#### ❌ Error States
- Persistent failure → suggest refresh
- Server down → show fallback message

#### ⚠️ Edge Cases
- Offline mode → disable actions

---

## 3. Navigation Map
Home (/)
├── Login (/login)
├── Signup (/signup)
├── Product Page (/product/:id)
├── Cart (/cart)
│ └── Checkout (/checkout)
│ └── Order Success (/order-success)
├── Dashboard (/dashboard)
│ ├── Add Product (/add-product)
│ ├── Manage Products
├── Profile (/profile)
└── Admin (/admin)


---

## 4. Screen Inventory

---

### 🏠 Home (`/`)
- Access: Public  
- Purpose: Display products  
- Elements: Product cards, navbar  
- Actions:
  - Click product → Product page  
- States:
  - Loading → spinner  
  - Empty → "No products available"  
  - Error → "Failed to load products"  

---

### 🔐 Login (`/login`)
- Access: Public  
- Purpose: User login  
- Elements: Email, password form  
- Actions:
  - Submit → Dashboard  
- States:
  - Error → invalid credentials  

---

### 📝 Signup (`/signup`)
- Access: Public  
- Purpose: Register user  
- Elements: Form fields  
- Actions:
  - Submit → Login  
- States:
  - Error → validation message  

---

### 📦 Product Page (`/product/:id`)
- Access: Public  
- Purpose: View product details  
- Elements: Image, price, add to cart  
- Actions:
  - Add to cart → Cart  
- States:
  - Error → product not found  

---

### 🛒 Cart (`/cart`)
- Access: Authenticated  
- Purpose: Manage cart  
- Actions:
  - Checkout → `/checkout`  

---

### 💳 Checkout (`/checkout`)
- Access: Authenticated  
- Purpose: Payment  
- Actions:
  - Pay → Order success  

---

### 🎉 Order Success (`/order-success`)
- Access: Authenticated  
- Purpose: Confirmation  

---

### 🧑‍💼 Dashboard (`/dashboard`)
- Access: Seller  
- Purpose: Manage products  

---

### ➕ Add Product (`/add-product`)
- Access: Seller  
- Purpose: Add product  

---

### 👤 Profile (`/profile`)
- Access: Authenticated  
- Purpose: Manage account  

---

## 5. Decision Points

- IF user not logged in → redirect to `/login`  
- IF cart is empty → disable checkout  
- IF payment success → create order  
- IF payment failure → retry option  
- IF role = seller → show dashboard  
- IF role = customer → hide seller panel  

---

## 6. Error Handling

### 404 (Page Not Found)
- Message: "Page not found"
- Action: Go to homepage

### 500 (Server Error)
- Message: "Something went wrong"
- Action: Retry / Refresh

### Network Offline
- Message: "You are offline"
- Action: Retry button

---

## 7. Responsive Behavior

### 📱 Mobile
- Vertical layout  
- Collapsible menu  
- Touch-friendly buttons  

### 💻 Desktop
- Grid layout  
- Full navbar  
- Hover interactions  

---

## 8. Validation Rules

- Email must be valid format  
- Password ≥ 6 characters  
- Product price > 0  
- Required fields cannot be empty  

---

# ✅ End of Document