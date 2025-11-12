# Architecture Overview

## Design Decisions

### Database Layer
Chose Expo SQLite for local persistence because:
- Native performance
- Simple async/await API
- No additional dependencies
- Good Expo integration

The database module wraps SQLite with:
- Type-safe operations
- Error handling
- Batch operations for sync
- Search functionality

### State Management
Using custom hooks instead of Redux/MobX because:
- Simpler for this use case
- Better TypeScript inference
- Easier testing
- Less boilerplate

`useUsers` hook encapsulates all user-related logic:
- Data fetching
- Local CRUD operations
- Filtering and search
- Refresh logic

### GraphQL Integration
Apollo Client provides:
- Automatic request deduplication
- Built-in caching
- TypeScript code generation support
- Standard industry solution

Network-first fetch policy ensures fresh data on sync while falling back to local database.

### Form Validation
Validation logic is separated into utility functions:
- Testable in isolation
- Reusable across components
- Clear error messages
- Follows requirements exactly

### Component Structure
Components follow single responsibility:
- `Avatar` - User initials display
- `UserListItem` - Individual list item
- `SectionHeader` - Alphabetical sections
- `SearchBar` - Search input with clear
- `TabButton` - Tab selector

### Tab Design
Animated pill-style tab selector matching the design spec:
- Grey rounded background container
- Animated indicator slides horizontally between tabs
- Uses spring animation for natural feel
- Active tab: blue text with light blue indicator
- Inactive tabs: gray text
- Clean, minimal design

Search is a toggle feature:
- Search icon in header opens search bar
- Search bar replaces tabs when active
- Close icon returns to tab view

### Swipe Functionality
PagerView implementation for tab content:
- Uses `react-native-pager-view` for native swipe gestures
- Three pages: All, Admin, Manager
- Bidirectional sync: swipe updates tabs, tab click updates page
- Each page has its own SectionList with filtered data
- Smooth page transitions with native animations

### Animation
Tab indicator animation:
- React Native Animated API with spring physics
- Smooth horizontal transition between tabs
- Damping: 20, Stiffness: 90 for natural movement
- Transform-based animation for 60fps performance
- Syncs with both tab clicks and PagerView swipes

### Testing Strategy
Tests cover:
- **Unit tests** - Validation and helper functions
- **Component tests** - UI rendering and interaction
- **Integration tests** - Could be added for full user flows

Using React Native Testing Library follows best practices for testing user behavior rather than implementation details.

## Trade-offs

**Expo vs Bare React Native**
- Chose Expo for easier setup and better compatibility
- Trade-off: Slightly larger app size, but gains easier development and deployment

**Local-only mutations**
- Add/update/delete operations don't sync to API
- Simpler implementation, matches requirements
- In production, would add mutation support with optimistic updates

**No state management library**
- Context + hooks sufficient for this app size
- Would add Redux if app grows significantly

**SQLite vs WatermelonDB/Realm**
- SQLite is simpler and sufficient for this use case
- WatermelonDB would be better for very large datasets
- Realm adds complexity without clear benefit here

## Future Improvements

If this were production:

1. **Offline queue** - Queue mutations while offline
2. **Conflict resolution** - Handle concurrent updates
3. **Pagination** - For large user lists
4. **Search optimization** - Full-text search with indexing
5. **Error boundaries** - Graceful error handling
6. **Analytics** - Track user behavior
7. **Performance monitoring** - Monitor app performance
8. **Accessibility** - Screen reader support, touch targets
9. **Internationalization** - Multi-language support
10. **E2E tests** - Detox or similar for full app testing
