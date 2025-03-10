import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage, responsive, placeholder } from '@cloudinary/react';
import { auto } from "@cloudinary/url-gen/qualifiers/quality";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { webp } from "@cloudinary/url-gen/qualifiers/format";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { monsters } from './monsters';
import RelatedArticles from './RelatedArticles';
import './Blog.css'; // Import the local CSS file
import './DatabaseBlog.css'; // Import the local CSS file

const cld = new Cloudinary({ cloud: { cloudName: 'dl9xg597r' } });

const bannerUrl = monsters[Math.floor(Math.random() * monsters.length)]
const DatabaseBlog = ({ url }) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const fetchHtmlContent = async () => {
      try {
        // Fetch the HTML content from the server using Axios
        const response = await axios.get('/api/blog/' + url);
        setHtmlContent(response.data["html_content"]); // Set the HTML content to state
      } catch (error) {
        console.error('Error fetching HTML content:', error);
      }
    };

    fetchHtmlContent();
  }, [url]);

  const getCloudinaryImage = (url) => {
    const img = cld
      .image(url.split("/").pop())
      .format(webp())
      .quality(auto())
      .resize(fill().width(900).height(450)) // Adjust the size of the banner image
      .roundCorners(byRadius(20));
    return <AdvancedImage cldImg={img} />;
  };

  return (
    <div>
      {/* Render the banner image */}
      {bannerUrl && (
        <div className="banner-container">
          {getCloudinaryImage(bannerUrl)}
        </div>
      )}

      {/* Render the fetched HTML content */}
      <div className="content-container">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
      <div className="content-container">
      <RelatedArticles />
      </div>
    </div>
  );
};

export default DatabaseBlog;