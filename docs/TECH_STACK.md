# 📄 TECHNOLOGY STACK DOCUMENT (TECH_STACK.md)
## 🛒 Multi-Vendor E-commerce Platform with Payment & AI Features

---

## 0. App Context

- Type: Web Application  
- Scale: MVP  
- Timeline: 7–10 Days  

---

# 1. FRONTEND STACK

## 1.1 Framework
- Name: React  
- Version: 18.2.0  
- Documentation: https://react.dev/  
- Reason:
  - Component-based architecture
  - Fast MVP development
  - Large ecosystem
- Alternatives:
  - Angular → Too heavy
  - Vue → Smaller ecosystem

---

## 1.2 Language
- Name: TypeScript  
- Version: 5.3.3  
- Documentation: https://www.typescriptlang.org/docs/  
- Reason:
  - Type safety
  - Reduces runtime bugs
- Alternatives:
  - JavaScript → No type safety

---

## 1.3 Styling
- Name: Tailwind CSS  
- Version: 3.4.1  
- Documentation: https://tailwindcss.com/docs  
- Reason:
  - Fast UI development
  - Utility-first approach
- Alternatives:
  - Bootstrap → Less flexible
  - CSS Modules → Slower workflow

---

## 1.4 State Management
- Name: Redux Toolkit  
- Version: 2.2.1  
- Documentation: https://redux-toolkit.js.org/  
- Reason:
  - Predictable state
  - Scalable
- Alternatives:
  - Context API → Not scalable

---

## 1.5 Forms
- Name: React Hook Form  
- Version: 7.49.3  
- Documentation: https://react-hook-form.com/  
- Reason:
  - Lightweight
  - High performance
- Alternatives:
  - Formik → Slower

---

## 1.6 HTTP Client
- Name: Axios  
- Version: 1.6.7  
- Documentation: https://axios-http.com/docs/intro  
- Reason:
  - Easy API handling
  - Better error handling
- Alternatives:
  - Fetch → Less structured

---

## 1.7 UI Components
- Name: shadcn/ui  
- Version: 0.8.0  
- Documentation: https://ui.shadcn.com/  
- Reason:
  - Modern UI
  - Customizable
- Alternatives:
  - Material UI → Heavy

---

# 2. BACKEND STACK

## 2.1 Runtime
- Name: Node.js  
- Version: 20.11.1  
- Documentation: https://nodejs.org/docs  
- Reason:
  - Fast and scalable
- Alternatives:
  - Python Flask → Less async support

---

## 2.2 Framework
- Name: Express.js  
- Version: 4.18.2  
- Documentation: https://expressjs.com/  
- Reason:
  - Lightweight
  - Easy routing
- Alternatives:
  - NestJS → Overkill for MVP

---

## 2.3 Database
- Name: MongoDB  
- Version: 7.0  
- Documentation: https://www.mongodb.com/docs/  
- Reason:
  - Flexible schema
  - Fast for MVP
- Alternatives:
  - MySQL → Rigid schema

---

## 2.4 ORM
- Name: Mongoose  
- Version: 7.6.3  
- Documentation: https://mongoosejs.com/docs/  
- Reason:
  - Easy schema validation
- Alternatives:
  - Prisma → Better for SQL

---

## 2.5 Authentication
- Name: jsonwebtoken  
- Version: 9.0.2  
- Documentation: https://github.com/auth0/node-jsonwebtoken  
- Reason:
  - Stateless authentication
- Alternatives:
  - Sessions → Not scalable

---

## 2.6 Password Hashing
- Name: bcrypt  
- Version: 5.1.0  
- Documentation: https://www.npmjs.com/package/bcrypt  
- Reason:
  - Secure hashing
- Alternatives:
  - crypto → Low-level

---

## 2.7 Payment Gateway
- Name: Razorpay  
- Version: API v1  
- Documentation: https://razorpay.com/docs/  
- Reason:
  - Best for India
  - Easy integration
- Alternatives:
  - Stripe → Less India-focused

---

## 2.8 File Storage
- Name: Cloudinary  
- Version: 1.37.2  
- Documentation: https://cloudinary.com/documentation  
- Reason:
  - Easy image upload
- Alternatives:
  - AWS S3 → Complex

---

## 2.9 Email Service
- Name: Nodemailer  
- Version: 6.9.8  
- Documentation: https://nodemailer.com/  
- Reason:
  - Simple email sending

---

# 3. ENVIRONMENT VARIABLES

PORT=5000  
MONGO_URI=your_mongodb_uri  
JWT_SECRET=your_secret  
JWT_EXPIRE=1d  
BCRYPT_ROUNDS=10  

RAZORPAY_KEY_ID=your_key  
RAZORPAY_KEY_SECRET=your_secret  

CLOUDINARY_CLOUD_NAME=your_name  
CLOUDINARY_API_KEY=your_key  
CLOUDINARY_API_SECRET=your_secret  

EMAIL_USER=your_email  
EMAIL_PASS=your_password  

---

# 4. PACKAGE.JSON SCRIPTS

{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "react-scripts build",
    "client": "npm start --prefix client"
  }
}

---

# 5. BACKEND DEPENDENCIES

{
  "express": "4.18.2",
  "mongoose": "7.6.3",
  "jsonwebtoken": "9.0.2",
  "bcrypt": "5.1.0",
  "dotenv": "16.4.5",
  "nodemailer": "6.9.8",
  "cors": "2.8.5"
}

---

# 6. FRONTEND DEPENDENCIES

{
  "react": "18.2.0",
  "react-dom": "18.2.0",
  "typescript": "5.3.3",
  "axios": "1.6.7",
  "redux": "5.0.1",
  "@reduxjs/toolkit": "2.2.1",
  "react-hook-form": "7.49.3",
  "tailwindcss": "3.4.1"
}

---

# 7. SECURITY CONFIGURATION

- bcrypt rounds: 10  
- JWT expiry: 1 day  
- CORS: allow frontend origin only  
- Rate limit: 100 requests per 15 minutes  
- Input validation required on all APIs  

---

# 8. GIT STRATEGY

- main → production  
- dev → development  
- feature/* → features  
- hotfix/* → fixes  

---

# 9. CI/CD SETUP

- Platform: GitHub Actions  
- Steps:
  - Install dependencies  
  - Build project  
  - Run tests  
  - Deploy  

---

# 10. VERSION UPGRADE POLICY

- Minor updates every 3 months  
- Security updates immediately  
- Major upgrades after testing  

---

# ✅ End of Document