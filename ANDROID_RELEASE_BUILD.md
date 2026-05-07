# Android Release Build Guide for SwiftDocs

## Step 1: Generate a Signing Key

If you don't have a keystore yet, create one:

```bash
cd /Users/macos/Desktop/swiftdocs/android/app

# Generate keystore (do this ONCE and save it safely!)
keytool -genkeypair -v -storetype PKCS12 -keystore swiftdocs-release-key.keystore -alias swiftdocs-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**IMPORTANT**: 
- Save the password you create!
- Back up the `.keystore` file - you'll need it for all future releases
- Never commit it to git

## Step 2: Configure Gradle Signing

1. Create or edit `android/gradle.properties` and add:

```properties
MYAPP_UPLOAD_STORE_FILE=swiftdocs-release-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=swiftdocs-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=YOUR_KEYSTORE_PASSWORD
MYAPP_UPLOAD_KEY_PASSWORD=YOUR_KEY_PASSWORD
```

2. Edit `android/app/build.gradle` - Add signing config:

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
```

## Step 3: Build the Release Bundle (AAB)

```bash
cd /Users/macos/Desktop/swiftdocs/android

# Clean previous builds
./gradlew clean

# Build release AAB (recommended for Play Store)
./gradlew bundleRelease

# Your AAB will be at:
# android/app/build/outputs/bundle/release/app-release.aab
```

**OR build APK** (alternative):
```bash
./gradlew assembleRelease

# Your APK will be at:
# android/app/build/outputs/apk/release/app-release.apk
```

## Step 4: Test the Release Build Locally

```bash
# Install the release APK on a device
adb install android/app/build/outputs/apk/release/app-release.apk

# Test all features to ensure everything works in release mode
```

---

✅ Once you have your signed AAB/APK, proceed to Google Play Console setup!
