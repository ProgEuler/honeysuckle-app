# 🌿 Honeysuckle Trail — Mental Health & Wellness App

**Honeysuckle Trail** is a journaling, reflection, wellness, and supportive AI companion app built with React Native (Expo). It helps users track thoughts, moods, habits, and patterns while providing general prompts, reflections, summaries, and wellness insights.

> **⚠️ Important:** Honeysuckle Trail is **not** medical care, mental health treatment, therapy, counseling, crisis response, or a medical device. It does not diagnose, treat, cure, or prevent any medical or mental health condition. If you are in crisis, contact emergency services or a qualified crisis resource immediately (e.g., call or text **988**).

---

## ✨ Features

- **Daily Check-In** — Log your mood, emotions, and performance each day
- **Journaling** — Write journal entries with tags and emotion tracking
- **Journal History** — Browse past entries with filters and search
- **AI Chat** — Conversational AI companion for reflection and support
- **Analytics & Insights** — Visualize your mood trends, patterns, and habits over time
- **Authentication** — Email/password, Google Sign-In, and Apple Sign-In
- **Push Notifications** — Reminders and updates via Firebase Cloud Messaging
- **Onboarding** — Guided introduction to the app's features
- **Profile & Settings** — Personal info, change password, security, privacy, invite friends, feedback submission
- **Custom Themes** — Warm, earth-tone design system

---

## 🧱 Tech Stack

| Technology              | Purpose                              |
| ----------------------- | ------------------------------------ |
| **Expo SDK 54**         | Framework & build tooling            |
| **React Native 0.81**   | Mobile UI framework                  |
| **React 19**            | UI library                           |
| **Expo Router**         | File-based navigation & routing      |
| **TypeScript**          | Type safety                          |
| **Zustand**             | Lightweight client state management  |
| **TanStack React Query**| Server state & API caching           |
| **Firebase Auth**       | Authentication (email, Google, Apple)|
| **Firebase Messaging**  | Push notifications                   |
| **react-hook-form**     | Form handling & validation           |
| **react-native-gifted-chat** | Chat UI                        |
| **react-native-gifted-charts** | Data visualizations          |
| **react-native-reanimated** | Smooth animations               |
| **expo-secure-store**   | Secure token/key storage             |
| **lucide-react-native** | Icons                                |
| **sonner-native**       | Toast notifications                  |
| **expo-linear-gradient**| Gradient backgrounds                 |

---

## 📁 Project Structure

```
mentalheath/
├── app/                    # Expo Router pages (file-based routing)
│   ├── auth/               # Sign up, login, OTP, forgot password
│   ├── (tabs)/             # Main tab navigation (home, dailycheck, chat, analytics, settings)
│   ├── welcome/            # Welcome/onboarding screens
│   ├── onboarding/         # Guided onboarding flow
│   ├── dailycheck-sub-screens/ # Daily check-in sub-screens
│   ├── chatpages/          # Chat-related pages
│   ├── settings-sub-screens/   # Settings sub-screens
│   ├── notifications/      # Notification screens
│   ├── splash.tsx          # Splash screen
│   └── _layout.tsx         # Root layout
├── components/             # Reusable UI components
│   ├── ui/                 # Base UI primitives (button, text, input, etc.)
│   ├── icons/              # Custom tab bar icons
│   ├── layout/             # Layout components
│   ├── shared/             # Shared components (social auth, image picker)
│   ├── splash/             # Custom splash component
│   └── custometabbar.tsx   # Custom bottom tab bar
├── constants/              # Colors, terms & policy, prompt inspirations
├── hooks/                  # Custom React hooks (queries, auth, etc.)
├── lib/                    # API client & service modules
│   └── api/                # API endpoint modules (auth, chat, checkin, etc.)
├── store/                  # Zustand stores (auth, check-in, user)
├── theme/                  # Theme globals (spacing, font size, border radius)
├── assets/                 # Images, SVGs, fonts
└── app.json                # Expo configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **Bun** (recommended) or npm / yarn
- **Xcode** (for iOS development — macOS only)
- **Android Studio** (for Android development)
- **Expo CLI** — installed automatically as a dependency

### 1. Install Dependencies

```bash
bun install
```

> Or with npm: `npm install`

### 2. Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable              | Required | Description                        |
| --------------------- | -------- | ---------------------------------- |
| `EXPO_PUBLIC_API_URL` | **Yes**  | Base URL for the backend API       |

### 3. Firebase Setup

This app uses Firebase Authentication and Cloud Messaging. You need Firebase project credentials:

**iOS:**
1. Download `GoogleService-Info.plist` from Firebase Console → Project Settings → iOS app
2. Place it in the project root directory

**Android:**
1. Download `google-services.json` from Firebase Console → Project Settings → Android app
2. Place it in the project root directory

> **Note:** These files are already present for development. For production builds, replace them with your own Firebase project credentials.

### 4. Start the Development Server

```bash
bun start
```

Or with npm:

```bash
npx expo start
```

### 5. Run on a Device / Simulator

After the dev server starts, press:

- **`i`** — Open in iOS simulator (macOS only)
- **`a`** — Open in Android emulator
- **`w`** — Open in web browser (limited functionality)
- **`s`** — Switch to Expo Go (scan QR code with your device)

> For the best experience, use a **development build** (see below).

---

## 📱 Development Builds

For native features (push notifications, Apple/Google auth), you need a development build rather than Expo Go.

### Build locally

```bash
# iOS
bun run ios

# Android
bun run android
```

### Build with EAS (Expo Application Services)

This project is configured with EAS Build. The EAS project ID is `5032232b-eb7c-4c60-97bd-a2eb73f20d1e`.

```bash
# Install EAS CLI
bun install -g eas-cli

# Development build
eas build --platform ios --profile development
eas build --platform android --profile development

# Preview build (internal distribution)
eas build --platform ios --profile preview
eas build --platform android --profile preview

# Production build
eas build --platform ios --profile production
eas build --platform android --profile production
```

### Submit to App Store

```bash
eas submit --platform ios --profile production
```

---

## 🔧 Useful Scripts

| Command              | Description                               |
| -------------------- | ----------------------------------------- |
| `bun start`          | Start Expo dev server                     |
| `bun run ios`        | Build and run on iOS simulator            |
| `bun run android`    | Build and run on Android emulator         |
| `bun run web`        | Start dev server for web                  |
| `bun run lint`       | Run ESLint                                |
| `npx expo doctor`    | Check for common configuration issues     |

---

## 🧪 Architecture Notes

### State Management

- **Server state** (API data): Managed via **TanStack React Query** — each API module exports hooks (`useMeQuery`, `useChatHistoryQuery`, `useInsightsQuery`, etc.)
- **Client state** (UI/local): Managed via **Zustand** stores in `store/`:
  - `useAuthStore` — Authentication tokens & user session
  - `useCheckinStore` — Daily check-in state
  - `useUserStore` — User profile data

### API Client

All API calls go through the centralized client in `lib/api/client.ts`. It handles:
- Base URL resolution from `EXPO_PUBLIC_API_URL`
- Bearer token injection from the auth store
- JSON parsing and error extraction
- FormData support for file uploads

### Authentication Flow

1. User signs up / logs in via email, Google, or Apple
2. Firebase Auth returns credentials
3. Backend endpoint validates and returns a JWT + refresh token
4. Tokens are stored in `expo-secure-store` and managed by `useAuthStore`

---

## 📄 License & Legal

This project is proprietary software owned by **Honeysuckle Co. LLC**. See the Terms of Service and Privacy Policy within the app for legal details.

- **Contact:** hello@thehoneysucklecompany.com
- **Website:** https://thehoneysucklecompany.com/

---

## 🤝 Contributing

Internal development only. For questions or support, reach out to the team at hello@thehoneysucklecompany.com.
