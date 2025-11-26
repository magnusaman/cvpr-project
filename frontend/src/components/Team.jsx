import { motion } from 'framer-motion'
import { Github, Linkedin } from 'lucide-react'

const teamMembers = [
  {
    rollNo: '22IT3004',
    name: 'Aman Anand',
    initials: 'AA',
    linkedin: 'https://www.linkedin.com/in/aman7anand/',
    github: 'https://github.com/magnusaman',
    image: '/team/22it3004.png',
    color: 'from-primary-500 to-blue-500'
  },
  {
    rollNo: '22IT3001',
    name: 'Aayush Kumar',
    initials: 'AK',
    linkedin: 'https://www.linkedin.com/in/aayush-kumar-debugging/',
    image: '/team/22it3001.png',
    color: 'from-purple-500 to-pink-500'
  },
  {
    rollNo: '22IT3002',
    name: 'Aditya Kumar',
    initials: 'AK',
    linkedin: 'https://www.linkedin.com/in/adityakumar8018/',
    image: '/team/22it3002.png',
    color: 'from-green-500 to-teal-500'
  },
  {
    rollNo: '22IT3003',
    name: 'Akshat Goyal',
    initials: 'AG',
    linkedin: 'https://www.linkedin.com/in/akshatg1403/',
    image: '/team/22it3003.png',
    color: 'from-orange-500 to-red-500'
  },
  {
    rollNo: '22IT3005',
    name: 'Aman Kumar Gupta',
    initials: 'AKG',
    linkedin: 'https://www.linkedin.com/in/amangupta8864/',
    image: '/team/22it3005.png',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    rollNo: '22IT3006',
    name: 'Tanmay Amrutkar',
    initials: 'TA',
    linkedin: 'https://www.linkedin.com/in/tanmay-amrutkar/',
    image: '/team/22it3006.png',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    rollNo: '22IT3009',
    name: 'Arnav Sao',
    initials: 'AS',
    linkedin: 'https://www.linkedin.com/in/arnavsao/',
    image: '/team/22it3009.png',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    rollNo: '22IT3010',
    name: 'Aryan Singh',
    initials: 'AS',
    linkedin: 'https://www.linkedin.com/in/aryankumarsingh0704/',
    image: '/team/22it3010.png',
    color: 'from-pink-500 to-rose-500'
  },
  {
    rollNo: '22IT3018',
    name: 'Jagriti Priya',
    initials: 'JP',
    linkedin: 'https://www.linkedin.com/in/jagritipriya21/',
    image: '/team/22it3018.png',
    color: 'from-violet-500 to-purple-500'
  },
  {
    rollNo: '22IT3028',
    name: 'Payal Singh',
    initials: 'PS',
    linkedin: 'https://www.linkedin.com/in/payalsingh2209/',
    image: '/team/22it3028.png',
    color: 'from-emerald-500 to-green-500'
  }
]

export default function Team() {
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
          Meet <span className="gradient-text">Our Team</span>
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Talented individuals working together to deliver cutting-edge AI solutions
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -10, scale: 1.05 }}
            className="glass-morphism rounded-2xl p-6 text-center relative overflow-hidden group"
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

            <div className="relative">
              {/* Avatar - Profile image with fallback to initials */}
              <div className="mb-4 mx-auto">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-2xl font-bold shadow-xl overflow-hidden border-2 border-white/20`}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <span className="text-2xl font-bold hidden">{member.initials}</span>
                </motion.div>
              </div>

              {/* Name */}
              <h3 className="text-lg font-bold mb-1 text-white">{member.name}</h3>

              {/* Roll Number */}
              <p className="text-sm text-gray-400 mb-4">{member.rollNo}</p>

              {/* Social Links */}
              <div className="flex justify-center space-x-2">
                {member.github && (
                  <motion.a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                    className="glass-morphism p-2 rounded-lg hover:bg-white/10"
                  >
                    <Github className="w-4 h-4" />
                  </motion.a>
                )}
                <motion.a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                  className="glass-morphism p-2 rounded-lg hover:bg-white/10"
                >
                  <Linkedin className="w-4 h-4" />
                </motion.a>
              </div>

              {/* Decorative element */}
              <div className={`absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-to-br ${member.color} rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
