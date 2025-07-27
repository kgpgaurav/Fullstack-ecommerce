export const validateEnvironment = () => {
    const requiredEnvVars = [
        'MONGO_URI',
        'ACCESS_TOKEN_SECRET',
        'REFRESH_TOKEN_SECRET',
        'UPSTASH_REDIS_URL',
        'UPSTASH_REDIS_TOKEN',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET',
        'STRIPE_SECRET_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:');
        missingVars.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        process.exit(1);
    }

    console.log('✅ All required environment variables are set');
};
