import { db } from '../../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { roomCode, joinedPlayerWalletAddress, joinedPlayerName } = body;

    const roomRef = doc(db, 'Games', roomCode);
    await updateDoc(roomRef, {
      joinedPlayerWalletAddress,
      joinedPlayerName,
    });

    return NextResponse.json({ message: 'Joined room successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to join room', details: error.message }, { status: 500 });
  }
}
