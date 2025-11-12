# ListApp

A user management app built for the Zeller coding challenge. It pulls users from a GraphQL API, stores them in SQLite locally, and lets you do the usual CRUD stuff with some filtering and search thrown in.

## What's in here

Built out a few things:
- GraphQL integration (using Apollo Client)
- SQLite for local storage - works offline
- Add/edit/delete users with validation
- Filter by Admin or Manager role
- Search by name
- Tab navigation with that animated blue indicator
- Swipeable pages (you can swipe between tabs or just click them)
- Search bar that slides in when you tap the icon
- Pull down to refresh
- Users grouped alphabetically with section headers

## Stack

React Native with Expo (SDK 54), TypeScript in strict mode, Apollo Client for the GraphQL stuff, SQLite for local data, React Navigation, and Jest for testing. Pretty standard setup.

## Before you start

Make sure you have:
- Node 18 or higher
- Xcode if you're on Mac (grab it from the App Store)
- CocoaPods: `sudo gem install cocoapods`
- Android Studio if you want Android support

Nice to have:
- Watchman (`brew install watchman`) - makes things faster
- Expo Go on your phone for quick testing

## Getting Started

Easiest way - just run these two commands:

```bash
bash setup.sh    # One time thing to install everything
bash start.sh    # Starts the servers
```

The start script opens two terminal tabs - one for the mock GraphQL server (on port 9002) and one for Expo. Once Expo's running, just press `i` for iOS or `a` for Android.

If you don't want the automatic tab thing, you can do it manually:

```bash
# Terminal 1
cd mock-server && npm start

# Terminal 2
npm start
```

Then press `i` or `a` when prompted.

You can also scan the QR code with Expo Go on your phone if you prefer that.

## Tests

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode for development
npm test -- --coverage # See coverage report
```

Got around 92% coverage on the important stuff.

## Project Structure

Pretty straightforward:

```
src/
├── components/      # UI components
├── screens/         # Main screens
├── navigation/      # Navigation config
├── services/        # GraphQL stuff
├── database/        # SQLite wrapper
├── hooks/           # Custom hooks
├── utils/           # Helpers and validation
├── types/           # TypeScript definitions
└── __tests__/       # Tests
```

## Development

Using functional components everywhere. TypeScript's in strict mode so it'll yell at you if something's wrong - which is good.

If you need to add packages:
```bash
npx expo install <package-name>
```
This keeps everything compatible with Expo.

## When things go wrong

Clear the cache first:
```bash
npx expo start -c
```

If that doesn't work:
```bash
rm -rf node_modules
npm install
```

iOS giving you trouble? Try this:
```bash
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
```

## How it's built

**Database**: Custom SQLite wrapper with async/await. Has all the usual CRUD stuff plus search and bulk inserts for syncing with the API.

**GraphQL**: Apollo Client with TypeScript types. Fetches from the mock server on port 9002.

**Validation**: Name can't have special characters (max 50 chars), email format is checked, errors show up as you type.

**Animations**: The tab indicator uses spring animations to follow whichever tab is active. Works whether you swipe or click.

**Tests**: Covered the validation logic, helper functions, and main components. Used React Native Testing Library for the component tests.

## Quick notes

- Mock server needs to be running (port 9002)
- Database gets set up automatically on first launch
- GraphQL data is cached locally in SQLite
- Add/update/delete operations only touch the local database
