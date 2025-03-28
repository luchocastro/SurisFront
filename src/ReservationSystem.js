import React, { useState, useEffect } from 'react';

const ReservationSystem = () => {
  const [services] = useState([
    'Corte de cabello',
    'Tinte',
    'Manicura',
    'Pedicura',
    'Tratamiento facial'
  ]);

  const [availableHours] = useState([
    '09:00', '10:00', '11:00', '12:00', 
    '14:00', '15:00', '16:00', '17:00'
  ]);

  const [reservations, setReservations] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [clientName, setClientName] = useState('');

  const getAvailableHours = (date) => {
    const takenHours = reservations
      .filter(r => r.date === date)
      .map(r => r.hour);
    return availableHours.filter(hour => !takenHours.includes(hour));
  };

  const handleReservation = () => {
    if (!selectedService || !selectedDate || !selectedHour || !clientName) {
      alert('Por favor complete todos los campos');
      return;
    }

    // Validar que la fecha y hora sean posteriores a la actual
    const selectedDateTime = new Date(`${selectedDate}T${selectedHour}`);
    const currentDateTime = new Date();

    if (selectedDateTime <= currentDateTime) {
      alert('La fecha y hora seleccionadas deben ser posteriores a la fecha y hora actual');
      return;
    }

    const newReservation = {
      service: selectedService,
      date: selectedDate,
      hour: selectedHour,
      clientName: clientName
    };

    setReservations([...reservations, newReservation]);
    setSelectedService('');
    setSelectedDate('');
    setSelectedHour('');
    setClientName('');
    alert('Reserva realizada con éxito');
  };

  return (
    <div>
      <h2>Sistema de Reservas</h2>
      
      <div>
        <h3>Nueva Reserva</h3>
        <div>
          <label>Servicio:</label>
          <select 
            value={selectedService} 
            onChange={(e) => setSelectedService(e.target.value)}
          >
            <option value="">Seleccione un servicio</option>
            {services.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Fecha:</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label>Hora:</label>
          <select 
            value={selectedHour} 
            onChange={(e) => setSelectedHour(e.target.value)}
          >
            <option value="">Seleccione un horario</option>
            {selectedDate && getAvailableHours(selectedDate).map(hour => (
              <option key={hour} value={hour}>{hour}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Nombre del Cliente:</label>
          <input 
            type="text" 
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>

        <button onClick={handleReservation}>Reservar</button>
      </div>

      <div>
        <h3>Listado de Reservas</h3>
        <ul>
          {reservations.map((reservation, index) => (
            <li key={index}>
              {reservation.clientName} - {reservation.service} - {reservation.date} - {reservation.hour}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReservationSystem;
