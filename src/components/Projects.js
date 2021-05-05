import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import sanityClient from "../client";

import imageUrlBuilder from "@sanity/image-url";

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);

// Then we like to make a simple function like this that gives the
// builder an image and returns the builder for you to specify additional
// parameters:
function urlFor(source) {
  return builder.image(source);
}

export default function Projects() {
  const [postData, setPost] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(
        '*[_type == "project"]{title,slug,mainImage{asset->{_id,url}, alt},imagesGallery}'
      )
      .then((data) => {
        setPost(data);
        console.log(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="content-container">
      <section className="grid grid-cols-2">
        {postData &&
          postData.map((post, index) => (
            <article key={post.slug.current} className="teaser">
              <Link
                to={"/projects/" + post.slug.current}
                key={post.slug.current}
                className="w-full teaser-link"
              >
                <h3>{post.title}</h3>
                <div className="flex-row">
                  <img
                    src={post.mainImage.asset.url}
                    alt={post.mainImage.alt}
                    className="w-full teaser-image"
                  />
                  {post.imagesGallery &&
                    post.imagesGallery.map((image, index) => (
                      <img
                        src={urlFor(image).url()}
                        alt={image}
                        key={index}
                        className="w-full teaser-image"
                      />
                    ))}
                </div>
              </Link>
            </article>
          ))}
      </section>
    </div>
  );
}
