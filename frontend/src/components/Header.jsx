import { motion } from 'framer-motion'
import { Brain, Github } from 'lucide-react'

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-morphism border-b border-white/10 sticky top-0 z-50 backdrop-blur-2xl"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-br from-primary-600 to-purple-600 p-2 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">ObjectVision AI</h1>
              <p className="text-xs text-gray-400">Trained on COCO Dataset</p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="hidden md:flex items-center space-x-2 glass-morphism px-4 py-2 rounded-lg"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Model Active</span>
            </motion.div>

            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
              className="glass-morphism p-2 rounded-lg hover:bg-white/10"
            >
              <Github className="w-6 h-6" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
