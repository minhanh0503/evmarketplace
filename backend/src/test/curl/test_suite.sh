#!/bin/bash
BASE=https://evmarketplace-backend.onrender.com

# Homepage (SPA index.html)
curl -s $BASE/ | head -5

# All vehicles
curl -s $BASE/api/vehicles

# Single vehicle (used by CarDetails.jsx)
curl -s $BASE/api/vehicles/8

# Search/filter
curl -s "$BASE/api/vehicles/search?make=Tesla"

# Add to cart
curl -X POST $BASE/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"vehicleId":8,"quantity":1}'

# View cart
curl -s $BASE/api/cart/1

# Checkout
curl -X POST $BASE/api/orders/checkout \
  -H "Content-Type: application/json" \
  -d '{"userId":1}'

# Register
curl -X POST $BASE/api/identity/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test2@test.com","password":"Str0ng!Pass"}'

# Login
curl -X POST $BASE/api/identity/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tazwar@test.com","password":"test1234"}'