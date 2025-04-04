import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import { Product } from './src/models/product' // Import the custom entity
import path from 'path' // Import path for resolving directory

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    // Add driverOptions for Neon DB SSL connection
    databaseDriverOptions: {
      connection: {
        ssl: {
          rejectUnauthorized: false // As noted in rules.txt scratchpad
        }
      }
    },
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: {
    // Explicitly configure the product module
    product: {
      resolve: "@medusajs/product", // Specify the base module package
      options: {
        database: {
          // Register the custom entity to be merged with the base Product
          extraModels: [Product],
          // Explicitly define the path to project-specific migrations for this module
          migrations: [path.join(__dirname, "src", "migrations")],
        }
      }
    },
    // Add Stripe Payment Module Configuration
    "@medusajs/payment-stripe": { // Use the correct package name found earlier
      resolve: "@medusajs/payment-stripe",
      options: {
        api_key: process.env.STRIPE_SECRET_KEY,
        webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
        // You can add more options here if needed, e.g., capture: true
      }
    },
    // Other modules can be added here if needed, otherwise defaults are used
  },
})
