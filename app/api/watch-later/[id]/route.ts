import {
  deleteWatchLater,
  watchLaterExists,
  insertWatchLater,
} from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * POST /api/watch-later/:id
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

    const exists = await watchLaterExists(id, email);
    if (exists) {
      return NextResponse.json({ message: "Already in watch later" });
    }

    try {
      await insertWatchLater(id, email);
      return NextResponse.json({ message: "Watch later Added" });
    } catch (error) {
      console.error("Database Error:", error);
      return NextResponse.json(
        { error: "Failed to add watch-later" },
        { status: 500 },
      );
    }
  },
);

/**
 * DELETE /api/watch-later/:id
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
      await deleteWatchLater(id, email);
      return NextResponse.json({ message: "Watch later removed" });
    } catch (error) {
      console.error("Database Error:", error);
      return NextResponse.json(
        { error: "Failed to remove watch later" },
        { status: 500 },
      );
    }
  },
);
