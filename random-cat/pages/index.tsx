import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import styles from "./index.module.css";

// getServerSidePropsから渡されるpropsの型
type Props = {
  initialImageUrl: string;
};

// ページコンポーネント関数にpropsを受け取る引数を追加する
const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
  // 画像URLとロード中かどうかの状態をuseStateで管理する
  const [imageUrl, setImageUrl] = useState(initialImageUrl); // 初期値を渡す
  const [loading, setLoading] = useState(false); // 初期状態はfalseにしておく

  // クリック時に新しい画像を取得し、画像URLとロード状態を更新する関数を定義する
  const handleClick = async () => {
    setLoading(true);
    const newImage = await fetchImage();
    setImageUrl(newImage.url);
    setLoading(false);
  };

  // ページコンポーネントのレンダリング内容を定義する
  return (
    <div className={styles.page}>
      <button onClick={handleClick} className={styles.button}>
        他のにゃんこも見る
      </button>
      <div className={styles.frame}>
        {/* ロード中でなければ画像を表示する */}
        {loading || <img src={imageUrl} className={styles.img} />}
      </div>
    </div>
  );
};

// ページコンポーネント関数のエクスポート
export default IndexPage;

// サーバーサイドで実行する処理を定義する
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  // APIからランダムな猫の画像を取得する
  const image = await fetchImage();
  return {
    props: {
      initialImageUrl: image.url, // 画像URLをinitialImageUrlとしてpropsに渡す
    },
  };
};

// 猫の画像をランダムに取得する関数を定義する
type Image = {
  url: string;
};
const fetchImage = async (): Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const images = await res.json();
  console.log(images);
  return images[0]; // 取得した画像の配列から先頭の画像を返す
};
