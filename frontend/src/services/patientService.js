import api from './api'

export const patientService = {
  async getPatients() {
    try {
      console.log('Fetching patients');
      const response = await api.get('/patients')
      console.log('Patients fetched successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      throw error;
    }
  },

  async addPatient(patientData) {
    try {
      console.log('Adding patient:', patientData);
      const response = await api.post('/patients', patientData)
      console.log('Patient added successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('Failed to add patient:', error);
      throw error;
    }
  },

  async registerPatientWithQueue(registrationData) {
    try {
      console.log('Registering patient with queue:', registrationData);
      const response = await api.post('/patients/register', registrationData)
      console.log('Patient registered with queue successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('Failed to register patient with queue:', error);
      throw error;
    }
  },

  async updatePatient(id, patientData) {
    try {
      console.log('Updating patient:', id, patientData);
      const response = await api.put(`/patients/${id}`, patientData)
      console.log('Patient updated successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('Failed to update patient:', error);
      throw error;
    }
  },

  async deletePatient(id) {
    try {
      console.log('Deleting patient:', id);
      const response = await api.delete(`/patients/${id}`)
      console.log('Patient deleted successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('Failed to delete patient:', error);
      throw error;
    }
  },

  async markPatientServed(id) {
    try {
      console.log('Marking patient as served:', id);
      const response = await api.patch(`/patients/${id}/serve`)
      console.log('Patient marked as served successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('Failed to mark patient as served:', error);
      throw error;
    }
  },

  async getCompletedPatients() {
    try {
      console.log('Fetching completed patients');
      const response = await api.get('/patients/completed')
      console.log('Completed patients fetched successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('Failed to fetch completed patients:', error);
      throw error;
    }
  },

  async getPatientStats() {
    try {
      console.log('Fetching patient stats');
      const response = await api.get('/patients/stats')
      console.log('Patient stats fetched successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('Failed to fetch patient stats:', error);
      throw error;
    }
  },
}
