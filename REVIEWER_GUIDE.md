# Reviewer Quick Start Guide

## Running the App (2 commands)

```bash
bash setup.sh    # One time setup
bash start.sh    # Start everything
```

That's it! The `start.sh` script opens two new terminal tabs:
1. Mock GraphQL server (port 9002)
2. Expo dev server

Once Expo starts, press `i` for iOS or `a` for Android.

### Manual Alternative

If you prefer manual control:

```bash
# Terminal 1
cd mock-server && npm start

# Terminal 2
npm start
```

## Testing the Features

### Initial Load
- App fetches 4 users from GraphQL on startup
- Users are stored in SQLite
- List shows alphabetically grouped users

### Tab Switching & Swipe
- **Click tabs**: Click All/Admin/Manager tabs to switch
- **Swipe**: Swipe left/right to navigate between pages
- **Indicator animation**: Watch the blue indicator smoothly slide to the active tab
- **Two-way sync**: Swiping updates the tab, clicking tabs updates the page
- Active tab shows blue text with light blue indicator behind
- List filters automatically

### Search
- Click search icon (top right) to open search bar
- Type to filter users in real-time
- Click X icon to close search and return to tabs
- Search works across currently selected tab filter

### Add User
- Tap blue + button (bottom right)
- Fill in: First Name, Last Name, Email
- Select Admin or Manager role
- Tap "Create User"
- Validation errors show if invalid

### Pull to Refresh
- Pull down on user list
- Syncs latest data from GraphQL
- Shows loading indicator

## Running Tests

```bash
npm test              # All tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```


## Code to Review

**Architecture**
- `src/database/db.ts` - Clean database abstraction
- `src/hooks/useUsers.ts` - State management
- `src/services/graphql.ts` - API integration

**UI Implementation**
- `src/screens/HomeScreen.tsx` - Tab animations
- `src/screens/AddUserScreen.tsx` - Form with validation
- `src/components/` - Reusable components

**Testing**
- `src/__tests__/` - Unit and component tests

**Documentation**
- `ARCHITECTURE.md` - Design decisions
- `README.md` - Setup and overview

## What's Working

✅ GraphQL data fetching
✅ SQLite local storage
✅ Add/update/delete users
✅ Form validation (all requirements)
✅ Tab filtering with animations
✅ **Swipeable pages** (react-native-pager-view)
✅ Tab ↔ Swipe bidirectional sync
✅ Search functionality
✅ Pull-to-refresh
✅ Alphabetical grouping
✅ TypeScript strict mode
✅ Unit & component tests
✅ Clean, modular, documented code

## Notes

- Using Expo for compatibility
- Mock server must be running
- First launch syncs data from GraphQL
- All user mutations are local-only (per requirements)
- iOS and Android both supported
