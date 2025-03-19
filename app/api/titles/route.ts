import { auth } from "@/auth";
import { fetchTitles } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/titles
 */
export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized - Not logged in" },
      { status: 401 },
    );
  }

  const email = session.user.email;

  const params = req.nextUrl.searchParams;
  const page = Number(params.get("page")) || 1;
  const minYear = Number(params.get("minYear")) || 0;
  const maxYear = Number(params.get("maxYear")) || new Date().getFullYear();
  const query = params.get("query")?.trim() ?? "";
  const genres =
    params
      .get("genres")
      ?.split(",")
      .map((g) => g.trim()) ?? [];

  if (isNaN(page) || isNaN(minYear) || isNaN(maxYear)) {
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 },
    );
  }

  try {
    const { titles, totalPages } = await fetchTitles(
      page,
      minYear,
      maxYear,
      query,
      genres,
      email,
    );

    return NextResponse.json({ titles, totalPages });
  } catch (error) {
    console.error("Database Error - Failed to fetch titles:", error);
    return NextResponse.json(
      { error: "Failed to fetch titles" },
      { status: 500 },
    );
  }
}
