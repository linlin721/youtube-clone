import styles from './page.module.css';
import { getVideos } from './firebase/uploadFunctions';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const videos = await getVideos();
  // in server 
  // console.log(video);
  return (
    <main>
      {
        videos.map((video) => (
          <Link href={`/watch?v=${video.filename}`} key={video.id}>
            <Image src={'/thumbnail.png'} alt='video' width={120} height={80}
              className={styles.thumbnail}/>
          </Link>
        ))
      }
    </main>
  )
}

export const revalidate = 30;
