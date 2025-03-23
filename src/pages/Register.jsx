import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../features/auth/authSlice";
import FormInput from "../components/FormInput";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isRequiredEmailValidation, message } =
    useSelector((state) => state.auth);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.confirmPassword) {
      toast.error("Kayıt için erekli alanları doldurmalısınız!");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Şifreler eşleşmiyor. Yeniden deneyin!");
      return;
    }

    try {
      const result = await dispatch(registerUser(form));
      if (registerUser.fulfilled.match(result)) {
        if (isRequiredEmailValidation) {
          toast.success(message);
          navigate("/email-activation-message");
        } else {
          toast.success(
            "Kayıt başarıyla tamamlandı. Panele yönlendiriliyorsunuz..."
          );
          navigate("/dashboard");
        }
      } else if (registerUser.rejected.match(result)) {
        toast.error(error);
      }
    } catch (err) {
      toast.error("Kayıt esnasında bilinmeyen bir hata oluştu.");
    }
  };

  return (
    <div className="card shadow">
      <div className="card-body">
        <h2 className="card-title">Register</h2>
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <FormInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            required
          />
          {error && (
            <div className="alert alert-danger">
              {typeof error === "object" ? error.message : error}
            </div>
          )}
          <button disabled={loading}>
            {loading ? <div className="spinner-border" /> : "Kayıt Ol"}
          </button>
          <hr />
          <p>
            Don't have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
