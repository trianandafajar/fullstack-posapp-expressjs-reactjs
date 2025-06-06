import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import { useEffect, useState, useCallback, useMemo } from "react";
import secureLocalStorage from "react-secure-storage";
import { axiosInstance } from "../auth/AxiosConfig.jsx";
import { toast } from "react-toastify";

// Custom hook untuk form state
const useFormState = (initialState) => {
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  return { state, setState, errors, setErrors, handleChange };
};

// Validasi form
const validateForm = (values) => {
  const errors = {};
  
  if (!values.name.trim()) {
    errors.name = 'Nama tidak boleh kosong';
  }
  
  if (!values.userName.trim()) {
    errors.userName = 'Username tidak boleh kosong';
  }
  
  if (values.password) {
    if (values.password.length < 6) {
      errors.password = 'Password minimal 6 karakter';
    }
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Password tidak cocok';
    }
  }
  
  return errors;
};

const ProfilModal = ({ show, onHide, size }) => {
  const user = secureLocalStorage.getItem("user");
  
  const initialState = useMemo(() => ({
    name: '',
    userName: '',
    password: '',
    confirmPassword: '',
  }), []);

  const { 
    state: formData, 
    setState: setFormData, 
    errors, 
    setErrors, 
    handleChange 
  } = useFormState(initialState);

  // Reset form ketika modal dibuka
  useEffect(() => {
    if (show && user) {
      setFormData({
        ...initialState,
        name: user.name,
        userName: user.userName,
      });
      setErrors({});
    }
  }, [show, user, setFormData, initialState]);

  const actionUpdate = useCallback(async (e) => {
    e.preventDefault();

    // Validasi form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const headers = {
      Authorization: `Bearer ${secureLocalStorage.getItem("acessToken")}`,
      "Content-Type": "application/json",
    };

    const requestData = {
      name: formData.name,
      userName: formData.userName,
      password: formData.password || undefined, // Hanya kirim password jika diisi
      confirmPassword: formData.confirmPassword || undefined,
      role: user.role,
    };

    try {
      const response = await axiosInstance.put(
        `/api/users/${user.id}`,
        requestData,
        { headers }
      );

      if (response.data) {
        secureLocalStorage.setItem("user", response.data.result);
        toast.success(response.data.message, {
          position: "top-center",
        });
        onHide();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan';
      toast.error(errorMessage, {
        position: "top-center",
      });
    }
  }, [formData, user, onHide]);

  const renderFormField = useCallback((label, name, type = "text", sm = "3") => (
    <Form.Group as={Row} className="mb-3">
      <Form.Label column sm="2">
        {label}
      </Form.Label>
      <Col sm={sm}>
        <Form.Control
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          isInvalid={!!errors[name]}
        />
        <Form.Control.Feedback type="invalid">
          {errors[name]}
        </Form.Control.Feedback>
      </Col>
    </Form.Group>
  ), [formData, errors, handleChange]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size={size}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={actionUpdate}>
          {renderFormField("Full Name", "name", "text", "7")}
          {renderFormField("Username", "userName")}
          {renderFormField("Password", "password", "password")}
          {renderFormField("Confirm Password", "confirmPassword", "password")}
          
          <Row>
            <Col md={{ span: 10, offset: 2 }}>
              <Button type="submit" variant="primary">
                Submit
              </Button>
            </Col>
          </Row>
        </form>
      </Modal.Body>
    </Modal>
  );
};

ProfilModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  size: PropTypes.string,
};

ProfilModal.defaultProps = {
  size: "md",
};

export default ProfilModal;
