# SwiftDocs GitHub Pages

This directory contains the GitHub Pages site for SwiftDocs.

## Pages Included

- **index.html** - Homepage
- **privacy-policy.html** - Privacy Policy (required for app stores)
- **terms-of-service.html** - Terms of Service (required for app stores)
- **about.html** - About the app
- **support.html** - Support and FAQ page

## Setup Instructions

### 1. Push to GitHub

```bash
git add docs/
git commit -m "Add GitHub Pages for SwiftDocs"
git push origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings**
3. Scroll down to **Pages** section
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/docs`
5. Click **Save**

### 3. Access Your Site

After a few minutes, your site will be live at:
```
https://[your-username].github.io/[repository-name]/
```

For example: `https://yourusername.github.io/swiftdocs/`

## Using in Your App

Once published, you can link to these pages in your app:

### iOS (Info.plist)
```xml
<key>NSPrivacyPolicyURL</key>
<string>https://yourusername.github.io/swiftdocs/privacy-policy.html</string>
```

### Android (strings.xml or directly in code)
```kotlin
// In your app
val privacyPolicyUrl = "https://yourusername.github.io/swiftdocs/privacy-policy.html"
val termsUrl = "https://yourusername.github.io/swiftdocs/terms-of-service.html"
```

### React Native
```typescript
import { Linking } from 'react-native';

const openPrivacyPolicy = () => {
  Linking.openURL('https://yourusername.github.io/swiftdocs/privacy-policy.html');
};

const openTermsOfService = () => {
  Linking.openURL('https://yourusername.github.io/swiftdocs/terms-of-service.html');
};
```

## Customization

Feel free to update the content in any of the HTML files to match your specific needs. The email address (`support@swiftdocs.app`) should be updated to your actual support email.

## Note

Remember to update:
- Support email addresses
- Any specific legal requirements for your jurisdiction
- Version numbers and dates as you release updates
