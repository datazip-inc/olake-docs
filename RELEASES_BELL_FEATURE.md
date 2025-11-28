# Releases Bell Notification Feature

## Overview
This feature adds a notification bell icon to the navbar that displays the latest GitHub releases from the OLake repository.

## Features
- 🔔 Bell icon in the navbar with a red notification badge showing the count of new releases
- 📋 Dropdown showing the latest 3 releases from https://github.com/datazip-inc/olake/releases
- 📅 Each release displays:
  - Version tag
  - Release date (formatted as "X days ago" or actual date)
  - Release name
  - Truncated description
- 🔗 "View More Releases" link that redirects to the full GitHub releases page
- 🌙 Dark mode support
- 📱 Mobile responsive design

## Files Added/Modified

### New Files Created:
1. **src/components/ReleasesBellNotification/ReleasesBellNotification.tsx**
   - Main React component for the notification bell
   - Fetches releases from GitHub API
   - Handles dropdown open/close state
   - Formats dates and truncates text

2. **src/components/ReleasesBellNotification/ReleasesBellNotification.module.css**
   - Styles for the bell icon, dropdown, and notification badge
   - Includes animations and hover effects
   - Dark mode and mobile responsive styles

3. **src/components/ReleasesBellNotification/index.ts**
   - Export file for easy imports

4. **src/clientModules/releasesBell.tsx**
   - Client-side module that mounts the bell component into the navbar
   - Uses React 18's createRoot API
   - Inserts the bell after the GitHub icon

5. **src/theme/NavbarItem/ReleasesBellNavbarItem.tsx**
   - Navbar item wrapper component (for potential future use)

### Modified Files:
1. **docusaurus.config.js**
   - Added clientModules configuration to load the releases bell

2. **src/theme/NavbarItem/ComponentTypes.tsx**
   - Registered the new releasesBell navbar item type

## How It Works
1. The client module (`releasesBell.tsx`) runs when the page loads
2. It finds the navbar and locates the GitHub icon
3. It creates a container and inserts it after the GitHub icon
4. It mounts the React component (`ReleasesBellNotification`) into the container
5. The component fetches the latest 3 releases from GitHub API
6. When clicked, it displays a dropdown with the release information

## Testing
To test the feature locally:
```bash
npm run start
```
Visit http://localhost:3000 and look for the bell icon in the navbar (next to the GitHub icon).

## API Used
- GitHub REST API: `https://api.github.com/repos/datazip-inc/olake/releases?per_page=3`
- No authentication required for public repositories
- Rate limit: 60 requests/hour for unauthenticated requests

## Future Enhancements
- Add localStorage to track viewed releases and only show badge for new ones
- Add caching to reduce API calls
- Add loading skeleton
- Add error state handling
- Add pagination or "load more" functionality

