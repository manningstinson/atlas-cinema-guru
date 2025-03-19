<<<<<<< HEAD

 
=======
>>>>>>> 4a98395f (updated dependency)
## 🔗 **[Live Site](https://atlas-cinema-guru-beta.vercel.app/)**

**Cinema Guru** is a full-stack movie tracking application built with Next.js, Tailwind CSS, and TypeScript. This application was developed as part of a school project to practice building a feature-rich, interactive movie database while integrating authentication, filtering, and dynamic UI components.

Users can browse movies, filter by year and genre, favorite movies, add them to a watch later list, and track their activity through a real-time activity feed.

</div>

**To explore its features**:

1. Log in using your GitHub account.
2. Browse movies, filter by year and genre, and view details.
3. Favorite movies or add them to the watch later list.
4. Track recent actions in the activity feed.

> **Note:** This project was developed for **educational purposes** and is not a production-ready application.

---

![cinema-guru](https://github.com/user-attachments/assets/73948a04-2b08-49c9-bf59-6479a5b8e696)


---

## Table of Contents

- [Usage Guide](#usage-guide)
- [Tech Stack](#tech-stack)
- [Project Overview & Learning Objectives](#project-overview--learning-objectives)
- [Design Reference](#design-reference)
- [Project Setup & Implementation](#project-setup--implementation)
- [Task 0: Getting Started](#task-0-getting-started)
- [Task 1: Authentication & Layout](#task-1-authentication--layout)
- [Task 2: Home Page](#task-2-home-page)
- [Task 3: Favorites Page](#task-3-favorites-page)
- [Task 4: Watch Later Page](#task-4-watch-later-page)
- [Task 5: Latest Activity Feed](#task-5-latest-activity-feed)
- [Task 6: Deploy Application](#task-6-deploy-application)
- [Reflection](#reflection)

---

## Usage Guide

### User Authentication

- Users must log in with GitHub to access the app.
- Unauthenticated users are redirected to the login page.
- The header displays the logged-in user’s email and provides a logout option.

### Browsing Movies

- Use the search bar to filter movies by title.
- Select Min Year and Max Year to filter movies by release year.
- Choose one or more genres to refine your search.

### Favoriting & Watch Later

- Click the **⭐ Favorite** button to add or remove a movie from your Favorites list.
- Click the **🕓 Watch Later** button to save a movie for later viewing.
- Access your **Favorites** and **Watch Later** lists through the sidebar.

### Pagination

- Movies are paginated, showing 6 titles per page. Click **Next** or **Previous** at the bottom to navigate.

---

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS, TypeScript
- **Backend:** Next.js API Routes, PostgreSQL
- **Authentication:** Auth.js (GitHub OAuth)
- **Hosting:** Vercel

---

## Project Overview & Learning Objectives

This project was developed as part of a school curriculum to enhance skills in:

- Translating a Figma design into a fully functional application.
- Building a React front-end that interacts with a backend API.
- Integrating authentication using Auth.js (GitHub OAuth).
- Managing state effectively with server and client-side rendering.
- Styling complex UI components using Tailwind CSS.

---

## Design Reference

- **[Figma Prototype](https://www.figma.com/design/AWVM8Ak0kY6aTdEbiqscFb/Cinema-Guru?node-id=0-1&p=f&t=gSfaV6yrvbIyl7kW-0)**
- **[Project Overview Video](https://www.loom.com/share/8eb1e6cf1c3c435a8d1d8d64d04cc86c?sid=80baa4ed-8658-49ef-a5dd-5cb591b35530)**

---

## Project Setup & Implementation

This project was developed in multiple stages, beginning with setting up the environment, configuring the database, and ensuring a functional authentication system. Each task focused on progressively building core features while maintaining a clean and accessible UI.

The following sections break down the implementation process, including the challenges encountered and the solutions applied.

---

## Task 0: Getting Started

### Resources:

- [Next.js Documentation](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vercel](https://vercel.com/)
- [Setting up a Database on Vercel](https://atlas-jswank.github.io/blog/next-js-database/)
- [Seeding a Database](https://en.wikipedia.org/wiki/Database_seeding)

### What I Did:

1. **Cloned the Starter Repository**
   - Used the provided **GitHub template** and created a new repository from [https://github.com/atlas-jswank/atlas-cinema-guru](https://github.com/atlas-jswank/atlas-cinema-guru)
2. **Installed Dependencies**

   - Ran `npm install` to install all necessary dependencies.

3. **Ran the Development Server**

   - Started the local dev server using:
     ```bash
     npm run dev
     ```
   - Opened `http://localhost:3000/` to verify that the starter template was working.

4. **Set Up the Database**
   - Created a **new PostgreSQL database** in Vercel.
   - Configured the **.env.local** file with the required database credentials:
     ```
     POSTGRES_URL=your_database_url
     POSTGRES_PRISMA_URL=your_database_prisma_url
     POSTGRES_URL_NON_POOLING=your_database_non_pooling_url
     POSTGRES_USER=your_user
     POSTGRES_HOST=your_host
     POSTGRES_PASSWORD=your_password
     POSTGRES_DATABASE=your_database
     ```
   - Seeded the database by calling:
     ```bash
     curl http://localhost:3000/api/seed
     ```
   - This created the required database tables and populated them with initial data.

### Result:

- Successfully set up the project and database.
- The starter template was running locally with seeded data.

---

## Task 1: Authentication & Layout

### Resources:

- [OAuth with GitHub](https://authjs.dev/guides/configuring-github)
- [Get Session](https://authjs.dev/getting-started/session-management/get-session)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)

### What I Did:

#### 1. Implemented GitHub Authentication

- Integrated **GitHub OAuth** using **NextAuth.js**, allowing users to log in via their **GitHub accounts**.
- Configured **GitHubProvider** in the authentication setup, using environment variables (`GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`).
- Ensured authentication state was available throughout the app by wrapping everything in `SessionProvider`.

#### 2. Created Authentication API Route

- Implemented `app/api/auth/[...nextauth]/route.ts` to handle authentication requests (login/logout) using NextAuth.js handlers.
- This route manages authentication flows securely and redirects users based on their session state.

#### 3. Restricted Access to Logged-in Users

- Configured authentication callbacks to redirect unauthenticated users to the login page.
- Modified `auth.ts` to ensure that all pages require authentication before allowing access.

#### 4. Added Logged-in User Info in the Header

- Created `app/components/Header.tsx` to:
  - Display the logged-in user’s email address.
  - Include a log out button that securely logs users out.
  - Styled the header to match the Figma design.

#### 5. Built the Sidebar with Activity Feed

- Created `app/components/Dashboard.tsx` to:
  - Have a collapsed sidebar by default.
  - Expand on hover.
  - Contain links to Home, Favorites, and Watch Later.
  - Display a dynamically updated Activity Feed (which was fully implemented in Task 5).

#### 6. Updated App Layout Structure

- Modified `app/layout.tsx` to:
  - Include Header and DashboardSidebar for consistent navigation across all pages.
  - Ensure responsiveness so that the sidebar works correctly on both mobile and desktop.

### Result:

- Users can log in via GitHub and log out securely.
- Unauthenticated users are automatically redirected to the login page.
- The app now has a consistent layout that includes a header and sidebar.
- The sidebar is collapsed by default and expands when hovered over.
- The Activity Feed framework was set up (fully implemented in **Task 5**).

### Troubleshooting:

**Issue: "Invalid Provider" Error in NextAuth**

- Authentication initially failed due to missing `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.
- Fixed by **adding values to `.env.local`** and restarting the dev server.

**Issue: Sidebar Not Expanding on Hover**

- The sidebar did not expand correctly.
- Fixed by **adjusting hover states** and **transition effects** in Tailwind CSS.

---

## Task 2: Home Page

### Requirements:

- **URL: `/`**
- **Access Restriction:** Only logged-in users can access the page.
- **Filtering & Paging:** Users can filter movies by **title, year, and genre**. The page includes pagination.
- **Movie Cards:** Display movie information and allow users to favorite or add movies to watch later.

### What I Did:

#### 1. Restricted Home Page to Logged-in Users

- Modified the **`GET /api/titles`** route to check authentication status using NextAuth.
- Ensured that users must be logged in to fetch movie data. If unauthorized, the API returns a `401 Unauthorized` response.

#### 2. Implemented Movie Filtering & Search

- Users can search for movies by title (case-insensitive).
- Min Year and Max Year inputs allow filtering movies by release year.
- Users can filter movies by selecting multiple genres. The list of selected genres updates dynamically.

#### 3. Implemented Pagination

- Added pagination controls to navigate between pages of movie results. 6 movies per page.

#### 4. Refactored Movie Fetching API (`GET /api/titles`)

- **Updated Query Parameters Handling:**
  - Trimmed search queries to avoid extra spaces.
  - Parsed and validated the `page`, `minYear`, and `maxYear` parameters.
  - Ensured proper handling of multiple selected genres.
- **Optimized Data Fetching:**
  - Used database queries to fetch movies, ensuring efficient pagination and filtering.
  - Removed unnecessary default genre fetches to avoid unintended behavior.

#### 5. Created Movie Display Components

- **`Filters.tsx`**:

  - Search input, year range inputs, and genre selection UI.
  - Allows users to refine their movie search dynamically.

- **`MovieCard.tsx`**:

  - Displays movie title, image, description, release year, and genre.
  - When hovered, it reveals:
    - Favorite & Watch Later buttons (interactive).
    - The title, description, and release year of the movie.

- **`MovieList.tsx`**:

  - Displays a grid of MovieCards.
  - Updates dynamically when filters or pagination change.

- **`Pagination.tsx`**:
  - Allows users to navigate through multiple pages of movie results.
  - Updates the displayed movies when clicking "Next" or "Previous."

#### 6. Edited `app/page.tsx`

- Integrated:
  - **Filters Component** to allow searching and filtering.
  - **Movie List Component** to display filtered results.
  - **Pagination Component** to enable navigating between pages.
- Implemented **React state hooks (`useState`, `useEffect`, `useCallback`)** to manage movies, filters, and pagination dynamically.
- **Ensured accessibility** by adding appropriate ARIA roles and `aria-live` attributes.

### Result:

- The home page is now fully functional, filtering movies by:
  - **Title (search)**
  - **Release year (min/max year)**
  - **Genres (multi-selection)**
- **Pagination works correctly**, allowing users to browse movies across multiple pages.
- **Movie hover effects work**, displaying additional details and interactive buttons.
- **Movies can be favorited or added to "Watch Later"**, with visual indicators.

---

## Task 3: Favorites Page

### Requirements:

- **URL:** `/favorites`
- **Access Restriction:** Only logged-in users can access the page.
- **Display Favorite Movies:** Lists all movies that the user has added to their favorites.
- **Pagination Support:** Users can navigate through multiple pages of favorites.
- **Movie Card Functionality:** The movie card should retain all interactivity and behavior from the home page.

### What I Did:

#### 1. Implemented Favorites Page (`/favorites`)

- Created **`app/favorites/page.tsx`** to display a paginated list of the user’s favorite movies.
- Used state management (`useState`, `useEffect`, `useCallback`) to:
  - Fetch favorite movies from the backend.
  - Handle pagination dynamically.
  - Update the UI when a movie is favorited/unfavorited.
  - Support toggling watch later directly from the favorites page.

#### 2. Refactored Favorites Logic in `lib/data.ts`

- Updated database queries to:
  - Include pagination support for retrieving favorite movies.
  - Return `totalPages` for better frontend navigation.
  - Prevent duplicate entries when adding favorites.
- **Improved Error Handling**:
  - Logged errors for better debugging.
  - Ensured database transactions were safely managed.

#### 3. Updated API Endpoints for Favorites

- **Refactored `GET /api/favorites`**
  - Ensured users must be logged in.
  - Validated query parameters (`page`, etc.).
  - Returned favorite movies and total pages for pagination.
- **Updated `POST /api/favorites/:id`**
  - Checked if the movie was already favorited before inserting.
  - Ensured proper error handling.
- **Updated `DELETE /api/favorites/:id`**
  - Allowed users to remove movies from their favorites list.
  - Ensured transactions were properly handled.

#### 4. Ensured UI Accessibility & Responsiveness

- Heading (`Favorites`) follows accessibility best practices.
- ARIA attributes (`aria-live`, `aria-labelledby`) added for screen readers.
- Mobile-friendly layout with proper spacing.

#### 5. Pagination Support

- Clicking "Next" or "Previous" updates the favorite movies list dynamically.
- Ensured total page count is correctly fetched from the API.

#### 6. Ensured Consistency with the Home Page

- The **Movie Card Component** in `/favorites` now:
  - Displays hover effects for movie details.
  - Allows favoriting/unfavoriting movies.
  - Supports watch later toggling from the favorites page.

### Result:

- The **Favorites Page** now:
  - Displays favorited movies in a paginated format.
  - Allows users to remove movies from favorites.
  - Supports watch later toggling.
  - Maintains accessibility & responsiveness.
- API calls are secure, optimized, and handle edge cases.

---

## Task 4: Watch Later Page

### Requirements:

- **URL:** `/watch-later`
- **Access Restriction:** Only logged-in users can access the page.
- **Display Watch Later Movies:** Lists all movies the user has added to their "Watch Later" list.
- **Pagination Support:** Users can navigate through multiple pages.
- **Movie Card Functionality:** The movie card should have the same interactive elements and behavior as those on the home page.

### What I Did:

#### 1. Implemented the Watch Later Page (`/watch-later`)

- Created **`app/watch-later/page.tsx`** to display movies added to the watch later list.
- Used state management (`useState`, `useEffect`, `useCallback`) to:
  - Fetch the list of "watch later" movies from the backend.
  - Handle pagination dynamically.
  - Update the UI when movies are added/removed from watch later or favorites.

#### 2. Refactored Watch Later Logic in `lib/data.ts`

- Updated database queries to:
  - Include pagination support for fetching "watch later" movies.
  - Return `totalPages` for improved frontend navigation.
  - Prevent duplicate entries when adding movies to the list.
- Improved Error Handling:
  - Logged errors for better debugging.
  - Ensured database transactions were safely managed.

#### 3. Updated API Endpoints for Watch Later

- **Refactored `GET /api/watch-later`**
  - Ensured users must be logged in to fetch their "watch later" movies.
  - Added support for pagination.
  - Returned movies and total pages for better UI navigation.
- **Updated `POST /api/watch-later/:id`**
  - Checked if the movie was already in the "Watch Later" list before inserting.
  - Ensured proper error handling.
- **Updated `DELETE /api/watch-later/:id`**
  - Allowed users to remove movies from their "Watch Later" list.
  - Ensured transactions were properly handled.

#### 4. Ensured UI Accessibility & Responsiveness

- Heading (`Watch Later`) follows accessibility best practices.
- ARIA attributes (`aria-live`, `aria-labelledby`) added for screen readers.
- Mobile-friendly layout with proper spacing.

#### 5. Pagination Support

- **Clicking "Next" or "Previous" updates the watch later list dynamically**.
- Ensured **total page count is correctly fetched from the API**.

#### 6. Ensured Consistency with the Home Page

- The **Movie Card Component** in `/watch-later` now:
  - Displays hover effects for movie details.
  - Allows adding/removing movies from Watch Later.
  - Supports favoriting/unfavoriting movies directly from the watch later list.

### Result:

- The **Watch Later Page** now:
  - Displays movies added to the user's watch later list.
  - Allows users to remove movies from watch later.
  - Supports favoriting/unfavoriting directly from watch later.
  - Handles pagination efficiently.
  - Maintains accessibility & responsiveness.
- API calls are secure, optimized, and handle edge cases.

---

## Task 5: Latest Activity Feed

### Resources:

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/api-routes)
- [Fetching Data in Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Date Formatting in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)

### What I Did:

#### 1. Implemented the Activity Feed in the Sidebar

- Created `app/components/ActivityFeed.tsx` to display a list of recent activities.
- Activities include:
  - Favoriting a movie.
  - Adding a movie to Watch Later.
- Each activity displays:
  - Date and time of the action.
  - Movie title.
  - Action performed (Favorited or Watch Later).

#### 2. Fetched User Activity Data

- Used Next.js API routes to fetch activities dynamically.
- Created a state variable (`refreshTrigger`) to update the feed when new actions are performed.
- Ensured API calls are efficient and only fetch the latest activity (no pagination required).

#### 3. Connected Activity Feed to Sidebar

- Updated `app/components/Dashboard.tsx` to:
  - Expand the sidebar on hover.
  - Display the Activity Feed only when expanded.

#### 4. Ensured Accessibility & Readability

- Added `aria-live="polite"` to make sure updates are read aloud by screen readers.
- Used `aria-busy="true"` when loading to indicate activity updates are happening.
- Formatted timestamps to show both date and time in a readable format.

### Result:

- The Activity Feed is now fully functional.
- Users can see a list of their most recent actions (favoriting movies and adding to Watch Later).
- The sidebar expands properly, showing latest activities dynamically.
- State updates automatically when new actions occur.
- Accessibility improvements ensure screen readers correctly read updates.

---

## Task 6: Deploy Application

### Resources:

- [Deploying from GitHub](https://vercel.com/docs/getting-started-with-vercel/import)
- [Managing Environment Variables on Vercel](https://vercel.com/docs/environment-variables/managing-environment-variables)

### What I Did:

#### 1. Updated Environment Variables on Vercel

- Environment variables defined locally were manually added to Vercel.
- Specifically, updated the following variables:
  - `NEXTAUTH_URL` → Set to the **Vercel deployment URL** (`https://atlas-cinema-guru-beta.vercel.app/`).
  - `NEXTAUTH_CALLBACK_URL` → Updated to match **GitHub OAuth settings**.
  - `GITHUB_CLIENT_SECRET` → Updated as required.

#### 2. Verified Functionality in Production

- Tested all features to ensure they work as expected in the deployed environment.
  - **Authentication with GitHub** worked properly.
  - **Filtering, pagination, and movie interactions** (favorites, watch later) functioned without issues.
  - **Activity feed updated correctly** when movies were added to lists.
  - **API endpoints responded as expected**.

### Result:

- The application is **fully deployed and accessible** at:  
  **[https://atlas-cinema-guru-beta.vercel.app/](https://atlas-cinema-guru-beta.vercel.app/)**
- All features function correctly in production.
- Environment variables match the local setup to ensure consistency.

---

## Reflection

This project was a great challenge in expanding upon existing source code while ensuring the design matched the Figma layout. It deepened my understanding of when to use Next.js server components vs. client components, how to structure API calls efficiently, and how to integrate authentication, filtering, and dynamic updates seamlessly. Troubleshooting issues—from authentication errors to ensuring Tailwind styles maintained accessibility and responsiveness—helped me refine my debugging process and overall proficiency. Each task strengthened my ability to translate designs into functional, user-friendly applications, and I look forward to applying these skills in future projects.

With love,

[Vie P](https://whatdoyouknowaboutlove.com/viepaula/)
