```markdown
# Sample .env File

Below is a sample `.env` file for configuring the environment variables required for this project. Replace the placeholder values with your actual credentials.

```env
# Server Configuration
PORT=3000

# Database Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.pyhpdrg.mongodb.net/ecommerce_db?retryWrites=true&w=majority&appName=Cluster0

# Redis Configuration
UPSTASH_REDIS_URL=rediss://default:<password>@thankful-mosquito-34443.upstash.io:6379

# Authentication Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key

# Client URL
CLIENT_URL=http://localhost:5173
```

> **Note:** Ensure you replace sensitive information like `<username>`, `<password>`, and other placeholders with your actual credentials. Never share your `.env` file publicly.
```  