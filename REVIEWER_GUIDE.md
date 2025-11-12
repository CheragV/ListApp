# Quick Start for Reviewers

## Getting it running

Just two commands:

```bash
bash setup.sh    # First time only
bash start.sh    # Every time after
```

The start script will open two terminal tabs - one for the mock server (port 9002) and one for Expo. When Expo's ready, hit `i` for iOS or `a` for Android.

If you don't like the auto-tab thing:

```bash
# Terminal 1
cd mock-server && npm start

# Terminal 2
npm start
```

## Features to check out

**When it first loads:**
The app grabs 4 test users from the GraphQL server and stores them in SQLite. They show up grouped alphabetically.

**Tab navigation:**
You can click between All/Admin/Manager tabs, or just swipe left and right. The blue indicator animates to follow along. Try both - they sync with each other.

**Search:**
Tap the search icon in the top right to bring up the search bar. Type to filter users, click the X to close it. Works within whatever tab you're on.

**Adding users:**
Hit the blue + button, fill in first name, last name, email, pick a role, and create. Form validation will catch mistakes.

**Editing users:**
Tap any user to edit their info or delete them.

**Pull to refresh:**
Drag down on the list to sync with the GraphQL server again.

## Tests

```bash
npm test              # All tests
npm run test:watch    # Watch mode
npm run test:coverage # See coverage
```

Currently sitting at ~92% coverage.

## Files worth looking at

If you want to dig into the code:

**Core architecture:**
- `src/database/db.ts` - SQLite wrapper
- `src/hooks/useUsers.ts` - Main data/state management
- `src/services/graphql.ts` - Apollo setup

**UI stuff:**
- `src/screens/HomeScreen.tsx` - Tab animations and swipe handling
- `src/screens/AddUserScreen.tsx` - Form with validation
- `src/screens/ProfileScreen.tsx` - Edit/delete users
- `src/components/` - Reusable bits

**Tests:**
- `src/__tests__/` - Unit and component tests

**Docs:**
- `README.md` - Setup instructions
- `ARCHITECTURE.md` - Design decisions (if you care about that)

## What works

The main stuff:
- GraphQL fetching from mock server
- SQLite storage for offline use
- Create/edit/delete users
- Form validation (names, emails)
- Tab switching with smooth animations
- Swipe between tabs (or click - both work)
- Search that filters in real-time
- Pull to refresh
- Alphabetical grouping
- TypeScript everywhere (strict mode on)
- Tests for the important parts

## Couple of notes

Using Expo because it makes cross-platform easier. Mock server has to be running or the initial data fetch fails. First time you launch it syncs from GraphQL, after that it's all local. User changes (add/edit/delete) only touch the local database - no API mutations.

Works on both iOS and Android.
