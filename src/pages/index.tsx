import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import { FiCalendar, FiUser } from "react-icons/fi";
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Link from 'next/link';
import Head from 'next/head';
import { useState } from 'react';
import Header from '../components/Header';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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

  // console.log(postsPagination)

  return (
    <>

      <Head>
        <title> Home | Spacetraveling</title>
      </Head>

      <Header />
      <main className={styles.contentContainer}>
        <div className={styles.posts}>
          {
            postsPagination.results.map(post => (
              <Link key={post.uid} href={`post/${post.uid}`}>
                <a>
                  <strong>{post.data.title}</strong>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.legends}>
                    <time> <FiCalendar /> {post.first_publication_date}</time>
                    <span><FiUser /> {post.data.author}</span>
                  </div>
                </a>
              </Link>
            ))
          }
        </div>

        <div className={styles.showMore}>
          <button>Carregar Mais</button>
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  const postsResponse = await prismic.getByType('posts', {
    pageSize: 1,
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results.map((post: any) => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.first_publication_date),
          "dd LLL yyyy",
          {
            locale: ptBR,
          }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        }
      }
    })

  }

  // console.log(postsPagination)
  return {
    props: { postsPagination }
  }
};
