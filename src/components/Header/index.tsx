import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  return (
    <>
      <header className={styles.contentContainer}>
        <div className={styles.container}>
          <Link href="/">
            <a>
              <img src="/img/Logo.png" alt="logo" />
            </a>
          </Link>
        </div>
      </header>
    </>
  )
}
