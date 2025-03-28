import React, { useState, useEffect } from 'react';
import { reservationService } from '../services/reservationService';

const ReservationSystem = () => {
  const [services, setServices] = useState([]);
  const [availableHours] = useState([
    '09:00', '10:00', '11:00', '12:00', 
    '14:00', '15:00', '16:00', '17:00'
  ]);
  const [availableTime, setTime] = useState([]);

  const [reservations, setReservations] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState([]);
  const [clientName, setClientName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('form'); // 'form' o 'report'
  const [loading, setLoading] = useState(false);
const [resultHours] =useState([])
  const loadHours = async (date) => {
    try {
      setSelectedDate(date)
      setLoading(true);
      const hoursData = await reservationService.getHours(date);
      setSelectedDate(date)
      setSelectedHour(hoursData);
    } catch (error) {
      setError('Error al cargar las reservas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // Cargar servicios y reservas al montar el componente
  useEffect(() => {
    loadServices();
    loadReservations();
  }, []);

  const loadServices = async () => {
    try {
      const servicesData = await reservationService.getServices();
      setServices(servicesData);
    } catch (error) {
      setError('Error al cargar los servicios');
      console.error(error);
    }
  };

  const loadReservations = async () => {
    try {
      setLoading(true);
      const reservationsData = await reservationService.getReservations();
      setReservations(reservationsData);
    } catch (error) {
      setError('Error al cargar las reservas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableHours = (date) => {
    const takenHours = reservations
      .filter(r => r.date === date)
      .map(r => r.hour);
    return availableHours.filter(hour => !takenHours.includes(hour));
  };

  const handleReservation = async () => {
    if (!selectedService || !selectedDate || !selectedHour || !clientName) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {
      const newReservation = {
        serviceId: parseInt(selectedService),
        date: selectedDate,
        hour: availableTime,
        clientName: clientName
      };

      const result = await reservationService.createReservation(newReservation);
      
      setSuccess('Reserva realizada con éxito');
      setError('');
      // Limpiar formulario
      setSelectedService('');
      setSelectedDate('');
      setSelectedHour('');
      setClientName('');
      setSelectedHour([])
      // Recargar las reservas
      loadReservations();
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear la reserva');
      setSuccess('');
      console.error(error);
    }
  };

  const getServiceName = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Servicio no encontrado';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sistema de Reservas</h2>
        <div className="space-x-4">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded ${
              activeTab === 'form' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Nueva Reserva
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 rounded ${
              activeTab === 'report' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Reporte de Reservas
          </button>
        </div>
      </div>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
      
      {activeTab === 'form' ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Nueva Reserva</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Servicio:</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={selectedService} 
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="">Seleccione un servicio</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha:</label>
              <input 
                type="date" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Hora:</label>
              <select multiple={false}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={availableTime} 
                onChange={(e) => setTime(e.target.value)}

              >
                <option value="">Seleccione un horario</option>
                {selectedDate &&  selectedHour.length>0 && selectedHour.map(hour => (
                  <option key={hour} value={hour}>{hour}</option>
                ))}
                
              </select>
              <button
            onClick={() => loadHours(selectedDate)}
            className={`px-4 py-2 rounded ${
              activeTab === 'report' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            clickee para refrescar
          </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre del Cliente:</label>
              <input 
                type="text" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>

            <button 
              onClick={handleReservation}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Reservar
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Reporte de Reservas</h3>
            <button
              onClick={loadReservations}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Actualizar
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay reservas registradas
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Servicio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hora
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {reservation.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getServiceName(reservation.serviceId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(reservation.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reservation.hour}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationSystem;