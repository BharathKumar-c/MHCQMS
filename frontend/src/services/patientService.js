import api from './api'

export const patientService = {
  async getPatients() {
    const response = await api.get('/patients')
    return response.data
  },

  async addPatient(patientData) {
    const response = await api.post('/patients', patientData)
    return response.data
  },

  async updatePatient(id, patientData) {
    const response = await api.put(`/patients/${id}`, patientData)
    return response.data
  },

  async deletePatient(id) {
    const response = await api.delete(`/patients/${id}`)
    return response.data
  },

  async markPatientServed(id) {
    const response = await api.patch(`/patients/${id}/serve`)
    return response.data
  },

  async getCompletedPatients() {
    const response = await api.get('/patients/completed')
    return response.data
  },

  async getPatientStats() {
    const response = await api.get('/patients/stats')
    return response.data
  },
}
