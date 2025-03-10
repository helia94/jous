// RelatedArticles.jsx
import React from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { autoEco } from "@cloudinary/url-gen/qualifiers/quality";
import { scale } from "@cloudinary/url-gen/actions/resize";
import { webp } from "@cloudinary/url-gen/qualifiers/format";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { monsters } from './monsters';
import DatabaseBlogData from './DatabaseBlogData';
import './RelatedArticles.css'; // Create this CSS file for styling

const cld = new Cloudinary({ cloud: { cloudName: 'dl9xg597r' } });

const RelatedArticles = () => {
  // Function to get a random subset of articles
  const getRandomArticles = (data, count) => {
    const shuffled = data.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Function to get Cloudinary image
  const getCloudinaryImage = (url) => {
    const img = cld
      .image(url.split("/").pop())
      .format(webp())
      .quality(autoEco())
      .resize(scale().width(200).height(200))
      .roundCorners(byRadius(20));
    return <AdvancedImage cldImg={img} />;
  };

  // Handle article click
  const handleArticleClick = (url) => {
    window.location.href = `/blog/${url}`;
  };

  // Get 3 random articles
  const randomArticles = getRandomArticles(DatabaseBlogData, 3);

  return (
    <div className="relatedArticlesContainer">
      <h2 className="relatedHeader">Related Articles</h2>
      <div className="relatedArticlesList">
        {randomArticles.map((blog, index) => {
          const imageUrl = monsters[index % monsters.length];
          return (
            <div
              key={index}
              className="relatedArticleCard"
              onClick={() => handleArticleClick(blog.URL)}
            >
              <div className="relatedImageContainer">
                {getCloudinaryImage(imageUrl)}
              </div>
              <h3 className="relatedTitle">{blog.title}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedArticles;