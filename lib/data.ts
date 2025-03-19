import { db } from "./db";

/**
 * Query all titles with filtering and pagination.
 */
export async function fetchTitles(
  page: number,
  minYear: number,
  maxYear: number,
  query: string,
  genres: string[],
  userEmail: string,
) {
  try {
    const ITEMS_PER_PAGE = 6;

    // Fetch user's favorited and watch later movie IDs
    const favoritedMovies = (
      await db
        .selectFrom("favorites")
        .select("title_id")
        .where("user_id", "=", userEmail)
        .execute()
    ).map((row) => row.title_id);

    const watchLaterMovies = (
      await db
        .selectFrom("watchlater")
        .select("title_id")
        .where("user_id", "=", userEmail)
        .execute()
    ).map((row) => row.title_id);

    // Get total count of movies that match the filters
    let countQuery = db
      .selectFrom("titles")
      .select(({ fn }) => fn.count<number>("id").as("total"));

    if (minYear > 0) {
      countQuery = countQuery.where("titles.released", ">=", minYear);
    }
    if (maxYear <= new Date().getFullYear()) {
      countQuery = countQuery.where("titles.released", "<=", maxYear);
    }
    if (query) {
      countQuery = countQuery.where("titles.title", "ilike", `%${query}%`);
    }
    if (genres.length > 0) {
      countQuery = countQuery.where("titles.genre", "in", genres);
    }

    const countResult = await countQuery.execute();
    const totalTitles = countResult[0]?.total ?? 0;
    const totalPages = Math.ceil(totalTitles / ITEMS_PER_PAGE);

    // Get paginated movie list
    let queryBuilder = db
      .selectFrom("titles")
      .selectAll()
      .orderBy("titles.title", "asc")
      .limit(ITEMS_PER_PAGE)
      .offset((page - 1) * ITEMS_PER_PAGE);

    if (minYear > 0) {
      queryBuilder = queryBuilder.where("titles.released", ">=", minYear);
    }
    if (maxYear <= new Date().getFullYear()) {
      queryBuilder = queryBuilder.where("titles.released", "<=", maxYear);
    }
    if (query) {
      queryBuilder = queryBuilder.where("titles.title", "ilike", `%${query}%`);
    }
    if (genres.length > 0) {
      queryBuilder = queryBuilder.where("titles.genre", "in", genres);
    }

    const titles = await queryBuilder.execute();

    return {
      titles: titles.map((row) => ({
        ...row,
        favorited: favoritedMovies.includes(row.id),
        watchLater: watchLaterMovies.includes(row.id),
        image: `/images/${row.id}.webp`,
      })),
      totalPages,
    };
  } catch (error) {
    console.error("Database Error - Failed to fetch titles:", error);
    throw new Error("Failed to fetch titles.");
  }
}

/**
 * Get a users favorites list.
 */
export async function fetchFavorites(page: number, userEmail: string) {
  try {
    const ITEMS_PER_PAGE = 6;

    // Get watch later movie IDs
    const watchLater = (
      await db
        .selectFrom("watchlater")
        .select("title_id")
        .where("user_id", "=", userEmail)
        .execute()
    ).map((row) => row.title_id);

    // Count total favorites
    const countResult = await db
      .selectFrom("favorites")
      .select(({ fn }) => fn.count<number>("title_id").as("total"))
      .where("favorites.user_id", "=", userEmail)
      .execute();

    const totalFavorites = countResult[0]?.total ?? 0;
    const totalPages = Math.ceil(totalFavorites / ITEMS_PER_PAGE);

    // Get paginated favorite movies
    const titles = await db
      .selectFrom("titles")
      .selectAll("titles")
      .innerJoin("favorites", "titles.id", "favorites.title_id")
      .where("favorites.user_id", "=", userEmail)
      .orderBy("titles.released", "asc")
      .limit(ITEMS_PER_PAGE)
      .offset((page - 1) * ITEMS_PER_PAGE)
      .execute();

    return {
      favorites: titles.map((row) => ({
        ...row,
        favorited: true,
        watchLater: watchLater.includes(row.id),
        image: `/images/${row.id}.webp`,
      })),
      totalPages,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch favorites.");
  }
}

/**
 *  Add a title to a user's favorites list.
 */
export async function insertFavorite(title_id: string, userEmail: string) {
  try {
    await db
      .insertInto("favorites")
      .values({ title_id, user_id: userEmail })
      .execute();
    await insertActivity(title_id, userEmail, "FAVORITED");
    return { message: "Favorite Added" };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add favorite.");
  }
}

/**
 * Remove a title from a user's favorites list.
 */
export async function deleteFavorite(title_id: string, userEmail: string) {
  try {
    const result = await db
      .deleteFrom("favorites")
      .where("title_id", "=", title_id)
      .where("user_id", "=", userEmail)
      .returning(["title_id"])
      .execute();

    if (result.length === 0) {
      return {
        message: "Favorite not found or already removed",
        success: false,
      };
    }

    await db
      .deleteFrom("activities")
      .where("title_id", "=", title_id)
      .where("user_id", "=", userEmail)
      .where("activity", "=", "FAVORITED")
      .execute();

    return { message: "Favorite removed successfully", success: true };
  } catch (error) {
    console.error("Database Error - Failed to delete favorite:", error);
    return { error: "Failed to delete favorite.", success: false };
  }
}

/**
 * Check if a title is in a users favorites list.
 */
export async function favoriteExists(
  title_id: string,
  userEmail: string,
): Promise<boolean> {
  try {
    const data = await db
      .selectFrom("favorites")
      .select("title_id")
      .where("title_id", "=", title_id)
      .where("user_id", "=", userEmail)
      .execute();

    return data.length > 0;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch favorite.");
  }
}

/**
 * Get a users watch later list.
 */
export async function fetchWatchLaters(page: number, userEmail: string) {
  try {
    const ITEMS_PER_PAGE = 6;

    // Get favorite movie IDs
    const favorites = (
      await db
        .selectFrom("favorites")
        .select("title_id")
        .where("user_id", "=", userEmail)
        .execute()
    ).map((row) => row.title_id);

    // Count total watch later movies
    const countResult = await db
      .selectFrom("watchlater")
      .select(({ fn }) => fn.count<number>("title_id").as("total"))
      .where("watchlater.user_id", "=", userEmail)
      .execute();

    const totalWatchLater = countResult[0]?.total ?? 0;
    const totalPages = Math.ceil(totalWatchLater / ITEMS_PER_PAGE);

    // Get paginated watch later movies
    const titles = await db
      .selectFrom("titles")
      .selectAll("titles")
      .innerJoin("watchlater", "titles.id", "watchlater.title_id")
      .where("watchlater.user_id", "=", userEmail)
      .orderBy("titles.released", "asc")
      .limit(ITEMS_PER_PAGE)
      .offset((page - 1) * ITEMS_PER_PAGE)
      .execute();

    return {
      watchLater: titles.map((row) => ({
        ...row,
        favorited: favorites.includes(row.id),
        watchLater: true,
        image: `/images/${row.id}.webp`,
      })),
      totalPages,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch watch later movies.");
  }
}

/**
 * Add a title to a user's watch later list.
 */
export async function insertWatchLater(title_id: string, userEmail: string) {
  try {
    await db
      .insertInto("watchlater")
      .values({ title_id, user_id: userEmail })
      .execute();
    await insertActivity(title_id, userEmail, "WATCH_LATER");
    return { message: "Added to Watch Later" };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add watch later.");
  }
}

/**
 * Remove a title from a user's watch later list.
 */
export async function deleteWatchLater(title_id: string, userEmail: string) {
  try {
    const result = await db
      .deleteFrom("watchlater")
      .where("title_id", "=", title_id)
      .where("user_id", "=", userEmail)
      .returning(["title_id"])
      .execute();

    if (result.length === 0) {
      return {
        message: "Watch Later entry not found or already removed",
        success: false,
      };
    }

    await db
      .deleteFrom("activities")
      .where("title_id", "=", title_id)
      .where("user_id", "=", userEmail)
      .where("activity", "=", "WATCH_LATER")
      .execute();

    return { message: "Removed from Watch Later", success: true };
  } catch (error) {
    console.error("Database Error - Failed to remove watch later:", error);
    return { error: "Failed to remove watch later.", success: false };
  }
}

/**
 * Check if a movie title exists in a user's watch later list.
 */
export async function watchLaterExists(
  title_id: string,
  userEmail: string,
): Promise<boolean> {
  try {
    const data = await db
      .selectFrom("watchlater")
      .select("title_id")
      .where("title_id", "=", title_id)
      .where("user_id", "=", userEmail)
      .execute();

    return data.length > 0;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch watchLater.");
  }
}

/**
 * Get all genres for titles.
 */
export async function fetchGenres(): Promise<string[]> {
  try {
    const data = await db
      .selectFrom("titles")
      .distinct()
      .select("titles.genre")
      .execute();

    return data.map((row) => row.genre);
  } catch (error) {
    console.error("Error fetching genres from database:", error);
    throw new Error("Failed to fetch genres.");
  }
}

export async function fetchActivities(userEmail: string, limit: number = 6) {
  try {
    const activities = await db
      .selectFrom("activities")
      .innerJoin("titles", "activities.title_id", "titles.id")
      .select([
        "activities.id",
        "activities.timestamp",
        "activities.activity",
        "titles.title",
      ])
      .where("activities.user_id", "=", userEmail)
      .orderBy("activities.timestamp", "desc")
      .limit(limit)
      .execute();

    return activities;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch activities.");
  }
}

/**
 * Insert activity into activity feed.
 */
export async function insertActivity(
  title_id: string,
  userEmail: string,
  activity:
    | "FAVORITED"
    | "WATCH_LATER"
    | "REMOVED_FAVORITE"
    | "REMOVED_WATCH_LATER",
) {
  try {
    if (activity === "REMOVED_FAVORITE") {
      await db
        .deleteFrom("activities")
        .where("title_id", "=", title_id)
        .where("user_id", "=", userEmail)
        .where("activity", "=", "FAVORITED")
        .execute();

      return { message: "Favorite activity removed", success: true };
    }

    if (activity === "REMOVED_WATCH_LATER") {
      await db
        .deleteFrom("activities")
        .where("title_id", "=", title_id)
        .where("user_id", "=", userEmail)
        .where("activity", "=", "WATCH_LATER")
        .execute();

      return { message: "Watch Later activity removed", success: true };
    }

    await db
      .insertInto("activities")
      .values({ title_id, user_id: userEmail, activity, timestamp: new Date() })
      .execute();

    return { message: "Activity Logged", success: true };
  } catch (error) {
    console.error("Database Error - Failed to log activity:", error);
    return { error: "Failed to log activity.", success: false };
  }
}
