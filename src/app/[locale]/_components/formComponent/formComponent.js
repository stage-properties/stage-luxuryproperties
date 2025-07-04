"use client";

import React, { useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";

function FormComponent({ title }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "", // Will store the phone number as a string
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  // Function to validate a single field
  const validateField = (name, value) => {
    let error = "";

    // Validate Name
    if (name === "name") {
      if (!value.trim()) {
        error = "Name is required";
      }
    }

    // Validate Phone Number
    if (name === "phone") {
      if (!value || value.trim() === "") {
        error = "Phone number is required";
      } else if (!isValidPhoneNumber(value)) {
        // Using isValidPhoneNumber for accurate validation
        error = "Invalid phone number";
      }
    }

    // Validate Email
    if (name === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Invalid email address";
      }
    }

    // Validate Message
    if (name === "message") {
      if (!value.trim()) {
        error = "Message is required";
      }
    }

    return error;
  };

  // Function to validate all fields on submit
  const validate = () => {
    const newErrors = {};

    // Validate all fields
    Object.keys(formData).forEach((fieldName) => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Submit form data
      console.log("Form submitted:", formData);
      // You can add form submission logic here, e.g., send data to API

      // Clear form after submission
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
      setErrors({});
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate the field as the user types
    const error = validateField(name, value);

    // Update errors state
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  // Handler specifically for phone input changes
  const handlePhoneChange = (value) => {
    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      phone: value || "", // `value` can be undefined or null
    }));

    // Validate the phone field
    const error = validateField("phone", value || "");

    setErrors((prevErrors) => ({
      ...prevErrors,
      phone: error,
    }));
  };

  return (
    <form id="formComponent" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? "error" : ""}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <PhoneInput
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={handlePhoneChange}
          defaultCountry="AE" // Set default country as per your requirement
          className={errors.phone ? "phone-input error" : "phone-input"}
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "error" : ""}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <textarea
          id="message"
          name="message"
          rows="4"
          required
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          className={errors.message ? "error" : ""}
        ></textarea>
        {errors.message && <span className="error">{errors.message}</span>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default FormComponent;