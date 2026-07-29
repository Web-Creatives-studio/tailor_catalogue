import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully!" },
      { status: 200 }
    );

    // Expire/Clear authentication cookies
    response.cookies.set("tailor_token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    response.cookies.set("tailor_id", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { error: "Failed to log out." },
      { status: 500 }
    );
  }
}