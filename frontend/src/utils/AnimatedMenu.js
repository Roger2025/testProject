import { motion } from "framer-motion"
import { Link } from "react-router-dom"

// Type 定義
type MenuItemType = {
  label: string
  link: string
}

// 主元件
export default function AnimatedMenu({ items }: { items: MenuItemType[] }) {
  return (
    <motion.ul
      variants={navVariants}
      initial="hidden"
      animate="visible"
      style={list}
    >
      {items.map((item, index) => (
        <MenuItem key={index} i={index} item={item} />
      ))}
    </motion.ul>
  )
}

// 單一選單項目元件
const MenuItem = ({ i, item }: { i: number; item: MenuItemType }) => {
  const border = `2px solid ${colors[i % colors.length]}`
  return (
    <motion.li
      variants={itemVariants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={listItem}
    >
      <Link to={item.link} style={{ textDecoration: "none", color: "black", display: "flex", alignItems: "center" }}>
        <div style={{ ...iconPlaceholder, border }} />
        <div style={{ ...textPlaceholder, border }}>{item.label}</div>
      </Link>
    </motion.li>
  )
}

// 預設 props
AnimatedMenu.defaultProps = {
  items: [
    { label: '首頁', link: '/' },
    { label: '關於我們', link: '/about' },
    { label: '產品介紹', link: '/products' },
    { label: '聯絡我們', link: '/contact' },
  ],
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
  visible: { opacity: 1, y: 0 },
}

// 樣式
const colors = ["#ff0055", "#0099ff", "#22cc88", "#ffaa00"]

const list = {
  padding: 0,
  margin: 0,
  listStyle: "none",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
}

const listItem = {
  margin: "12px 0",
  width: "220px",
  height: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "12px",
  backgroundColor: "#f0f0f0",
  cursor: "pointer",
}

const iconPlaceholder = {
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  marginRight: "12px",
}

const textPlaceholder = {
  fontSize: "16px",
  fontWeight: "bold",
}
