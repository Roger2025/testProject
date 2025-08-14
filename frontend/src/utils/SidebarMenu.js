import { motion } from "framer-motion"
import { Link } from "react-router-dom"

// items: [{ label: '首頁', link: '/' }, ...]
export default function AnimatedMenu({ items }) {
  return (
    <motion.ul
      variants={navVariants}
      initial="hidden"
      animate="visible"
      style={list}
    >
      {items.map((item, index) => (
        <MenuItem key={index} i={index} label={item.label} link={item.link} />
      ))}
    </motion.ul>
  )
}

const MenuItem = ({ i, label, link }) => {
  const border = `2px solid ${colors[i % colors.length]}`
  return (
    <motion.li
      variants={itemVariants}
      whileHover={{ scale: 1.1}}
      whileTap={{ scale: 1 }}
      style={listItem}
    >
      <Link to={link} style={{ display: 'flex', textDecoration: 'none', color: 'inherit', width: '100%' }}>
        <div style={{ ...iconPlaceholder, border }} />
        <div style={{ ...textPlaceholder, border }}>{label}</div>
      </Link>
    </motion.li>
  )
}

// 動畫設定
const navVariants = {
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  hidden: {},
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
}

// 樣式
const colors = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF", "#4400FF"]
const list = {
  padding: 50,
  marginRight: "-110px",
  listStyle: "none",
}
const listItem = {
  display: "flex",
  alignItems: "stretch",
  cursor: "pointer",
  padding: "10px",
}
const iconPlaceholder = {
  width: 30,
  height: 30,
  borderRadius: "30%",
  marginRight: 10,
}
const textPlaceholder = {
  width: 100,
  height: 30,
  borderRadius: 6,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // color: "#fff",
}
/////////傳入的範例////////////////
// // 預設選單項目
// AnimatedMenu.defaultProps = {
//   items: [
//     { label: '首頁', link: '/' },
//     { label: '關於我們', link: '/about' },
//     // 其他項目...
//   ],
// }
