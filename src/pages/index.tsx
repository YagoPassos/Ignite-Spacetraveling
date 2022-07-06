import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import { FiCalendar, FiUser } from "react-icons/fi";
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Link from 'next/link';
import Head from 'next/head';
import { useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {

  // const [posts, setPosts] = useState(postsPagination.results)

  console.log(postsPagination)

  return (
    <>

      <Head>
        <title> Home | Spacetraveling</title>
      </Head>
      <main className={styles.contentContainer}>
        <div className={styles.posts}>
          {
            postsPagination.results.map(post => (

              // <Link key={post.uid} href={`posts/${post.uid}`}>
              <>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <div>
                  <time> <FiCalendar />{post.first_publication_date}</time>
                  <span><FiUser />{post.data.author}</span>
                </div>
              </>
              // </Link>
            ))
          }
        </div>

        <button>Carregar Mais</button>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  const postsResponse = await prismic.getByType('posts', {
    pageSize: 10,
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results.map((post: any) => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        }
      }
    })

  }

  console.log(postsPagination)
  return {
    props: { postsPagination }
  }
};
