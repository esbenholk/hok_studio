import React, { useState, useEffect } from "react";

import sanityClient from "../client";

export default function Posts() {
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch('*[_type == "post"]{title,slug,mainImage{asset->{_id,url}, alt}}')
      .then((data) => setProjectData(data))
      .catch(console.error);
  });

  return (
    <div className="content-container">
      <div>
        <section>
          <div>
            {projectData &&
              projectData.map((post, index) => (
                <article key={index}>
                  <span key={index}>
                    <img
                      src={post.mainImage.asset.url}
                      alt={post.mainImage.alt}
                    />
                    <span>
                      <h3>{post.title}</h3>
                    </span>
                  </span>
                </article>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
