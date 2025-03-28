import axios from 'axios';

const API_URL = 'http://localhost:7001/api'; // Cambiado a http

export const reservationService = {
    // Obtener todos los servicios disponibles
    getServices: async () => {
        try {
            console.log('Intentando obtener servicios de:', `${API_URL}/Service/services`);
            const response = await axios.get(`${API_URL}/Service/services`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            console.log('Respuesta recibida:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error completo:', error);
            console.error('Error de respuesta:', error.response?.data);
            console.error('Estado del error:', error.response?.status);
            throw error;
        }
    },

    // Obtener todas las reservas
    getReservations: async () => {
        try {
            console.log('Intentando obtener reservas de:', `${API_URL}/Reservation/reservations`);
            const response = await axios.get(`${API_URL}/Reservation/reservations`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            console.log('Respuesta recibida:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error completo:', error);
            console.error('Error de respuesta:', error.response?.data);
            console.error('Estado del error:', error.response?.status);
            throw error;
        }
    },
    // Obtener todas las reservas
    getHours: async (da) => {
        try {
            console.log('Intentando obtener horas  de:', `${API_URL}/Reservation/hours`);
            const response = await axios.get(`${API_URL}/Reservation/hours`, {
                params: {
                    
                    date: da
                  },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            console.log('Respuesta recibida:', response.data);
            return response.data ;
        } catch (error) {
            console.error('Error completo:', error);
            console.error('Error de respuesta:', error.response?.data);
            console.error('Estado del error:', error.response?.status);
            throw error;
        }
    },

    // Crear una nueva reserva
    createReservation: async (reservation) => {
        try {
            console.log('Intentando crear reserva:', reservation);
            const response = await axios.post(`${API_URL}/Reservation/CreateReservation`, reservation, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            console.log('Respuesta recibida:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error completo:', error);
            console.error('Error de respuesta:', error.response?.data);
            console.error('Estado del error:', error.response?.status);
            throw error;
        }
    }
};