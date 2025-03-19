import { deleteFavorite, favoriteExists, insertFavorite } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * POST /api/favorites/:id
 */
export const POST = auth(
  //@ts-ignore
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await params;

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

    const exists = await favoriteExists(id, email);
    if (exists) {
      return NextResponse.json({ message: "Already favorited" });
    }

    try {
      await insertFavorite(id, email);
      return NextResponse.json({ message: "Favorite Added" });
    } catch (error) {
      console.error("Database Error:", error);
      return NextResponse.json(
        { error: "Failed to add favorite" },
        { status: 500 },
      );
    }
  },
);

/**
 * DELETE /api/favorites/:id
 */
export const DELETE = auth(
  //@ts-ignore
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await params;

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

    try {
      await deleteFavorite(id, email);
      return NextResponse.json({ message: "Favorite removed" });
    } catch (error) {
      console.error("Database Error:", error);
      return NextResponse.json(
        { error: "Failed to remove favorite" },
        { status: 500 },
      );
    }
  },
);
