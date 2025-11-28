import { motion } from 'framer-motion'
import { Sparkles, Zap, Target, Brain } from 'lucide-react'

export default function Hero() {
  return (
    <div className="text-center py-16 relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-50"></div>
            <Sparkles className="w-16 h-16 text-primary-400 relative" />
          </motion.div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="gradient-text">Advanced Object Detection</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Choose between <span className="text-primary-400 font-semibold">ObjectVision AI</span> and{' '}
          <span className="text-purple-400 font-semibold">ObjectVision AI+</span> models, or compare both side-by-side.
          Trained on COCO dataset with <span className="text-pink-400 font-semibold">80+ object classes</span>
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-morphism px-6 py-3 rounded-full flex items-center space-x-2"
          >
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium">Real-time Processing</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-morphism px-6 py-3 rounded-full flex items-center space-x-2"
          >
            <Target className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium">~50% mAP Accuracy</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-morphism px-6 py-3 rounded-full flex items-center space-x-2"
          >
            <Brain className="w-5 h-5 text-primary-400" />
            <span className="text-sm font-medium">AI-Powered Detection</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
