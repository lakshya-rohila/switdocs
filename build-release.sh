#!/bin/bash

# SwiftDocs - Quick Release Build Script
# This script will guide you through building a signed release APK/AAB

echo "🚀 SwiftDocs Release Build Script"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Step 1: Check for keystore
echo "📝 Step 1: Checking for release keystore..."
KEYSTORE_PATH="android/app/swiftdocs-release-key.keystore"

if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "⚠️  Release keystore not found!"
    echo ""
    echo "You need to generate a release keystore first."
    echo "Run this command:"
    echo ""
    echo "keytool -genkeypair -v -storetype PKCS12 \\"
    echo "  -keystore android/app/swiftdocs-release-key.keystore \\"
    echo "  -alias swiftdocs-key-alias \\"
    echo "  -keyalg RSA -keysize 2048 -validity 10000"
    echo ""
    echo "IMPORTANT: Save the password you create!"
    echo ""
    read -p "Press Enter after you've created the keystore, or Ctrl+C to cancel..."
fi

# Step 2: Check gradle.properties
echo ""
echo "📝 Step 2: Checking gradle.properties..."
GRADLE_PROPS="android/gradle.properties"

if ! grep -q "MYAPP_UPLOAD_STORE_FILE" "$GRADLE_PROPS" 2>/dev/null; then
    echo "⚠️  Signing configuration not found in gradle.properties"
    echo ""
    echo "Add these lines to $GRADLE_PROPS:"
    echo ""
    echo "MYAPP_UPLOAD_STORE_FILE=swiftdocs-release-key.keystore"
    echo "MYAPP_UPLOAD_KEY_ALIAS=swiftdocs-key-alias"
    echo "MYAPP_UPLOAD_STORE_PASSWORD=YOUR_PASSWORD_HERE"
    echo "MYAPP_UPLOAD_KEY_PASSWORD=YOUR_PASSWORD_HERE"
    echo ""
    read -p "Press Enter after you've configured gradle.properties, or Ctrl+C to cancel..."
fi

# Step 3: Clean previous builds
echo ""
echo "🧹 Step 3: Cleaning previous builds..."
cd android
./gradlew clean
cd ..

# Step 4: Build options
echo ""
echo "📦 Step 4: Choose build type"
echo "1) Build AAB (Android App Bundle - recommended for Play Store)"
echo "2) Build APK (for direct installation testing)"
echo ""
read -p "Enter choice (1 or 2): " BUILD_CHOICE

cd android

if [ "$BUILD_CHOICE" = "1" ]; then
    echo ""
    echo "🔨 Building release AAB..."
    ./gradlew bundleRelease
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Success! Your AAB is at:"
        echo "android/app/build/outputs/bundle/release/app-release.aab"
        echo ""
        echo "📤 Upload this file to Google Play Console"
    else
        echo ""
        echo "❌ Build failed! Check the error messages above."
        exit 1
    fi
    
elif [ "$BUILD_CHOICE" = "2" ]; then
    echo ""
    echo "🔨 Building release APK..."
    ./gradlew assembleRelease
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Success! Your APK is at:"
        echo "android/app/build/outputs/apk/release/app-release.apk"
        echo ""
        echo "📱 Install on device with:"
        echo "adb install app/build/outputs/apk/release/app-release.apk"
    else
        echo ""
        echo "❌ Build failed! Check the error messages above."
        exit 1
    fi
else
    echo "❌ Invalid choice"
    exit 1
fi

cd ..

echo ""
echo "🎉 Done!"
