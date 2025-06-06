import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";

const NoPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center" style={{ height: "100vh", backgroundColor: "#f8f9fa" }}>
      <motion.div
        className="text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <FaExclamationTriangle size={80} className="text-warning mb-4" />
        </motion.div>
        
        <motion.h1 
          className="display-1 fw-bold text-primary mb-3"
          variants={itemVariants}
        >
          404
        </motion.h1>
        
        <motion.h2 
          className="h3 text-muted mb-4"
          variants={itemVariants}
        >
          Halaman Tidak Ditemukan
        </motion.h2>
        
        <motion.p 
          className="text-muted mb-4"
          variants={itemVariants}
        >
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
        </motion.p>
        
        <motion.div variants={itemVariants}>
          <Button
            variant="primary"
            size="lg"
            className="d-flex align-items-center mx-auto"
            onClick={() => navigate("/")}
          >
            <FaHome className="me-2" />
            Kembali ke Beranda
          </Button>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default NoPage;
