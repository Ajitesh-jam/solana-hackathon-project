// app/api/rooms/hostRoom/route.js

import { db } from '../../../lib/firebase'; // adjust if needed
import { doc, setDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { roomCode, hostPlayerWalletAddress, hostPlayerName, stakeAmount, isPrivateRoom } = body;

    if (
      !roomCode ||
      !hostPlayerWalletAddress ||
      !hostPlayerName ||
      stakeAmount === undefined ||
      isPrivateRoom === undefined
    ) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await setDoc(doc(db, 'Games', roomCode), {
      roomCode,
      hostPlayerWalletAddress,
      hostPlayerName,
      stakeAmount,
      joinedPlayerWalletAddress: null,
      joinedPlayerName: null,
      isPrivateRoom,
    });

    return NextResponse.json({ message: 'Room hosted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create Room' },
      { status: 500 }
    );
  }
}
