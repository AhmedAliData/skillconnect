// src/services/api.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

/* ---------- Student APIs ---------- */

export const fetchStudents = async (params = {}) => {
  const res = await axios.get(`${API_BASE}/students`, { params });
  return res.data;
};

export const fetchProfile = async () => {
  const res = await axios.get(`${API_BASE}/students/me`);
  return res.data;
};

export const updateProfile = async (payload) => {
  const res = await axios.put(`${API_BASE}/students/me`, payload);
  return res.data;
};

export const sendConnectionRequest = async (targetId) => {
  const res = await axios.post(`${API_BASE}/connections/${targetId}`);
  return res.data;
};

export const fetchConnections = async () => {
  const res = await axios.get(`${API_BASE}/connections`);
  return res.data;
};

/* ---------- Admin APIs ---------- */

export const fetchAdminStats = async () => {
  const res = await axios.get(`${API_BASE}/admin/stats`);
  return res.data;
};

export const fetchAdminUsers = async (params = {}) => {
  const res = await axios.get(`${API_BASE}/admin/users`, { params });
  return res.data;
};

export const toggleUserBlock = async (userId) => {
  const res = await axios.patch(`${API_BASE}/admin/users/${userId}/block`);
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await axios.delete(`${API_BASE}/admin/users/${userId}`);
  return res.data;
};

export const fetchAdminConnections = async (params = {}) => {
  const res = await axios.get(`${API_BASE}/admin/connections`, { params });
  return res.data;
};
