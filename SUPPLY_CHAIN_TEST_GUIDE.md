# Supply Chain Testing Guide

## Complete Flow Test: Farmer → Validator → Distributor

This guide walks through testing the complete supply chain flow from product submission to distribution.

## Prerequisites

1. **Backend Server Running**: Make sure the backend is running on `http://localhost:3000`
2. **Frontend Server Running**: Make sure the frontend is running on `http://localhost:5173`
3. **Multiple Wallets**: You'll need different MetaMask accounts for different roles

## Test Wallets & Roles

### Wallet 1: Farmer/Producer
- **Role**: `farmer` or `producer`
- **Purpose**: Submit products for approval
- **Dashboard**: FarmerDashboard

### Wallet 2: Validator/Quality Inspector
- **Role**: `quality-inspector` or `validator`
- **Purpose**: Approve or reject submitted products
- **Dashboard**: ValidatorDashboard

### Wallet 3: Distributor
- **Role**: `distributor`
- **Purpose**: Accept approved products for distribution
- **Dashboard**: DistributorDashboard

## Step-by-Step Testing Process

### Step 1: Register as Farmer
1. Open browser and go to `http://localhost:5173/register`
2. Complete 3-step registration:
   - **Personal Info**: Full name, email, phone
   - **Location**: Address details
   - **Role Selection**: Choose "Farmer/Producer"
3. Connect MetaMask wallet (Wallet 1)
4. Complete registration
5. Login and access FarmerDashboard

### Step 2: Submit a Product (Farmer)
1. In FarmerDashboard, scroll to "Submit New Product"
2. Fill product details:
   ```
   Product Name: Test Organic Tomatoes
   Quantity: 100 (kg)
   Price per kg: 45
   Harvest Date: Select recent date
   Description: Fresh organic tomatoes for testing
   ```
3. Click "Submit Product"
4. Check that product appears in "Your Products" with status "pending"

### Step 3: Register as Validator
1. **Switch MetaMask Account** to Wallet 2
2. Go to `http://localhost:5173/register`
3. Complete registration with role "Quality Inspector/Validator"
4. Connect Wallet 2
5. Login and access ValidatorDashboard

### Step 4: Approve Product (Validator)
1. In ValidatorDashboard, you should see the submitted product
2. Review product details
3. Click "Approve" button
4. Verify success message appears
5. Check that product status changes to "approved"

### Step 5: Register as Distributor
1. **Switch MetaMask Account** to Wallet 3
2. Go to `http://localhost:5173/register`
3. Complete registration with role "Distributor"
4. Connect Wallet 3
5. Login and access DistributorDashboard

### Step 6: Accept Product for Distribution
1. In DistributorDashboard, you should see approved products
2. Find the product approved in Step 4
3. Click "Accept for Distribution"
4. Verify success message appears
5. Check that product status changes to "in-distribution"

## Debugging Tips

### If products don't appear:
1. Check browser console for API errors
2. Verify backend server is running on correct port (3000)
3. Check if JWT token is present in localStorage
4. Try refreshing the dashboard page

### If wallet connection fails:
1. Make sure MetaMask is installed and unlocked
2. Check if you're on the correct network (local blockchain)
3. Try disconnecting and reconnecting wallet

### If role permissions fail:
1. Verify you registered with the correct role
2. Check JWT token contains correct role claim
3. Make sure you're logged in with the correct wallet

### API Endpoints to Test Manually:
```bash
# Get all products
GET http://localhost:3000/api/products

# Get user profile (with JWT token)
GET http://localhost:3000/api/auth/verify
Authorization: Bearer <your_jwt_token>

# Vote on product (validator only)
POST http://localhost:3000/api/products/{product_id}/vote
Authorization: Bearer <validator_jwt_token>
Content-Type: application/json
{
  "vote": "approve"
}

# Accept product for distribution (distributor only)
POST http://localhost:3000/api/products/{product_id}/accept
Authorization: Bearer <distributor_jwt_token>
```

## Expected Results

After completing all steps:

1. **Farmer Dashboard**: Shows submitted product with "in-distribution" status
2. **Validator Dashboard**: Shows approved product (can see voting history)
3. **Distributor Dashboard**: Shows accepted product in "Order Management" section

## Current Status Flow

```
pending → approved → in-distribution → retail → sold
  ↑         ↑            ↑
Farmer   Validator   Distributor
```

## Troubleshooting Common Issues

### 1. "Products not showing in Distributor Dashboard"
- **Cause**: Product status might not be "approved"
- **Solution**: Check validator approved the product first

### 2. "Wallet login not working"
- **Cause**: Wrong network or wallet not connected
- **Solution**: Connect to local blockchain (chainId: 31337)

### 3. "JWT token errors"
- **Cause**: Token expired or invalid
- **Solution**: Re-login to get fresh token

### 4. "Role permission errors"
- **Cause**: User registered with wrong role
- **Solution**: Check role in JWT token matches required role

## Success Indicators

✅ **Farmer can submit products**
✅ **Validator can see and approve products**  
✅ **Distributor can see approved products**
✅ **Distributor can accept products for distribution**
✅ **Product status updates correctly through the flow**
✅ **Wallet authentication works for all roles**

## Next Steps After Testing

Once basic flow works:
1. Add Retailer dashboard for retail sales
2. Add Consumer QR scanning for purchase verification
3. Add blockchain transaction recording
4. Add real-time notifications
5. Add inventory management features