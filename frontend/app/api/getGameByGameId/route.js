// app/api/rooms/getRoomsByGameId/route.js

import { db } from '../../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { gameId } = body;

    if (!gameId) {
      return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
    }

    const q = query(collection(db, 'Games'), where('gameId', '==', gameId));
    const snapshot = await getDocs(q);

    const rooms = snapshot.docs.map(doc => doc.data());
    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rooms', details: error.message }, { status: 500 });
  }
}
