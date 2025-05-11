import { db } from '../../../lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { roomCode } = body;

    await deleteDoc(doc(db, 'Games', roomCode));

    return NextResponse.json({ message: 'Room deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete room', details: error.message }, { status: 500 });
  }
}
