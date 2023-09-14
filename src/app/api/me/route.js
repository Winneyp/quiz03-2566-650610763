import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Tayakorn Aowrattanakul",
    studentId: "650610763",
  });
};
