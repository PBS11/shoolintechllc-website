#!/bin/bash

# Employee Portal Installation Script
# Run this script to set up the Employee Portal

echo "=========================================="
echo "ShoolinTech LLC - Employee Portal Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Setup MongoDB Atlas (FREE):"
echo "   → Go to: https://www.mongodb.com/cloud/atlas"
echo "   → Create a free cluster"
echo "   → Get your connection string"
echo ""
echo "2. Configure Environment Variables:"
echo "   → Copy: cp .env.example .env"
echo "   → Edit: .env"
echo "   → Add your MongoDB connection string"
echo "   → Add a JWT secret"
echo ""
echo "3. Start the Server:"
echo "   → npm start"
echo "   → Server will run at: http://localhost:5000"
echo ""
echo "4. Test the System:"
echo "   → Register: http://localhost:5000/register.html"
echo "   → Login: http://localhost:5000/login.html"
echo "   → Dashboard: http://localhost:5000/dashboard.html"
echo ""
echo "📚 Documentation:"
echo "   → QUICK_START.md - Quick start guide"
echo "   → MONGODB_ATLAS_SETUP.md - Atlas setup instructions"
echo "   → EMPLOYEE_PORTAL_README.md - Complete documentation"
echo ""
echo "=========================================="
