// BlogSection.jsx
import React from "react";
import BlogItem from "./BlogItem";
// import "./BlogSection.css";

const blogData = [
  {
    img: "img/blog/blog-1.jpg",
    date: "May 4, 2019",
    comments: 5,
    title: "Cooking tips make cooking simple",
    description: "Sed quia non numquam modi tempora indunt ut labore et dolore magnam aliquam quaerat",
  },
  {
    img: "img/blog/blog-2.jpg",
    date: "May 4, 2019",
    comments: 5,
    title: "6 ways to prepare breakfast for 30",
    description: "Sed quia non numquam modi tempora indunt ut labore et dolore magnam aliquam quaerat",
  },
  {
    img: "img/blog/blog-3.jpg",
    date: "May 4, 2019",
    comments: 5,
    title: "Visit the clean farm in the US",
    description: "Sed quia non numquam modi tempora indunt ut labore et dolore magnam aliquam quaerat",
  },
];

const BlogSection = () => {
  return (
    <section className="from-blog spad">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title from-blog__title">
              <h2>From The Blog</h2>
            </div>
          </div>
        </div>
        <div className="row">
          {blogData.map((item, index) => (
            <div className="col-lg-4 col-md-4 col-sm-6" key={index}>
              <BlogItem {...item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;