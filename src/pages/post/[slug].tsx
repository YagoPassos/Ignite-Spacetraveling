import { asHTML } from '@prismicio/helpers';
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-reactjs';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {

  // console.log(post.data.content);


  return (
    <>
      <Header />

      <main className={styles.contentContainer}>
        <img src={`${post.data.banner.url}`} alt="" />
        <div className={styles.container}>
          <strong>{post.data.title}</strong>
          <div className={styles.legends}>
            <time> <FiCalendar /> {format(
              new Date(post.first_publication_date,),
              "dd LLL yyyy",
              {
                locale: ptBR,
              })}</time>
            <span> <FiUser /> {post.data.author}</span>
            <span> <FiClock /> time</span>
          </div>

          <div className={styles.content}>
            {
              post.data.content.map(content => (
                <div key={content.heading}>
                  <h3>{content.heading}</h3>
                  {content.body.map(content => (
                    <p>{content.text}</p>
                  ))}
                </div>
              ))
            }
          </div>
        </div>
      </main>
    </>
  )
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  return {
    paths: [],
    fallback: 'blocking' // false or 'blocking'
  };
};

export const getStaticProps = async ({ params }) => {

  const { slug } = params

  const prismic = getPrismicClient({});


  try {
    const response = await prismic.getByUID('posts', String(slug));

    const post = {
      first_publication_date: response.first_publication_date,
      data: {
        title: response.data.title,
        banner: {
          url: response.data.banner.url,
        },
        author: response.data.author,
        content: response.data.content.map(content => {
          return {
            heading: content.heading,
            body: content.body
          }
        }),
      }
    }
    return {
      props: { post }
    }
  } catch (e) {
  }
}
