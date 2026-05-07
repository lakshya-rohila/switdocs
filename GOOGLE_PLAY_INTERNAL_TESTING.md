# Google Play Console - Internal Testing Setup Guide

## 🎯 Overview
You're currently at the Dashboard. Here's the complete step-by-step process.

---

## 📱 Step-by-Step Guide

### ✅ STEP 1: Complete App Information

#### 1.1 App Details
Go to: **Dashboard → Grow → Store presence → Main store listing**

Fill in:
- **App name**: SwiftDocs
- **Short description** (80 chars max):
  ```
  All your doc tools in one place. PDF converter, signer, compressor - zero ads!
  ```
- **Full description** (4000 chars max):
  ```
  SwiftDocs brings every essential document tool to your fingertips - completely free, with zero ads, forever.

  🔧 FEATURES:
  • PDF Tools: Create, merge, split, compress, rotate PDFs
  • E-Signature: Sign documents digitally
  • Image Tools: Convert, compress, resize, crop images
  • Document Converter: Convert between PDF, images, and more
  • QR Code: Generate and scan QR codes
  • Word Counter: Count words and characters

  🔒 PRIVACY FIRST:
  All processing happens on your device. No uploads, no servers, no data collection. Your files stay private, always.

  🚫 ZERO ADS:
  No popups, banners, or interruptions. Ever. Just tools that work.

  💰 ALWAYS FREE:
  Every feature is free. No premium tiers, no subscriptions, no hidden costs.

  ⚡ FAST & OFFLINE:
  Works completely offline. No internet required for any feature.

  SwiftDocs is perfect for students, professionals, and anyone who works with documents regularly.
  ```

- **App icon**: Upload your app icon (512x512 PNG)
- **Feature graphic**: Create one (1024x500 PNG) - can use Canva
- **Screenshots**: 
  - Phone: Minimum 2, maximum 8 (recommended: 4-5)
  - 7-inch tablet: Optional
  - 10-inch tablet: Optional

#### 1.2 Categorization
- **App category**: Productivity
- **Tags**: Select relevant tags (documents, PDF, productivity, tools)

#### 1.3 Contact Details
- **Email**: lakshyarohila21@gmail.com
- **Phone**: (optional)
- **Website**: https://lakshya-rohila.github.io/switdocs/

#### 1.4 Privacy Policy
- **Privacy Policy URL**: 
  ```
  https://lakshya-rohila.github.io/switdocs/privacy-policy.html
  ```

---

### ✅ STEP 2: App Content & Declarations

#### 2.1 Content Rating
Go to: **Policy → App content → Content rating**

Click "Start questionnaire":
1. Enter email address
2. Select category: **Utility, Productivity, Communication, or Other**
3. Answer questions (all should be "No" for SwiftDocs):
   - Violence?filter_none No
   - Sexual content? No
   - Language? No
   - Drugs? No
   - Gambling? No
4. Submit and get your rating

#### 2.2 Target Audience
Go to: **Policy → App content → Target audience and content**

- **Target age group**: 
  - Ages 13+ (or 13 and older)
- **Appeals to children**: No

#### 2.3 News App
- Select: **No, this is not a news app**

#### 2.4 COVID-19 Contact Tracing
- Select: **No**

#### 2.5 Data Safety
Go to: **Policy → App content → Data safety**

This is crucial! Fill out based on SwiftDocs:

**Data Collection**:
- **Does your app collect or share user data?** → No

**Data Types**:
- Since you selected "No", you don't need to specify data types

**Security Practices**:
- **Data is encrypted in transit** → Yes (HTTPS)
- **Users can request data deletion** → N/A (no data collected)
- **Independent security review** → No (optional)

#### 2.6 App Access
- **Special app access**: Select "All functionality is available without restrictions"

#### 2.7 Ads
- **Contains ads**: No
- **Ads SDK**: N/A

---

### ✅ STEP 3: Set Up Internal Testing Track

#### 3.1 Create Internal Testing Release
Go to: **Release → Testing → Internal testing**

Click **"Create new release"**

#### 3.2 Upload Your App Bundle
1. Click **"Upload"**
2. Select your `app-release.aab` file from:
   ```
   android/app/build/outputs/bundle/release/app-release.aab
   ```
3. Wait for upload and processing

#### 3.3 Release Name & Notes
- **Release name**: Version 1.0.0 (auto-filled from versionName)
- **Release notes**: 
  ```
  🎉 Initial release of SwiftDocs!

  Features:
  • PDF tools (create, merge, split, compress, rotate)
  • E-Signature
  • Image converter & compressor
  • Document converter
  • QR code generator & scanner
  • Word counter
  • Zero ads, always free
  • Privacy-first: all processing on device
  ```

#### 3.4 Save and Review
- Click **"Save"**
- Review the release summary

---

### ✅ STEP 4: Add Internal Testers

#### 4.1 Create Tester List
Still in **Internal testing**:

1. Click **"Testers"** tab
2. Click **"Create email list"**
3. **List name**: "SwiftDocs Internal Testers"
4. Add email addresses (one per line):
   ```
   lakshyarohila21@gmail.com
   friend1@example.com
   friend2@example.com
   ```
5. Click **"Save"**

#### 4.2 Set Feedback Channel (Optional)
- **Feedback email**: lakshyarohila21@gmail.com
- **Feedback URL**: (optional)

---

### ✅ STEP 5: Publish to Internal Testing

1. Go back to the release you created
2. Review all details
3. Click **"Start rollout to Internal testing"**
4. Confirm

⏱️ Processing time: Usually 1-2 hours (can take up to 24 hours)

---

### ✅ STEP 6: Share with Testers

Once published, you'll get:

1. **Opt-in URL**: Share this link with your testers
   - Example: `https://play.google.com/apps/internaltest/...`

2. **Testers will**:
   - Click the opt-in link
   - Accept the invitation
   - Download the app from Google Play
   - Test and provide feedback

---

## 📋 Checklist Before Publishing

- [ ] App name set: **SwiftDocs**
- [ ] Short & full descriptions written
- [ ] App icon uploaded (512x512)
- [ ] Feature graphic uploaded (1024x500)
- [ ] At least 2 screenshots uploaded
- [ ] Category selected: **Productivity**
- [ ] Email: lakshyarohila21@gmail.com
- [ ] Website: https://lakshya-rohila.github.io/switdocs/
- [ ] Privacy Policy URL added
- [ ] Content rating questionnaire completed
- [ ] Target audience set (13+)
- [ ] Data safety form completed (No data collection)
- [ ] Ads declaration: No ads
- [ ] Signed AAB/APK uploaded
- [ ] Release notes written
- [ ] Internal testers added
- [ ] Release reviewed and published

---

## 🐛 Common Issues & Solutions

### Upload Failed
- **Error: "Not signed"** → Make sure you built with `bundleRelease` and configured signing
- **Error: "Package name mismatch"** → Check applicationId in build.gradle matches console

### Processing Stuck
- Wait 1-2 hours
- If still stuck after 24 hours, contact Play Console support

### Can't Find Internal Testing
- Make sure you're looking under **Release → Testing → Internal testing**
- Not under "Production" or "Open testing"

---

## 📱 After Publishing

### Test Everything:
- [ ] Download via opt-in URL
- [ ] Test all PDF features
- [ ] Test image tools
- [ ] Test e-signature
- [ ] Test QR scanner
- [ ] Verify no crashes
- [ ] Check Privacy Policy link works
- [ ] Test on multiple devices

### Gather Feedback:
- Ask testers to report bugs
- Note any performance issues
- Collect feature requests

### Iterate:
1. Fix critical bugs
2. Build new version (increment versionCode)
3. Upload to internal testing again
4. Repeat until stable

---

## 🚀 Next Steps After Internal Testing

Once you've tested thoroughly and fixed bugs:

1. **Closed Testing** (optional): Test with more users
2. **Open Testing** (optional): Public beta
3. **Production**: Full public release

---

## 📞 Need Help?

- **Play Console Help**: https://support.google.com/googleplay/android-developer
- **Email**: lakshyarohila21@gmail.com

Good luck with your internal testing! 🎉
