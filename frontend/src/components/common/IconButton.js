// src/components/common/IconButton.js
import React from 'react';
import PropTypes from 'prop-types';
// import './IconButton.css'; // 可選：統一樣式
import '../../styles/css/ProductDiscount.css'; // 放自訂樣式 可放 Ogani 原樣式

const IconButton = ({ iconClass, label, onClick, as = 'button', href }) => {
  const Element = as === 'a' ? 'a' : 'button';

  const commonProps = {
    className: 'icon-button',
    'aria-label': label,
    onClick,
  };

  return (
    <Element
      {...commonProps}
      {...(as === 'a' ? { href: href || '#', role: 'button' } : {})}
    >
      <i className={iconClass} aria-hidden="true" />
    </Element>
  );
};

IconButton.propTypes = {
  iconClass: PropTypes.string.isRequired,     // e.g. "fa fa-heart"
  label: PropTypes.string.isRequired,         // e.g. "加入收藏"
  onClick: PropTypes.func,                    // optional click handler
  as: PropTypes.oneOf(['button', 'a']),       // render as <button> or <a>
  href: PropTypes.string,                     // only used if as === 'a'
};

export default IconButton;