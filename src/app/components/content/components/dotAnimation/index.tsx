import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';

const DotAnimation = () => {
  const [activeIndex, setActiveIndex] = useState(1); // 初始激活的圆点索引为1

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 1000); // 设置圆点变动的时间间隔为1秒

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <div className={`${styles.dot} ${styles.normal} ${activeIndex === 0 ? styles.active : ''}`} />
      <div className={`${styles.dot} ${styles.large} ${activeIndex === 1 ? styles.active : ''}`} />
      <div className={`${styles.dot} ${styles.normal} ${activeIndex === 2 ? styles.active : ''}`} />
    </div>
  );
};

export default DotAnimation;
