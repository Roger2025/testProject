import logo from '../assets/images/ByteEat.png'
import { motion } from 'framer-motion'

export default function JumpImage() {
  return (
    <motion.img
      width="600px"
      src={logo}
      alt="跳進圖片"
      initial={{ y: 100, scale: 5, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.5 }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 10,
        duration: 2,
      }}
      style={{ display: 'block', margin: '1px auto' }}
    />
  )
}