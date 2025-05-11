import { db } from '../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { roomCode } = body;

    const roomSnap = await getDoc(doc(db, 'Games', roomCode));
    if (roomSnap.exists()) {
      return NextResponse.json(roomSnap.data(), { status: 200 });
    } else {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get room', details: error.message }, { status: 500 });
  }
}
