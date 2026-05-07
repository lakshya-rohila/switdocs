#!/bin/bash

# Quick Release Key Setup - No interaction needed except password
cd /Users/macos/Desktop/swiftdocs

echo "🔑 SwiftDocs Release Key - Quick Setup"
echo "======================================"
echo ""
echo "This will:"
echo "  1. Generate release keystore"
echo "  2. Configure gradle.properties"
echo "  3. Build signed AAB"
echo ""
echo "⚠️  You'll need to:"
echo "  • Create a password (SAVE IT!)"
echo "  • Answer a few questions (or just press Enter)"
echo ""
read -p "Ready? Press Enter to start..."
echo ""

# Generate keystore
echo "📝 Generating keystore..."
echo ""
keytool -genkeypair -v -storetype PKCS12 \
  -keystore android/app/swiftdocs-release-key.keystore \
  -alias swiftdocs-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Failed to create keystore"
    exit 1
fi

echo ""
echo "✅ Keystore created!"
echo ""

# Get password
echo "📝 Configuring gradle.properties..."
echo ""
echo "Enter the keystore password you just created:"
read -s PASS
echo ""

# Add to gradle.properties
echo "" >> android/gradle.properties
echo "# Release signing" >> android/gradle.properties
echo "MYAPP_UPLOAD_STORE_FILE=swiftdocs-release-key.keystore" >> android/gradle.properties
echo "MYAPP_UPLOAD_KEY_ALIAS=swiftdocs-key-alias" >> android/gradle.properties
echo "MYAPP_UPLOAD_STORE_PASSWORD=$PASS" >> android/gradle.properties
echo "MYAPP_UPLOAD_KEY_PASSWORD=$PASS" >> android/gradle.properties

echo "✅ Configuration complete!"
echo ""

# Build
echo "🔨 Building signed release AAB..."
echo ""
cd android
./gradlew clean
./gradlew bundleRelease

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS!"
    echo ""
    echo "Your SIGNED AAB is ready at:"
    echo "  android/app/build/outputs/bundle/release/app-release.aab"
    echo ""
    echo "📤 Upload this to Google Play Console!"
    echo ""
    echo "⚠️  IMPORTANT:"
    echo "  • Password: $PASS"
    echo "  • SAVE THIS PASSWORD for future updates!"
    echo "  • Backup: android/app/swiftdocs-release-key.keystore"
else
    echo ""
    echo "❌ Build failed - check errors above"
fi
