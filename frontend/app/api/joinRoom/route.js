import { db } from '../../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { roomCode, joinedPlayerWalletAddress, joinedPlayerName } = body;
    if (!roomCode || !joinedPlayerWalletAddress || !joinedPlayerName) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const roomRef = doc(db, 'Games', roomCode);
    const roomSnapshot = await roomRef.get();
    if (!roomSnapshot.exists()) {
      return NextResponse.json({ message: 'Room does not exist' }, { status: 404 });
    }
    const roomData = roomSnapshot.data();
    if (roomData.numberOfPlayers >= 2) {//currenlty hardcoded to 2 -----> max 2 players //but it can be changed easily
      return NextResponse.json({ message: 'Room is full' }, { status: 400 });
    }
    await updateDoc(roomRef, {
      joinedPlayerWalletAddress,
      joinedPlayerName,
      numberOfPlayers: roomData.numberOfPlayers + 1,
    });

    return NextResponse.json({ message: 'Joined room successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to join room', details: error.message }, { status: 500 });
  }
}
