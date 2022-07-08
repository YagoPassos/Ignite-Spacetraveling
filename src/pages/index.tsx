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

  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page)


  async function AddPost() {
    const nextPageData = await fetch(String(nextPage))
      .then(res => res.json())
      .then(data => {
        return data
      })

    setPosts([
      ...posts,
      ...nextPageData.results
    ])

    setNextPage(nextPageData.next_page)

  }

  return (
    <>

      <Head>
        <title> Home | Spacetraveling</title>
      </Head>

      <Header />
      <main className={styles.contentContainer}>
        <div className={styles.posts}>
          {
            posts.map(post => (
              <Link key={post.uid} href={`post/${post.uid}`}>
                <a>
                  <strong>{post.data.title}</strong>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.legends}>
                    <time> <FiCalendar /> {format(
                      new Date(post.first_publication_date),
                      "dd LLL yyyy",
                      {
                        locale: ptBR,
                      }
                    )}</time>
                    <span><FiUser /> {post.data.author}</span>
                  </div>
                </a>
              </Link>
            ))
          }
        </div>
        {
          (nextPage) ?
            < div className={styles.showMore}>
              <button onClick={AddPost}>Carregar Mais</button>
            </div>
            : null
        }
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  const postsResponse = await prismic.getByType('posts', {
    pageSize: 2,
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

  return {
    props: {
      postsPagination,
    }
  }
};
