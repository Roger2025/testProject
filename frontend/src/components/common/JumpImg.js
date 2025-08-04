// import logo from '../assets/images/ByteEat.png';
import { motion } from 'framer-motion'; // npm install framer-motion

// 透過後端 Node.js /public/images/ 下載圖片
// 必須先打開 Node.js 伺服器 localhost:3001/images/
export const getImageURL = (modulePath) => {
  return `http://localhost:3001/images/${modulePath}`;
};
const logo = getImageURL('ByteEat.png');

const JumpImage = () => {
// export default function JumpImage() {
  return (
    <motion.img
      width="2500px"
      src={logo}
      alt="跳進圖片"
      initial={{ y: 100, scale: 5, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.5 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 5,
        duration: 2,
      }}
      style={{ display: 'block', margin: '1px auto' }}
    />
  )
}

export default JumpImage;