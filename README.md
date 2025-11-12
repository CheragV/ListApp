# ListApp

User management app for Zeller code challenge. Fetches users from GraphQL API, stores them locally in SQLite, and provides full CRUD operations with filtering and search.

## What's implemented

- GraphQL integration using Apollo Client
- SQLite local database for offline-first architecture
- Add, update, delete users with form validation
- Filter by user type (Admin/Manager) and search by name
- Tab-based filtering with animated indicator
- Swipeable pages between All/Admin/Manager lists (using PagerView)
- Smooth horizontal animations for both swipe and tab clicks
- Toggleable search (click search icon to show/hide search bar)
- Pull-to-refresh functionality
- Alphabetically grouped user list with section headers
- Clean architecture with separation of concerns

## Tech Stack

- React Native + Expo SDK 54
- TypeScript (strict mode)
- Apollo Client for GraphQL
- Expo SQLite for local persistence
- React Navigation for routing
- Jest + React Native Testing Library
- Custom animated tab indicator

## Prerequisites

You'll need:
- Node.js 18+ 
- Xcode (for iOS) - get it from the Mac App Store
- CocoaPods - `sudo gem install cocoapods`
- Android Studio (if you want to run on Android)

Optional but helpful:
- Watchman - `brew install watchman`
- Expo Go app on your phone for quick testing

## Getting Started

### Quick Start (2 commands)

```bash
bash setup.sh    # Install dependencies (one time)
bash start.sh    # Start everything (opens new terminal tabs)
```

> **Note:** Using `bash` prefix works on any system without needing execute permissions.

The `start.sh` script automatically:
- Opens mock GraphQL server in a new tab (port 9002)
- Opens Expo dev server in another tab
- Once Expo starts, press `i` for iOS or `a` for Android

### Manual Start (if needed)

If you prefer to start things manually:

```bash
# Terminal 1 - Mock server
cd mock-server
npm start

# Terminal 2 - App
npm start
```

## Running it

```bash
npm start         # Start dev server
npm run ios       # Run on iOS simulator
npm run android   # Run on Android emulator
```

Or use Expo Go on your phone - just scan the QR code after running `npm start`.

## Tests

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # With coverage
```

## Project Structure

```
src/
├── components/      # Reusable components
├── screens/         # Screen components
├── navigation/      # Navigation setup
├── services/        # GraphQL and API calls
├── database/        # Local database setup
├── hooks/           # Custom hooks
├── utils/           # Helper functions
├── types/           # TypeScript types
└── __tests__/       # Tests
```

## Development notes

Using functional components and hooks throughout. TypeScript is configured pretty strictly, so you should get type errors if something's wrong.

For adding packages, use:
```bash
npx expo install <package-name>
```

This ensures Expo compatibility.

## Troubleshooting

If things break:

```bash
# Clear cache and restart
npx expo start -c

# Nuclear option - delete everything and reinstall
rm -rf node_modules
npm install
```

If the iOS build fails, try:
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

## Project Structure

The codebase follows clean architecture principles:

- **database/** - SQLite wrapper with async/await API
- **services/** - GraphQL client and API calls
- **hooks/** - Custom React hooks for data management
- **components/** - Reusable UI components
- **screens/** - Screen-level components
- **utils/** - Validation and helper functions
- **types/** - TypeScript type definitions
- **__tests__/** - Unit and component tests

## Implementation Highlights

**Database Layer**
- Custom SQLite wrapper with full CRUD operations
- Bulk insert for API sync
- Search functionality

**GraphQL Integration**
- Apollo Client setup with proper typing
- Network-first fetch policy
- Error handling

**Form Validation**
- Name validation (no special chars, max 50 chars)
- Email format validation
- Real-time error display

**Tab Animation**
- Animated indicator following active tab
- Spring animation for smooth transitions
- Follows the design spec

**Testing**
- Validation logic tests
- Helper function tests
- Component tests with React Native Testing Library

## Notes

- Mock server runs on port 9002
- Database is initialized on app startup
- All data fetched from GraphQL is stored locally first
- User operations (add/update/delete) are local-only
