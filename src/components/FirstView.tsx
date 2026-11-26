import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import styles from './FirstView.module.css';

const strengths = [
  ['国家資格保有', '鍼灸師・あん摩マッサージ指圧師が担当'],
  ['整体×トレーニング', '身体を整えてから動かす'],
  ['運動初心者歓迎', '身体の状態に合わせた無理のない運動'],
] as const;

const scenes = [
  { key: 'training', label: 'トレーニング指導', alt: '河本大地がお客様の姿勢と動きを確認しながら指導する様子' },
  { key: 'consultation', label: 'カウンセリング', alt: '河本大地がお客様の身体の悩みを聞き取る様子' },
  { key: 'body-care', label: '整体・担当 河本大地', alt: 'トレーナーの河本大地がお客様の脚の動きを確認する整体の様子' },
] as const;

export function FirstView({ bookingUrl }: { bookingUrl?: string }) {
  return (
    <section className={styles.hero} id="concept" aria-labelledby="first-view-title">
      <div className={styles.intro}>
        <div className={styles.display} aria-hidden="true">YOUR LIFE.</div>
        <p className={styles.category}>デスクワーカーのための<br />整体×パーソナルトレーニング</p>
        <h1 id="first-view-title">デスクワークによる<br />肩こり・腰痛を楽にする。</h1>
        <p className={styles.area}>雪が谷大塚・中延・五反田エリア</p>
      </div>

      <div className={styles.gallery}>
        {scenes.map(({key, label, alt}) => {
          const lead = key === 'training';
          return (
            <figure className={lead ? styles.lead : styles.support} key={key}>
              <Image
                src={`/images/first-view/${key}.webp`}
                alt={alt}
                fill
                preload={lead}
                sizes={lead ? '(max-width: 760px) 62vw, 31vw' : '(max-width: 760px) 29vw, 15vw'}
              />
              <figcaption>{label}</figcaption>
            </figure>
          );
        })}
      </div>

      <div className={styles.details}>
        <div className={styles.description}>
          <p>ただ激しい筋トレをするのではなく、<br />身体を整え、動かし、鍛える。</p>
          <p>仕事終わりに、<br className={styles.desktopBreak} />好きなことを楽しめる身体へ。</p>
        </div>
        {bookingUrl && (
          <a className={styles.booking} href={bookingUrl} target="_blank" rel="noopener noreferrer"
             data-booking data-location="hero">
            体験トレーニングを予約する <ArrowUpRight size={20} aria-hidden="true" />
          </a>
        )}
        <ul className={styles.strengths}>
          {strengths.map(([title, description]) => (
            <li key={title}><strong>{title}</strong><p>{description}</p></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
