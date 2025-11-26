import { motion } from 'framer-motion'
import { Brain, Github, Linkedin, Mail, Heart } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 mb-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-br from-primary-600 to-purple-600 p-2 rounded-xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold gradient-text">ObjectVision AI</h2>
                <p className="text-xs text-gray-400">Advanced Object Detection</p>
              </div>
            </motion.div>
            <p className="text-gray-400 mb-4 max-w-md">
              State-of-the-art object detection powered by YOLOv8 architecture, trained on the comprehensive COCO dataset for exceptional accuracy and performance.
            </p>
            <div className="flex items-center space-x-3">
              <motion.a
                href="https://github.com/magnusaman"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="glass-morphism p-2 rounded-lg hover:bg-white/10"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/aman7anand/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="glass-morphism p-2 rounded-lg hover:bg-white/10"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="mailto:22it3004@rgipt.ac.in"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="glass-morphism p-2 rounded-lg hover:bg-white/10"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 gradient-text">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/magnusaman" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://docs.ultralytics.com/models/yolov8/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors">
                  YOLOv8 Docs
                </a>
              </li>
              <li>
                <a href="https://cocodataset.org/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors">
                  COCO Dataset
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 gradient-text">About</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400">CVPR Project 2024</span>
              </li>
              <li>
                <span className="text-gray-400">RGIPT</span>
              </li>
              <li>
                <a href="mailto:22it3004@rgipt.ac.in" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} ObjectVision AI. All rights reserved.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 text-sm text-gray-400"
          >
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            </motion.div>
            <span>using YOLOv8 & React</span>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
