/*
import { Calendar } from 'lucide-react'

export default function FancyButtonDemo() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <button className="
        flex items-center gap-2
        bg-gradient-to-r from-purple-500 to-blue-500
        text-white font-semibold
        py-3 px-6 rounded-full shadow-lg
        transform transition-transform duration-300 hover:scale-105
        hover:shadow-2xl
      ">
        <Calendar className="w-5 h-5" />
        預約時間
      </button>
    </div>
  )
}
*/

// 動畫特效
'use client'
import { Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

export default function FancyButtonDemo() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <motion.button
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="
          flex items-center gap-2
          bg-gradient-to-r from-purple-500 to-blue-500
          text-white font-semibold
          py-3 px-6 rounded-full shadow-lg
          transform transition-transform duration-300 hover:scale-105
          hover:shadow-2xl
        "
      >
        <Calendar className="w-5 h-5" />
        預約時間
      </motion.button>
    </div>
  )
}