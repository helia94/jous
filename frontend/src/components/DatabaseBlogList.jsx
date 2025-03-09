// DatabaseBlogList.jsx
import React from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage, responsive, placeholder } from '@cloudinary/react';
import { autoEco } from "@cloudinary/url-gen/qualifiers/quality";
import { scale } from "@cloudinary/url-gen/actions/resize";
import { webp } from "@cloudinary/url-gen/qualifiers/format";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { monsters } from './monsters';
import DatabaseBlogData from './DatabaseBlogData';
import './DatabaseBlogList.css';

const cld = new Cloudinary({ cloud: { cloudName: 'dl9xg597r' } });

const DatabaseBlogList = () => {
  const getCloudinaryImage = (url) => {
    const img = cld
      .image(url.split("/").pop())
      .format(webp())
      .quality(autoEco())
      .resize(scale().width(200).height(200))
      .roundCorners(byRadius(20));
    return <AdvancedImage cldImg={img} />;
  };

  const handleArticleClick = (url) => {
    window.location.href = `/blog/${url}`;
  };

  return (
    <div className="container">
      <h1 className="header">Featured Articles</h1>
      <div className="articleList">
        {DatabaseBlogData.map((blog, index) => {
          const imageUrl = monsters[index % monsters.length];
          return (
            <div
              key={index}
              className="articleCard"
              onClick={() => handleArticleClick(blog.URL)}
            >
              <div className="imageContainer">{getCloudinaryImage(imageUrl)}</div>
              <div className="textContainer">
                <h2 className="title">{blog.title}</h2>
                <p className="categoryLabel">{blog.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DatabaseBlogList;
