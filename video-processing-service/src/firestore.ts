import { credential } from "firebase-admin";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";

initializeApp({credential: credential.applicationDefault()});

const firestore = new Firestore();
const videoCollectionId = 'videos';

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: 'processing' | 'processed',
  title?: string,
  description?: string
}

async function getVideo(videoId: string) {
  const res = await firestore.collection(videoCollectionId).doc(videoId).get();
  return (res.data() as Video) ?? {};
}

export function setVideo(videoId: string, video: Video) {
  return firestore
    .collection(videoCollectionId)
    .doc(videoId)
    .set(video, { merge: true })
}

// export async function isVideoNew(videoId: string) {
//   const video = await getVideo(videoId);
//   return video?.status === undefined;
// }

const videoCollection = firestore.collection('videos');

export async function isVideoNew(videoId: string): Promise<boolean> {
  const doc = await videoCollection.doc(videoId).get();
  
  // Check if the video already exists and is processing or processed
  if (doc.exists) {
    const videoData = doc.data();
    if (videoData?.status === 'processing' || videoData?.status === 'processed') {
      return false;
    }
  }
  
  return true;
}