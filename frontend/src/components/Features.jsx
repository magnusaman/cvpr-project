import { motion } from 'framer-motion'
import { Zap, Shield, Globe, Cpu, Eye, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Real-time object detection with millisecond inference speeds',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Eye,
    title: 'High Accuracy',
    description: 'Advanced deep learning models trained on COCO dataset',
    color: 'from-primary-500 to-blue-500'
  },
  {
    icon: Cpu,
    title: 'Advanced AI',
    description: 'Powered by cutting-edge deep learning neural networks',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your images are processed securely and never stored',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Globe,
    title: '80+ Classes',
    description: 'Detect a wide variety of objects from everyday items to vehicles',
    color: 'from-cyan-500 to-teal-500'
  },
  {
    icon: TrendingUp,
    title: 'Scalable',
    description: 'Built to handle multiple requests with consistent performance',
    color: 'from-red-500 to-pink-500'
  }
]

export default function Features() {
  return (
    <div className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Why Choose <span className="gradient-text">ObjectVision AI</span>
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Built with industry-leading technology to deliver exceptional object detection capabilities
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-morphism rounded-2xl p-6 relative overflow-hidden group"
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

            <div className="relative">
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} mb-4`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>

              {/* Decorative element */}
              <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br ${feature.color} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
