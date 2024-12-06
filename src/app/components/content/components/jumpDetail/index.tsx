import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import dayjs from 'dayjs';
import ImgLinkIcon from "@/public/images/link_icon.png";
import classnames from "classnames/bind";
import styles from "./index.module.scss";
const classNames = classnames.bind(styles);

interface JumpDetailProps {
  item: any;
}

const JumpDetail = (props: JumpDetailProps) => {
  const { item } = props;
  const [redirectUrl, setRedirectUrl] = useState<string>('');

  useEffect(() => {
    if (item) {
      const { fromDate, toDate, keywords, orgs } = item;

      // 使用dayjs将日期转换为毫秒
      const startDate = dayjs(fromDate).valueOf();
      const endDate = dayjs(toDate).valueOf();

      // 指定的URL
      const currentUrl = window.location.href;
      let linkUrl = currentUrl.includes('http://172.253.168.62:8080')
        ? 'http://172.253.168.62:8080/web/#/current/km-review/kmReviewMain/all'
        : (currentUrl.includes('uat') ? 'https://workflow-uat.newone.com.cn/web/#/current/km-review/kmReviewMain/all' : '');
      // linkUrl = 'https://workflow-uat.newone.com.cn/web/#/current/km-review/kmReviewMain/all';

      // 构建查询参数字符串
      const query = new URLSearchParams({
        fromDate: encodeURIComponent(startDate.toString()),
        toDate: encodeURIComponent(endDate.toString()),
        keywords: encodeURIComponent(keywords.join(',')), // 将keywords数组转换为逗号分隔的字符串，并进行编码
        // 如果orgs数组不为空，则添加到查询参数中，并进行编码
        ...(orgs.length > 0 && { orgs: encodeURIComponent(orgs.join(',')) }),
      });

      // 构建完整的跳转URL
      const fullUrl = `${linkUrl}?aiQuery=${query.toString()}`;

      console.log('fullUrl', fullUrl)

      // 更新状态以触发重新渲染
      setRedirectUrl(fullUrl);
    }
  }, [item]); // 依赖项数组中包含item，当item变化时，副作用函数将重新运行

  return (
    <div className={classNames("assistant-content-detail")}>
      {redirectUrl && (
        <Link href={redirectUrl} target="_blank">
          查看详情
        </Link>
      )}
      <span className={classNames("assistant-detail-link")}>
        <Image src={ImgLinkIcon} alt="link_icon" width={12} height={12} />
      </span>
    </div>
  );
}

export default JumpDetail;
