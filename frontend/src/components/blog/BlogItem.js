// BlogItem.jsx
import React from "react";

const BlogItem = ({ img, date, comments, title, description }) => {
  return (
    <div className="blog__item">
      <div className="blog__item__pic">
        <img src={img} alt="" />
      </div>
      <div className="blog__item__text">
        <ul>
          <li><i className="fa fa-calendar-o"></i> {date}</li>
          <li><i className="fa fa-comment-o"></i> {comments}</li>
        </ul>
        <h5><a href="#">{title}</a></h5>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default BlogItem;