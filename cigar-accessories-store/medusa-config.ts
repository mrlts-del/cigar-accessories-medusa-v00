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
    // Temporarily comment out Stripe Payment Module Configuration due to persistent loading issues
    /*
    "@medusajs/payment-stripe": {
      // resolve: "@medusajs/payment-stripe", // Removed resolve
      options: {
        api_key: process.env.STRIPE_SECRET_KEY,
        webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
        // capture: true // Example option
      }
    },
    */
    // Other modules can be added here if needed, otherwise defaults are used
  },
})
