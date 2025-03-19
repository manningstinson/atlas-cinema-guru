import { auth } from "@/auth";
import { fetchActivities } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/activities - Fetches paginated user activities.
 */
export const GET = auth(async (req: NextRequest) => {
  //@ts-ignore
  if (!req.auth) {
    return NextResponse.json(
      { error: "Unauthorized - Not logged in" },
      { status: 401 },
    );
  }

  const {
    user: { email }, //@ts-ignore
  } = req.auth;

  const activities = await fetchActivities(email, 6);
  return NextResponse.json({ activities });
});
