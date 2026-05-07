#!/bin/bash

# SwiftDocs Release Key Setup Script
# This will guide you through creating and configuring your release key

echo "🔑 SwiftDocs Release Key Setup"
echo "=============================="
echo ""

# Navigate to project root
cd /Users/macos/Desktop/swiftdocs

# Check if keystore already exists
KEYSTORE_PATH="android/app/swiftdocs-release-key.keystore"

if [ -f "$KEYSTORE_PATH" ]; then
    echo "✅ Release keystore already exists at:"
    echo "   $KEYSTORE_PATH"
    echo ""
    read -p "Do you want to create a new one? This will overwrite the existing keystore! (y/N): " OVERWRITE
    if [ "$OVERWRITE" != "y" ] && [ "$OVERWRITE" != "Y" ]; then
        echo "Keeping existing keystore."
    else
        echo "Creating new keystore..."
        keytool -genkeypair -v -storetype PKCS12 \
          -keystore "$KEYSTORE_PATH" \
          -alias swiftdocs-key-alias \
          -keyalg RSA \
          -keysize 2048 \
          -validity 10000
    fi
else
    echo "📝 Creating release keystore..."
    echo ""
    echo "You'll be asked for:"
    echo "  1. Keystore password (create a strong password - SAVE IT!)"
    echo "  2. Your name (or just press Enter for 'SwiftDocs')"
    echo "  3. Organization info (can press Enter to skip)"
    echo ""
    read -p "Press Enter to continue..."
    echo ""
    
    keytool -genkeypair -v -storetype PKCS12 \
      -keystore "$KEYSTORE_PATH" \
      -alias swiftdocs-key-alias \
      -keyalg RSA \
      -keysize 2048 \
      -validity 10000
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Keystore created successfully!"
    else
        echo ""
        echo "❌ Failed to create keystore"
        exit 1
    fi
fi

# Now configure gradle.properties
echo ""
echo "📝 Configuring gradle.properties..."

GRADLE_PROPS="android/gradle.properties"

# Check if already configured
if grep -q "MYAPP_UPLOAD_STORE_FILE" "$GRADLE_PROPS"; then
    echo "⚠️  Signing configuration already exists in gradle.properties"
    read -p "Update it? (y/N): " UPDATE
    if [ "$UPDATE" != "y" ] && [ "$UPDATE" != "Y" ]; then
        echo "Skipping gradle.properties update"
        exit 0
    fi
    # Remove old config
    grep -v "MYAPP_UPLOAD" "$GRADLE_PROPS" > "$GRADLE_PROPS.tmp"
    mv "$GRADLE_PROPS.tmp" "$GRADLE_PROPS"
fi

# Ask for passwords
echo ""
echo "Enter the keystore password you just created:"
read -s STORE_PASS
echo ""
echo "Enter the key password (usually same as keystore password):"
read -s KEY_PASS
echo ""

# Add configuration
echo "" >> "$GRADLE_PROPS"
echo "# Release signing config" >> "$GRADLE_PROPS"
echo "MYAPP_UPLOAD_STORE_FILE=swiftdocs-release-key.keystore" >> "$GRADLE_PROPS"
echo "MYAPP_UPLOAD_KEY_ALIAS=swiftdocs-key-alias" >> "$GRADLE_PROPS"
echo "MYAPP_UPLOAD_STORE_PASSWORD=$STORE_PASS" >> "$GRADLE_PROPS"
echo "MYAPP_UPLOAD_KEY_PASSWORD=$KEY_PASS" >> "$GRADLE_PROPS"

echo "✅ gradle.properties configured!"

# Update build.gradle
echo ""
echo "📝 Updating build.gradle..."

BUILD_GRADLE="android/app/build.gradle"

# Check if release signing config exists
if grep -q "signingConfigs.release" "$BUILD_GRADLE"; then
    echo "✅ build.gradle already has release signing config"
else
    echo "Adding release signing config to build.gradle..."
    # This is complex - let's just show instructions
    echo ""
    echo "⚠️  Manual step required!"
    echo ""
    echo "Open: android/app/build.gradle"
    echo ""
    echo "Find the 'signingConfigs' block and add:"
    echo ""
    echo "    release {"
    echo "        if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {"
    echo "            storeFile file(MYAPP_UPLOAD_STORE_FILE)"
    echo "            storePassword MYAPP_UPLOAD_STORE_PASSWORD"
    echo "            keyAlias MYAPP_UPLOAD_KEY_ALIAS"
    echo "            keyPassword MYAPP_UPLOAD_KEY_PASSWORD"
    echo "        }"
    echo "    }"
    echo ""
    echo "And in 'buildTypes' -> 'release', change:"
    echo "    signingConfig signingConfigs.debug"
    echo "to:"
    echo "    signingConfig signingConfigs.release"
    echo ""
    read -p "Press Enter after you've made these changes..."
fi

# Verify keystore
echo ""
echo "🔍 Verifying keystore..."
keytool -list -v -keystore "$KEYSTORE_PATH" -alias swiftdocs-key-alias -storepass "$STORE_PASS" 2>/dev/null | head -20

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Summary:"
echo "   • Keystore: $KEYSTORE_PATH"
echo "   • Alias: swiftdocs-key-alias"
echo "   • gradle.properties: configured"
echo ""
echo "⚠️  IMPORTANT:"
echo "   1. BACKUP your keystore file!"
echo "   2. SAVE your password in a secure location!"
echo "   3. Add *.keystore to .gitignore (don't commit it!)"
echo ""
echo "🚀 You're ready to build! Run:"
echo "   ./build-release.sh"
echo ""
