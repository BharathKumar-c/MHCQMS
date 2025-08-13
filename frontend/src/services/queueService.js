import api from './api'

export const queueService = {
  async getQueueStatus() {
    try {
      console.log('Fetching queue status');
      const response = await api.get('/queue')
      console.log('Queue status fetched successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('Failed to fetch queue status:', error);
      throw error;
    }
  },

  async addToQueue(queueData) {
    try {
      console.log('Adding to queue:', queueData);
      const response = await api.post('/queue', queueData)
      console.log('Added to queue successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('Failed to add to queue:', error);
      throw error;
    }
  },

  async updateQueueEntry(id, queueData) {
    try {
      console.log('Updating queue entry:', id, queueData);
      const response = await api.put(`/queue/${id}`, queueData)
      console.log('Queue entry updated successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('Failed to update queue entry:', error);
      throw error;
    }
  },

  async updateQueueStatus(id, statusData) {
    try {
      console.log('Updating queue status:', id, statusData);
      const response = await api.patch(`/queue/${id}/status`, statusData)
      console.log('Queue status updated successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('Failed to update queue status:', error);
      throw error;
    }
  },

  async removeFromQueue(id) {
    try {
      console.log('Removing from queue:', id);
      const response = await api.delete(`/queue/${id}`)
      console.log('Removed from queue successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('Failed to remove from queue:', error);
      throw error;
    }
  },

  async getQueueStats() {
    try {
      console.log('Fetching queue stats');
      const response = await api.get('/queue/stats/summary')
      console.log('Queue stats fetched successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('Failed to fetch queue stats:', error);
      throw error;
    }
  },
}
