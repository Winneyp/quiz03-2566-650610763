import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  return NextResponse.json({
    ok: true,
    rooms: DB.rooms,
    totalRooms: DB.rooms.length,
  });
};

export const POST = async (request) => {
  const payload = checkToken();
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  readDB();
  //check role
  let role = null;
  role = payload.role;

  // let roomName = null;
  // roomName = payload.roomName;
  const body = await request.json();
  const { roomName } = body;

  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.json(
      {
        ok: false,
        message: `Only ADMIN or SUPER_ADMIN can create room`,
      },
      { status: 403 }
    );
  }

  const findRoom = DB.rooms.find((x) => x.roomName === roomName);
  if (findRoom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );
  }
  const roomId = nanoid();
  DB.rooms.push({ roomId, roomName });

  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${roomName} has been created`,
  });
};
