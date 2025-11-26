import { motion } from 'framer-motion'
import { TrendingUp, Users, Zap, Award } from 'lucide-react'

const stats = [
  {
    icon: TrendingUp,
    value: '50%+',
    label: 'mAP Accuracy',
    description: 'Mean Average Precision'
  },
  {
    icon: Award,
    value: '80+',
    label: 'Object Classes',
    description: 'COCO Dataset Coverage'
  },
  {
    icon: Zap,
    value: '<100ms',
    label: 'Inference Time',
    description: 'Real-time Processing'
  },
  {
    icon: Users,
    value: '118K+',
    label: 'Training Images',
    description: 'COCO 2017 Dataset'
  }
]

export default function Stats() {
  return (
    <div className="py-12 mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-morphism rounded-3xl p-8 md:p-12 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Powered by <span className="gradient-text">Advanced Technology</span>
            </h2>
            <p className="text-gray-400">
              Industry-leading performance metrics backed by rigorous training
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 border border-primary-500/30 mb-4"
                >
                  <stat.icon className="w-8 h-8 text-primary-400" />
                </motion.div>

                {/* Value */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                  className="text-4xl md:text-5xl font-bold gradient-text mb-2"
                >
                  {stat.value}
                </motion.div>

                {/* Label */}
                <div className="text-lg font-semibold text-white mb-1">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-sm text-gray-400">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
