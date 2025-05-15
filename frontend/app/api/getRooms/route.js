import { db } from '../../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const q = query(
      collection(db, 'Games'),
      where('isPrivateRoom', '==', false),
      where('numberOfPlayers', '<=', 1) 
    );
    const snapshot = await getDocs(q);
    console.log('Snapshot:', snapshot); 

    const rooms = snapshot.docs.map(doc => doc.data());
    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch rooms', details: error.message },
      { status: 500 }
    );
  }
}
