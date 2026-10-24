import { motion } from 'framer-motion'

const DURATION_ANIMATION_OPACITY = 0.5

export const PageTransitionFadeInOutWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.main
        key="landing-page"
        initial="hidden"
        exit="hidden"
        animate="enter"
        variants={{
            hidden: { opacity: 0, x: 0, y: 0 },
            enter: { opacity: 1, x: 0, y: 0 },
        }}
        transition={{ type: 'linear', duration: DURATION_ANIMATION_OPACITY }}
    >
        {children}
    </motion.main>
)
