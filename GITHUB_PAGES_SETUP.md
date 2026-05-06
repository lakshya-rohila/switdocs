# SwiftDocs - GitHub Pages Setup Guide

## 📁 What's Been Created

All the necessary files for your GitHub Pages site have been created in the `/docs` folder:

### Pages
- ✅ **index.html** - Landing page for SwiftDocs
- ✅ **privacy-policy.html** - Privacy Policy (required for App Store & Google Play)
- ✅ **terms-of-service.html** - Terms of Service (required for app stores)
- ✅ **about.html** - About SwiftDocs
- ✅ **support.html** - Support & FAQ page
- ✅ **styles.css** - Styling for all pages

### App Integration
- ✅ **src/utils/webLinks.ts** - Utility functions to open web pages from your app
- ✅ **src/screens/SettingsScreen.tsx** - Example Settings screen component

---

## 🚀 Deployment Steps

### Step 1: Commit the Files

```bash
cd /Users/macos/Desktop/swiftdocs

# Add the docs folder
git add docs/

# Add the new utility and screen
git add src/utils/webLinks.ts src/screens/SettingsScreen.tsx

# Commit
git commit -m "Add GitHub Pages with Privacy Policy and Terms of Service"
```

### Step 2: Push to GitHub

```bash
# If you haven't set up a remote yet:
git remote add origin https://github.com/YOUR_USERNAME/swiftdocs.git

# Push to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/swiftdocs`
2. Click on **Settings** tab
3. Scroll down to **Pages** section (in the left sidebar under "Code and automation")
4. Under **Source**:
   - Branch: Select `main`
   - Folder: Select `/docs`
5. Click **Save**

### Step 4: Wait for Deployment

- GitHub will build and deploy your site (usually takes 1-2 minutes)
- Your site will be available at: `https://YOUR_USERNAME.github.io/swiftdocs/`
- You'll see a green checkmark when it's ready

---

## 🔗 Update URLs in Your App

Once your GitHub Pages is live, update the base URL in your app:

### Edit `src/utils/webLinks.ts`

```typescript
// Replace this line:
const BASE_URL = 'https://yourusername.github.io/swiftdocs';

// With your actual GitHub Pages URL:
const BASE_URL = 'https://YOUR_GITHUB_USERNAME.github.io/swiftdocs';
```

### Update Support Email

Find and replace `support@swiftdocs.app` with your actual support email in:
- All HTML files in `/docs` folder
- `src/utils/webLinks.ts`
- `src/screens/SettingsScreen.tsx`

---

## 📱 Using in Your App

### Example: Add to Settings Screen

```typescript
import SettingsScreen from './src/screens/SettingsScreen';

// Use in your navigation
<Stack.Screen 
  name="Settings" 
  component={SettingsScreen} 
/>
```

### Example: Open Privacy Policy

```typescript
import { openPrivacyPolicy } from './src/utils/webLinks';

// In your component
<TouchableOpacity onPress={openPrivacyPolicy}>
  <Text>Privacy Policy</Text>
</TouchableOpacity>
```

### Example: Add to Onboarding

Add a link to Terms & Privacy in your onboarding flow:

```typescript
import { openPrivacyPolicy, openTermsOfService } from './src/utils/webLinks';

<Text>
  By continuing, you agree to our{' '}
  <Text onPress={openTermsOfService} style={styles.link}>
    Terms of Service
  </Text>
  {' '}and{' '}
  <Text onPress={openPrivacyPolicy} style={styles.link}>
    Privacy Policy
  </Text>
</Text>
```

---

## 📋 App Store Requirements

### Apple App Store (iOS)

Add to your `Info.plist`:

```xml
<key>NSPrivacyPolicyURL</key>
<string>https://YOUR_USERNAME.github.io/swiftdocs/privacy-policy.html</string>
```

In App Store Connect, you'll need to provide:
- Privacy Policy URL
- Support URL (can use support.html)

### Google Play Store (Android)

In the Google Play Console, under "Store presence" → "Store listing", add:
- Privacy Policy URL: `https://YOUR_USERNAME.github.io/swiftdocs/privacy-policy.html`

---

## ✅ Checklist Before Submitting to App Stores

- [ ] GitHub Pages is live and accessible
- [ ] All URLs in `webLinks.ts` are updated with your actual GitHub Pages URL
- [ ] Support email is updated everywhere (search for `support@swiftdocs.app`)
- [ ] Privacy Policy and Terms are reviewed and accurate
- [ ] Dates in Privacy Policy and Terms are current
- [ ] Tested opening links from the app on both iOS and Android
- [ ] Added Privacy Policy URL to Info.plist (iOS)
- [ ] Added Privacy Policy URL to Google Play Console (Android)

---

## 🎨 Customization

Feel free to customize:
- Colors and styling in `styles.css`
- Content in any HTML file
- App version number in `about.html` and `SettingsScreen.tsx`
- Company/developer information

---

## 🔄 Updating Content

To update your GitHub Pages after initial deployment:

```bash
# Make changes to files in /docs
# Then:
git add docs/
git commit -m "Update privacy policy"
git push

# GitHub will automatically rebuild your site
```

---

## 📞 Support

Your GitHub Pages URLs:
- **Home**: `https://YOUR_USERNAME.github.io/swiftdocs/`
- **Privacy Policy**: `https://YOUR_USERNAME.github.io/swiftdocs/privacy-policy.html`
- **Terms of Service**: `https://YOUR_USERNAME.github.io/swiftdocs/terms-of-service.html`
- **About**: `https://YOUR_USERNAME.github.io/swiftdocs/about.html`
- **Support**: `https://YOUR_USERNAME.github.io/swiftdocs/support.html`

---

Good luck with your app submission! 🚀
