"use client";

import { useState, useEffect } from "react";

interface Activity {
  id: string;
  timestamp: string;
  activity: "FAVORITED" | "WATCH_LATER" | "REMOVED";
  title: string;
}

interface ActivityFeedProps {
  refreshTrigger: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ refreshTrigger }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/activities`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setActivities(data.activities);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setError("Failed to load activities.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [refreshTrigger]);

  return (
    <section
      className="bg-mintyTeal rounded-xl p-6 flex flex-col h-100 overflow-y-auto shadow-lg mt-3"
      aria-labelledby="activity-feed-heading"
      aria-live="polite"
    >
      <h2
        id="activity-feed-heading"
        className="text-lg font-bold text-midnightBlue mb-4 px-2"
      >
        Latest Activities
      </h2>

      {loading ? (
        <p
          className="text-midnightBlue text-md font-medium px-2"
          aria-busy="true"
        >
          Loading activities...
        </p>
      ) : error ? (
        <p className="text-red-500 text-md font-medium px-2" role="alert">
          {error}
        </p>
      ) : activities.length > 0 ? (
        <ul className="space-y-3 px-2 pr-2">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="text-midnightBlue text-sm focus:outline-none focus:ring-2 focus:ring-midnightBlue-300"
              tabIndex={0}
            >
              <time
                dateTime={activity.timestamp}
                className="block text-sm font-medium text-gray-900"
              >
                {new Date(activity.timestamp).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
                {", "}
                {new Date(activity.timestamp).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </time>
              <p className="text-md text-gray-800 mt-1">
                {activity.activity === "FAVORITED" ? (
                  <>
                    Favorited{" "}
                    <span className="font-bold">{activity.title}</span>
                  </>
                ) : activity.activity === "REMOVED" ? (
                  <>
                    Removed <span className="font-bold">{activity.title}</span>
                  </>
                ) : activity.activity === "WATCH_LATER" ? (
                  <>
                    Added <span className="font-bold">{activity.title}</span> to
                    Watch Later
                  </>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-midnightBlue text-md font-medium px-2">
          No recent activities
        </p>
      )}
    </section>
  );
};

export default ActivityFeed;
